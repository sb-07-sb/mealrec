import React from 'react';

const MealTypeSelectionForm = ({
    size,
    spice_level,
    protein_category,
    meal_types,
    setFormData,
    prevStep,
    nextStep,
    errors, // Pass errors as a prop
    setErrors
}) => {
    // Predefined options
    const sizeOptions = ['extra_small', 'small', 'medium', 'large', 'extra_large'];
    const spiceOptions = ['Low', 'Medium', 'High'];
    const proteinCategoryOptions = ['balance', 'high', 'low'];
    const mealTypeOptions = ['breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'];

    // Handle change for dropdown fields (size, protein_option, protein_category)
    const handleDropdownChange = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));

        // Clear the error for the field being edited
        if (errors[fieldName]) {
            setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
        }
    };

    // Handle selection of meal types from the dropdown
    const handleMealTypeSelect = (e) => {
        const selectedMealType = e.target.value;
        if (selectedMealType && !meal_types.includes(selectedMealType)) {
            setFormData((prev) => ({
                ...prev,
                meal_types: [...prev.meal_types, selectedMealType]
            }));
        }
        // Clear the error for meal_types
        if (errors.meal_types) {
            setErrors((prevErrors) => ({ ...prevErrors, meal_types: '' }));
        }
        e.target.value = ''; // Reset the dropdown after selection
    };

    // Handle removal of a meal type tag
    const removeMealType = (index) => {
        setFormData((prev) => ({
            ...prev,
            meal_types: prev.meal_types.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Meal Type Selection</h2>
            </div>

            <p className="form-description">Select your meal preferences.</p>

            {/* Size Field */}
            <div className="form-group tag-field-group">
                <div className="label-container">
                    <label>Size</label>
                    {errors.size && <span className="error">{errors.size}</span>}
                </div>
                <div className="tags-field-container">
                    <div className="select-container">
                        <select
                            value={size}
                            onChange={(e) => handleDropdownChange('size', e.target.value)}
                            className={errors.size ? "error-border" : ""}
                        >
                            {sizeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="select-arrow">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Protein Option and Protein Category Fields */}
            <div className="form-row">
                <div className="form-group">
                    <div className="label-container">
                        <label>Spice Level</label>
                        {errors.spice_level && <span className="error">{errors.spice_level}</span>}
                    </div>
                    <div className="select-container">
                        <select
                            value={spice_level}
                            onChange={(e) => handleDropdownChange('spice_level', e.target.value)}
                            className={errors.spice_level ? "error-border" : ""}
                        >
                            <option value="" disabled>Select an option</option>
                            {spiceOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="select-arrow">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="label-container">
                        <label>Protein Category</label>
                        {errors.protein_category && <span className="error">{errors.protein_category}</span>}
                    </div>
                    <div className="select-container">
                        <select
                            value={protein_category}
                            onChange={(e) => handleDropdownChange('protein_category', e.target.value)}
                            className={errors.protein_category ? "error-border" : ""}
                        >
                            {proteinCategoryOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="select-arrow">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meal Types Field */}
            <div className="form-group tag-field-group">
                <div className="label-container">
                    <label>Meal Types</label>
                    {errors.meal_types && <span className="error">{errors.meal_types}</span>}
                </div>
                <div className="tags-field-container">
                    {/* Display selected meal types as tags */}
                    <div className="tags-display">
                        {meal_types.map((tag, index) => (
                            <div key={index} className="tag">
                                <span className="tag-text">{tag}</span>
                                <button className="tag-close-btn" onClick={() => removeMealType(index)}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    {/* Single-select dropdown for meal types */}
                    <div className="select-container">
                        <select
                            onChange={handleMealTypeSelect}
                            className={`tag-input ${errors.meal_types ? "error-border" : ""}`}
                        >
                            <option value="" disabled>Select a meal type</option>
                            {mealTypeOptions
                                .filter((option) => !meal_types.includes(option)) // Exclude already selected options
                                .map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                        </select>
                        <div className="select-arrow">
                            <svg viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
                <button onClick={prevStep} className="btn-back">Back</button>
                <button onClick={nextStep} className="btn-next">Next Step</button>
            </div>
        </div>
    );
};

export default MealTypeSelectionForm;