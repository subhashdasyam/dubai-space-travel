import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const UserProfile = () => {
  const { user, updatePreferences, error, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState(user?.preferences || {
    has_space_experience: false,
    preferred_destinations: [],
    preferred_accommodation_types: [],
    budget_range: { min: 10000, max: 50000 }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    clearError();
    setSuccessMessage('');
  };

  // Handle preferences changes
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setPreferences(prev => {
      if (name.includes('.')) {
        // Handle nested properties like budget_range.min
        const [parent, child] = name.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: type === 'number' ? parseInt(value, 10) || 0 : value
          }
        };
      } else if (type === 'checkbox') {
        return {
          ...prev,
          [name]: checked
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });
  };

  // Handle checkbox list selections
  const handleMultiCheck = (category, value, checked) => {
    setPreferences(prev => {
      const currentValues = [...(prev[category] || [])];
      
      if (checked && !currentValues.includes(value)) {
        return {
          ...prev,
          [category]: [...currentValues, value]
        };
      } else if (!checked && currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter(v => v !== value)
        };
      }
      
      return prev;
    });
  };

  // Check if a value is in a multi-select array
  const isChecked = (category, value) => {
    return preferences[category] && preferences[category].includes(value);
  };

  // Save profile changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await updatePreferences(preferences);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      // Error will be displayed through auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing without saving
  const handleCancel = () => {
    setPreferences(user?.preferences || {
      has_space_experience: false,
      preferred_destinations: [],
      preferred_accommodation_types: [],
      budget_range: { min: 10000, max: 50000 }
    });
    setIsEditing(false);
    clearError();
    setSuccessMessage('');
  };

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="profile-title">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
        
        {!isEditing && (
          <button 
            className="btn btn-outline edit-btn"
            onClick={toggleEditMode}
          >
            Edit Profile
          </button>
        )}
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="profile-content">
        <div className="profile-section">
          <h3 className="section-title">Travel Preferences</h3>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="preferences-form">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="has_space_experience"
                    checked={preferences.has_space_experience}
                    onChange={handlePreferenceChange}
                  />
                  <span>I have previous space travel experience</span>
                </label>
              </div>
              
              <div className="form-group">
                <label className="form-label">Preferred Destinations</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_destinations', 'Lunar Resort')}
                      onChange={(e) => handleMultiCheck('preferred_destinations', 'Lunar Resort', e.target.checked)}
                    />
                    <span>Lunar Resort</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_destinations', 'Mars Colony')}
                      onChange={(e) => handleMultiCheck('preferred_destinations', 'Mars Colony', e.target.checked)}
                    />
                    <span>Mars Colony</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_destinations', 'Orbital Luxury Station')}
                      onChange={(e) => handleMultiCheck('preferred_destinations', 'Orbital Luxury Station', e.target.checked)}
                    />
                    <span>Orbital Luxury Station</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_destinations', 'Venus Cloud City')}
                      onChange={(e) => handleMultiCheck('preferred_destinations', 'Venus Cloud City', e.target.checked)}
                    />
                    <span>Venus Cloud City</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Preferred Accommodation Types</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_accommodation_types', 'Luxury Suite')}
                      onChange={(e) => handleMultiCheck('preferred_accommodation_types', 'Luxury Suite', e.target.checked)}
                    />
                    <span>Luxury Suite</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_accommodation_types', 'Standard Room')}
                      onChange={(e) => handleMultiCheck('preferred_accommodation_types', 'Standard Room', e.target.checked)}
                    />
                    <span>Standard Room</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_accommodation_types', 'Private Pod')}
                      onChange={(e) => handleMultiCheck('preferred_accommodation_types', 'Private Pod', e.target.checked)}
                    />
                    <span>Private Pod</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isChecked('preferred_accommodation_types', 'Shared Quarters')}
                      onChange={(e) => handleMultiCheck('preferred_accommodation_types', 'Shared Quarters', e.target.checked)}
                    />
                    <span>Shared Quarters</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Budget Range (AED)</label>
                <div className="budget-inputs">
                  <div className="budget-field">
                    <label className="budget-label">Minimum</label>
                    <input
                      type="number"
                      name="budget_range.min"
                      value={preferences.budget_range?.min || 0}
                      onChange={handlePreferenceChange}
                      min="0"
                      step="1000"
                    />
                  </div>
                  <div className="budget-field">
                    <label className="budget-label">Maximum</label>
                    <input
                      type="number"
                      name="budget_range.max"
                      value={preferences.budget_range?.max || 0}
                      onChange={handlePreferenceChange}
                      min="0"
                      step="1000"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-outline cancel-btn"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="preferences-display">
              <div className="preference-item">
                <span className="preference-label">Space Travel Experience:</span>
                <span className="preference-value">
                  {user.preferences?.has_space_experience ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="preference-item">
                <span className="preference-label">Preferred Destinations:</span>
                <span className="preference-value">
                  {user.preferences?.preferred_destinations?.length > 0
                    ? user.preferences.preferred_destinations.join(', ')
                    : 'None specified'
                  }
                </span>
              </div>
              
              <div className="preference-item">
                <span className="preference-label">Preferred Accommodation Types:</span>
                <span className="preference-value">
                  {user.preferences?.preferred_accommodation_types?.length > 0
                    ? user.preferences.preferred_accommodation_types.join(', ')
                    : 'None specified'
                  }
                </span>
              </div>
              
              <div className="preference-item">
                <span className="preference-label">Budget Range:</span>
                <span className="preference-value">
                  {user.preferences?.budget_range
                    ? `AED ${user.preferences.budget_range.min.toLocaleString()} - AED ${user.preferences.budget_range.max.toLocaleString()}`
                    : 'Not specified'
                  }
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-section">
          <h3 className="section-title">Account Information</h3>
          <div className="account-info">
            <div className="account-item">
              <span className="account-label">Email:</span>
              <span className="account-value">{user.email}</span>
            </div>
            <div className="account-item">
              <span className="account-label">Account Created:</span>
              <span className="account-value">
                {user.created_at 
                  ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) 
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx="true">{`
        .user-profile {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .profile-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          background-color: var(--secondary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          color: var(--primary-dark);
        }
        
        .profile-name {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }
        
        .profile-email {
          color: var(--text-muted);
        }
        
        .edit-btn {
          align-self: flex-start;
        }
        
        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--danger);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .success-message {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--success);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .profile-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .profile-section {
          background-color: var(--card-bg);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .section-title {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--secondary-light);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }
        
        .preference-item,
        .account-item {
          margin-bottom: 1rem;
          display: flex;
          flex-direction: column;
        }
        
        .preference-label,
        .account-label {
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .preference-value,
        .account-value {
          font-weight: 600;
        }
        
        .preferences-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 0.5rem;
        }
        
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-left: 1rem;
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
        
        .budget-field {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .budget-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        
        .budget-field input {
          padding: 0.75rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          color: var(--text-light);
        }
        
        .budget-field input:focus {
          outline: none;
          border-color: var(--secondary);
        }
        
        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .cancel-btn,
        .save-btn {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .edit-btn {
            width: 100%;
          }
          
          .budget-inputs {
            flex-direction: column;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .cancel-btn,
          .save-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;