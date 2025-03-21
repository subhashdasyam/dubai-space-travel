import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Dubai to Stars</h3>
            <p className="footer-description">
              Experience luxury space travel from Dubai, the gateway to the stars.
              Book your interstellar journey today!
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/accommodations">Accommodations</Link></li>
              <li><Link to="/packages">Packages</Link></li>
              <li><Link to="/booking">Book Now</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/safety">Safety Protocols</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Contact</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-label">Email:</span>
                <a href="mailto:info@dubaitostars.com">info@dubaitostars.com</a>
              </li>
              <li>
                <span className="contact-label">Phone:</span>
                <a href="tel:+97144000000">+971 4 400 0000</a>
              </li>
              <li>
                <span className="contact-label">Address:</span>
                <span>Burj Khalifa, Downtown Dubai, UAE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Dubai to Stars. All rights reserved.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <div className="social-icon facebook"></div>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <div className="social-icon twitter"></div>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <div className="social-icon instagram"></div>
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <div className="social-icon linkedin"></div>
            </a>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .footer {
          background-color: var(--primary);
          padding: 4rem 0 2rem;
          position: relative;
          z-index: 10;
          margin-top: 4rem;
        }

        .footer::before {
          content: '';
          position: absolute;
          top: -50px;
          left: 0;
          width: 100%;
          height: 50px;
          background: linear-gradient(to bottom, transparent, var(--primary));
          z-index: -1;
        }

        .footer-container {
          display: flex;
          flex-direction: column;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .footer-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--secondary);
        }

        .footer-subtitle {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
          font-family: var(--font-display);
        }

        .footer-description {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          max-width: 300px;
        }

        .footer-links, .footer-contact {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li, .footer-contact li {
          margin-bottom: 0.75rem;
        }

        .footer-links a, .footer-contact a {
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.3s ease;
          position: relative;
          display: inline-block;
        }

        .footer-links a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--secondary);
          transition: width 0.3s ease;
        }

        .footer-links a:hover, .footer-contact a:hover {
          color: var(--secondary-light);
        }

        .footer-links a:hover::after {
          width: 100%;
        }

        .contact-label {
          font-weight: 600;
          margin-right: 0.5rem;
          color: var(--text-light);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .copyright {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05);
          transition: background-color 0.3s ease;
        }

        .social-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .social-icon {
          width: 1.2rem;
          height: 1.2rem;
          position: relative;
        }

        /* CSS-only social icons */
        .social-icon.facebook::before,
        .social-icon.facebook::after {
          content: '';
          position: absolute;
        }

        .social-icon.facebook::before {
          width: 0.8rem;
          height: 0.8rem;
          border: 2px solid var(--secondary-light);
          border-radius: 2px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .social-icon.facebook::after {
          width: 0.4rem;
          height: 0.6rem;
          background-color: var(--secondary-light);
          top: 0.2rem;
          right: 0;
          border-radius: 1px;
        }

        .social-icon.twitter::before {
          content: '';
          position: absolute;
          width: 1rem;
          height: 0.8rem;
          border: 2px solid var(--secondary-light);
          border-radius: 50% 50% 0 0;
          border-bottom: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .social-icon.twitter::after {
          content: '';
          position: absolute;
          width: 0.4rem;
          height: 0.4rem;
          background-color: var(--secondary-light);
          border-radius: 50%;
          top: 0.4rem;
          left: 0.4rem;
        }

        .social-icon.instagram::before,
        .social-icon.instagram::after {
          content: '';
          position: absolute;
        }

        .social-icon.instagram::before {
          width: 0.9rem;
          height: 0.9rem;
          border: 2px solid var(--secondary-light);
          border-radius: 0.3rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .social-icon.instagram::after {
          width: 0.4rem;
          height: 0.4rem;
          border: 2px solid var(--secondary-light);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .social-icon.linkedin::before {
          content: '';
          position: absolute;
          width: 0.9rem;
          height: 0.9rem;
          border: 2px solid var(--secondary-light);
          border-radius: 0.2rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .social-icon.linkedin::after {
          content: 'in';
          position: absolute;
          color: var(--secondary-light);
          font-size: 0.6rem;
          font-weight: bold;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        @media (max-width: 768px) {
          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;