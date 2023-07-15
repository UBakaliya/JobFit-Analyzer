import { useEffect, useState } from "react";
import { Card, Container, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Account = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("profile", {
        withCredentials: true,
      });
      setIsLoading(false);
      setUser({ name: response.data.username, email: response.data.email });
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data.message);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !oldPassword) {
      return setError("*All fields are required");
    }

    const trimNewPassword = newPassword.trim();

    if (!trimNewPassword || trimNewPassword.length < 5) {
      return setError("*Password must be at least 5 characters long");
    }

    try {
      setIsLoading(true);
      const res = await axios.put(
        `profile/resetpassword/`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      setIsLoading(false);
      setSuccess(res.data.message);
      setError("");
    } catch (err) {
      setIsLoading(false);
      setError("*" + err.response.data.message);
      setSuccess("");
    }
  };

  const handledDeleteAccount = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete("profile/delete/", {
        withCredentials: true,
      });
      setIsLoading(false);
      setSuccess(res.data.message);
      setError("");
      setShowConfirmation(false);
      window.location.href = "/";
    } catch (err) {
      setIsLoading(false);
      setError("*" + err.response.data.message);
      setSuccess("");
      setShowConfirmation(false);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>JobFit Analyzer | Profile</title>
      </Helmet>
      {isLoading ? (
        <div className="loading-overlay position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <Container
          className="d-flex justify-content-center align-items-center mt-5"
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

                <Form.Group controlId="formOldPassword">
                  <Form.Label className="mt-2">Old Password</Form.Label>
                  <Form.Control
                    autoComplete="on"
                    type="password"
                    value={oldPassword}
                    placeholder="Old Password"
                    required
                    onChange={handleOldPasswordChange}
                  />
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                  <Form.Label className="mt-2">New Password</Form.Label>
                  <Form.Control
                    autoComplete="on"
                    type="password"
                    value={newPassword}
                    placeholder="New Password"
                    onChange={handleNewPasswordChange}
                    required
                  />
                </Form.Group>
                <p className="m-1  text-danger">{error}</p>
                <p className="m-1  text-success">{success}</p>

                <Button
                  variant="primary"
                  className="mt-3"
                  onClick={handleResetPassword}
                >
                  Reset Password
                </Button>
                <hr />
                <div className="d-flex justify-content-center">
                  <Button
                    variant="danger"
                    className="mt-3"
                    onClick={handledDeleteAccount}
                  >
                    <FaTrash className="mr-2" /> Delete Account
                  </Button>

                  <Modal
                    show={showConfirmation}
                    onHide={handleCloseConfirmation}
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to delete your account?
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={handleCloseConfirmation}
                      >
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      )}
    </>
  );
};

export default Account;
