import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginUser, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        await loginUser(formData);
        // If login successful, redirect will happen via useEffect
      } catch (err) {
        console.error('Login error:', err);
        // Error is handled by AuthContext and displayed via the error state
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="login-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Log in to continue your journey to the stars</p>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={formErrors.email ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <span className="error-text">{formErrors.email}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={formErrors.password ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <span className="error-text">{formErrors.password}</span>
                )}
              </div>
              
              <div className="form-footer">
                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Log In'}
                </button>
                
                <p className="auth-alternative">
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">Register</Link>
                </p>
              </div>
            </form>
          </div>
          
          <div className="auth-visual">
            <div className="visual-content">
              <div className="space-travel-visual">
                <div className="planet earth"></div>
                <div className="spaceship">
                  <div className="ship-body"></div>
                  <div className="ship-cockpit"></div>
                  <div className="ship-wing left"></div>
                  <div className="ship-wing right"></div>
                  <div className="ship-thruster left"></div>
                  <div className="ship-thruster middle"></div>
                  <div className="ship-thruster right"></div>
                  <div className="ship-flame left"></div>
                  <div className="ship-flame middle"></div>
                  <div className="ship-flame right"></div>
                </div>
                <div className="stars">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`star star-${i + 1}`}></div>
                  ))}
                </div>
              </div>
              <div className="visual-text">
                <h2>Explore the Solar System</h2>
                <p>Log in to continue planning your interstellar journey.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .login-page {
          min-height: 100vh;
          padding: 6rem 0 4rem;
          display: flex;
          align-items: center;
        }
        
        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .auth-card {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        
        .auth-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .auth-subtitle {
          color: var(--text-muted);
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-light);
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        input:focus {
          outline: none;
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
        }
        
        input.error {
          border-color: var(--danger);
        }
        
        .error-text {
          display: block;
          color: var(--danger);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        
        .form-footer {
          margin-top: 2rem;
        }
        
        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }
        
        .auth-alternative {
          text-align: center;
          color: var(--text-muted);
        }
        
        .auth-link {
          color: var(--secondary);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        .auth-link:hover {
          color: var(--secondary-light);
        }
        
        .auth-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          overflow: hidden;
          position: relative;
        }
        
        .visual-content {
          padding: 2rem;
          text-align: center;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .space-travel-visual {
          position: relative;
          height: 300px;
          margin-bottom: 2rem;
        }
        
        .planet {
          position: absolute;
          border-radius: 50%;
        }
        
        .earth {
          width: 120px;
          height: 120px;
          background: radial-gradient(circle at 30% 30%, #5d9dff, #3066BE);
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 20px rgba(48, 102, 190, 0.5);
        }
        
        .earth::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: 
            radial-gradient(circle at 80% 40%, rgba(255, 255, 255, 0.2) 10%, transparent 12%),
            radial-gradient(circle at 30% 60%, rgba(255, 255, 255, 0.2) 15%, transparent 17%),
            radial-gradient(circle at 60% 75%, rgba(255, 255, 255, 0.2) 8%, transparent 10%);
        }
        
        .spaceship {
          position: absolute;
          width: 80px;
          height: 40px;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-15deg);
          animation: spaceship-orbit 20s linear infinite;
        }
        
        .ship-body {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
          width: 50px;
          height: 20px;
          background: linear-gradient(90deg, #64748b, #94a3b8, #64748b);
          border-radius: 10px 10px 0 0;
        }
        
        .ship-cockpit {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 10px;
          background-color: rgba(14, 165, 233, 0.7);
          border: 1px solid #0ea5e9;
          border-radius: 50% 50% 0 0;
        }
        
        .ship-wing {
          position: absolute;
          top: 45%;
          width: 16px;
          height: 8px;
          background-color: #475569;
          border-radius: 2px;
        }
        
        .ship-wing.left {
          left: 15%;
          transform: skewY(-15deg);
        }
        
        .ship-wing.right {
          right: 15%;
          transform: skewY(15deg);
        }
        
        .ship-thruster {
          position: absolute;
          bottom: 10%;
          width: 8px;
          height: 10px;
          background-color: #475569;
          border-radius: 0 0 50% 50%;
        }
        
        .ship-thruster.left {
          left: 30%;
        }
        
        .ship-thruster.middle {
          left: 50%;
          transform: translateX(-50%);
        }
        
        .ship-thruster.right {
          right: 30%;
        }
        
        .ship-flame {
          position: absolute;
          bottom: -10px;
          width: 4px;
          height: 12px;
          background: linear-gradient(to bottom, #f97316, #f59e0b, #fbbf24);
          border-radius: 0 0 50% 50%;
          animation: thruster-pulse 0.3s ease-in-out infinite;
        }
        
        .ship-flame.left {
          left: 32%;
        }
        
        .ship-flame.middle {
          left: 50%;
          transform: translateX(-50%);
        }
        
        .ship-flame.right {
          right: 32%;
        }
        
        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: #fff;
          border-radius: 50%;
        }
        
        /* Position stars randomly */
        ${[...Array(20)].map((_, i) => `
          .star-${i + 1} {
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: twinkle ${1 + Math.random() * 2}s ease-in-out infinite ${Math.random() * 3}s;
            width: ${1 + Math.random() * 2}px;
            height: ${1 + Math.random() * 2}px;
          }
        `).join('')}
        
        .visual-text {
          color: var(--text-light);
        }
        
        .visual-text h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }
        
        .visual-text p {
          color: var(--text-muted);
        }
        
        @keyframes spaceship-orbit {
          0% {
            transform: translate(-50%, -50%) rotate(-15deg) translateY(0);
          }
          25% {
            transform: translate(-30%, -70%) rotate(15deg) translateY(20px);
          }
          50% {
            transform: translate(-50%, -120%) rotate(30deg) translateY(0);
          }
          75% {
            transform: translate(-70%, -70%) rotate(0deg) translateY(-20px);
          }
          100% {
            transform: translate(-50%, -50%) rotate(-15deg) translateY(0);
          }
        }
        
        @keyframes thruster-pulse {
          0%, 100% {
            height: 12px;
            opacity: 0.8;
          }
          50% {
            height: 15px;
            opacity: 1;
          }
        }
        
        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
          }
          
          .auth-visual {
            display: none;
          }
        }
        
        @media (max-width: 768px) {
          .auth-card {
            padding: 2rem;
          }
          
          .auth-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;