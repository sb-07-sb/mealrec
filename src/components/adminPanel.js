import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/AdminPanel.module.css';
import UserList from './Admin/UserList';
import AdminRecipes from './Admin/AdminRecipes';
import { Users, BookOpen, ChevronRight, Menu, X } from 'lucide-react';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Check if the user is an admin
    const userRole = localStorage.getItem('role');
    if (userRole !== 'admin') {
        navigate('/');
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavItemClick = (step) => {
        setCurrentStep(step);
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar Navigation */}
            <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.appLogo}>FoodApp</h2>
                </div>
                
                <div className={styles.navSection}>
                    <ul className={styles.navList}>
                        <li 
                            className={`${styles.navItem} ${currentStep === 1 ? styles.activeNavItem : ''}`} 
                            onClick={() => handleNavItemClick(1)}
                        >
                            <Users size={18} className={styles.navIcon} />
                            <span className={styles.navText}>User Management</span>
                            <ChevronRight size={16} className={styles.navArrow} />
                        </li>
                        <li 
                            className={`${styles.navItem} ${currentStep === 2 ? styles.activeNavItem : ''}`} 
                            onClick={() => handleNavItemClick(2)}
                        >
                            <BookOpen size={18} className={styles.navIcon} />
                            <span className={styles.navText}>Recipe List</span>
                            <ChevronRight size={16} className={styles.navArrow} />
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <button className={styles.menuToggle} onClick={toggleSidebar}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className={styles.searchContainer}>
                        <input type="text" placeholder="Search..." className={styles.searchInput} />
                    </div>
                    <div className={styles.userMenu}>
                        <span className={styles.userAvatar}>A</span>
                    </div>
                </div>
                
                {currentStep === 1 && <UserList />}
                {currentStep === 2 && <AdminRecipes />}
            </div>
        </div>
    );
};

export default AdminPanel;