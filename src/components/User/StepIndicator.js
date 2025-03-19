// StepIndicator.js
import React from 'react';


const StepIndicator = ({ currentStep }) => {
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
                    <h2>Meal Preferences</h2>
                </div>
            </div>
            <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <div className="step-text">
                    <h2>Meal Type Selection</h2>
                </div>
            </div>
            <div className={`step-item ${currentStep === 4 ? 'active' : ''}`}>
                <div className="step-circle">4</div>
                <div className="step-text">
                    <h2>Dietary Preferences & Restrictions</h2>
                </div>
            </div>
        </div>
    );
};

export default StepIndicator;