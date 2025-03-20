import React, { useState } from 'react';
import './assets/styles/StepperForm.css';
import PersonalInfoForm from './components/User/PersonalInfoForm';
import RestrictionsForm from './components/User/RestrictionsForm';
import MealPreferencesForm from './components/User/MealPreferencesForm';
import MealTypeSelectionForm from './components/User/MealTypeSelectionForm';
import StepIndicator from './components/User/StepIndicator';
import { validateStep } from './utils/validation';

const StepperForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: 'Turkey',
        email: '',
        city: '',
        allergenTags: [], // For allergen tags
        dislikeTags: [],  // For dislike tags
        user_pref: [],    // For preferred dishes
        user_likes: [     // Initialize with predefined cuisines
            'Mediterranean',
            'European',
            'Arabic',
            'Asian',
            'Comfort Food',
            'Italian',
            'Mexican',
            'Indian'
        ],
        size: 'large', // Default size
        protein_option: 'chicken', // Default protein option
        protein_category: 'balance', // Default protein category
        meal_types: ['lunch'] // Default meal types (pre-selected)
    });

    const [errors, setErrors] = useState({}); // State to track validation errors

    const [userPrefInput, setUserPrefInput] = useState('');
    const [userLikesInput, setUserLikesInput] = useState('');

    const [mealTypeInput, setMealTypeInput] = useState('');

    const [allergenTagInput, setAllergenTagInput] = useState('');
    const [dislikeTagInput, setDislikeTagInput] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const TOTAL_STEPS = 4; // Adjust this based on your total steps

    // const nextStep = () => {
    //     if (currentStep < TOTAL_STEPS) {
    //         setCurrentStep(currentStep + 1);
    //     } else {
    //         // Handle form submission or completion
    //         handleFormSubmit();
    //     }
    // };

    const nextStep = () => {
        const { isValid, errors: validationErrors } = validateStep(currentStep, formData);

        if (isValid) {
            setErrors({}); // Clear errors if validation passes
            if (currentStep < TOTAL_STEPS) {
                setCurrentStep(currentStep + 1);
            } else {
                handleFormSubmit();
            }
        } else {
            setErrors(validationErrors); // Set errors if validation fails
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleTagKeyPress = (e, fieldName, tagInput, setTagInput) => {
        if (e.key === 'Enter' && tagInput.trim() !== '') {
            const newTag = tagInput.trim();

            // Check if the tag contains at least 3 alphabet characters
            const alphabetCount = (newTag.match(/[a-zA-Z]/g) || []).length;
            const hasEnoughAlphabets = alphabetCount >= 3;

            // Check if the tag already exists (case-insensitive)
            const isDuplicate = formData[fieldName].some(
                (tag) => tag.toLowerCase() === newTag.toLowerCase()
            );

            // Prevent adding the tag if it doesn't contain at least 3 alphabet characters
            if (!hasEnoughAlphabets) {
                setTagInput(''); // Clear input
                e.preventDefault();
                return;
            }

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

    const removeTag = (index, fieldName) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: prev[fieldName].filter((_, i) => i !== index)
        }));
    };

    const renderStepIndicator = () => {
        return <StepIndicator currentStep={currentStep} />;
    };

    const handleFormSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/save-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: 'USER_ID_FROM_LOGIN', // Replace with the actual user ID after login
                    ...formData,
                }),
            });

            if (response.ok) {
                alert('Form submitted successfully!');
            } else {
                alert('Failed to submit form.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
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
                        errors={errors} // Pass errors to the form component
                    />
                );
            case 2:
                return (
                    <MealPreferencesForm
                        user_pref={formData.user_pref}
                        user_likes={formData.user_likes}
                        userPrefInput={userPrefInput}
                        setUserPrefInput={setUserPrefInput}
                        userLikesInput={userLikesInput}
                        setUserLikesInput={setUserLikesInput}
                        handleTagKeyPress={handleTagKeyPress}
                        removeTag={removeTag}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        setFormData={setFormData} // Pass setFormData
                    />
                );
            case 3:
                return (
                    <MealTypeSelectionForm
                        size={formData.size}
                        protein_option={formData.protein_option}
                        protein_category={formData.protein_category}
                        meal_types={formData.meal_types}
                        mealTypeInput={mealTypeInput}
                        setMealTypeInput={setMealTypeInput}
                        handleTagKeyPress={handleTagKeyPress}
                        removeTag={removeTag}
                        prevStep={prevStep}
                        nextStep={nextStep}
                        setFormData={setFormData}
                    />
                );
            case 4:
                return (
                    <RestrictionsForm
                        allergenTags={formData.allergenTags}
                        dislikeTags={formData.dislikeTags}
                        allergenTagInput={allergenTagInput}
                        setAllergenTagInput={setAllergenTagInput}
                        dislikeTagInput={dislikeTagInput}
                        setDislikeTagInput={setDislikeTagInput}
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
                        <p>Enter your personal information.</p>
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