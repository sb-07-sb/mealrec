import React from 'react';

const PersonalInfoForm = ({ formData, handleInputChange, prevStep, nextStep, currentStep, errors }) => {
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
                    <div className="label-container">
                        <label>First Name</label>
                        {errors.firstName && <span className="error">{errors.firstName}</span>}
                    </div>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Özgün"
                        className={errors.firstName ? "error-border" : ""}
                    />
                </div>
                <div className="form-group">
                    <div className="label-container">
                        <label>Last Name</label>
                        {errors.lastName && <span className="error">{errors.lastName}</span>}
                    </div>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Açık"
                        className={errors.lastName ? "error-border" : ""}
                    />
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

export default PersonalInfoForm;