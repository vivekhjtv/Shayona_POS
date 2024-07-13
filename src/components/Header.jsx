import React from 'react';
import StoreBulkOrder from './StoreBulkOrder';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="headerStyle">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            <img src="Shayona_icon.png" height="70" alt="Logo" />
          </a>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"></ul>

          <div className="">
            <Link type="button" to="/" className="btn me-2">
              POS
            </Link>
            <Link type="button" to="/stock" className="btn  me-2">
              Stock
            </Link>
            <StoreBulkOrder />
            <Link type="button" to="/mandir" className="btn me-2">
              Mandir Order
            </Link>
            <Link type="button" to="/orderForm" className="btn  me-2">
              Order Form
            </Link>

            {/* <button type="button" className="btn btn-outline-light me-2">
              Login
            </button>
            <button type="button" className="btn btn-warning me-2">
              Sign-up
            </button>
            <button type="button" className="btn btn-outline-light">
              Logout
            </button> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
