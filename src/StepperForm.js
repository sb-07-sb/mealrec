import React, { useState } from 'react';
import './assets/styles/StepperForm.css';
import PersonalInfoForm from './components/User/PersonalInfoForm';
import EducationForm from './components/User/EducationForm';
import StepIndicator from './components/User/StepIndicator';

const StepperForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: 'Turkey',
        email: '',
        city: '',
        educationTags: [],
        skillTags: []      // For skill tags

    });

    const [educationTagInput, setEducationTagInput] = useState('');
    const [skillTagInput, setSkillTagInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const TOTAL_STEPS = 4; // Adjust this based on your total steps

    const nextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        } else {
            // Handle form submission or completion
            handleFormSubmit();
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleTagKeyPress = (e, fieldName, tagInput, setTagInput) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            const newTag = tagInput.trim();

            // Check if the tag already exists (case-insensitive)
            const isDuplicate = formData[fieldName].some(
                (tag) => tag.toLowerCase() === newTag.toLowerCase()
            );

            if (!isDuplicate) {
                setFormData((prev) => ({
                    ...prev,
                    [fieldName]: [...prev[fieldName], newTag],
                }));
                setTagInput(''); // Clear input after adding tag
            } else {
                setTagInput('');
            }

            e.preventDefault();
        }
    };

    const removeTag = (index) => {
        setFormData((prev) => ({
            ...prev,
            educationTags: prev.educationTags.filter((_, i) => i !== index)
        }));
    };

    const renderStepIndicator = () => {
        return <StepIndicator currentStep={currentStep} />;
    };

    const handleFormSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Form submitted successfully!');
        // You can also reset the form or redirect the user
    };

    const renderForm = () => {
        switch (currentStep) {
            case 1:
                return (

                    <PersonalInfoForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        currentStep={currentStep}
                    />
                );
            case 2:
                return (
                    <div className="form-container">
                        <h2>Meal Preferences</h2>
                        <p>Meal Preferences form will be here</p>
                        <div className="form-actions">
                            <button onClick={prevStep} className="btn-back">Back</button>
                            <button onClick={nextStep} className="btn-next">Next Step</button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="form-container">
                        <h2>Meal Type Selection</h2>
                        <p>Meal Type Selection form will be here</p>
                        <div className="form-actions">
                            <button onClick={prevStep} className="btn-back">Back</button>
                            <button onClick={nextStep} className="btn-next">Next Step</button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <EducationForm
                        educationTags={formData.educationTags}
                        skillTags={formData.skillTags}
                        educationTagInput={educationTagInput}
                        setEducationTagInput={setEducationTagInput}
                        skillTagInput={skillTagInput}
                        setSkillTagInput={setSkillTagInput}
                        handleTagKeyPress={handleTagKeyPress}
                        removeTag={removeTag}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        handleFormSubmit={handleFormSubmit} // Pass handleFormSubmit

                    />
                );
            default:
                return (
                    <PersonalInfoForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        currentStep={currentStep}
                    />
                );
        }
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