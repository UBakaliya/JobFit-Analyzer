import { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import "../index.css";
import axios from "axios";

const History = () => {
  useEffect(() => {
    document.title = "JobFit Analyzer | History";
  }, []);

  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        const res = await axios.get("resumes");
        setIsLoading(false);
        setHistories(res.data.resumes);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    getResumes();
  }, []);

  const handleDelete = async (_id) => {
    try {
      const res = await axios.delete(`resumes/${_id}`);
      console.log(res.data);
      setHistories(histories.filter((obj) => obj._id !== _id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearAll = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete("resumes");
      setIsLoading(false);
      console.log(res.data.message);
      setHistories([]);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const getFormattedDate = (date) => {
    const formateDate = new Date(date);

    // const month = formateDate.toLocaleString("en-US", { month: "long" });
    // const day = formateDate.toLocaleString("en-US", { day: "numeric" });
    // const year = formateDate.toLocaleString("en-US", { year: "numeric" });
    const time = formateDate.toLocaleString("en-US", { timeStyle: "medium" });

    return <span className="formatted-date">{time}</span>;
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-overlay position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
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
                >
                  Clear All
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
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div className="item-container">
                          {getFormattedDate(createdAt)} -{" "}
                          <a href="#" onClick={(e) => e.preventDefault()}>
                            {truncateQuery(fileName, 50)}
                          </a>
                        </div>
                        <div>
                          <Button
                            variant="outline-danger"
                            className={"delete-button"}
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
      )}
    </>
  );
};

export default History;
