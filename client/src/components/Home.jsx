import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { MDBFile, MDBTextArea } from "mdb-react-ui-kit";
import Result from "./Result";
import axios from "axios";

const Home = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [matchRate, setMatchRate] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const convertToMB = () => {
    const bytes = resumeFile.size;
    const megabytes = bytes / (1024 * 1024);
    return megabytes.toFixed(3);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fileName = resumeFile.name.toLowerCase();
    const typeOfFileToAccept = [".docx", ".pdf"];
    let typeOfFile = "";

    // validate file types
    if (fileName.endsWith(typeOfFileToAccept[0])) typeOfFile = ".docx";
    else if (fileName.endsWith(typeOfFileToAccept[1])) typeOfFile = ".pdf";
    else return setError("Invalid file format. Accepted formats: PDF, DOCX");

    // convert this file to mb
    const fileSize = convertToMB();

    // Do not accept the files thar are more then 10MB
    if (fileSize > 10) return setError("File size must be less than 10MB");

    setError("");

    let formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("fileSize", fileSize);
    formData.append("fileType", typeOfFile);

    try {
      setIsLoading(true);
      const response = await axios.post("resumes/scan", formData, {
        withCredentials: true,
      });
      setIsLoading(false);
      const data = response.data;
      setMatchRate(data.matchRate);
      setShowResult(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleResumeFileChange = (event) => {
    const file = event.target.files[0];
    setResumeFile(file);
  };

  const handleJobDescriptionChange = (event) => {
    const value = event.target.value;
    setJobDescription(value);
  };

  const handleGoBack = () => {
    setMatchRate("");
    setShowResult(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-overlay position-fixed top-0 start-0 h-100 w-100 d-flex flex-column align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Processing...</h4>
        </div>
      ) : showResult ? (
        <Result onGoBack={handleGoBack} matchRate={matchRate} />
      ) : (
        <Row className="mt-5 m-0">
          <Col xs={12} sm={6} className="offset-sm-3">
            <Form className="card bg-light p-5 rounded" onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className="font-weight-bold mb-4 fs-4">
                  Upload Your Resume
                </Form.Label>

                <MDBFile
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
                <Form.Label className="font-weight-bold mb-4 fs-4">
                  Job Description
                </Form.Label>
                <MDBTextArea
                  id="textAreaExample"
                  rows={6}
                  className="resize-none"
                  placeholder="Provide a detailed job description..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  required
                />
              </Form.Group>
              <h6 className="text-center mt-3 text-danger">{error}</h6>
              <Button
                variant="dark"
                size="md"
                className="w-100 mt-4 p-2"
                type="submit"
              >
                Start JobFit Analysis
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Home;
