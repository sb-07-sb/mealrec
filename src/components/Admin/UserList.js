import React, { useEffect, useState } from 'react';
import { fetchAllUsers, handleSave, deleteUser } from '../../api/auth';
import styles from '../../assets/styles/UserList.module.css';
import UserListSection from './UserListSection';
import UserDetailsSection from './UserDetailsSection';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showingDetails, setShowingDetails] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [tagField, setTagField] = useState('');
    const [editMode, setEditMode] = useState(false);
  
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setEditingUser(null);
    if (window.innerWidth <= 768) {
      setShowingDetails(true);
    }
  };

  const handleBackToList = () => {
    setShowingDetails(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser(null);
        setShowingDetails(false);
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const startEditing = () => {
    setEditingUser({ ...selectedUser });
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const handleInputChange = (name, value) => {
    setEditingUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveChanges = async () => {
    if (!editingUser || !editingUser._id) {
      console.error("Editing user is missing or _id is not defined");
      return;
    }
  
    // Remove the _id field from the editingUser before updating
    const { _id, ...updatedUserData } = editingUser;
  
    try {
      // Make API call to save the changes, excluding the _id field from the payload
      const updatedUser = await handleSave(_id, updatedUserData); // Pass only the updated data without _id
  
      // Update the user list with the modified user
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
      setSelectedUser(updatedUser); // Set selected user to the updated user
      setEditMode(false);

      window.location.reload();


    } catch (error) {
      console.error("Error saving user changes:", error);
    }
  };
  

  const handleTagAction = (action, field, value) => {
    if (!editingUser || !value || typeof value !== 'string' || !value.trim()) return;

    setEditingUser(prev => ({
      ...prev,
      [field]: action === 'add'
        ? [...(prev[field] || []), value.trim()]
        : prev[field].filter(tag => tag !== value)
    }));

    setNewTagInput('');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'admins') return user.role === 'admin' && matchesSearch;
    if (activeTab === 'users') return user.role === 'user' && matchesSearch;

    return matchesSearch;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className={`${styles.userManagementContainer} ${showingDetails ? styles.showingDetails : ''}`}>
      <UserListSection
        users={currentUsers}
        selectedUser={selectedUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleUserSelect={handleUserSelect}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        indexOfFirstUser={indexOfFirstUser}
        indexOfLastUser={indexOfLastUser}
        filteredUsers={filteredUsers}
      />
      
      {selectedUser && (
        <UserDetailsSection
          selectedUser={selectedUser}
          editingUser={editingUser}
          handleBackToList={handleBackToList}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          saveChanges={saveChanges} // Now calling the updated saveChanges function
          handleDeleteUser={handleDeleteUser}
          handleInputChange={handleInputChange}
          newTagInput={newTagInput}
          setNewTagInput={setNewTagInput}
          tagField={tagField}
          setTagField={setTagField}
          handleTagAction={handleTagAction}
        />
      )}
    </div>
  );
};

export default UserList;
