/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import AceEditor from 'react-ace';
import { FaCopy, FaCheck, FaHistory } from 'react-icons/fa';
import History from './History/History';
import { ToastContainer, toast } from 'react-toastify';
import { FILE_TYPES } from './constants';
import 'brace/mode/json'
import 'brace/theme/merbivore_soft'
import 'react-toastify/dist/ReactToastify.css';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';

import './parse.css';

function Parse() {
    const [jsonInput, setJsonInput] = useState(() => {
        const savedJsonInput = localStorage.getItem('lastJsonInput');
        return savedJsonInput || '';
    });
    const [historyVisible, setHistoryVisible] = useState(false);
    const [history, setHistory] = useState(
        () => JSON.parse(localStorage.getItem('jsonHistory')) || []
    );
    const [showCopyIcon, setShowCopyIcon] = useState(false);
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('lastJsonInput', jsonInput);
    }, [jsonInput]);

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (editorRef.current) {
            const editor = editorRef.current.editor;

            // Search box functionality
            editor.commands.addCommand({
                name: 'showSearchBox',
                bindKey: { win: 'Ctrl-F', mac: 'Cmd-F' },
                exec: () => {
                    editorRef.current.editor.execCommand('find');
                }
            });

            // Save file functionality
            editor.commands.addCommand({
                name: 'saveFile',
                bindKey: { win: 'Ctrl-S', mac: 'Cmd-S' },
                exec: () => {
                    saveToFile(jsonInput);
                }
            });

            // Import JSON file functionality
            editor.commands.addCommand({
                name: 'importJsonFile',
                bindKey: { win: 'Ctrl-O', mac: 'Cmd-O' },
                exec: () => {
                    triggerFileInput();
                }
            });
        }
    }, []);

    const handleInputChange = (newValue) => {
        setJsonInput(newValue);
        try {
            const parsedJson = JSON.parse(newValue);
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setJsonInput(formattedJson);
            updateHistory(formattedJson);
        } catch (err) {
        }
    };

    const showError = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true
        });
    };

    const validateJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setJsonInput(formattedJson);
            updateHistory(formattedJson);
            editorRef.current.editor.setValue(formattedJson, -1); 
        } catch (err) {
            console.log(err.message)
            showError(`Invalid JSON! Error: ${err.message}`);
        }
    };

    const compressJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const compressedJson = JSON.stringify(parsedJson);
            setJsonInput(compressedJson);
            updateHistory(compressedJson);
        } catch (err) {
            showError(`Cannot compress JSON! Error: ${err.message}`);
        }
    };

    const clearJson = () => {
        setJsonInput('');
    };

    const copyText = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonInput).then(() => {
                setShowCopyIcon(true);
                setTimeout(() => setShowCopyIcon(false), 2000);
            }).catch(err => {
                showError(`Failed to copy text: ${err.message}`);
            });
        } else {
            showError('Clipboard API not available.');
        }
    };
    
    /**
     * Function to save JSON content to a file using the File System Access API 
     * or fallback to traditional download.
     * @param {*} content 
     */
    const saveToFile = async (content) => {
        try {
            const supportsFileSystemAccess = 'showSaveFilePicker' in window;

            if (supportsFileSystemAccess) {
                const options = {
                    suggestedName: 'untitled.json',
                    types: [ ...FILE_TYPES ],
                    startIn: 'downloads'
                };

                const fileHandle = await window.showSaveFilePicker(options);
                const writableStream = await fileHandle.createWritable();
                await writableStream.write(content);
                await writableStream.close();
                console.log('File saved using File System Access API!');

            } else {
                // Fallback for browsers that don't support File System Access API
                console.warn('File System Access API not supported, falling back to traditional download.');
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'output.json';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('File save cancelled by user.');
            } else {
                console.error('Error saving file:', err);
                showError(`Error saving file: ${err.message}`);
            }
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            showError('Please select a JSON file.');
            event.target.value = '';
            return;
        }
        let fileContent = '';
        try {
            const readableStream = file.stream();
            const reader = readableStream.getReader();
            const textDecoder = new TextDecoder('utf-8');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fileContent += textDecoder.decode(value, { stream: true });
            }
            fileContent += textDecoder.decode();

            try {
                const parsedContent = JSON.parse(fileContent);
                setJsonInput(JSON.stringify(parsedContent, null, 2));
            } catch (parseError) {
                showError(`Error parsing JSON from file: ${parseError.message}`);
                setJsonInput(fileContent);
            }

        } catch (err) {
            console.error('Error reading file with streams:', err);
            showError('Error reading file with streams.');
        } finally {
            event.target.value = '';
        }
    };

    const handleSelectHistory = (selectedJson) => {
        setJsonInput(selectedJson);
    };

    const updateHistory = (json) => {
        const isDuplicate = history.some(entry => entry.json === json);
        if (isDuplicate) return;

        const newEntry = { json, timestamp: new Date().toLocaleString() };
        const newHistory = [newEntry, ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('jsonHistory', JSON.stringify(newHistory));
    };

    const clearAllHistory = () => {
        setHistory([]);
        localStorage.removeItem('jsonHistory');
    };

    const toggleHistory = () => {
        setHistoryVisible(!historyVisible);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`json-wrapper`}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept=".json,application/json"
                />
                <div className='editor-container'>
                    <AceEditor
                        mode="json"
                        theme="merbivore_soft"
                        onChange={handleInputChange}
                        value={jsonInput}
                        placeholder='Enter your json here or import a file with Ctrl+O ...'
                        name="jsonEditor"
                        editorProps={{ $blockScrolling: true }}
                        enableBasicAutocompletion={true}
                        enableLiveAutocompletion={true}
                        enableSnippets={true}
                        width="100%"
                        height="100%"
                        fontSize={14}
                        showPrintMargin={false}
                        ref={editorRef}
                    />
                    {showCopyIcon ? (
                        <div className='copy-icon-container'>
                            <FaCheck className='copy-icon-check' />
                        </div>
                    ) : (
                        <div className='copy-icon-container'>
                            <FaCopy className='copy-icon' onClick={copyText} title="Copy" />
                        </div>
                    )}
                </div>
                <div className='button-row-container'>
                    <div className='btn-container-a'>
                        <Button className='btns-jsontool' onClick={validateJson}>Validate</Button>
                        <Button className='btns-jsontool' onClick={compressJson}>Compress</Button>
                        <Button className='btns-clear' onClick={clearJson}>Clear</Button>
                        {/* <FaFileImport className='import-icon' size={33} onClick={triggerFileInput} disabled={isLoading} title="Import" /> */}
                    </div>
                    <div className='btn-container-h'>
                        {!historyVisible && (
                            <FaHistory className='history-icon' size={35} onClick={toggleHistory} title="Show History" />
                        )}
                    </div>
                </div>
                <ToastContainer />
                <History
                    history={history}
                    isVisible={historyVisible}
                    onSelect={handleSelectHistory}
                    clearAllHistory={clearAllHistory}
                    toggleHistory={toggleHistory}
                />
            </div>
            {/* <section id="footer" className='footer-container'>
                <p className='footer'>
                    &copy; 2024 Gaurav Singh. <br />
                    All rights reserved.
                </p>
            </section> */}
        </motion.div>
    );
}

export default Parse;
