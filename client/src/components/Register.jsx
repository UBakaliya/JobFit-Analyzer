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

    if (password !== confirmPassword)
      return setError("Ensure the passwords matches each other");

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
    <>
      {isLoading ? (
        <div className="loading-overlay position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="text-center">Sign up</h2>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        id="username"
                        type="username"
                        className="form-control"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="mt-2">
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
                    <div className="form-group">
                      <label className="mt-2" htmlFor="password">
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
                    <div className="form-group">
                      <label className="mt-2" htmlFor="confirm-password">
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
                    <p className="text-danger text-center mt-3">{error}</p>
                    <p className="text-success text-center mt-3">
                      {confirmation}
                    </p>

                    <div className="text-center mt-3">
                      <button type="submit" className="btn btn-dark w-100 p-2">
                        Sign up
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
