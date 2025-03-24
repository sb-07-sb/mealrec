// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from '../assets/styles/AdminPanel.module.css';
// import { fetchAllUsers, getUserFormData } from '../api/auth';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/AdminPanel.module.css';
import UserList from './Admin/UserList'; // Import the UserList component
import AdminRecipes from './Admin/AdminRecipes';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 1: User List, 2: Step 2, 3: Step 3

    // Check if the user is an admin
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
        navigate('/'); // Redirect non-admin users
    }

    // Handle step navigation
    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className={styles.adminContainer}>
            {/* Stepper Sidebar */}
            <div className={styles.stepperSidebar}>
                <div className={styles.sidebarHeader}>
                    <h1>Admin Panel</h1>
                    <p>Manage users and their details</p>
                </div>
                <div className={styles.stepsContainer}>
                    <div className={`${styles.stepItem} ${currentStep === 1 ? styles.active : ''}`} onClick={() => setCurrentStep(1)}>
                        <div className={styles.stepCircle}>1</div>
                        <div className={styles.stepText}>
                            <h2>User List</h2>
                        </div>
                    </div>
                    <div className={`${styles.stepItem} ${currentStep === 2 ? styles.active : ''}`} onClick={() => setCurrentStep(2)}>
                        <div className={styles.stepCircle}>2</div>
                        <div className={styles.stepText}>
                            <h2>Recipes List</h2>
                        </div>
                    </div>
                    <div className={`${styles.stepItem} ${currentStep === 3 ? styles.active : ''}`} onClick={() => setCurrentStep(3)}>
                        <div className={styles.stepCircle}>3</div>
                        <div className={styles.stepText}>
                            <h2>Step 3</h2>
                        </div>
                    </div>
                </div>
            </div>

             {/* Main Content */}
             <div className={styles.adminMainContent}>
                {currentStep === 1 && (
                    <UserList
                        onUserSelect={(userId) => {
                            console.log('Selected User ID:', userId);
                        }}
                    />
                )}
                {currentStep === 2 && <AdminRecipes />}
            </div>
        </div>
          
    );
};

export default AdminPanel;