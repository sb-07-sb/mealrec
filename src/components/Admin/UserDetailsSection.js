import React from 'react';
import styles from '../../assets/styles/UserList.module.css';
import { ArrowLeft, X, Check } from 'lucide-react';

const UserDetailsSection = ({
  selectedUser,
  editingUser,
  handleBackToList,
  startEditing,
  cancelEditing,
  saveChanges,
  handleDeleteUser,
  handleInputChange,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  newCuisine,
  setNewCuisine,
  addCuisine,
  removeCuisine
}) => {
  const renderEditableField = (fieldName, value, label) => {
    return (
      <div className={styles.detailRow}>
        <div className={styles.detailLabel}>{label}</div>
        {editingUser ? (
          <input
            type="text"
            name={fieldName}
            value={value || ''}
            onChange={handleInputChange}
            className={styles.editableInput}
          />
        ) : (
          <div className={styles.detailValue}>{value || '-'}</div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.userDetailsContainer}>
      <button className={styles.backButton} onClick={handleBackToList}>
        <ArrowLeft size={16} /> Back to list
      </button>
      
      <div className={styles.userDetailsContent}>
        <div className={styles.detailsHeader}>
          <h3>User Details</h3>
          <div className={styles.detailsActions}>
            {editingUser ? (
              <>
                <button className={styles.saveButton} onClick={saveChanges}>
                  Save
                </button>
                <button className={styles.cancelButton} onClick={cancelEditing}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button className={styles.editButton} onClick={startEditing}>
                  Edit User
                </button>
                <button 
                  className={styles.deleteButton}
                  onClick={() => handleDeleteUser(selectedUser._id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>BASIC INFORMATION</h4>
          {renderEditableField('email', editingUser?.email || selectedUser.email, 'Email')}
          {renderEditableField('role', editingUser?.role || selectedUser.role, 'Role')}
          {renderEditableField('firstName', editingUser?.firstName || selectedUser.firstName, 'First Name')}
          {renderEditableField('lastName', editingUser?.lastName || selectedUser.lastName, 'Last Name')}
          {renderEditableField('city', editingUser?.city || selectedUser.city, 'City')}
          {renderEditableField('country', editingUser?.country || selectedUser.country, 'Country')}
        </div>
        
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>FOOD PREFERENCES</h4>
          {renderEditableField('size', editingUser?.size || selectedUser.size, 'Size')}
          {renderEditableField('proteinOption', editingUser?.proteinOption || selectedUser.proteinOption, 'Protein Option')}
          {renderEditableField('mealTypes', editingUser?.mealTypes || selectedUser.mealTypes, 'Meal Types')}
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>Preferred Foods</div>
            {editingUser ? (
              <input
                type="text"
                name="user_pref"
                value={editingUser.user_pref?.join(', ') || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange({
                    target: {
                      name: 'user_pref',
                      value: value.split(',').map(item => item.trim()).filter(item => item)
                    }
                  });
                }}
                className={styles.editableInput}
                placeholder="Comma separated values"
              />
            ) : (
              <div className={styles.detailValue}>
                {selectedUser.user_pref?.join(', ') || '-'}
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>DIETARY RESTRICTIONS</h4>
          <div className={styles.tagContainer}>
            {editingUser ? (
              <>
                <div className={styles.tagInputContainer}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className={styles.tagInput}
                    placeholder="Add new restriction"
                  />
                  <button className={styles.addTagButton} onClick={addTag}>
                    Add
                  </button>
                </div>
                {editingUser.allergenTags?.map((tag, index) => (
                  <span key={index} className={styles.editableTag}>
                    {tag}
                    <button onClick={() => removeTag(tag)} className={styles.removeTagButton}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </>
            ) : (
              selectedUser.allergenTags && selectedUser.allergenTags.length > 0 ? 
                selectedUser.allergenTags.map((tag, index) => (
                  <span key={index} className={styles.restrictionTag}>{tag}</span>
                )) :
                <span className={styles.noRestrictions}>No restrictions specified</span>
            )}
          </div>
        </div>
        
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>CUISINE PREFERENCES</h4>
          <div className={styles.cuisineContainer}>
            {editingUser ? (
              <>
                <div className={styles.tagInputContainer}>
                  <input
                    type="text"
                    value={newCuisine}
                    onChange={(e) => setNewCuisine(e.target.value)}
                    className={styles.tagInput}
                    placeholder="Add new cuisine"
                  />
                  <button className={styles.addTagButton} onClick={addCuisine}>
                    Add
                  </button>
                </div>
                {editingUser.user_likes?.map((cuisine, index) => (
                  <span key={index} className={styles.editableCuisineTag}>
                    {cuisine}
                    <button onClick={() => removeCuisine(cuisine)} className={styles.removeTagButton}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </>
            ) : (
              selectedUser.user_likes && selectedUser.user_likes.length > 0 ? 
                selectedUser.user_likes.map((cuisine, index) => (
                  <span key={index} className={styles.cuisineTag}>{cuisine}</span>
                )) :
                <span className={styles.noCuisines}>No cuisine preferences specified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSection;