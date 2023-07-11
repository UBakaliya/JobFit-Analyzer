import React, { useEffect, useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "../index.css";
import axios from "axios";

const History = ({ loadedFile }) => {
  const [history, setHistory] = useState([]);

  const truncateQuery = (query, maxLength) => {
    if (query.length <= maxLength) {
      return query;
    } else {
      return query.substring(0, maxLength - 3) + "...";
    }
  };

  useEffect(() => {
    const getResumes = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/v1/resumes", {
          withCredentials: true,
        });
        setHistory(...history, res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getResumes();
  }, []);

  const handleDelete = (_id) => {
    console.log("delete ", _id);
    // const updatedHistory = [...history];
    // updatedHistory.splice(index, 1);
    // setHistory(updatedHistory);
    // console.log("Item Deleted: ", index);
  };

  const handleLoad = (item) => {
    // Perform the loading operation here
    console.log("Loading item:", item);
  };

  const handleClearAll = () => {
    // delete all
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
                {history.map(({ fileName, _id }) => (
                  <li
                    key={_id}
                    className="list-group-item d-flex justify-content-between align-items-center w-100"
                  >
                    <div className="item-container">
                      <span
                        className="query-link"
                        style={{ marginRight: "10px" }}
                      >
                        {truncateQuery(fileName, 50)}
                      </span>
                    </div>
                    <div>
                      {/* <Button
                        variant="primary"
                        className="load-button pr-5"
                        style={{ marginRight: "10px" }}
                        onClick={() => {
                          handleLoad(_id);
                          loadedFile(fileName);
                        }}
                      >
                        <FaCloudUploadAlt className="upload-icon" /> Load
                      </Button> */}
                      <Button
                        variant="outline-danger"
                        onClick={() => handleDelete(_id)}
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
