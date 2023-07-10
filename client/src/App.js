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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const res = await axios.get("http://localhost:9999/api/v1/logged", {
          withCredentials: true,
        });
        setIsLoggedIn(res.data.auth);
      } catch (error) {
        console.log(error);
        setIsLoggedIn(false);
      }
    };

    checkIsLoggedIn();
  }, []);

  return (
    <Router>
      <NavbarCompo isLogged={isLoggedIn}>
        <Routes>
          <Route exact path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes (account) */}
          <Route element={<ProtectedRoutes checkIsLoggedIn={isLoggedIn} />}>
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </NavbarCompo>
    </Router>
  );
};

export default App;
