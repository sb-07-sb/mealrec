import React from 'react';

const MealTypeSelectionForm = ({
    size,
    protein_option,
    protein_category,
    meal_types,
    setFormData,
    prevStep,
    nextStep
}) => {
    // Predefined options
    const sizeOptions = ['large', 'standard'];
    const proteinOptions = ['chicken', 'beef', 'vegetarian'];
    const proteinCategoryOptions = ['balance', 'high-protein', 'low-carb'];
    const mealTypeOptions = ['breakfast', 'morning_snack', 'lunch', 'evening_snack', 'dinner'];

    // Handle change for dropdown fields (size, protein_option, protein_category)
    const handleDropdownChange = (fieldName, value) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: value
        }));
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
                <label>Size</label>
                <div className="tags-field-container">
                    <div className="select-container">
                        <select
                            value={size}
                            onChange={(e) => handleDropdownChange('size', e.target.value)}
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
                    <label>Protein Option</label>
                    <div className="select-container">
                        <select
                            value={protein_option}
                            onChange={(e) => handleDropdownChange('protein_option', e.target.value)}
                        >
                            <option value="" disabled>Select an option</option>
                            {proteinOptions.map((option) => (
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
                    <label>Protein Category</label>
                    <div className="select-container">
                        <select
                            value={protein_category}
                            onChange={(e) => handleDropdownChange('protein_category', e.target.value)}
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
                <label>Meal Types</label>
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
                            className="tag-input"
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