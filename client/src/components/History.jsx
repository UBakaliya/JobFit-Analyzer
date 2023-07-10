import React, { useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "../index.css";

const truncateQuery = (query, maxLength) => {
  if (query.length <= maxLength) {
    return query;
  } else {
    return query.substring(0, maxLength - 3) + "...";
  }
};

const History = ({ loadedFile }) => {
  const [history, setHistory] = useState([
    { query: "Search query 1" },
    { query: "Search query 2" },
    { query: "Search query 3" },
    { query: "Search query 4" },
    { query: "Search query 5" },
    { query: "Search query 6" },
    { query: "Search query 7" },
    { query: "Search query 8" },
    { query: "Search query 9" },
    { query: "Search query 10" },
  ]);



  


  const handleDelete = (index) => {
    const updatedHistory = [...history];
    updatedHistory.splice(index, 1);
    setHistory(updatedHistory);
    console.log("Item Deleted: ", index);
  };

  const handleLoad = (item) => {
    // Perform the loading operation here
    console.log("Loading item:", item);
  };

  const handleClearAll = () => {
    setHistory([]);
  };

  return (
    <div className="history-container mt-5">
      <div className="history-box">
        <div className="history-header mb-3">
          <h3 className="history-title">History</h3>
          {history.length !== 0 && (
            <Button
              variant="danger"
              className="history-clear-button"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="history-items">
          {history.length === 0 ? (
            <p>No history available</p>
          ) : (
            <div className="history-scroll">
              <ul className="list-group">
                {history.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center w-100"
                  >
                    <div className="item-container">
                      <span
                        className="query-link"
                        style={{ marginRight: "10px" }}
                      >
                        {truncateQuery(item.query, 50)}
                      </span>
                    </div>
                    <div>
                      <Button
                        variant="primary"
                        className="load-button pr-5"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          handleLoad(index);
                          loadedFile(item.query);
                        }}
                      >
                        <FaCloudUploadAlt className="upload-icon" /> Load
                      </Button>
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(index)}
                      >
                        <FaTimes />
                      </Button>
                    </div>
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
