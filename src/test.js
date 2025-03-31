import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './assets/styles/UserModule.module.css';
import { User, Utensils, ChevronRight, Menu, X } from 'lucide-react';
import ProfileView from './components/User/ProfileView';

const UserModule = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleNavItemClick = (step) => {
        setCurrentStep(step);
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className={styles.userContainer}>
            {/* Sidebar Navigation */}
            <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.appLogo}>NutriSync</h2>
                </div>
                
                <div className={styles.navSection}>
                    <ul className={styles.navList}>
                        <li 
                            className={`${styles.navItem} ${currentStep === 1 ? styles.activeNavItem : ''}`} 
                            onClick={() => handleNavItemClick(1)}
                        >
                            <User size={18} className={styles.navIcon} />
                            <span className={styles.navText}>My Profile</span>
                            <ChevronRight size={16} className={styles.navArrow} />
                        </li>
                        <li 
                            className={`${styles.navItem} ${currentStep === 2 ? styles.activeNavItem : ''}`} 
                            onClick={() => handleNavItemClick(2)}
                        >
                            <Utensils size={18} className={styles.navIcon} />
                            <span className={styles.navText}>Meal Plan</span>
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
                        <span className={styles.userAvatar}>
                            {localStorage.getItem('firstName')?.charAt(0) || 'U'}
                        </span>
                    </div>
                </div>
                
                <div className={styles.contentContainer}>
                    {currentStep === 1 && <ProfileView />}
                </div>
            </div>
        </div>
    );
};

export default UserModule;