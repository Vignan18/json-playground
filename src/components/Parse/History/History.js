import React from 'react';
import { Button } from 'react-bootstrap';
import './history.css'

function History({ history, isVisible, onSelect, clearAllHistory }) {

    const handleClick = (json) => {
        onSelect(json);
    };

    const handleClearAll = () => {
        clearAllHistory();
    };

    return (
        <div className={`history-panel ${isVisible ? 'open' : 'close'}`}>
            <h3>History</h3>
            <ul>
                {history.map((entry, index) => (
                    <span>
                        <li key={index} className="history-item" onClick={() => handleClick(entry.json)}>
                            <span className="json">{entry.json}</span>
                        </li>
                        <li>
                            <span className="timestamp">{entry.timestamp}</span>
                        </li>
                    </span>
                ))}
            </ul>
            <div className="clearBtn-container">
                <Button className="btn-clearAll" onClick={handleClearAll}>Clear All</Button>
            </div>
        </div>
    );
}

export default History;
