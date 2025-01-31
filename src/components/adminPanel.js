import React, { useState } from 'react';
import { fetchUserData } from '../api/apiRequests'; // Assuming fetchUserData is imported from api.js

const AdminPanel = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [error, setError] = useState(null);

  // Assuming that this function is properly triggered elsewhere to fetch the user data.
  const handleFetchUserData = async (userId) => {
    try {
      const response = await fetchUserData(userId);
      if (response.success) {
        setSelectedUserData(response.userDetails); // Set the fetched user details to state
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Error fetching user data');
    }
  };

  const renderInputField = (field, value) => {
    return (
      <div className="form-group" key={field}>
        <label htmlFor={field}>
          {field.replace(/([A-Z])/g, ' $1').toUpperCase()}
        </label>
        <input
          type="text"
          id={field}
          name={field}
          value={value}
          placeholder={field.replace(/([A-Z])/g, ' $1').toUpperCase()}
          readOnly
        />
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="title">Admin Panel</div>
        <ul className="steps">
          <li className="step active">
            <span className="checkmark">&#10003;</span>
            <p>View User Information</p>
          </li>
        </ul>
      </div>

      {/* Form Section */}
      <div className="form-container">
        <div className="form-header">
          <h3>User Information</h3>
        </div>

        {error && <p className="error-message">{error}</p>}

        {/* Example Trigger: Button to Fetch User Data */}
        <button
          onClick={() => handleFetchUserData('679875ed1b8f6eb2d58cc4ea')} // Example user ID
          className="submit-btn"
        >
          Fetch User Data
        </button>

        {/* If user data is available, show the form */}
        {selectedUserData ? (
          <form className="form">
            {Object.entries(selectedUserData).map(([field, value]) => {
              // Skip _id and user_id, as these should not be editable
              if (field === '_id' || field === 'user_id') return null;
              return renderInputField(field, value);
            })}
          </form>
        ) : (
          <p>No user data available. Click on the "Fetch User Data" button.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
