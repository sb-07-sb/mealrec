import React, { useState, useEffect } from 'react';
import styles from '../../assets/styles/ProfileView.module.css';
import { fetchAllUsers } from '../../api/auth';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const ProfileView = ({ onGeneratePlan }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchAllUsers();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        Loading profile...
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  if (!profileData) {
    return <div className={styles.emptyState}>No profile data found</div>;
  }

  return (
    <div className={styles.profileManagementContainer}>
      <div className={styles.profileContent}>
        <div className={styles.header}>
          <h2>My Profile</h2>
          <div className={styles.actions}>
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

        <div className={styles.detailsContainer}>
          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>BASIC INFORMATION</h4>
            <DetailRow 
              label="First Name" 
              value={profileData.firstName} 
              editMode={editMode}
            />
            <DetailRow 
              label="Last Name" 
              value={profileData.lastName} 
              editMode={editMode}
            />
            <DetailRow 
              label="City" 
              value={profileData.city} 
              editMode={editMode}
            />
            <DetailRow 
              label="Country" 
              value={profileData.country} 
              editMode={editMode}
            />
          </div>

          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>DIET PREFERENCES</h4>
            <DetailRow 
              label="Meal Size" 
              value={profileData.size} 
              editMode={editMode}
            />
            <DetailRow 
              label="Protein Option" 
              value={profileData.protein_option} 
              editMode={editMode}
            />
            <DetailRow 
              label="Protein Category" 
              value={profileData.protein_category} 
              editMode={editMode}
            />
            <DetailRow 
              label="Meal Types" 
              value={profileData.meal_types?.join(', ')} 
              editMode={editMode}
            />
          </div>

          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>FOOD PREFERENCES</h4>
            <TagGroup 
              label="Preferred Dishes" 
              tags={profileData.user_pref} 
              editMode={editMode}
            />
            <TagGroup 
              label="Preferred Cuisines" 
              tags={profileData.user_likes} 
              editMode={editMode}
            />
          </div>

          <div className={styles.detailsSection}>
            <h4 className={styles.sectionTitle}>DIETARY RESTRICTIONS</h4>
            <TagGroup 
              label="Allergens" 
              tags={profileData.allergenTags} 
              editMode={editMode}
              tagStyle="restriction"
            />
            <TagGroup 
              label="Dislikes" 
              tags={profileData.dislikeTags} 
              editMode={editMode}
              tagStyle="restriction"
            />
          </div>
        </div>

        {editMode && (
          <div className={styles.formActions}>
            <button className={styles.secondaryButton}>
              Discard Changes
            </button>
            <button className={styles.primaryButton}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, editMode }) => (
  <div className={styles.detailRow}>
    <div className={styles.detailLabel}>{label}</div>
    <div className={styles.detailValue}>
      {editMode ? (
        <input 
          type="text" 
          defaultValue={value} 
          className={styles.editInput}
        />
      ) : (
        value || '-'
      )}
    </div>
  </div>
);

const TagGroup = ({ label, tags, editMode, tagStyle = 'default' }) => (
  <div className={styles.tagGroup}>
    <div className={styles.detailRow}>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>
        {editMode && (
          <input 
            type="text" 
            placeholder="Add new..."
            className={styles.tagInput}
          />
        )}
      </div>
    </div>
    <div className={`${styles.tagContainer} ${styles[tagStyle]}`}>
      {tags?.length > 0 ? (
        tags.map((tag, index) => (
          <span key={index} className={styles.tag}>
            {tag}
            {editMode && <button className={styles.tagRemove}>&times;</button>}
          </span>
        ))
      ) : (
        <span className={styles.noTags}>None specified</span>
      )}
    </div>
  </div>
);

export default ProfileView;