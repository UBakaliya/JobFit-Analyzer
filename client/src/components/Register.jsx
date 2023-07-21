import { useState, useEffect } from "react";
import axios from "axios";

const Register = () => {
  useEffect(() => {
    document.title = "JobFit Analyzer | Sign Up";
  }, []);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // check for black spaces
    const trimUsername = username.trim();
    const trimPassword = password.trim();

    if (!trimUsername || trimUsername.length < 4) {
      return setError("Username must be at least 5 characters long");
    }

    if (!trimPassword || trimPassword.length < 5) {
      return setError("Password must be at least 5 characters long");
    }

    if (password !== confirmPassword) {
      return setError("Ensure the passwords match each other");
    }

    try {
      setIsLoading(true);
      const response = await axios.post("register", {
        username,
        password,
        email,
      });
      setIsLoading(false);
      setError("");
      setConfirmation(response.data.message);
      window.location.href = "/login";
    } catch (error) {
      setIsLoading(false);
      setConfirmation("");
      setError(error.response.data.message);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center mt-5">
      <div
        className="card shadow"
        style={{ maxWidth: "600px", width: "100%", borderRadius: "8px" }}
      >
        <div
          className="card-header bg-dark text-white text-center py-3"
          style={{ borderRadius: "8px 8px 0 0" }}
        >
          <h2 className="mb-0">Sign up</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="form-control"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
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
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="on"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                autoComplete="on"
              />
            </div>
            {error && (
              <p className="text-danger text-center mb-3">
                <i className="bi bi-exclamation-circle me-1"></i>
                {error}
              </p>
            )}
            {confirmation && (
              <p className="text-success text-center mb-3">
                <i className="bi bi-check-circle me-1"></i>
                {confirmation}
              </p>
            )}

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
                    Signing up...
                  </>
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
