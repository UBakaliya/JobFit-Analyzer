import { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";

const NavbarCompo = ({ isLogged, children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("logout");
      setTimeout(() => {
        setIsLoading(false);
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
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
        <>
          <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
            <Container>
              <Navbar.Brand href="/">JobFit Analyzer</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" />
                <Nav className="justify-content-end">
                  <Nav.Link href="/">Home</Nav.Link>
                  <Nav.Link href="/about">About</Nav.Link>

                  {isLogged ? (
                    <>
                      <Nav.Link href="/history">History</Nav.Link>
                      <NavDropdown title="Profile" id="basic-nav-dropdown">
                        <NavDropdown.Item href="/account">
                          Account
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={handleLogout}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  ) : (
                    <>
                      <Nav.Link href="/register">Sign Up</Nav.Link>
                      <Nav.Link href="/login">Login</Nav.Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          {children}
        </>
      )}
    </>
  );
};

export default NavbarCompo;
