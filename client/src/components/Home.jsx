import { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import Result from "./Result";
import axios from "axios";

const Home = () => {
  useEffect(() => {
    document.title = "JobFit Analyzer";
  }, []);

  const acceptedFileFormats = [".docx", ".pdf"];
  const maxFileSizeInMB = 10;
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [matchRate, setMatchRate] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to convert file size to MB
  const convertToMB = (sizeInBytes) => {
    return (sizeInBytes / (1024 * 1024)).toFixed(3);
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      setError("Please select a resume file.");
      return;
    }

    const fileName = resumeFile.name.toLowerCase();
    let typeOfFile = acceptedFileFormats.find((format) =>
      fileName.endsWith(format)
    );

    if (!typeOfFile) {
      setError("Invalid file format. Accepted formats: PDF, DOCX");
      return;
    }

    const fileSize = convertToMB(resumeFile.size);

    if (fileSize > maxFileSizeInMB) {
      setError(`File size must be less than ${maxFileSizeInMB}MB`);
      return;
    }

    setError("");
    setIsLoading(true);

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
      setError("Error processing the request. Please try again later.");
      console.log(error.message);
    } finally {
      setIsLoading(false);
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
      {showResult ? (
        <Result onGoBack={handleGoBack} matchRate={matchRate} />
      ) : (
        <Row className="m-0 mt-5 d-flex align-items-center justify-content-center">
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
                  Maximum file size: {maxFileSizeInMB}MB
                </Form.Text>
                <hr />
                <Form.Label className="font-weight-bold mb-4 fs-4 text-center">
                  Job Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Analyzing...
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
