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
  };

  const handleTagChange = (field, tags) => {
    setFormData(prev => ({
      ...prev,
      [field]: tags
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await handleSave(userId, formData);
      setProfileData(formData); // Update the displayed data with the saved data
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    }
  };

  if (loading) return <div className={styles.loadingContainer}>Loading...</div>;
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
              onClick={() => setEditMode(!editMode)}
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
                />
                <DetailRow
                  label="Spice Level"
                  value={formData.spice_level}
                  editMode={true}
                  isDropdown={true}
                  options={['low', 'medium', 'high']}
                  onChange={(value) => handleInputChange('spice_level', value)}
                />
                <DetailRow
                  label="Protein Category"
                  value={formData.protein_category}
                  editMode={true}
                  isDropdown={true}
                  options={['low', 'balance', 'high']}
                  onChange={(value) => handleInputChange('protein_category', value)}
                />
              </>
            )}
            <TagGroup
              label="Meal Types"
              tags={editMode ? formData.meal_types || [] : profileData.meal_types || []}
              editMode={editMode}
              onTagsChange={(tags) => handleTagChange('meal_types', tags)}
            />
          </div>
          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>FOOD PREFERENCES</h4>
            <TagGroup
              label="Preferred Cuisines"
              tags={editMode ? formData.user_pref || [] : profileData.user_pref || []}
              editMode={editMode}
              onTagsChange={(tags) => handleTagChange('user_pref', tags)}
            />
            <TagGroup
              label="Preferred Dishes"
              tags={editMode ? formData.user_likes || [] : profileData.user_likes || []}
              editMode={editMode}
              onTagsChange={(tags) => handleTagChange('user_likes', tags)}
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

const DetailRow = ({ label, value, editMode, isDropdown = false, options = [], onChange }) => {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <div className={styles.detailRow}>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>
        {editMode ? (
          isDropdown ? (
            <select
              className={styles.editInput}
              value={value || ''}
              onChange={handleChange}
            >
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
          )
        ) : (
          <span>{value ? (typeof value === 'string' ? value.replace('_', ' ') : value) : '-'}</span>
        )}
      </div>
    </div>
  );
};

const TagGroup = ({ label, tags, editMode, tagStyle = 'default', onTagsChange }) => {
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
      onTagsChange(updatedTags); // ✅ Manually trigger update
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tagList.filter(tag => tag !== tagToRemove);
    setTagList(updatedTags);
    onTagsChange(updatedTags); // ✅ Manually trigger update
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