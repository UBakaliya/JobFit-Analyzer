import React, { useEffect, useState } from "react";
import { Button, ListGroup, Spinner } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import "../index.css";
import axios from "axios";

const History = () => {
  useEffect(() => {
    document.title = "JobFit Analyzer | History";
  }, []);

  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [isDeleting, setIsDeleting] = useState({});

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
        const res = await axios.get("resumes");
        setHistories(res.data.resumes);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getResumes();
  }, []);

  const handleDelete = async (_id) => {
    try {
      setIsDeleting((prevState) => ({
        ...prevState,
        [_id]: true,
      }));

      const res = await axios.delete(`resumes/${_id}`);
      console.log(res.data);
      setHistories((prevHistories) =>
        prevHistories.filter((obj) => obj._id !== _id)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting((prevState) => ({
        ...prevState,
        [_id]: false,
      }));
    }
  };

  const handleClearAll = async () => {
    try {
      setIsClearing(true);
      const res = await axios.delete("resumes");
      console.log(res.data.message);
      setHistories([]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsClearing(false);
    }
  };

  const getFormattedDate = (date) => {
    const formateDate = new Date(date);
    const time = formateDate.toLocaleString("en-US", { timeStyle: "medium" });

    return <span className="formatted-date">{time}</span>;
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-overlay position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="history-container mt-5">
          <div className="card bg-light history-box">
            <div className="history-header d-flex justify-content-between align-items-center mb-3">
              <h3 className="history-title">History</h3>
              {histories.length !== 0 && (
                <Button
                  variant="danger"
                  className="history-clear-button"
                  onClick={handleClearAll}
                  disabled={isClearing}
                >
                  {isClearing ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Clearing...
                    </>
                  ) : (
                    "Clear All"
                  )}
                </Button>
              )}
            </div>
            <div className="history-items">
              {histories.length === 0 ? (
                <p className="text-center">No history available</p>
              ) : (
                <div className="history-scroll">
                  <ListGroup>
                    {histories.map(({ fileName, _id, createdAt }) => (
                      <ListGroup.Item
                        key={_id}
                        className="d-flex justify-content-between align-items-center history-item"
                      >
                        <div className="item-container">
                          {getFormattedDate(createdAt)} -{" "}
                          {truncateQuery(fileName, 50)}
                        </div>
                        <div>
                          <Button
                            variant="outline-danger"
                            className={"delete-button"}
                            onClick={() => handleDelete(_id)}
                            disabled={isDeleting[_id]}
                          >
                            {isDeleting[_id] ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Deleting...
                              </>
                            ) : (
                              <FaTimes />
                            )}
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
      )}
    </>
  );
};

export default History;
