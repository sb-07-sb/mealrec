// RestrictionsForm.js
import React from 'react';

const RestrictionsForm = ({
    allergenTags,
    dislikeTags,
    allergenTagInput,
    setAllergenTagInput,
    dislikeTagInput,
    setDislikeTagInput,
    handleTagKeyPress,
    removeTag,
    prevStep,
    handleFormSubmit, // Add handleFormSubmit prop
    errors, // Pass errors as a prop
    setErrors

}) => {
    return (
        <div className="form-container">
            <div className="form-header">
            <h2>Dietary Preferences & Restrictions</h2>
            </div>

            <p className="form-description">Enter your Allergens and Food Dislikes.</p>

            {/* Allergens Tags Field */}
            <div className="form-group tag-field-group">
                <label>Select your Allergens</label>
                {errors.allergenTags && <span className="error">{errors.allergenTags}</span>}

                <div className="tags-field-container">
                    <div className="tags-display">
                        {allergenTags.map((tag, index) => (
                            <div key={index} className="tag">
                                <span className="tag-text">{tag}</span>
                                <button className="tag-close-btn" onClick={() => removeTag(index, 'allergenTags')}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className={`tag-input ${errors.allergenTags ? "error-border" : ""}`}
                        placeholder="Type and press Enter"
                        value={allergenTagInput}
                        onChange={(e) => {
                            setAllergenTagInput(e.target.value)
                            if (errors.allergenTags) {
                                setErrors((prevErrors) => ({ ...prevErrors, allergenTags: '' }));
                            }}}
                        onKeyDown={(e) => handleTagKeyPress(e, 'allergenTags', allergenTagInput, setAllergenTagInput)}
                    />
                </div>
            </div>

            {/* Dislike Tags Field */}
            <div className="form-group tag-field-group">
                <label>Select foods you dislike</label>
                <div className="tags-field-container">
                    <div className="tags-display">
                        {dislikeTags.map((tag, index) => (
                            <div key={index} className="tag">
                                <span className="tag-text">{tag}</span>
                                <button className="tag-close-btn" onClick={() => removeTag(index, 'dislikeTags')}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className="tag-input"
                        placeholder="Type and press Enter"
                        value={dislikeTagInput}
                        onChange={(e) => setDislikeTagInput(e.target.value)}
                        onKeyDown={(e) => handleTagKeyPress(e, 'dislikeTags', dislikeTagInput, setDislikeTagInput)}
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
                <button onClick={prevStep} className="btn-back">Back</button>
                <button onClick={handleFormSubmit} className="btn-next">Submit</button>
            </div>
        </div>
    );
};

export default RestrictionsForm;