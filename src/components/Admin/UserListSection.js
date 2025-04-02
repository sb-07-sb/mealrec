import React from 'react';
import styles from '../../assets/styles/UserList.module.css';
import { ChevronRight } from 'lucide-react';

const UserListSection = ({
  users,
  selectedUser,
  activeTab,
  setActiveTab,
  handleUserSelect,
  currentPage,
  setCurrentPage,
  totalPages,
  indexOfFirstUser,
  indexOfLastUser,
  filteredUsers
}) => {
  return (
    <div className={styles.userListSection}>
      <div className={styles.header}>
        <h2>Users</h2>
        <div className={styles.actions}>
          
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
        {users.map(user => (
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
  );
};

export default UserListSection;