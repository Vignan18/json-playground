import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

import './parse.css';

function Parse() {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [historyVisible, setHistoryVisible] = useState(false);
    const [history, setHistory] = useState(
        () => JSON.parse(sessionStorage.getItem('jsonHistory')) || []
    );

    useEffect(() => {
    }, [jsonInput]);

    const handleInputChange = (newValue) => {
        setJsonInput(newValue);
        setError('');
    };

    const validateJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setJsonInput(formattedJson);
            updateHistory(formattedJson);
            setError('');
        } catch (err) {
            setError(`Invalid JSON! Error: ${err.message}`);
        }
    };

    const compressJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const compressedJson = JSON.stringify(parsedJson);
            setJsonInput(compressedJson);
            updateHistory(compressedJson);
            setError('');
        } catch (err) {
            setError(`Cannot compress JSON! Error: ${err.message}`);
        }
    };

    const clearJson = () => {
        setJsonInput('');
        setError('');
    };

    const copyText = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonInput).then(() => {
                alert('Copied to clipboard!');
            }).catch(err => {
                setError(`Failed to copy text: ${err.message}`);
            });
        } else {
            setError('Clipboard API not available.');
        }
    };

    const updateHistory = (json) => {
        const newEntry = { json, timestamp: new Date().toLocaleString() };
        const newHistory = [newEntry, ...history].slice(0, 10); // Keep only the latest 10 entries
        setHistory(newHistory);
        sessionStorage.setItem('jsonHistory', JSON.stringify(newHistory));
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
                <div className='editor-container'>
                    <AceEditor
                        mode="json5"
                        theme="monokai"
                        onChange={handleInputChange}
                        value={jsonInput}
                        placeholder='Enter your json here ...'
                        name="jsonEditor"
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true,
                        }}
                        width="100%"
                        height="100%"
                        fontSize={14}
                        showPrintMargin={false}
                    />
                </div>
                <div className='btn-container'>
                    <Button className='btns-jsontool' onClick={validateJson}>Validate</Button>
                    <Button className='btns-jsontool' onClick={compressJson}>Compress JSON</Button>
                    <Button className='btns-jsontool' onClick={clearJson}>Clear</Button>
                    <Button className='btns-jsontool' onClick={toggleHistory}>
                        {historyVisible ? 'Hide History' : 'Show History'}
                    </Button>
                    {jsonInput && (
                        <Button className='btns-jsontool' onClick={copyText}>Copy</Button>
                    )}
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {historyVisible && (
                    <ul>
                        {history.map((entry, index) => (
                            <li key={index}>{entry.timestamp}: {entry.json}</li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.div>
    );
}

export default Parse;
