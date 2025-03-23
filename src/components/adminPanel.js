// src/components/AdminPanel.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/AdminPanel.module.css';
import { getUserFormData } from '../api/auth';
import UserList from './Admin/UserList';

const AdminPanel = () => {
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
    }, [navigate]);

    // Handle user selection
    const handleUserSelect = async (userId) => {
        try {
            const data = await getUserFormData(userId);
            setSelectedUser(data);
            setFormData(data); // Set form data for editing
            // setCurrentStep(2); // Move to Step 2
        } catch (error) {
            console.error('Error fetching user form data:', error);
        }
    };

    // Handle step click
    const handleStepClick = (step) => {
        setCurrentStep(step);
    };

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <div className={styles.stepperSidebar}>
                <div className={styles.sidebarHeader}>
                    <h1>Admin Panel</h1>
                    <p>Manage user data and preferences</p>
                </div>
                <div className={styles.stepsContainer}>
                    <div className={`${styles.stepItem} ${currentStep === 1 ? styles.active : ''}`} onClick={() => handleStepClick(1)}>
                        <div className={styles.stepCircle}>1</div>
                        <div className={styles.stepText}>
                            <h2>User List</h2>
                        </div>
                    </div>
                    <div className={`${styles.stepItem} ${currentStep === 2 ? styles.active : ''}`} onClick={() => handleStepClick(2)}>
                        <div className={styles.stepCircle}>2</div>
                        <div className={styles.stepText}>
                            <h2>User Form</h2>
                        </div>
                    </div>
                    <div className={`${styles.stepItem} ${currentStep === 3 ? styles.active : ''}`} onClick={() => handleStepClick(3)}>
                        <div className={styles.stepCircle}>3</div>
                        <div className={styles.stepText}>
                            <h2>Save</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.adminMainContent}>
                {currentStep === 1 && <UserList onUserSelect={handleUserSelect} />}
                {currentStep === 2 && (
                    <div>
                        <h1>Edit User</h1>
                        {/* Add form fields for editing user data */}
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                        <h1>Save Changes</h1>
                        {/* Add save confirmation or additional steps */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;