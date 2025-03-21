import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {}
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { registerUser, isAuthenticated, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
        
        // Prepare data for API (without confirmPassword)
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          preferences: {
            has_space_experience: false,
            preferred_destinations: [],
            preferred_accommodation_types: [],
            budget_range: { min: 10000, max: 50000 }
          }
        };
        
        await registerUser(userData);
        // Redirect will happen via useEffect if registration is successful
      } catch (err) {
        console.error('Registration error:', err);
        // Error is handled by AuthContext and displayed via the error state
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="register-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-visual">
            <div className="visual-content">
              <div className="space-travel-visual">
                <div className="mars-planet"></div>
                <div className="space-station">
                  <div className="station-core"></div>
                  <div className="station-ring rotate-slow"></div>
                  <div className="station-module top"></div>
                  <div className="station-module bottom"></div>
                  <div className="station-module left"></div>
                  <div className="station-module right"></div>
                  <div className="station-solar-panel left"></div>
                  <div className="station-solar-panel right"></div>
                </div>
                <div className="stars">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`star star-${i + 1}`}></div>
                  ))}
                </div>
              </div>
              <div className="visual-text">
                <h2>Join the Space Tourism Revolution</h2>
                <p>Register now to begin your journey beyond Earth.</p>
              </div>
            </div>
          </div>
          
          <div className="auth-card">
            <div className="auth-header">
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join Dubai to Stars and explore the universe</p>
            </div>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={formErrors.name ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {formErrors.name && (
                  <span className="error-text">{formErrors.name}</span>
                )}
              </div>
              
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
                  placeholder="Create a password"
                  className={formErrors.password ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {formErrors.password && (
                  <span className="error-text">{formErrors.password}</span>
                )}
                <span className="password-hint">
                  Password must be at least 8 characters
                </span>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={formErrors.confirmPassword ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {formErrors.confirmPassword && (
                  <span className="error-text">{formErrors.confirmPassword}</span>
                )}
              </div>
              
              <div className="form-group terms-group">
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    disabled={isSubmitting}
                  />
                  <label htmlFor="terms" className="checkbox-label">
                    I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                  </label>
                </div>
              </div>
              
              <div className="form-footer">
                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <p className="auth-alternative">
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">Login</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .register-page {
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
        
        .password-hint {
          display: block;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        
        .terms-group {
          margin-top: 2rem;
        }
        
        .checkbox-container {
          display: flex;
          align-items: flex-start;
        }
        
        .checkbox-container input[type="checkbox"] {
          width: auto;
          margin-right: 0.75rem;
          margin-top: 0.25rem;
        }
        
        .checkbox-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        
        .terms-link {
          color: var(--secondary);
          text-decoration: underline;
          transition: color 0.3s ease;
        }
        
        .terms-link:hover {
          color: var(--secondary-light);
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
          background: linear-gradient(135deg, #6f1d1b, #99582a);
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
        
        .mars-planet {
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle at 30% 30%, #e45f35, #c1440e);
          border-radius: 50%;
          bottom: 20px;
          left: 65%;
          transform: translateX(-50%);
          box-shadow: 0 0 20px rgba(228, 95, 53, 0.5);
        }
        
        .mars-planet::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: 
            radial-gradient(circle at 70% 20%, rgba(233, 150, 122, 0.3) 5%, transparent 10%),
            radial-gradient(circle at 20% 40%, rgba(233, 150, 122, 0.3) 10%, transparent 15%),
            radial-gradient(circle at 50% 80%, rgba(233, 150, 122, 0.3) 8%, transparent 12%);
        }
        
        .space-station {
          position: absolute;
          width: 150px;
          height: 150px;
          top: 30%;
          left: 25%;
        }
        
        .station-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background-color: #64748b;
          border-radius: 50%;
          box-shadow: inset 5px 5px 15px rgba(0, 0, 0, 0.5);
        }
        
        .station-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(75deg);
          width: 100px;
          height: 100px;
          border: 5px solid #64748b;
          border-radius: 50%;
          box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
        }
        
        .station-module {
          position: absolute;
          width: 20px;
          height: 10px;
          background-color: #94a3b8;
          border-radius: 3px;
        }
        
        .station-module.top {
          top: 30%;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .station-module.bottom {
          bottom: 30%;
          left: 50%;
          transform: translateX(-50%);
        }
        
        .station-module.left {
          top: 50%;
          left: 25%;
          transform: translateY(-50%);
        }
        
        .station-module.right {
          top: 50%;
          right: 25%;
          transform: translateY(-50%);
        }
        
        .station-solar-panel {
          position: absolute;
          width: 30px;
          height: 10px;
          background: linear-gradient(90deg, #0ea5e9, #0284c7);
          border: 1px solid #0284c7;
        }
        
        .station-solar-panel.left {
          top: 50%;
          left: 5%;
          transform: translateY(-50%);
        }
        
        .station-solar-panel.right {
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
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
          color: #f5d0fe;
        }
        
        .visual-text p {
          color: rgba(255, 255, 255, 0.8);
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

export default RegisterPage;