import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on location change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <span className="logo-text">Dubai</span>
            <span className="logo-separator">to</span>
            <span className="logo-text accent">Stars</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="main-nav desktop-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/destinations" className={location.pathname.includes('/destinations') ? 'active' : ''}>
                Destinations
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/accommodations" className={location.pathname.includes('/accommodations') ? 'active' : ''}>
                Accommodations
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/packages" className={location.pathname.includes('/packages') ? 'active' : ''}>
                Packages
              </Link>
            </li>
          </ul>
        </nav>

        {/* Auth Buttons */}
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <div className="user-profile-menu">
                <button className="user-profile-button">
                  <span className="user-avatar">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                  <span className="user-name">{user?.name}</span>
                </button>
                <div className="profile-dropdown">
                  <Link to="/dashboard" className="dropdown-item">Dashboard</Link>
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              </div>
              <Link to="/booking" className="btn btn-primary book-btn">
                Book Now
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary register-btn">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav-container">
            <ul className="mobile-nav-list">
              <li className="mobile-nav-item">
                <Link to="/destinations">Destinations</Link>
              </li>
              <li className="mobile-nav-item">
                <Link to="/accommodations">Accommodations</Link>
              </li>
              <li className="mobile-nav-item">
                <Link to="/packages">Packages</Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li className="mobile-nav-item">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="mobile-nav-item">
                    <Link to="/booking">Book Now</Link>
                  </li>
                  <li className="mobile-nav-item">
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="mobile-nav-item">
                    <Link to="/login">Login</Link>
                  </li>
                  <li className="mobile-nav-item">
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>

      <style jsx="true">{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: var(--header-height);
          z-index: 100;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .header.scrolled {
          background-color: rgba(12, 15, 28, 0.95);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(10px);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .logo-container {
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .logo-text {
          color: var(--text-light);
        }

        .logo-text.accent {
          color: var(--secondary);
        }

        .logo-separator {
          margin: 0 6px;
          color: var(--text-muted);
          font-weight: 400;
        }

        .main-nav {
          display: flex;
        }

        .nav-list {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-item {
          margin: 0 1rem;
        }

        .nav-item a {
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 0;
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-item a:hover,
        .nav-item a.active {
          color: var(--secondary);
        }

        .nav-item a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--secondary);
          transition: width 0.3s ease;
        }

        .nav-item a:hover::after,
        .nav-item a.active::after {
          width: 100%;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
        }

        .login-link {
          margin-right: 1rem;
          color: var(--text-light);
          font-weight: 500;
        }

        .user-profile-menu {
          position: relative;
          margin-right: 1rem;
        }

        .user-profile-button {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 0.5rem;
        }

        .user-avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: var(--secondary);
          color: var(--primary-dark);
          font-weight: 600;
          margin-right: 0.5rem;
        }

        .user-name {
          font-weight: 500;
        }

        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: var(--panel-bg);
          border-radius: 0.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          min-width: 150px;
          z-index: 10;
          opacity: 0;
          transform: translateY(10px);
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .user-profile-menu:hover .profile-dropdown {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .dropdown-item {
          display: block;
          padding: 0.75rem 1rem;
          color: var(--text-light);
          text-decoration: none;
          font-weight: 500;
          text-align: left;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--secondary);
        }

        .mobile-menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 110;
        }

        .toggle-bar {
          width: 100%;
          height: 3px;
          background-color: var(--text-light);
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .mobile-menu-toggle.active .toggle-bar:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }

        .mobile-menu-toggle.active .toggle-bar:nth-child(2) {
          opacity: 0;
        }

        .mobile-menu-toggle.active .toggle-bar:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }

        .mobile-nav {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: var(--panel-bg);
          z-index: 100;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .mobile-nav.open {
          transform: translateX(0);
        }

        .mobile-nav-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding: 2rem;
        }

        .mobile-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          width: 100%;
        }

        .mobile-nav-item {
          margin: 1.5rem 0;
          text-align: center;
        }

        .mobile-nav-item a,
        .mobile-nav-item button {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-light);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          display: inline-block;
          position: relative;
        }

        .mobile-nav-item a::after,
        .mobile-nav-item button::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: var(--secondary);
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }

        .mobile-nav-item a:hover,
        .mobile-nav-item button:hover {
          color: var(--secondary);
        }

        .mobile-nav-item a:hover::after,
        .mobile-nav-item button:hover::after {
          width: 80%;
        }

        .logout-button {
          color: var(--danger);
        }

        @media (max-width: 768px) {
          .desktop-nav,
          .auth-buttons {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .mobile-nav {
            display: block;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;