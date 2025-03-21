import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { loginUser, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
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
    
    // Clear auth error
    if (error) {
      clearError();
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
        navigate(from, { replace: true });
      } catch (err) {
        // Error is displayed through the auth context
        console.error('Login error:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="form-title">Sign In</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
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
        
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
        
        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">Create Account</Link>
          </p>
        </div>
      </form>
      
      <style jsx="true">{`
        .login-form-container {
          max-width: 400px;
          margin: 0 auto;
        }
        
        .login-form {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .form-title {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: var(--text-light);
          font-size: 1rem;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: var(--secondary);
          box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
        }
        
        .form-group input.error {
          border-color: var(--danger);
        }
        
        .error-text {
          display: block;
          color: var(--danger);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        
        .form-actions {
          margin-top: 2rem;
        }
        
        .submit-btn {
          width: 100%;
          padding: 0.75rem;
          font-size: 1.1rem;
        }
        
        .form-footer {
          margin-top: 1.5rem;
          text-align: center;
          color: var(--text-muted);
        }
        
        .register-link {
          color: var(--secondary);
          font-weight: 500;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;