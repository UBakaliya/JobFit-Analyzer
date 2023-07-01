import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import NavbarCompo from "./components/NavbarCompo";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Register from "./components/Register";
import Account from "./components/Account";
import Logout from "./components/Logout";
import Result from "./components/Result";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <Router>
      <NavbarCompo isLogin={isAuthenticated}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/account" element={<Account />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
          {/* <Route path="/result" element={<Result />} /> */}
        </Routes>
      </NavbarCompo>
    </Router>
  );
};

export default App;
