import React, { useEffect, useState } from "react";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import { Button, ListGroup } from "react-bootstrap";
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
        const res = await axios.get("http://localhost:9999/api/v1/resumes/", {
          withCredentials: true,
        });

        setHistory([...history, ...res.data.resumes]);
      } catch (error) {
        console.log(error);
      }
    };
    getResumes();
  }, []);

  const handleDelete = async (_id) => {
    console.log("delete ", _id);

    try {
      const res = await axios.delete(
        `http://localhost:9999/api/v1/resumes/${_id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setHistory(history.filter((obj) => obj._id !== _id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLoad = (item) => {
    // Perform the loading operation here
    console.log("Loading item:", item);
  };

  const handleClearAll = async () => {
    try {
      // delete all
      const res = await axios.delete("http://localhost:9999/api/v1/resumes/", {
        withCredentials: true,
      });
      console.log(res.data.message);
      setHistory([]);
    } catch (error) {
      console.log(error);
    }
  };

  const getFormattedDate = (date) => {
    const formateDate = new Date(date);

    const month = formateDate.toLocaleString("en-US", { month: "long" });
    const day = formateDate.toLocaleString("en-US", { day: "numeric" });
    const year = formateDate.toLocaleString("en-US", { year: "numeric" });
    const time = formateDate.toLocaleString("en-US", { timeStyle: "medium" });

    return <span className="formatted-date">{time}</span>;
  };

  return (
    <div className="history-container mt-5">
      <div className="history-box">
        <div className="history-header d-flex justify-content-between align-items-center mb-3">
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
            <p className="text-center">No history available</p>
          ) : (
            <div className="history-scroll">
              <ListGroup>
                {history.map(({ fileName, _id, createdAt }) => (
                  <ListGroup.Item
                    key={_id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div className="item-container">
                      {getFormattedDate(createdAt)} -{" "}
                      {truncateQuery(fileName, 50)}
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
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
