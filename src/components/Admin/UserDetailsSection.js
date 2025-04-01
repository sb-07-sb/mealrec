import React from 'react';
import styles from '../../assets/styles/UserList.module.css';
import { ArrowLeft, X } from 'lucide-react';
import { updateUser } from '../../api/auth';

const UserDetailsSection = ({
  selectedUser,
  editingUser,
  handleBackToList,
  startEditing,
  cancelEditing,
  saveChanges,
  handleDeleteUser,
  handleInputChange,
  newTagInput,
  setNewTagInput,
  tagField,
  setTagField,
  handleTagAction
}) => {



  const handleInputChangeInternal = (e) => {
    const { name, value } = e.target;
  
    if (!name || value === undefined) {
      console.error("Invalid input field: missing name or value");
      return;
    }
  
    handleInputChange(name, value); // Call the parent handler
  };
  
  

  const renderEditableField = (fieldName, value, label) => {
    return (
      <div className={styles.detailRow}>
        <div className={styles.detailLabel}>{label}</div>
        {editingUser ? (
          <input
            type="text"
            name={fieldName}
            value={value || ''}
            onChange={handleInputChangeInternal} // Use the internal handler
            className={styles.editableInput}
          />
        ) : (
          <div className={styles.detailValue}>{value || '-'}</div>
        )}
      </div>
    );
  };

  const renderTagField = (field, label, placeholder) => {
    return (
      <div className={styles.detailRow}>
        <div className={styles.detailLabel}>{label}</div>
        <div className={styles.detailValue}>
          {editingUser ? (
            <>
              <div className={styles.tagInputContainer}>
                <input
                  type="text"
                  value={tagField === field ? newTagInput : ''}
                  onChange={(e) => {
                    setNewTagInput(e.target.value);
                    setTagField(field);
                  }}
                  className={styles.tagInput}
                  placeholder={placeholder}
                />
                <button 
                  className={styles.addTagButton} 
                  onClick={() => {
                    if (newTagInput.trim()) {
                      handleTagAction('add', field, newTagInput);
                      setNewTagInput('');
                    }
                  }}
                >
                  Add
                </button>
              </div>
              <div className={field === 'allergenTags' ? styles.tagContainer : styles.cuisineContainer}>
                {editingUser[field]?.map((item, index) => (
                  <span 
                    key={index} 
                    className={field === 'allergenTags' ? styles.editableTag : styles.editableCuisineTag}
                  >
                    {item}
                    <button 
                      onClick={() => handleTagAction('remove', field, item)} 
                      className={styles.removeTagButton}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </>
          ) : (
            selectedUser[field]?.length > 0 ? (
              <div className={field === 'allergenTags' ? styles.tagContainer : styles.cuisineContainer}>
                {selectedUser[field].map((item, index) => (
                  <span key={index} className={field === 'allergenTags' ? styles.restrictionTag : styles.cuisineTag}>
                    {item}
                  </span>
                ))}
              </div>
            ) : '-'
          )}
        </div>
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
        </div>
        
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>DIET PREFERENCES</h4>
          {renderEditableField('size', editingUser?.size || selectedUser.size, 'Size')}
          {renderEditableField('protein_category', editingUser?.proteinCategory || selectedUser.protein_category, 'Protein Category')}
          {renderTagField('meal_types', 'Meal Types', 'Add meal type')}
          {renderEditableField('spice_level', editingUser?.spice_level || selectedUser.spice_level, 'Spice Level')}

        </div>
        
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>DIETARY RESTRICTIONS</h4>
          {renderTagField('allergenTags', 'Dietary Restrictions', 'Add new restriction')}
          {renderTagField('dislikeTags', 'Disliked Dishes', 'Add disliked tag')}

        </div>
        
        <div className={styles.detailsSection}>
          <h4 className={styles.sectionTitle}>FOOD PREFERENCES</h4>
          {renderTagField('user_likes', 'Preferred Dishes', 'Add Preferred Dishes')}
          {renderTagField('user_pref', 'Cuisine Preferences', 'Add preferred Cuisines')}

        </div>
      </div>
    </div>
  );
};

export default UserDetailsSection;
