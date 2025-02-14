import React, { useState, useEffect } from 'react';
import { fetchUsers, updateUserRole, deleteUser } from '../api/apiRequests';  // Importing the API functions
import  { ManageUsersStep } from './manageUsers';  // Import the ManageUsersStep component
// import "../assets/styles/ManageUsersStep.css"

// Steps configuration: Each step has a title, description, and a content component.
const stepsAdmin = [
  {
    title: "Sign In",
    description: "Provide your email and password for the account.",
    content: ({ formData, handleInputChange, errors, setCurrentStep }) => (
      <div className="step-0">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          </div>
        </form>
        <div className="link-container">
          <a
            href="#"
            onClick={() => setCurrentStep(0)} // Navigate to the Sign-Up step
          >
            Don’t have an account? Sign up
          </a>
        </div>
      </div>
    ),
  },

  // New Manage Users Step
  {
    title: "Manage Users",
    description: "View and manage users, their roles, and delete users.",
    content: ({ setCurrentStep }) => <ManageUsersStep setCurrentStep={setCurrentStep} />,
  },
];

export default stepsAdmin;
