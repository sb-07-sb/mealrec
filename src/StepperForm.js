import React, { useState } from 'react';
import './assets/styles/StepperForm.css';

const StepperForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: 'Turkey',
    email: '',
    city: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStepIndicator = () => {
    return (
      <div className="steps-container">
        <div className={`step-item ${currentStep === 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <div className="step-text">
            <h2>Personal Information</h2>
          </div>
        </div>

        <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <div className="step-text">
            <h2>Education</h2>
          </div>
        </div>

        <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
          <div className="step-circle">3</div>
          <div className="step-text">
            <h2>Work Experience</h2>
          </div>
        </div>

        <div className={`step-item ${currentStep === 4 ? 'active' : ''}`}>
          <div className="step-circle">4</div>
          <div className="step-text">
            <h2>User Photo</h2>
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoForm();
      case 2:
        return (
          <div className="form-container">
            <h2>Education</h2>
            <p>Education form will be here</p>
            <div className="form-actions">
              <button onClick={prevStep} className="btn-back">Back</button>
              <button onClick={nextStep} className="btn-next">Next Step</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-container">
            <h2>Work Experience</h2>
            <p>Work experience form will be here</p>
            <div className="form-actions">
              <button onClick={prevStep} className="btn-back">Back</button>
              <button onClick={nextStep} className="btn-next">Next Step</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-container">
            <h2>User Photo</h2>
            <p>User photo upload will be here</p>
            <div className="form-actions">
              <button onClick={prevStep} className="btn-back">Back</button>
              <button onClick={nextStep} className="btn-next">Complete</button>
            </div>
          </div>
        );
      default:
        return renderPersonalInfoForm();
    }
  };

  const renderPersonalInfoForm = () => {
    return (
      <div className="form-container">
        <div className="form-header">
          <div className="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" className="user-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2>Your Personal Information</h2>
        </div>

        <p className="form-description">Enter your personal information to get closer to companies.</p>

        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Özgün"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Açık"
            />
          </div>
        </div>
        <div className="form-row">

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+9 000 000 0000"
            />
          </div>

          <div className="form-group">
            <label>E-mail Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ozgunacik@hotmail.com"
            />
          </div>

        </div>


        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Antalya"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <div className="select-container">
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option>Turkey</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>France</option>
              </select>
              <div className="select-arrow">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>


        <div className="form-actions">
          {currentStep > 1 && (
            <button onClick={prevStep} className="btn-back">Back</button>
          )}
          {currentStep === 1 && (
            <button onClick={prevStep} className="btn-back" disabled style={{ visibility: 'hidden' }}>Back</button>
          )}
          <button onClick={nextStep} className="btn-next">Next Step</button>
        </div>
      </div>
    );
  };

  return (
    <div className="stepper-container">
      <div className="stepper-content">
        <div className="stepper-sidebar">
          <div className="sidebar-header">
            <h1>Step {currentStep}</h1>
            <p>Enter your personal information to get closer to companies.</p>
          </div>
          {renderStepIndicator()}
        </div>
        <div className="stepper-form">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default StepperForm;