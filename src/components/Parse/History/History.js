import React from 'react';
import { Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa'
import { MdOutlineDeleteOutline } from "react-icons/md";
import './history.css'

function History({ history, isVisible, onSelect, onDelete, clearAllHistory, toggleHistory }) {

    const handleClick = (json) => {
        onSelect(json);
    };

    const handleClearAll = () => {
        clearAllHistory();
    };

    const closePanel = () => {
        toggleHistory();
    };

    const onDeleteItem = (index) => {
        onDelete(index);
    };

    return (
        <div className={`history-panel ${isVisible ? 'open' : 'close'}`}>
            <div>
                <h3>
                    <span className="close-icon" onClick={closePanel}>
                        <FaTimes />
                    </span>
                    History
                </h3>
            </div>
            <div className='list-container'>
                <ul>
                    {history.map((entry, index) => (
                        <span>
                            <li key={index} className="history-item" onClick={() => handleClick(entry.json)}>
                                <span className="json">{entry.json}</span>
                            </li>
                            <li className = "meta">
                                <span className="delete-icon" onClick={() => onDeleteItem(index)}>
                                    <MdOutlineDeleteOutline />
                                </span>
                                <span className="timestamp">{entry.timestamp}</span>
                            </li>
                        </span>
                    ))}
                </ul>
            </div>
            <div className="clearBtn-container">
                <Button className="btn-clearAll" onClick={handleClearAll}>Clear All</Button>
            </div>
        </div>
    );
}

export default History;
