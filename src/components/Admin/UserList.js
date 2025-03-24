// src/components/Admin/UserList.js
import React, { useEffect, useState } from 'react';
import { fetchAllUsers } from '../../api/auth';
import styles from '../../assets/styles/UserList.module.css';
import { deleteUser } from '../../api/auth';

const UserList = ({ onUserSelect }) => {
    const [users, setUsers] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    // Fetch users on component mount
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

    const UserListHeader = () => {
        return (
            <div className={styles.userListHeader}>
                <div className={styles.headerName}>Name</div>
                <div className={styles.headerEmail}>Email</div>
                <div className={styles.headerRole}>Role</div>
                <div className={styles.headerAction}>Action</div>
            </div>
        );
    };

    const toggleUserDetails = (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
        } else {
            setExpandedUser(userId);
            if (onUserSelect) onUserSelect(userId);
        }
    };

    const handleDeleteClick = (userId, e) => {
        e.stopPropagation();
        setDeleteConfirmation(userId);
    };

    const confirmDelete = async (userId, e) => {
        e.stopPropagation();
        try {
            const result = await deleteUser(userId);

            if (result.message) {
                setUsers(users.filter(user => user._id !== userId));
                setDeleteConfirmation(null);

                if (expandedUser === userId) {
                    setExpandedUser(null);
                }
            } else {
                console.error("Error:", result.error);
            }
        } catch (error) {
            console.error("Request failed", error);
        }
        setUsers(users.filter(user => user._id !== userId));
        setDeleteConfirmation(null);

        // If the deleted user was expanded, collapse it
        if (expandedUser === userId) {
            setExpandedUser(null);
        }
    };

    const cancelDelete = (e) => {
        e.stopPropagation();
        setDeleteConfirmation(null);
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.userListContainer}>

                {/* Add the header row */}
                {/* <UserListHeader /> */}

                {users.map((user) => (
                    <div key={user._id} className={styles.userCard}>
                        <div className={styles.userCardHeader} onClick={() => toggleUserDetails(user._id)}>
                            <div className={styles.userInfo}>
                                <div className={styles.userAvatar}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                    </svg>
                                </div>
                                <div className={styles.userMainInfo}>
                                    <div className={styles.userName}>{user.firstName} {user.lastName}</div>
                                    <div className={styles.userEmail}>{user.email}</div>
                                </div>
                            </div>
                            <div className={styles.userActions}>
                                <div className={styles.userRole}>
                                    <span className={styles.roleTag}>{user.role || "User"}</span>
                                </div>

                                {deleteConfirmation === user._id ? (
                                    <div className={styles.deleteConfirmation} onClick={(e) => e.stopPropagation()}>
                                        <span>Delete user?</span>
                                        <button
                                            className={`${styles.confirmButton} ${styles.confirmYes}`}
                                            onClick={(e) => confirmDelete(user._id, e)}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            className={`${styles.confirmButton} ${styles.confirmNo}`}
                                            onClick={cancelDelete}
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.actionButtons}>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={(e) => handleDeleteClick(user._id, e)}
                                            aria-label="Delete user"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                            </svg>
                                        </button>
                                        <button
                                            className={styles.viewDetailsButton}
                                            aria-label={expandedUser === user._id ? "Hide details" : "View details"}
                                        >
                                            {expandedUser === user._id ? "Hide Details" : "View Details"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {expandedUser === user._id && (
                            <div className={styles.userDetails}>
                                <div className={styles.detailsGrid}>
                                    {/* <div className={styles.detailsSection}>
                                        <h3>Personal Information</h3>
                                        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p><strong>Role:</strong> {user.role}</p>
                                        <p><strong>City:</strong> {user.city}</p>
                                        <p><strong>Country:</strong> {user.country}</p>
                                    </div> */}

                                    <div className={styles.detailsSection}>
                                        <h3>Meal Preferences</h3>
                                        <p><strong>Preferred Dishes:</strong> {user.user_pref?.join(', ') || 'None specified'}</p>
                                        <p><strong>Preferred Cuisines:</strong> {user.user_likes?.join(', ') || 'None specified'}</p>
                                    </div>

                                    <div className={styles.detailsSection}>
                                        <h3>Meal Type Selection</h3>
                                        <p><strong>Size:</strong> {user.size || 'Not specified'}</p>
                                        <p><strong>Protein Option:</strong> {user.protein_option || 'Not specified'}</p>
                                        <p><strong>Protein Category:</strong> {user.protein_category || 'Not specified'}</p>
                                        <p><strong>Meal Types:</strong> {user.meal_types?.join(', ') || 'None specified'}</p>
                                    </div>

                                    <div className={styles.detailsSection}>
                                        <h3>Restrictions</h3>
                                        <p><strong>Allergens:</strong> {user.allergenTags?.join(', ') || 'None specified'}</p>
                                        <p><strong>Dislikes:</strong> {user.dislikeTags?.join(', ') || 'None specified'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;