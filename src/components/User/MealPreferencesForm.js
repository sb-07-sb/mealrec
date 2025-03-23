import React from 'react';




const MealPreferencesForm = ({
    user_pref,
    user_likes,
    userPrefInput,
    setUserPrefInput,
    userLikesInput,
    setUserLikesInput,
    handleTagKeyPress,
    removeTag,
    prevStep,
    nextStep,
    errors, // Pass errors as a prop
    setErrors
}) => {
    return (
        <div className="form-container">
            <div className="form-header">
                <h2>Meal Preferences</h2>
            </div>

            <p className="form-description">Enter your preferred dishes and cuisines.</p>

            {/* Preferred Dishes Field */}
            <div className="form-group tag-field-group">
                <div className="label-container">
                    <label>Preferred Dishes</label>
                    {errors.user_pref && <span className="error">{errors.user_pref}</span>}
                </div>
                <div className="tags-field-container">
                    <div className="tags-display">
                        {user_pref.map((tag, index) => (
                            <div key={index} className="tag">
                                <span className="tag-text">{tag}</span>
                                <button className="tag-close-btn" onClick={() => removeTag(index, 'user_pref')}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className={`tag-input ${errors.user_pref ? "error-border" : ""}`}
                        placeholder="Type and press Enter"
                        value={userPrefInput}
                        onChange={(e) => {
                            setUserPrefInput(e.target.value);
                            if (errors.user_pref) {
                                setErrors((prevErrors) => ({ ...prevErrors, user_pref: '' }));
                            }
                        }}
                        onKeyDown={(e) => handleTagKeyPress(e, 'user_pref', userPrefInput, setUserPrefInput)}
                    />
                </div>
            </div>

            {/* Preferred Cuisines Field */}
            <div className="form-group tag-field-group">
                <div className="label-container">
                    <label>Preferred Cuisines</label>
                    {errors.user_likes && <span className="error">{errors.user_likes}</span>}
                </div>
                <div className="tags-field-container">
                    <div className="tags-display">
                        {user_likes.map((tag, index) => (
                            <div key={index} className="tag">
                                <span className="tag-text">{tag}</span>
                                <button className="tag-close-btn" onClick={() => removeTag(index, 'user_likes')}>
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        className={`tag-input ${errors.user_likes ? "error-border" : ""}`}
                        placeholder="Type and press Enter"
                        value={userLikesInput}
                        onChange={(e) => {
                            setUserLikesInput(e.target.value);
                            if (errors.user_likes) {
                                setErrors((prevErrors) => ({ ...prevErrors, user_likes: '' }));
                            }
                        }}
                        onKeyDown={(e) => handleTagKeyPress(e, 'user_likes', userLikesInput, setUserLikesInput)}
                    />
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

export default MealPreferencesForm;