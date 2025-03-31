import React, { useEffect, useState } from 'react';
import { fetchAllUsers, deleteUser } from '../../api/auth';
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
  const [newTag, setNewTag] = useState('');
  const [newCuisine, setNewCuisine] = useState('');
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveChanges = async () => {
    try {
      // await updateUser(editingUser._id, editingUser);
      setEditingUser(null);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const updateTags = (field, value, action) => {
    if (!editingUser || !value || typeof value !== 'string' || !value.trim()) return;

    setEditingUser(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...(prev[field] || []), value.trim()] 
        : prev[field].filter(tag => tag !== value)
    }));

    if (field === 'allergenTags') setNewTag('');
    if (field === 'user_likes') setNewCuisine('');
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
          saveChanges={saveChanges}
          handleDeleteUser={handleDeleteUser}
          handleInputChange={handleInputChange}
          newTag={newTag}
          setNewTag={setNewTag}
          addTag={() => updateTags('allergenTags', newTag, 'add')}
          removeTag={(tag) => updateTags('allergenTags', tag, 'remove')}
          newCuisine={newCuisine}
          setNewCuisine={setNewCuisine}
          addCuisine={() => updateTags('user_likes', newCuisine, 'add')}
          removeCuisine={(cuisine) => updateTags('user_likes', cuisine, 'remove')}
        />
      )}
    </div>
  );
};

export default UserList;
