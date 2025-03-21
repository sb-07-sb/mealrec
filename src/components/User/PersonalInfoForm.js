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
            <div className="form-row">
                <div className="form-group">
                    <div className="label-container">
                        <label>Phone Number</label>
                        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                    </div>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+9 000 000 0000"
                        className={errors.phoneNumber ? "error-border" : ""}
                    />
                </div>
                <div className="form-group">
                    <div className="label-container">
                        <label>E-mail Address</label>
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="ozgunacik@hotmail.com"
                        className={errors.email ? "error-border" : ""}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <div className="label-container">
                        <label>City</label>
                        {errors.city && <span className="error">{errors.city}</span>}
                    </div>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Antalya"
                        className={errors.city ? "error-border" : ""}
                    />
                </div>
                <div className="form-group">
                    <div className="label-container">
                        <label>Country</label>
                        {errors.country && <span className="error">{errors.country}</span>}
                    </div>
                    <div className="select-container">
                        <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className={errors.country ? "error-border" : ""}
                        >
                            <option value="">Select Country</option>
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

export default PersonalInfoForm;