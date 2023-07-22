import { useEffect, useState } from "react";
import { Card, Container, Form, Button, Modal, Toast } from "react-bootstrap";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const Account = () => {
  useEffect(() => {
    document.title = "JobFit Analyzer | Profile";
  }, []);

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const getUserProfile = async () => {
    try {
      const response = await axios.get("profile/");
      setUser({ name: response.data.username, email: response.data.email });
    } catch (error) {
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
      setSuccess("");
      setError("All fields are required");
      setShowErrorToast(true);
      return;
    }

    // Other form validation checks here...
    const trimmedNewPassword = newPassword.trim();
    if (trimmedNewPassword.length < 5) {
      setSuccess("");
      setError("Password must be at least 5 characters long");
      setShowErrorToast(true);
      return;
    }

    try {
      setIsResettingPassword(true);
      const res = await axios.put(`profile/resetpassword/`, {
        oldPassword,
        newPassword: trimmedNewPassword,
      });
      setIsResettingPassword(false);
      setSuccess("Password reset successful");
      setError("");
      setNewPassword("");
      setOldPassword("");
      setShowSuccessToast(true);
      console.log(res.data.message);
    } catch (err) {
      setIsResettingPassword(false);
      setSuccess("");
      setError("*" + err.response.data.message);
      setShowErrorToast(true);
    }
  };

  const handleDeleteAccount = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeletingAccount(true);
      const res = await axios.delete("profile/delete/");
      setTimeout(() => {
        setIsDeletingAccount(false);
        setSuccess("Account deleted successfully");
        setError("");
        setShowConfirmation(false);
        setShowSuccessToast(true);
        console.log(res.data.message);
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      setIsDeletingAccount(false);
      setError("*" + err.response.data.message);
      setShowErrorToast(true);
      setSuccess("");
      setShowConfirmation(false);
    }
  };

  const handleCloseErrorToast = () => {
    setError("");
    setShowErrorToast(false);
  };

  const handleCloseSuccessToast = () => {
    setSuccess("");
    setShowSuccessToast(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card
        className="w-100"
        style={{
          maxWidth: "600px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Card.Body>
          <h1 className="text-center mb-4">Profile</h1>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={user.name} disabled />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={user.email} disabled />
            </Form.Group>

            <Form.Group controlId="formOldPassword">
              <Form.Label>Old Password</Form.Label>
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
              <Form.Label>New Password</Form.Label>
              <Form.Control
                autoComplete="on"
                type="password"
                value={newPassword}
                placeholder="New Password"
                onChange={handleNewPasswordChange}
                required
              />
            </Form.Group>
            <Button
              variant="dark"
              className="w-100 mt-3"
              onClick={handleResetPassword}
              disabled={isResettingPassword}
            >
              {isResettingPassword ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm text-light me-2"
                    role="status"
                  ></div>
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
            <hr className="my-4" />
            <div className="d-flex justify-content-center align-items-center">
              <Button
                variant="danger"
                className="mt-3"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
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
                    disabled={isDeletingAccount}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleConfirmDelete}
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm text-light me-2"
                          role="status"
                        ></div>
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Toast
        show={showErrorToast}
        onClose={handleCloseErrorToast}
        autohide
        delay={3000} // Set the duration here (in milliseconds)
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast.Header className="bg-danger text-white">
          <strong className="me-auto">Error</strong>
        </Toast.Header>
        <Toast.Body>{error}</Toast.Body>
      </Toast>

      <Toast
        show={showSuccessToast}
        onClose={handleCloseSuccessToast}
        autohide
        delay={3000} // Set the duration here (in milliseconds)
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast.Header className="bg-success text-white">
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>{success}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default Account;
