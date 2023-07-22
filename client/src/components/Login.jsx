import { useState, useEffect } from "react";
import axios from "axios";
import { Toast } from "react-bootstrap";

const Login = () => {
  useEffect(() => {
    document.title = "JobFit Analyzer | Login";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post("login/", { email, password });
      setIsLoading(false);
      setSuccess(response.data.message);
      setError("");
      setShowSuccessToast(true);
      window.location.href = "/";
    } catch (error) {
      setIsLoading(false);
      setSuccess("");
      setError(error.response.data.message);
      setShowErrorToast(true);
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

  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "600px", width: "100%", borderRadius: "8px" }}
      >
        <div
          className="card-header bg-dark text-white text-center py-3"
          style={{ borderRadius: "8px 8px 0 0" }}
        >
          <h2 className="mb-0">Login</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Username or Email
              </label>
              <input
                id="email"
                type="text"
                className="form-control"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                autoComplete="on"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className={`btn btn-dark ${isLoading ? "disabled" : ""}`}
                style={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  borderRadius: "4px",
                  width: "100%",
                }}
              >
                {isLoading ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm text-light me-2"
                      role="status"
                    ></div>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

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
    </div>
  );
};

export default Login;
