// EducationForm.js
import React from 'react';

const EducationForm = ({
    educationTags,
    skillTags,
    educationTagInput,
    setEducationTagInput,
    skillTagInput,
    setSkillTagInput,
    handleTagKeyPress,
    removeTag,
    prevStep,
    handleFormSubmit // Add handleFormSubmit prop

}) => {
    return (
        <div className="form-container">
            <div className="form-header">
            <h2>Dietary Preferences & Restrictions</h2>
            </div>

            <p className="form-description">Enter your Allergens and Food Dislikes.</p>

            {/* Dietary Preferences & Restrictions Tags Field */}
            <div className="form-group tag-field-group">
                <label>Select your Allergens</label>
                <div className="tags-field-container">
                    <div className="tags-display">
                        {educationTags.map((tag, index) => (
                            <div key={index} className="tag">
                                <span className="tag-text">{tag}</span>
                                <button className="tag-close-btn" onClick={() => removeTag(index, 'educationTags')}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className="tag-input"
                        placeholder="Type and press Enter"
                        value={educationTagInput}
                        onChange={(e) => setEducationTagInput(e.target.value)}
                        onKeyDown={(e) => handleTagKeyPress(e, 'educationTags', educationTagInput, setEducationTagInput)}
                    />
                </div>
            </div>

            {/* Skill Tags Field */}
            <div className="form-group tag-field-group">
                <label>Select foods you dislike</label>
                <div className="tags-field-container">
                    <div className="tags-display">
                        {skillTags.map((tag, index) => (
                            <div key={index} className="tag">
                                <span className="tag-text">{tag}</span>
                                <button className="tag-close-btn" onClick={() => removeTag(index, 'skillTags')}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className="tag-input"
                        placeholder="Type and press Enter"
                        value={skillTagInput}
                        onChange={(e) => setSkillTagInput(e.target.value)}
                        onKeyDown={(e) => handleTagKeyPress(e, 'skillTags', skillTagInput, setSkillTagInput)}
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

export default EducationForm;