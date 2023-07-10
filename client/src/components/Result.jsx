import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Result = ({ onGoBack, matchRate }) => {
  const [showForm, setShowForm] = useState(false);

  const handleGoBack = () => {
    setShowForm(true);
    onGoBack();
  };

  const getColorClass = () => {
    if (matchRate >= 90) {
      return "text-success"; // Green color for match rate above 90%
    } else if (matchRate >= 50) {
      return "text-warning"; // Yellow color for match rate above 70%
    } else {
      return "text-danger"; // Red color for match rate below or equal to 70%
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
          <Button variant="secondary" onClick={handleGoBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Go Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Result;
