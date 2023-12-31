import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarCompo from "./components/NavbarCompo";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import axios from "axios";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import History from "./components/History";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // base url to make request to the server
  axios.defaults.baseURL =
    "https://jobfit-analyzer-server.onrender.com/api/v1/";

  // alow sending cookies
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const res = await axios.get("loggedin");
        setIsLoggedIn(res.data.auth);
      } catch (error) {
        console.log(error);
      }
    };
    checkIsLoggedIn();
  }, []);

  return (
    <Router>
      <NavbarCompo isLogged={isLoggedIn}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes (account) */}
          <Route element={<ProtectedRoutes checkIsLoggedIn={isLoggedIn} />}>
            <Route path="/account" element={<Account />} />
            <Route path="/history" element={<History />} />
          </Route>
        </Routes>
      </NavbarCompo>
    </Router>
  );
};

export default App;
