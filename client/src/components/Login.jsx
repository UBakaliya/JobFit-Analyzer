import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "login",
        { email, password },
        { withCredentials: true }
      );
      setSuccess(response.data.message);
      setError("");
      window.location.href = "/";
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h2 className="text-center">Login</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Username or Email</label>
                    <input
                      id="email"
                      type="text"
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
                      autoComplete="on"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <p className="text-danger text-center mt-3">{error}</p>
                  <p className="text-success text-center mt-3">{success}</p>

                  <div className="text-center mt-3">
                    <button type="submit" className="btn btn-dark w-100 p-2">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
