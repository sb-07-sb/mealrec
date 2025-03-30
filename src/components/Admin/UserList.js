import React, { useEffect, useState } from 'react';
import { fetchAllUsers, deleteUser } from '../../api/auth';
import styles from '../../assets/styles/UserList.module.css';
import { 
  Search, 
  Filter,
  Plus,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showingDetails, setShowingDetails] = useState(false);
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
    // On mobile, switch to details view when a user is selected
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

  // Filter users based on active tab and search term
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

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Check if we need to reset pagination when filter changes
  useEffect(() => {
    if (indexOfFirstUser >= filteredUsers.length && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [filteredUsers.length, indexOfFirstUser, currentPage]);

  // Handle window resize to reset mobile view when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && showingDetails) {
        setShowingDetails(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showingDetails]);

  return (
    <div className={`${styles.userManagementContainer} ${showingDetails ? styles.showingDetails : ''}`}>
      <div className={styles.userListSection}>
        <div className={styles.header}>
          <h2>Users</h2>
          <div className={styles.actions}>
            <button className={styles.filterButton}>
              Filter <ChevronRight size={16} />
            </button>
            <button className={styles.addUserButton}>
              + Add User
            </button>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <div 
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Users
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'admins' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            Admins ({users.filter(u => u.role === 'admin').length})
          </div>
          <div 
            className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({users.filter(u => u.role === 'user').length})
          </div>
        </div>

        <div className={styles.listHeader}>
          <div className={styles.emailColumn}>EMAIL</div>
          <div className={styles.roleColumn}>ROLE</div>
          <div className={styles.idColumn}>ID</div>
        </div>

        <div className={styles.usersList}>
          {currentUsers.map(user => (
            <div 
              key={user._id} 
              className={`${styles.userRow} ${selectedUser && selectedUser._id === user._id ? styles.selectedRow : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className={styles.emailColumn}>
                <div className={styles.userInitial}>
                  {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className={styles.emailText}>{user.email}</span>
              </div>
              <div className={`${styles.roleColumn} ${styles[user.role || 'user']}`}>
                <span className={styles.roleBadge}>{user.role || 'User'}</span>
              </div>
              <div className={styles.idColumn}>{user._id?.substring(0, 6) || 'N/A'}</div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </span>
          <div className={styles.pageButtons}>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => (
              <button 
                key={i + 1} 
                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.activePage : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedUser && (
        <div className={styles.userDetailsContainer}>
          <button className={styles.backButton} onClick={handleBackToList}>
            <ArrowLeft size={16} /> Back to list
          </button>
          
          <div className={styles.userDetailsContent}>
            <h3>User Details</h3>
            
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>BASIC INFORMATION</h4>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>User ID</div>
                <div className={styles.detailValue}>{selectedUser._id}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Email</div>
                <div className={styles.detailValue}>{selectedUser.email}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Role</div>
                <div className={styles.detailValue}>
                  <span className={`${styles.roleBadge} ${styles[selectedUser.role || 'user']}`}>
                    {selectedUser.role || 'User'}
                  </span>
                </div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>First Name</div>
                <div className={styles.detailValue}>{selectedUser.firstName || '-'}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Last Name</div>
                <div className={styles.detailValue}>{selectedUser.lastName || '-'}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>City</div>
                <div className={styles.detailValue}>{selectedUser.city || '-'}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Country</div>
                <div className={styles.detailValue}>{selectedUser.country || '-'}</div>
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>FOOD PREFERENCES</h4>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Size</div>
                <div className={styles.detailValue}>{selectedUser.size || '-'}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Protein Option</div>
                <div className={styles.detailValue}>{selectedUser.proteinOption || '-'}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Meal Types</div>
                <div className={styles.detailValue}>{selectedUser.mealTypes || '-'}</div>
              </div>
              <div className={styles.detailRow}>
                <div className={styles.detailLabel}>Preferred Foods</div>
                <div className={styles.detailValue}>{selectedUser.user_pref?.join(', ') || '-'}</div>
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>DIETARY RESTRICTIONS</h4>
              <div className={styles.tagContainer}>
                {selectedUser.allergenTags && selectedUser.allergenTags.length > 0 ? 
                  selectedUser.allergenTags.map((tag, index) => (
                    <span key={index} className={styles.restrictionTag}>{tag}</span>
                  )) :
                  <span className={styles.noRestrictions}>No restrictions specified</span>
                }
              </div>
            </div>
            
            <div className={styles.detailsSection}>
              <h4 className={styles.sectionTitle}>CUISINE PREFERENCES</h4>
              <div className={styles.cuisineContainer}>
                {selectedUser.user_likes && selectedUser.user_likes.length > 0 ? 
                  selectedUser.user_likes.map((cuisine, index) => (
                    <span key={index} className={styles.cuisineTag}>{cuisine}</span>
                  )) :
                  <span className={styles.noCuisines}>No cuisine preferences specified</span>
                }
              </div>
            </div>
            
            <div className={styles.userActions}>
              <button className={styles.editButton}>Edit User</button>
              <button 
                className={styles.deleteButton}
                onClick={() => handleDeleteUser(selectedUser._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;