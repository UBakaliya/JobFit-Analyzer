import React from "react";
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

  const suggestionsData = [
    {
      range: [0, 30],
      title: "Suggestions to Improve Your Resume:",
      suggestions: [
        "Skill up in areas where your match rate is low.",
        "Highlight relevant experiences and achievements.",
        "Customize your resume to match the job requirements.",
      ],
    },
    {
      range: [30, 50],
      title: "Suggestions to Enhance Your Resume:",
      suggestions: [
        "Focus on optimizing your skills and qualifications.",
        "Showcase your achievements and results prominently.",
        "Tailor your resume to highlight relevant keywords.",
      ],
    },
    {
      range: [50, 100],
      title: "Suggestions to Maximize Your Resume Match:",
      suggestions: [
        "Continuously update your resume with new skills and experiences.",
        "Highlight your most relevant qualifications and accomplishments.",
        "Showcase your unique selling points and strengths.",
      ],
    },
  ];

  const getMatchingSuggestions = () => {
    for (const { range, title, suggestions } of suggestionsData) {
      if (matchRate >= range[0] && matchRate <= range[1]) {
        return (
          <div>
            <h3>{title}</h3>
            <ul>
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={7}>
          <div className="bg-light p-5 rounded shadow">
            <h3 className="mb-4 font-weight-bold text-center">
              Result - Match Rate:
            </h3>
            <h2
              className={`text-center display-5 font-weight-bold ${getColorClass()}`}
            >
              {matchRate}%
            </h2>
            <hr />
            {getMatchingSuggestions()}
          </div>
        </Col>
      </Row>
      <Row className="mt-4 justify-content-center">
        <Col xs="auto">
          <Button variant="dark" onClick={handleGoBack}>
            <FontAwesomeIcon icon={faArrowLeft} className="btn-lg" />
            Go Back
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Result;
