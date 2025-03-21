import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferences: {
      has_space_experience: false,
      preferred_destinations: [],
      preferred_accommodation_types: [],
      budget_range: { min: 10000, max: 50000 }
    }
  });
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { registerUser, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (preferences)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
  
  // Handle checkbox changes for preferences
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    
    // Parse the preference category and value
    const [category, _] = name.split('.');
    
    setFormData(prev => {
      const currentPreferences = [...prev.preferences[category]];
      
      if (checked) {
        // Add the value if it's not already there
        if (!currentPreferences.includes(value)) {
          return {
            ...prev,
            preferences: {
              ...prev.preferences,
              [category]: [...currentPreferences, value]
            }
          };
        }
      } else {
        // Remove the value
        return {
          ...prev,
          preferences: {
            ...prev.preferences,
            [category]: currentPreferences.filter(item => item !== value)
          }
        };
      }
      
      return prev;
    });
  };
  
  // Handle budget range changes
  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    const budgetType = name.split('.')[1]; // min or max
    
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        budget_range: {
          ...prev.preferences.budget_range,
          [budgetType]: parseInt(value, 10) || 0
        }
      }
    }));
  };
  
  // Validate form
  const validateFormStep = (step) => {
    const errors = {};
    
    if (step === 1) {
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
    }
    
    if (step === 2) {
      // Validate preferences if needed
      if (formData.preferences.budget_range.min >= formData.preferences.budget_range.max) {
        errors['preferences.budget_range'] = 'Minimum budget must be less than maximum budget';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = (e) => {
    e.preventDefault();
    
    if (validateFormStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const handlePrevStep = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFormStep(currentStep)) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare data for API (without confirmPassword)
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        preferences: formData.preferences
      };
      
      await registerUser(userData);
      navigate('/dashboard');
    } catch (err) {
      // Error is displayed through the auth context
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="register-form-container">
      <form className="register-form">
        <h2 className="form-title">Create Account</h2>
        <div className="form-steps">
          <div className={`step-indicator ${currentStep >= 1 ? 'active' : ''}`}>1</div>
          <div className="step-line"></div>
          <div className={`step-indicator ${currentStep >= 2 ? 'active' : ''}`}>2</div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {currentStep === 1 && (
          <div className="form-step">
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
              <span className="help-text">
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
            
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-primary next-btn"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="form-step">
            <div className="form-group">
              <label>Space Travel Experience</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.has_space_experience"
                    checked={formData.preferences.has_space_experience}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span>I have previous space travel experience</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Preferred Destinations</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_destinations"
                    value="Lunar Resort"
                    checked={formData.preferences.preferred_destinations.includes('Lunar Resort')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Lunar Resort</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_destinations"
                    value="Mars Colony"
                    checked={formData.preferences.preferred_destinations.includes('Mars Colony')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Mars Colony</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_destinations"
                    value="Orbital Luxury Station"
                    checked={formData.preferences.preferred_destinations.includes('Orbital Luxury Station')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Orbital Luxury Station</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_destinations"
                    value="Venus Cloud City"
                    checked={formData.preferences.preferred_destinations.includes('Venus Cloud City')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Venus Cloud City</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Preferred Accommodation Types</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_accommodation_types"
                    value="Luxury Suite"
                    checked={formData.preferences.preferred_accommodation_types.includes('Luxury Suite')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Luxury Suite</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_accommodation_types"
                    value="Standard Room"
                    checked={formData.preferences.preferred_accommodation_types.includes('Standard Room')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Standard Room</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_accommodation_types"
                    value="Private Pod"
                    checked={formData.preferences.preferred_accommodation_types.includes('Private Pod')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Private Pod</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="preferences.preferred_accommodation_types"
                    value="Shared Quarters"
                    checked={formData.preferences.preferred_accommodation_types.includes('Shared Quarters')}
                    onChange={handleCheckboxChange}
                    disabled={isSubmitting}
                  />
                  <span>Shared Quarters</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>Budget Range (AED)</label>
              {formErrors['preferences.budget_range'] && (
                <span className="error-text">{formErrors['preferences.budget_range']}</span>
              )}
              <div className="budget-inputs">
                <div className="budget-input">
                  <label className="small-label">Minimum</label>
                  <input
                    type="number"
                    name="preferences.budget_range.min"
                    value={formData.preferences.budget_range.min}
                    onChange={handleBudgetChange}
                    min="0"
                    step="1000"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="budget-input">
                  <label className="small-label">Maximum</label>
                  <input
                    type="number"
                    name="preferences.budget_range.max"
                    value={formData.preferences.budget_range.max}
                    onChange={handleBudgetChange}
                    min="0"
                    step="1000"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  required
                  disabled={isSubmitting}
                />
                <span>
                  I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </span>
              </label>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline back-btn"
                onClick={handlePrevStep}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </div>
        )}
        
        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="login-link">Sign In</Link>
          </p>
        </div>
      </form>
      
      <style jsx="true">{`
        .register-form-container {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .register-form {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .form-title {
          text-align: center;
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: var(--secondary-light);
        }
        
        .form-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }
        
        .step-indicator {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .step-indicator.active {
          background-color: var(--secondary);
          color: var(--primary-dark);
        }
        
        .step-line {
          height: 2px;
          width: 50px;
          background-color: rgba(255, 255, 255, 0.1);
          margin: 0 0.5rem;
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .form-step {
          animation: fadeIn 0.3s ease;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        
        .form-group input[type="text"],
        .form-group input[type="email"],
        .form-group input[type="password"],
        .form-group input[type="number"] {
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
        
        .help-text {
          display: block;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
        }
        
        .checkbox-label input[type="checkbox"] {
          margin-top: 0.25rem;
        }
        
        .budget-inputs {
          display: flex;
          gap: 1rem;
        }
        
        .budget-input {
          flex: 1;
        }
        
        .small-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
          display: block;
        }
        
        .terms-group {
          margin-top: 2rem;
        }
        
        .terms-link {
          color: var(--secondary);
          text-decoration: underline;
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .back-btn,
        .next-btn,
        .submit-btn {
          flex: 1;
        }
        
        .form-footer {
          margin-top: 1.5rem;
          text-align: center;
          color: var(--text-muted);
        }
        
        .login-link {
          color: var(--secondary);
          font-weight: 500;
          text-decoration: underline;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;