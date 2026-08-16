import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "Features", path: "/features" },
    { label: "About Us", path: "/about" },
    { label: "How to Use", path: "/guide" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => navigate("/")}>
          <span className="navbar-brand-icon">🎓</span>
          <span className="navbar-brand-name">
            VK <span>LearnHub</span>
          </span>
        </div>

        <ul className="navbar-links">
          {links.map((link) => (
            <li key={link.path}>
              <button
                className={`navbar-link${isActive(link.path) ? " navbar-link--active" : ""}`}
                onClick={() => navigate(link.path)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button className="navbar-signin" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>

        <button
          className={`navbar-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((m) => !m)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen && (
        <div className="navbar-mobile">
          {links.map((link) => (
            <button
              key={link.path}
              className={`navbar-mobile-link${isActive(link.path) ? " navbar-link--active" : ""}`}
              onClick={() => {
                navigate(link.path);
                setMenuOpen(false);
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            className="navbar-mobile-signin"
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
          >
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
