import React from 'react';
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
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
