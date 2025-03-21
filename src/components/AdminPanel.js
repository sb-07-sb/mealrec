import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/AdminPanel.module.css';
import { fetchAllUsers, getUserFormData } from '../api/auth';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 1: User List, 2: User Form, 3: Save
    const [selectedUser, setSelectedUser] = useState(null); // Selected user data
    const [formData, setFormData] = useState({}); // Editable form data
    const [errors, setErrors] = useState({}); // Form validation errors


    // Check if the user is an admin
    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin') {
            navigate('/'); // Redirect non-admin users
        }

        const fetchUsers = async () => {
            try {
                const data = await fetchAllUsers(); // Use the API function
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [navigate]);

    // Handle user selection
    const handleUserSelect = async (userId) => {
        try {
            const data = await getUserFormData(userId);
            setSelectedUser(data);
            setFormData(data); // Set form data for editing
            setCurrentStep(2); // Move to Step 2
        } catch (error) {
            console.error('Error fetching user form data:', error);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '', // Clear error for the field being edited
        });
    };

    // // Handle form submission
    // const handleSubmit = async () => {
    //     try {
    //         const response = await saveUserFormData(selectedUser._id, formData);
    //         alert(response.message); // Show success message
    //         setCurrentStep(3); // Move to Step 3
    //     } catch (error) {
    //         console.error('Error saving user form data:', error);
    //     }
    // };
    return (
        <div className={styles.adminContainer}>
            <h1 className={styles.adminHeader}>Admin Panel</h1>
            <div className={styles.userList}>
                {users.map((user) => (
                    <div key={user._id} className={styles.userCard}>
                        <h2 className={styles.userEmail}>{user.email}</h2>
                        <div className={styles.userDetails}>
                            <h3>Personal Information</h3>
                            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                            <p><strong>Phone:</strong> {user.phoneNumber}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>City:</strong> {user.city}</p>
                            <p><strong>Country:</strong> {user.country}</p>

                            <h3>Meal Preferences</h3>
                            <p><strong>Preferred Dishes:</strong> {user.user_pref.join(', ')}</p>
                            <p><strong>Preferred Cuisines:</strong> {user.user_likes.join(', ')}</p>

                            <h3>Meal Type Selection</h3>
                            <p><strong>Size:</strong> {user.size}</p>
                            <p><strong>Protein Option:</strong> {user.protein_option}</p>
                            <p><strong>Protein Category:</strong> {user.protein_category}</p>
                            <p><strong>Meal Types:</strong> {user.meal_types.join(', ')}</p>

                            <h3>Restrictions</h3>
                            <p><strong>Allergens:</strong> {user.allergenTags.join(', ')}</p>
                            <p><strong>Dislikes:</strong> {user.dislikeTags.join(', ')}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
// return (
//     <div className={styles.stepperContainer}>
//         <div className={styles.stepperContent}>
//             {/* Sidebar */}
//             <div className={styles.stepperSidebar}>
//                 <div className={styles.sidebarHeader}>
//                     <h1>Step {currentStep}</h1>
//                     <p>
//                         {currentStep === 1 && 'Select a user to edit their data.'}
//                         {currentStep === 2 && 'Edit the user\'s information.'}
//                         {currentStep === 3 && 'User data saved successfully.'}
//                     </p>
//                 </div>
//                 <div className={styles.stepsContainer}>
//                     <div className={`${styles.stepItem} ${currentStep === 1 ? styles.active : ''}`}>
//                         <div className={styles.stepCircle}>1</div>
//                         <div className={styles.stepText}>
//                             <h2>Select User</h2>
//                         </div>
//                     </div>
//                     <div className={`${styles.stepItem} ${currentStep === 2 ? styles.active : ''}`}>
//                         <div className={styles.stepCircle}>2</div>
//                         <div className={styles.stepText}>
//                             <h2>Edit User</h2>
//                         </div>
//                     </div>
//                     <div className={`${styles.stepItem} ${currentStep === 3 ? styles.active : ''}`}>
//                         <div className={styles.stepCircle}>3</div>
//                         <div className={styles.stepText}>
//                             <h2>Save</h2>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Form Section */}
//             <div className={styles.stepperForm}>
//                 {currentStep === 1 && (
//                     <div className={styles.formContainer}>
//                         <h2>User List</h2>
//                         <ul className={styles.userList}>
//                             {users.map((user) => (
//                                 <li key={user._id} onClick={() => handleUserSelect(user._id)}>
//                                     {user.email}
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 {currentStep === 2 && (
//                     <div className={styles.formContainer}>
//                         <h2>Edit User</h2>
//                         <form>
//                             <div className={styles.formGroup}>
//                                 <label>First Name</label>
//                                 <input
//                                     type="text"
//                                     name="firstName"
//                                     value={formData.firstName || ''}
//                                     onChange={handleInputChange}
//                                 />
//                                 {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Last Name</label>
//                                 <input
//                                     type="text"
//                                     name="lastName"
//                                     value={formData.lastName || ''}
//                                     onChange={handleInputChange}
//                                 />
//                                 {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Email</label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     value={formData.email || ''}
//                                     onChange={handleInputChange}
//                                 />
//                                 {errors.email && <span className={styles.error}>{errors.email}</span>}
//                             </div>
//                             <div className={styles.formGroup}>
//                                 <label>Phone Number</label>
//                                 <input
//                                     type="text"
//                                     name="phoneNumber"
//                                     value={formData.phoneNumber || ''}
//                                     onChange={handleInputChange}
//                                 />
//                                 {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
//                             </div>
//                             <div className={styles.formActions}>
//                                 <button
//                                     type="button"
//                                     className={styles.btnBack}
//                                     onClick={() => setCurrentStep(1)}
//                                 >
//                                     Back
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className={styles.btnNext}
//                                     // onClick={handleSubmit}
//                                 >
//                                     Save
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 )}

//                 {currentStep === 3 && (
//                     <div className={styles.formContainer}>
//                         <h2>Success!</h2>
//                         <p>The user's data has been saved successfully.</p>
//                         <button
//                             type="button"
//                             className={styles.btnNext}
//                             onClick={() => setCurrentStep(1)}
//                         >
//                             Return to User List
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     </div>
// );
// };

export default AdminPanel;