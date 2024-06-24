import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './parse.css';

function Parse() {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState('');
    const [lineNumbers, setLineNumbers] = useState('1'); 
    const [historyVisible, setHistoryVisible] = useState(false);
    const [history, setHistory] = useState(
        () => JSON.parse(sessionStorage.getItem('jsonHistory')) || []
    );
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    useEffect(() => {
    }, [jsonInput]);

    const handleInputChange = (event) => {
        setJsonInput(event.target.value);
        setError(''); 
        updateLineNumbers(event.target.value);
    };

    const validateJson = () => {
        try {
            const parsedJson = JSON.parse(jsonInput);
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setJsonInput(formattedJson);
            updateLineNumbers(formattedJson);
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
            updateLineNumbers(compressedJson);
            updateHistory(compressedJson);
            setError('');
        } catch (err) {
            setError(`Cannot compress JSON! Error: ${err.message}`);
        }
    };

    const clearJson = () => {
        setJsonInput('');
        setError('');
        setLineNumbers('1'); // Reset line numbers
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

    const updateLineNumbers = (text) => {
        const lines = text.split('\n');
        const newLineNumbers = lines.map((_, index) => index + 1).join('\n');
        setLineNumbers(newLineNumbers);
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleScroll = () => {
        if (lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const updateHistory = (json) => {
        const newEntry = { json, timestamp: new Date().toLocaleString() };
        const newHistory = [newEntry, ...history].slice(0, 10); // Keep only the latest 50 entries
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
            transition={{ duration: .5 }}
        >
            <div className={`json-wrapper`}>
                <div className='line-number-container'>
                    <div className='line-number'></div>
                </div>
                <div className='textarea-container'>
                    <textarea
                        className='json-text-area'
                        ref={textareaRef}
                        value={jsonInput}
                        onChange={handleInputChange}
                        onScroll={handleScroll}
                        rows="10"
                        cols="50"
                        placeholder="Enter JSON here..."
                    />
                </div>
                <div className='btn-container'>
                    <Button className='btns-jsontool' onClick={validateJson}>Validate</Button>
                    <Button className='btns-jsontool' onClick={compressJson}>Compress JSON</Button>
                    <Button className='btns-jsontool' onClick={clearJson}>Clear</Button>
                    <Button className='btns-jsontool' onClick={toggleHistory}>{historyVisible ? 'Hide History' : 'Show History'}</Button>
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
