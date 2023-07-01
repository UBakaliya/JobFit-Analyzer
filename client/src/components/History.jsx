import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "../index.css";

const History = () => {
  const [history, setHistory] = useState([
    "Search query 1",
    "Search query 2",
    "Search query 3",
    "Search query 4",
    "Search query 5",
    "Search query 6",
    "Search query 7",
    "Search query 8",
    "Search query 9",
    "Search query 10",
  ]);

  const handleDelete = (index) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
  };

  const handleClearAll = () => {
    setHistory([]);
  };

  return (
    <div className="history-container mt-5">
      <div className="history-box">
        <div className="history-header mb-3">
          <h3 className="history-title">History</h3>
          <Button
            variant="danger"
            className="history-clear-button"
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        </div>
        <div className="history-items">
          {history.length === 0 ? (
            <p>No history available.</p>
          ) : (
            <div className="history-scroll">
              <ul className="list-group">
                {history.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center w-100"
                  >
                    <a href="#item">{item}</a>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(index)}
                    >
                      <FaTimes />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
