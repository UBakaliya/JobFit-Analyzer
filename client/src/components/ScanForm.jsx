import { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { MDBFile, MDBTextArea } from "mdb-react-ui-kit";
import Result from "./Result";

const CompareForm = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [matchRate, setMatchRate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData(); //formdata object
    formData.append("resumeFile", resumeFile);
    formData.append("jobDescription", jobDescription);
    fetch("http://localhost:9999/api/v1/resumes/scan/", {
      method: "post",
      body: formData,
    })
      .then((res) => {
        return res.text();
      })
      .then((data) => {
        const jsonData = JSON.parse(data);
        setMatchRate(jsonData.matchRate);
        setShowResult(true);
      })
      .catch((e) => {
        console.log(e.message);
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
    setShowResult(false);
  };

  return (
    <>
      {showResult ? (
        <Result onGoBack={handleGoBack} matchRate={matchRate} />
      ) : (
        <Row className="mt-5">
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
                  rows={4}
                  className="resize-none"
                  placeholder="Provide a detailed job description..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  required
                />
              </Form.Group>
              <Button
                variant="dark"
                size="md"
                className="w-100 mt-5 p-2"
                type="submit"
              >
                START SCANNING
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CompareForm;
