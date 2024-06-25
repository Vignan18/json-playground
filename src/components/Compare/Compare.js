import React, { useState, useRef, useEffect } from 'react';
import { diffWordsWithSpace } from 'diff';
import { motion } from 'framer-motion'
import Button from '@mui/material/Button';
import './compare.css';

function Compare() {
    // const [inputOne, setInputOne] = useState('');
    // const [inputTwo, setInputTwo] = useState('');
    // const [differences, setDifferences] = useState('');
    // const [expanded, setExpanded] = useState(false);
    // const compareTextareaRef1 = useRef(null);
    // const compareTextareaRef2 = useRef(null);
    // const [textareaHeight, setTextareaHeight] = useState('200px');


    // useEffect(() => {
    //     if (!compareTextareaRef1.current.contains(document.activeElement) && !compareTextareaRef2.current.contains(document.activeElement)) {
    //         if (expanded) {
    //             setTextareaHeight(`${compareTextareaRef1.current.scrollHeight-256}em`);
    //             setTextareaHeight(`${compareTextareaRef2.current.scrollHeight-256}em`);
    //         } else {
    //             setTextareaHeight('17rem');
    //         }
    //     }
        
    // }, [expanded, inputOne, inputTwo]);

    // const handleInputOneChange = (event) => {
    //     setInputOne(event.target.value);
    // };

    // const handleInputTwoChange = (event) => {
    //     setInputTwo(event.target.value);
    // };

    // const expandWindow = () => {
    //     setExpanded(!expanded);
    // };

    // const compareInputs = () => {
    //     // Use diffWordsWithSpace for word-level comparison
    //     const diff = diffWordsWithSpace(inputOne, inputTwo);
    //     if (diff.length === 1 && !diff[0].added && !diff[0].removed) {
    //         setDifferences('No differences found.');
    //     } else {
    //         const formattedDiff = diff.map((part, index) => {
    //             const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    //             const style = { backgroundColor: color, padding: '0.1em 0', marginRight: '2px' }; // Add styles for clarity
    //             return <span key={index} style={style}>{part.value}</span>;
    //         });
    //         setDifferences(<div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{formattedDiff}</div>);
    //     }
    // };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: .5 }}
        >
            {/* <div className={`json-compare-wrapper ${expanded ? 'expanded' : ''}`}>
                <button className='btn-expand-top' onClick={expandWindow}>
                    {expanded ? <i className="material-icons">expand_less</i> : <i className="material-icons">expand_more</i>}
                </button>
                <h3 className='json-compare-heading'>Check Difference</h3>
                <div className='textareas-container'>
                    <textarea
                        className='diff-text-area-left'
                        value={inputOne}
                        ref={compareTextareaRef1}
                        onChange={handleInputOneChange}
                        rows="10"
                        cols="50"
                        placeholder="Enter Text..."
                        style={{ resize: 'none', height: textareaHeight }}
                    />
                    <textarea
                        className='diff-text-area-right'
                        value={inputTwo}
                        ref={compareTextareaRef2}
                        onChange={handleInputTwoChange}
                        rows="10"
                        cols="50"
                        placeholder="Enter Text..."
                        style={{ resize: 'none', height: textareaHeight }}
                    />
                </div>
                <div className='btn-container'>
                    <Button className='btns-jsoncompare' onClick={compareInputs}>Compare</Button>
                </div>
                <div>
                    <h2>Differences:</h2>
                    {differences || <p>No differences detected or input is empty.</p>}
                </div>
            </div> */}
            <section id="hero" className='profile-container'>
                <div className='info'>
                    <h3 className='about-heading'>Comming Soon ...!</h3>
                </div>
            </section>
        </motion.div>
    );
}

export default Compare;

