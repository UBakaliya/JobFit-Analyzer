import { Container, Row, Col, Form, Button } from "react-bootstrap";
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

  return (
    <Container>
      <Row className="mt-5">
        <Col xs={12} sm={6} className="offset-sm-3">
          <div className="bg-light p-5 rounded shadow">
            <h4 className="font-weight-bold mb-4">Result</h4>
            <h4 className={`text-center ${getColorClass()}`}>{matchRate} %</h4>
          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
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
