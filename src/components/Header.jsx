import React from 'react';

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

          {/* <div className="text-end">
            <button type="button" className="btn btn-outline-light me-2">
              Login
            </button>
            <button type="button" className="btn btn-warning me-2">
              Sign-up
            </button>
            <button type="button" className="btn btn-outline-light">
              Logout
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
}

export default Header;
