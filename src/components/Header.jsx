import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { usePOSContext } from '../contexts/PosContext';

function Header() {
  const { isAuthenticated, logout } = usePOSContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="xl" className="headerStyle navbar-dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/login" className="d-flex align-items-center py-0 logo">
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
            <Nav.Link 
              as={NavLink} 
              to="/" 
              end 
              onClick={() => {
                if (isAuthenticated) {
                  logout();
                }
              }}
              className="nav-link"
            >
              POS
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={NavLink} to="/orders" className="nav-link">
                  Kitchen Board
                </Nav.Link>
                <Nav.Link as={NavLink} to="/orderList" className="nav-link">
                  Order History
                </Nav.Link>
                <Nav.Link as={NavLink} to="/orderForm" className="nav-link">
                  Book Order
                </Nav.Link>
                <Nav.Link as={NavLink} to="/orderCard" className="nav-link">
                  Booked Orders
                </Nav.Link>
                <Nav.Link as={NavLink} to="/stock" className="nav-link">
                  Inventory
                </Nav.Link>
                <Nav.Link as={NavLink} to="/mandir" className="nav-link">
                  Mandir Order
                </Nav.Link>
                <Nav.Link as={NavLink} to="/store" className="nav-link">
                  Store Order
                </Nav.Link>
                <Nav.Link as={NavLink} to="/manage-items" className="nav-link">
                  Manage Menu
                </Nav.Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light ms-xl-3 mt-2 mt-xl-0 px-3 py-2"
                  style={{ borderRadius: '8px', fontWeight: '600', fontSize: '14px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              ""
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
