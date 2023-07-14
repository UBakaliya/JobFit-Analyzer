import React, { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { FaTimes, FaCloudUploadAlt } from "react-icons/fa";
import "../index.css";
import axios from "axios";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

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

        setHistories([...histories, ...res.data.resumes]);
      } catch (error) {
        console.log(error);
      }
    };
    getResumes();
  }, []);

  const handleDelete = async (_id) => {
    try {
      const res = await axios.delete(
        `http://localhost:9999/api/v1/resumes/${_id}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setHistories(histories.filter((obj) => obj._id !== _id));
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleClearAll = async () => {
    try {
      const res = await axios.delete("http://localhost:9999/api/v1/resumes/", {
        withCredentials: true,
      });
      console.log(res.data.message);
      setHistories([]);
    } catch (error) {
      console.log(error);
    }
  };

  /************************************************************************************
   * @description:THIS IS NOT BEING USED IN THE VERSION OF THE APPLICATION
   * const handleLoad = (item) => {
   * console.log("Loading item:", item);
   * };
   ************************************************************************************/

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
                    onMouseEnter={() => setHoveredItem(_id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="item-container">
                      {getFormattedDate(createdAt)} -{" "}
                      {truncateQuery(fileName, 50)}
                    </div>
                    <div>
                      {/***********************************************************************************
                       * @description: THIS IS FUTURE IS NOT BING ADDED TO THE VERSION OF THIS APPLICATION
                       * <Button variant="primary"
                       *  className="load-button pr-5" style={{ marginRight: "10px" }}
                       *  onClick={() => handleLoad(_id)}>
                       *  <FaCloudUploadAlt className="upload-icon" /> Load
                       * </Button>
                       ***********************************************************************************/}

                      {hoveredItem === _id && (
                        <Button
                          variant="outline-danger"
                          onClick={() => handleDelete(_id)}
                        >
                          <FaTimes />
                        </Button>
                      )}
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
