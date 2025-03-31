import React, { useState, useEffect } from 'react';
import styles from '../../assets/styles/ProfileView.module.css';
import { getUserFormData } from '../../api/auth';

const ProfileView = ({ onGeneratePlan }) => {
  const [profileData, setProfileData] = useState(null);
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

  if (loading) return <div className={styles.loadingContainer}>Loading...</div>;
  if (error) return <div className={styles.errorContainer}>{error}</div>;
  if (!profileData) return <div className={styles.emptyState}>No profile data found</div>;

  return (
    <div className={styles.profileOuterContainer}>

      <div className={styles.profileGrid}>
        <div className={styles.profileHeader}>
          <h2>Profile</h2>
          <div className={styles.profileActions}>
            <button
              className={styles.editButton}
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              className={styles.primaryButton}
              onClick={onGeneratePlan}
            >
              Generate Meal Plan
            </button>
          </div>
        </div>

      {/* Scrollable Content */}
      <div className={styles.scrollableContent}>
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>BASIC INFORMATION</h4>
          <DetailRow label="First Name" value={profileData.firstName} editMode={editMode} />
          <DetailRow label="Last Name" value={profileData.lastName} editMode={editMode} />
          <DetailRow label="City" value={profileData.city} editMode={editMode} />
          <DetailRow label="Country" value={profileData.country} editMode={editMode} />
        </div>

        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>DIET PREFERENCES</h4>
          <DetailRow label="Meal Size" value={profileData.size} editMode={editMode} isDropdown={true} options={['extra_small', 'small', 'medium', 'large', 'extra_large']}  />
          <DetailRow label="Protein Option" value={profileData.protein_option} editMode={editMode} isDropdown={true} options={['chicken', 'beef']}/>
          <DetailRow label="Protein Category" value={profileData.protein_category} editMode={editMode} isDropdown={true} options={['low', 'balance', 'high']}/>
          <TagGroup label="Meal Types" tags={profileData.meal_types} editMode={editMode} />
        </div>

        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>FOOD PREFERENCES</h4>
          <TagGroup label="Preferred Dishes" tags={profileData.user_pref} editMode={editMode} />
          <TagGroup label="Preferred Cuisines" tags={profileData.user_likes} editMode={editMode} />
        </div>

        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>DIETARY RESTRICTIONS</h4>
          <TagGroup label="Allergens" tags={profileData.allergenTags} editMode={editMode} tagStyle="restriction" />
          <TagGroup label="Dislikes" tags={profileData.dislikeTags} editMode={editMode} tagStyle="restriction" />
        </div>

        {editMode && (
          <div className={styles.formActions}>
            <button
              className={styles.secondaryButton}
              onClick={() => setEditMode(false)}
            >
              Discard Changes
            </button>
            <button
              className={styles.primaryButton}
              onClick={() => {
                // Add save functionality here
                setEditMode(false);
              }}
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

const DetailRow = ({ label, value, editMode, isDropdown = false, options = [] }) => (
  <div className={styles.detailRow}>
    <div className={styles.detailLabel}>{label}</div>
    <div className={styles.detailValue}>
      {editMode ? (
        isDropdown ? (
          <select className={styles.editInput} defaultValue={value}>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            defaultValue={value}
            className={styles.editInput}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )
      ) : (
        value || '-'
      )}
    </div>
  </div>
);


const TagGroup = ({ label, tags, editMode, tagStyle = 'default' }) => {
  const [newTag, setNewTag] = useState('');
  const [tagList, setTagList] = useState(tags || []);

  const handleAddTag = () => {
    if (newTag.trim() && !tagList.includes(newTag.trim())) {
      setTagList([...tagList, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
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
                placeholder="Add new..."
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
        </div>
      </div>
      <div className={`${styles.tagContainer} ${styles[tagStyle]}`}>
        {tagList.length > 0 ? (
          tagList.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
              {editMode && (
                <button
                  className={styles.tagRemove}
                  onClick={() => handleRemoveTag(tag)}
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
  );
};

export default ProfileView;