import React, { useState } from "react";
import { Row, Col, Form, Button, Spinner } from "react-bootstrap";
import Result from "./Result";
import axios from "axios";

const Home = () => {
  // State variables
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [matchRate, setMatchRate] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert file size to MB
  const convertToMB = () => {
    const bytes = resumeFile.size;
    const megabytes = bytes / (1024 * 1024);
    return megabytes.toFixed(3);
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileName = resumeFile.name.toLowerCase();
    const typeOfFileToAccept = [".docx", ".pdf"];
    let typeOfFile = "";

    // Validate file types
    if (fileName.endsWith(typeOfFileToAccept[0])) typeOfFile = ".docx";
    else if (fileName.endsWith(typeOfFileToAccept[1])) typeOfFile = ".pdf";
    else return setError("Invalid file format. Accepted formats: PDF, DOCX");

    // Convert this file to MB
    const fileSize = convertToMB();

    // Do not accept files that are larger than 10MB
    if (fileSize > 10) return setError("File size must be less than 10MB");

    setError("");
    setIsLoading(true); // Set isLoading to true to disable the button and show loading style

    let formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("fileSize", fileSize);
    formData.append("fileType", typeOfFile);

    try {
      const response = await axios.post("resumes/scan", formData);
      const data = response.data;
      setMatchRate(data.matchRate);
      setShowResult(true);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false); // Reset isLoading after the form processing is complete
    }
  };

  // File input change handler
  const handleResumeFileChange = (event) => {
    const file = event.target.files[0];
    setResumeFile(file);
  };

  // Job description input change handler
  const handleJobDescriptionChange = (event) => {
    const value = event.target.value;
    setJobDescription(value);
  };

  // Go back to the input form
  const handleGoBack = () => {
    setMatchRate("");
    setShowResult(false);
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Processing...</span>
          </Spinner>
          <span className="m-2">Processing...</span>
        </div>
      )}

      {showResult ? (
        <Result onGoBack={handleGoBack} matchRate={matchRate} />
      ) : (
        <Row className="mt-5 d-flex align-items-center justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Form className="card bg-light p-5 rounded" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className="font-weight-bold mb-4 fs-4 text-center">
                  Upload Your Resume
                </Form.Label>
                <Form.Control
                  type="file"
                  id="customFile"
                  className="text-center mb-4"
                  name="uploadFile"
                  onChange={handleResumeFileChange}
                  required
                />
                <Form.Text className="text-muted fs-6">
                  Accepted formats: PDF, DOCX
                </Form.Text>
                <Form.Text className="d-block text-muted fs-6">
                  Maximum file size: 10MB
                </Form.Text>
                <hr />
                <Form.Label className="font-weight-bold mb-4 fs-4 text-center">
                  Job Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  className="resize-none"
                  placeholder="Provide a detailed job description..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  required
                />
              </Form.Group>
              {error && (
                <h6 className="text-center mt-3 text-danger">{error}</h6>
              )}
              <Button
                variant="dark"
                size="md"
                className="w-100 mt-4 p-2"
                type="submit"
                disabled={isLoading} // Disable the button while isLoading is true
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </>
                ) : (
                  "Start JobFit Analysis"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Home;
