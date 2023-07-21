import { useState, useEffect } from "react";
import axios from "axios";

const Login = () => {
  useEffect(() => {
    document.title = "JobFit Analyzer | Login";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      window.location.href = "/";
    } catch (error) {
      setIsLoading(false);
      setSuccess("");
      setError(error.response.data.message);
    }
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
            {error && (
              <p className="text-danger text-center mb-3">
                <i className="bi bi-exclamation-circle me-1"></i>
                {error}
              </p>
            )}
            {success && (
              <p className="text-success text-center mb-3">
                <i className="bi bi-check-circle me-1"></i>
                {success}
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
    </div>
  );
};

export default Login;
