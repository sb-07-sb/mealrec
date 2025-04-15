import React, { useState, useEffect } from 'react';
import styles from '../../assets/styles/ProfileView.module.css';
import { getUserFormData, handleSave } from '../../api/auth';

const ProfileView = ({ onGeneratePlan }) => {
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const userId = localStorage.getItem('user_id');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserFormData(userId);
        if (response && response.data) {
          setProfileData(response.data);

          // ✅ Only update formData if it's different (prevents infinite loop)
          if (JSON.stringify(response.data) !== JSON.stringify(formData)) {
            setFormData(response.data);
          }
        } else {
          throw new Error('No data received from API');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setValidationErrors(prevErrors => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field]; // Remove error for the updated field
      return updatedErrors;
    });
  };



  const handleTagChange = (field, tags) => {
    setFormData(prev => ({
      ...prev,
      [field]: tags
    }));

    // Clear validation error for the field when user types
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [field]: undefined, // Remove error message for this field
    }));
  };

  const handleSaveChanges = async () => {
    const errors = {};

    if (!formData.firstName?.trim()) errors.firstName = "Required*";
    if (!formData.size) errors.size = "Required*";
    if (!formData.spice_level) errors.spice_level = "Required*";
    if (!formData.protein_category) errors.protein_category = "Required*";
    if (!formData.meal_types || formData.meal_types.length === 0) {
      errors.meal_types = "Required*";
    }
    if (!formData.user_pref || formData.user_pref.length === 0) {
      errors.user_pref = "Required*";
    }
    if (!formData.user_likes || formData.user_likes.length === 0) {
      errors.user_likes = "Required*";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSaving(true);
    try {
      await handleSave(userId, formData);
      setProfileData(formData); // Update the displayed data with the saved data
      setEditMode(false);
      window.location.reload(); // ✅ Reload page 
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    }
  };

 
  const renderLoadingSkeleton = () => (
    <div className={styles.profileOuterContainer}>
      <div className={styles.profileGrid}>
        <div className={styles.profileHeader}>
          <div className={`${styles.shimmer} ${styles.headerShimmer}`}></div>
          <div className={styles.profileActions}>
            <div className={`${styles.shimmer} ${styles.buttonShimmer}`}></div>
            <div className={`${styles.shimmer} ${styles.buttonShimmer}`}></div>
          </div>
        </div>

        <div className={styles.scrollableContent}>
          {/* Basic Information Section */}
          <div className={styles.detailsSection}>
            <div className={`${styles.shimmer} ${styles.sectionTitleShimmer}`}></div>
            {[...Array(2)].map((_, i) => (
              <div key={`basic-${i}`} className={styles.detailRow}>
                <div className={`${styles.shimmer} ${styles.labelShimmer}`}></div>
                <div className={`${styles.shimmer} ${styles.valueShimmer}`}></div>
              </div>
            ))}
          </div>

          {/* Diet Preferences Section */}
          <div className={styles.detailsSection}>
            <div className={`${styles.shimmer} ${styles.sectionTitleShimmer}`}></div>
            {[...Array(3)].map((_, i) => (
              <div key={`diet-${i}`} className={styles.detailRow}>
                <div className={`${styles.shimmer} ${styles.labelShimmer}`}></div>
                <div className={`${styles.shimmer} ${styles.valueShimmer}`}></div>
              </div>
            ))}
            {[...Array(2)].map((_, i) => (
              <div key={`tags-${i}`} className={styles.tagGroup}>
                <div className={styles.detailRow}>
                  <div className={`${styles.shimmer} ${styles.labelShimmer}`}></div>
                  <div className={styles.detailValue}>
                    <div className={styles.tagContainer}>
                      {[...Array(3)].map((_, j) => (
                        <div key={`tag-${j}`} className={`${styles.shimmer} ${styles.tagShimmer}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Food Preferences Section */}
          <div className={styles.detailsSection}>
            <div className={`${styles.shimmer} ${styles.sectionTitleShimmer}`}></div>
            {[...Array(2)].map((_, i) => (
              <div key={`food-${i}`} className={styles.tagGroup}>
                <div className={styles.detailRow}>
                  <div className={`${styles.shimmer} ${styles.labelShimmer}`}></div>
                  <div className={styles.detailValue}>
                    <div className={styles.tagContainer}>
                      {[...Array(4)].map((_, j) => (
                        <div key={`food-tag-${j}`} className={`${styles.shimmer} ${styles.tagShimmer}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dietary Restrictions Section */}
          <div className={styles.detailsSection}>
            <div className={`${styles.shimmer} ${styles.sectionTitleShimmer}`}></div>
            {[...Array(2)].map((_, i) => (
              <div key={`restriction-${i}`} className={styles.tagGroup}>
                <div className={styles.detailRow}>
                  <div className={`${styles.shimmer} ${styles.labelShimmer}`}></div>
                  <div className={styles.detailValue}>
                    <div className={styles.tagContainer}>
                      {[...Array(2)].map((_, j) => (
                        <div key={`restriction-tag-${j}`} className={`${styles.shimmer} ${styles.tagShimmer}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return renderLoadingSkeleton();
  if (error) return <div className={styles.errorContainer}>{error}</div>;
  if (!profileData) return <div className={styles.emptyState}>No profile data found</div>;

  // Render non-edit mode with grid layout
  const renderBasicInfoGridNonEdit = () => {
    return (
      <div className={styles.gridRow}>
        <div className={styles.gridItem}>
          <div className={styles.detailLabel}>First Name</div>
          <div className={styles.detailValue}>
            {profileData.firstName || '-'}
          </div>
        </div>
        <div className={styles.gridItem}>
          <div className={styles.detailLabel}>Last Name</div>
          <div className={styles.detailValue}>
            {profileData.lastName || '-'}
          </div>
        </div>
      </div>
    );
  };



  return (
    <div className={styles.profileOuterContainer}>
      <div className={styles.profileGrid}>
        <div className={styles.profileHeader}>
          <h2>User Profile</h2>
          <div className={styles.profileActions}>
            <button
              className={styles.editButton}
              onClick={() => {
                if (editMode) {
                  setValidationErrors({});  
                  setFormData(profileData); 
                }
                setEditMode(!editMode);
              }}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className={styles.primaryButton} onClick={onGeneratePlan}>
              Generate Meal Plan
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className={styles.scrollableContent}>
          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>BASIC INFORMATION</h4>
            {!editMode ? (
              renderBasicInfoGridNonEdit()
            ) : (
              <>
                <DetailRow
                  label="First Name"
                  value={formData.firstName}
                  editMode={true}
                  onChange={(value) => handleInputChange('firstName', value)}
                  field="firstName"
                  validationErrors={validationErrors}

                />
                <DetailRow
                  label="Last Name"
                  value={formData.lastName}
                  editMode={true}
                  onChange={(value) => handleInputChange('lastName', value)}
                />
              </>
            )}
          </div>

          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>DIET PREFERENCES</h4>
            {!editMode ? (
              <>
                <div className={styles.gridRow}>
                  <div className={styles.gridItem}>
                    <div className={styles.detailLabel}>Meal Size</div>
                    <div className={styles.detailValue}>
                      {profileData.size ? profileData.size.replace('_', ' ') : '-'}
                    </div>
                  </div>
                </div>
                <div className={styles.gridRow}>
                  <div className={styles.gridItem}>
                    <div className={styles.detailLabel}>Spice Level</div>
                    <div className={styles.detailValue}>
                      {profileData.spice_level || '-'}
                    </div>

                  </div>
                </div>
                <div className={styles.gridRow}>
                  <div className={styles.gridItem}>
                    <div className={styles.detailLabel}>Protein Category</div>
                    <div className={styles.detailValue}>
                      {profileData.protein_category || '-'}
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <>
                <DetailRow
                  label="Meal Size"
                  value={formData.size}
                  editMode={true}
                  isDropdown={true}
                  options={['extra_small', 'small', 'medium', 'large', 'extra_large']}
                  onChange={(value) => handleInputChange('size', value)}
                  field="size"

                />
                <DetailRow
                  label="Spice Level"
                  value={formData.spice_level}
                  editMode={true}
                  isDropdown={true}
                  options={['low', 'medium', 'high']}
                  onChange={(value) => handleInputChange('spice_level', value)}
                  field="spice_level"
                  validationErrors={validationErrors}
                />
                <DetailRow
                  label="Protein Category"
                  value={formData.protein_category}
                  editMode={true}
                  isDropdown={true}
                  options={['low', 'balance', 'high']}
                  onChange={(value) => handleInputChange('protein_category', value)}
                  field="protein_category"
                  validationErrors={validationErrors}

                />
              </>
            )}
            <TagGroup
              label="Meal Types"
              tags={editMode ? formData.meal_types || [] : profileData.meal_types || []}
              editMode={editMode}
              onTagsChange={(tags) => handleTagChange('meal_types', tags)}
              field="meal_types"
              validationErrors={validationErrors}

            />
          </div>
          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>FOOD PREFERENCES</h4>
            <TagGroup
              label="Preferred Cuisines"
              tags={editMode ? formData.user_pref || [] : profileData.user_pref || []}
              editMode={editMode}
              onTagsChange={(tags) => handleTagChange('user_pref', tags)}
              field="user_pref"
              validationErrors={validationErrors}
            />
            <TagGroup
              label="Preferred Dishes"
              tags={editMode ? formData.user_likes || [] : profileData.user_likes || []}
              editMode={editMode}
              onTagsChange={(tags) => handleTagChange('user_likes', tags)}
              field="user_likes"
              validationErrors={validationErrors}
            />
          </div>

          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>DIETARY RESTRICTIONS</h4>
            <TagGroup
              label="Allergens"
              tags={editMode ? formData.allergenTags || [] : profileData.allergenTags || []}
              editMode={editMode}
              tagStyle="restriction"
              onTagsChange={(tags) => handleTagChange('allergenTags', tags)}
            />
            <TagGroup
              label="Dislikes"
              tags={editMode ? formData.dislikeTags || [] : profileData.dislikeTags || []}
              editMode={editMode}
              tagStyle="restriction"
              onTagsChange={(tags) => handleTagChange('dislikeTags', tags)}
            />
          </div>

          {editMode && (
            <div className={styles.formActions}>
              <button
                className={styles.secondaryButton}
                onClick={() => {
                  setFormData(profileData); // Reset to original data
                  setValidationErrors({});
                  setEditMode(false);
                }}
              >
                Discard Changes
              </button>
              <button
                className={styles.primaryButton}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, editMode, isDropdown = false, options = [], onChange, field, validationErrors = {} }) => {

  // const [validationErrors, setValidationErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);



  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <div className={styles.detailRow}>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>
        {editMode ? (
          <>
            {isDropdown ? (
              <select className={styles.editInput} value={value || ''} onChange={handleChange}>
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option.replace('_', ' ')}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={value || ''}
                className={styles.editInput}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            )}
            {validationErrors && validationErrors[field] && (
              <div className={styles.errorText}>{validationErrors[field]}</div>
            )}
          </>
        ) : (
          <span>{value ? value.replace('_', ' ') : '-'}</span>
        )}
      </div>
    </div>
  );
};


const TagGroup = ({ label, field, tags, editMode, tagStyle = 'default', onTagsChange, validationErrors = {}, setValidationErrors }) => {
  const [newTag, setNewTag] = useState('');
  const [tagList, setTagList] = useState(tags || []);

  useEffect(() => {
    setTagList(tags || []);
  }, [tags]);

  const handleAddTag = () => {
    if (newTag.trim() && !tagList.includes(newTag.trim())) {
      const updatedTags = [...tagList, newTag.trim()];
      setTagList(updatedTags);
      setNewTag('');
      onTagsChange(updatedTags);

      // ✅ Remove validation error for this specific field (meal_types, preferred_cuisines, etc.)
      if (setValidationErrors) {
        setValidationErrors(prevErrors => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[field]; // Use field, not label
          return updatedErrors;
        });
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tagList.filter(tag => tag !== tagToRemove);
    setTagList(updatedTags);
    onTagsChange(updatedTags);
  };

  return (
    <div className={styles.tagGroup}>
      <div className={styles.detailRow}>
        <div className={styles.detailLabel}>{label}</div>
        <div className={styles.detailValue}>
          {editMode && (
            <div className={styles.tagInputContainer}>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder={`Add new ${label.toLowerCase()}...`}
                className={styles.tagInput}
              />
              <button
                className={styles.addTagButton}
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                Add
              </button>
            </div>
          )}

          {/* ✅ Display Validation Error (using field instead of label) */}
          {validationErrors && validationErrors[field] && (
            <div className={styles.errorText}>{validationErrors[field]}</div>
          )}

          <div className={`${styles.tagContainer} ${styles[tagStyle]}`}>
            {tagList.length > 0 ? (
              tagList.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                  {editMode && (
                    <button
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      &times;
                    </button>
                  )}
                </span>
              ))
            ) : (
              <span className={styles.noTags}>None specified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfileView;