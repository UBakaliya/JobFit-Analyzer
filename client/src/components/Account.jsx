import React, { useState } from "react";
import { Card, Container, Form, Button } from "react-bootstrap";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "********",
  });

  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Code to reset password
    setUser({ ...user, password: newPassword });
    setNewPassword("");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "75vh" }}
    >
      <Card style={{ width: "900px" }}>
        <Card.Body>
          <h1>Profile</h1>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={user.name} disabled />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label className="mt-2">Email</Form.Label>
              <Form.Control type="email" value={user.email} disabled />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label className="mt-2">Old Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                placeholder="Old Password"
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label className="mt-2">New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                placeholder="New Password"
                onChange={handlePasswordChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              className="mt-3"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
