import React, { useEffect, useState } from 'react';
import { fetchAllUsers, deleteUser } from '../../api/auth';
import styles from '../../assets/styles/UserList.module.css';
import { 
    Trash2, 
    UserCircle, 
    BookUser, 
    Settings, 
    AlertTriangle 
} from 'lucide-react';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [expandedUser, setExpandedUser] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

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

    const toggleUserDetails = (userId) => {
        setExpandedUser(expandedUser === userId ? null : userId);
    };

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers(users.filter(user => user._id !== userId));
            if (expandedUser === userId) setExpandedUser(null);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const renderUserAvatar = (user, size = 'medium') => {
        const avatarClasses = {
            medium: styles.userAvatar,
            large: styles.userAvatarLarge
        };

        return (
            <div className={avatarClasses[size]}>
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
        );
    };

    const renderTabIcon = (tab) => {
        const iconMap = {
            'profile': <UserCircle size={18} />,
            'preferences': <BookUser size={18} />,
            'restrictions': <AlertTriangle size={18} />
        };
        return iconMap[tab];
    };

    return (
        <div className={styles.adminPanel}>
            {/* User List Section */}
            <div className={styles.userListSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>User Management</h2>
                    <div className={styles.sectionStats}>
                        <span>Total Users: {users.length}</span>
                    </div>
                </div>
                <div className={styles.userListContainer}>
                    <div className={styles.userListHeader}>
                        <div className={styles.headerName}>User</div>
                        <div className={styles.headerRole}>Role</div>
                        <div className={styles.headerActions}>Actions</div>
                    </div>
                    <div className={styles.userListScrollable}>
                        {users.map(user => (
                            <div key={user._id} className={styles.userCard}>
                                <div 
                                    className={`${styles.userCardContent} ${expandedUser === user._id ? styles.activeCard : ''}`} 
                                    onClick={() => toggleUserDetails(user._id)}
                                >
                                    <div className={styles.userMainInfo}>
                                        {renderUserAvatar(user)}
                                        <div className={styles.userTextInfo}>
                                            <span className={styles.userName}>
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span className={styles.userEmail}>{user.email}</span>
                                        </div>
                                    </div>
                                    <div className={styles.userRole}>{user.role}</div>
                                    <div className={styles.userActions}>
                                        {deleteConfirmation === user._id ? (
                                            <div className={styles.deleteConfirmation}>
                                                <button 
                                                    className={styles.confirmButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(user._id);
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                                <button 
                                                    className={styles.cancelButton}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteConfirmation(null);
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                className={styles.deleteButton}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDeleteConfirmation(user._id);
                                                }}
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Details Section */}
            {expandedUser && (
                <div className={styles.userDetailsSection}>
                    {users.filter(user => user._id === expandedUser).map(user => (
                        <div key={user._id}>
                            <div className={styles.userDetailsHeader}>
                                {renderUserAvatar(user, 'large')}
                                <div>
                                    <h3 className={styles.userName}>{user.firstName} {user.lastName}</h3>
                                    <p className={styles.userEmail}>{user.email}</p>
                                </div>
                            </div>

                            <div className={styles.tabs}>
                                {['profile', 'preferences', 'restrictions'].map(tab => (
                                    <button 
                                        key={tab}
                                        className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {renderTabIcon(tab)}
                                        <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                                    </button>
                                ))}
                            </div>

                            <div className={styles.tabContent}>
                                {activeTab === 'profile' && (
                                    <div className={styles.detailsCard}>
                                        <h4>Personal Information</h4>
                                        <div className={styles.detailRow}>
                                            <span>Name:</span>
                                            <span>{user.firstName} {user.lastName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Email:</span>
                                            <span>{user.email}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Role:</span>
                                            <span>{user.role}</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'preferences' && (
                                    <div className={styles.detailsCard}>
                                        <h4>Meal Preferences</h4>
                                        <div className={styles.detailRow}>
                                            <span>Preferred Dishes:</span>
                                            <div className={styles.tags}>
                                                {user.user_pref?.length ? (
                                                    user.user_pref.map((pref, i) => (
                                                        <span key={i} className={styles.tag}>{pref}</span>
                                                    ))
                                                ) : <span className={styles.mutedText}>None specified</span>}
                                            </div>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Preferred Cuisines:</span>
                                            <div className={styles.tags}>
                                                {user.user_likes?.length ? (
                                                    user.user_likes.map((like, i) => (
                                                        <span key={i} className={styles.tag}>{like}</span>
                                                    ))
                                                ) : <span className={styles.mutedText}>None specified</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'restrictions' && (
                                    <div className={styles.detailsCard}>
                                        <h4>Dietary Restrictions</h4>
                                        <div className={styles.detailRow}>
                                            <span>Allergens:</span>
                                            <div className={styles.tags}>
                                                {user.allergenTags?.length ? (
                                                    user.allergenTags.map((allergen, i) => (
                                                        <span key={i} className={`${styles.tag} ${styles.warningTag}`}>{allergen}</span>
                                                    ))
                                                ) : <span className={styles.mutedText}>None specified</span>}
                                            </div>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span>Dislikes:</span>
                                            <div className={styles.tags}>
                                                {user.dislikeTags?.length ? (
                                                    user.dislikeTags.map((dislike, i) => (
                                                        <span key={i} className={`${styles.tag} ${styles.secondaryTag}`}>{dislike}</span>
                                                    ))
                                                ) : <span className={styles.mutedText}>None specified</span>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList;