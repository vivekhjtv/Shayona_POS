import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Header() {
  return (
    <Navbar expand="xl" className="headerStyle navbar-dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center py-0 logo">
          <img
            src="Shayona_icon.png"
            height="55"
            alt="Shayona Logo"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center mt-2 mt-xl-0">
            <Nav.Link as={NavLink} to="/" end className="nav-link">
              POS
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
