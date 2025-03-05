// src/components/Navbar.js
import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import Categories from "./Categories";
import SearchBar from "./SearchBar";

const AppNavbar = ({ user, signInWithGoogle, logout, setSearchTerm }) => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand className="text-primary fw-bold">🔥 Zapdeals 🔥</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Categories /> {/* Dropdown Menu for Categories */}
          </Nav>
          <SearchBar setSearchTerm={setSearchTerm} /> {/* Search Bar */}
          {!user ? (
            <Button variant="primary" onClick={signInWithGoogle} className="ms-3">
              Login with Google
            </Button>
          ) : (
            <div className="d-flex align-items-center ms-3">
              <img src={user.photoURL} alt="User" className="rounded-circle me-2" width="40" />
              <Button variant="danger" onClick={logout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;

