import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { MDBFile, MDBTextArea } from "mdb-react-ui-kit";
import Result from "./Result";
import History from "./History";
import axios from "axios";

const Home = ({ isLoggedIn }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [matchRate, setMatchRate] = useState("");
  const [error, setError] = useState(null);

  const convertToMB = () => {
    const bytes = resumeFile.size;
    const megabytes = bytes / (1024 * 1024);
    return megabytes.toFixed(3); // Round the result to 3 decimal places
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const fileName = resumeFile.name.toLowerCase();
    const typeOfFileToAccept = [".docx", ".pdf"];
    let typeOfFile = "";
    if (fileName.endsWith(typeOfFileToAccept[0])) typeOfFile = ".docx";
    else if (fileName.endsWith(typeOfFileToAccept[1])) typeOfFile = ".pdf";
    else return setError("Invalid file type Accepted formats: PDF, DOCX");

    // get the file size in MB
    const fileSize = convertToMB();

    // if the file size is more then 10MD then
    if (fileSize > 10) {
      return setError("File size must be less then 10MB");
    }

    // if a valid file
    setError("");

    let formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("jobDescription", jobDescription);
    formData.append("fileSize", fileSize);
    formData.append("fileType", typeOfFile);

    // scan the resume and the job description and get the match rate
    axios
      .post("http://localhost:9999/api/v1/resumes/scan/", formData, {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
        setMatchRate(data.matchRate);
        setShowResult(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
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

  const loadFileName = (name) => {
    setResumeFile("");
  };

  return (
    <>
      {showResult ? (
        <Result onGoBack={handleGoBack} matchRate={matchRate} />
      ) : (
        <Row className="mt-5 m-0">
          <Col xs={12} sm={6} className="offset-sm-3">
            <Form className="bg-light p-5 rounded" onSubmit={handleSubmit}>
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
                START SCANNING
              </Button>
            </Form>
          </Col>
          {isLoggedIn && <History loadedFile={loadFileName} />}
        </Row>
      )}
    </>
  );
};

export default Home;
