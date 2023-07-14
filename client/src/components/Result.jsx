import { Container, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Result = ({ onGoBack, matchRate }) => {
  const [, setShowForm] = useState(false);

  const handleGoBack = () => {
    setShowForm(true);
    onGoBack();
  };

  const getColorClass = () => {
    if (matchRate >= 50) {
      return "text-success";
    } else if (matchRate >= 30) {
      return "text-warning";
    } else {
      return "text-danger";
    }
  };

  const ResumeMatchPage = () => {
    let suggestions = null;

    if (matchRate < 30) {
      suggestions = (
        <div>
          <h3>Suggestions to Improve Your Resume:</h3>
          <ul>
            <li>Skill up in areas where your match rate is low.</li>
            <li>Highlight relevant experiences and achievements.</li>
            <li>Customize your resume to match the job requirements.</li>
          </ul>
        </div>
      );
    } else if (matchRate >= 30 && matchRate <= 50) {
      suggestions = (
        <div>
          <h3>Suggestions to Enhance Your Resume:</h3>
          <ul>
            <li>Focus on optimizing your skills and qualifications.</li>
            <li>Showcase your achievements and results prominently.</li>
            <li>Tailor your resume to highlight relevant keywords.</li>
          </ul>
        </div>
      );
    } else if (matchRate > 50) {
      suggestions = (
        <div>
          <h3>Suggestions to Maximize Your Resume Match:</h3>
          <ul>
            <li>
              Continuously update your resume with new skills and experiences.
            </li>
            <li>
              Highlight your most relevant qualifications and accomplishments.
            </li>
            <li>Showcase your unique selling points and strengths.</li>
          </ul>
        </div>
      );
    }

    return (
      <div>
        <h2
          className={`text-center display-5 font-weight-bold ${getColorClass()}`}
        >
          {matchRate}%
          <hr />
        </h2>
        {suggestions}
      </div>
    );
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={7}>
          <div className="bg-light p-5 rounded shadow">
            <h3 className=" mb-4 font-weight-bold">Result - Match Rate:</h3>
            {ResumeMatchPage(matchRate)}
          </div>
        </Col>
      </Row>
      <Row className="mt-4 justify-content-center">
        <Col xs="auto">
          <Button variant="dark" onClick={handleGoBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Result;
