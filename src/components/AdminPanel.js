import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/AdminPanel.module.css';
import UserList from './Admin/UserList';
import AdminRecipes from './Admin/AdminRecipes';
import { Users, BookOpen, ChevronRight, Menu, X, LogOut, Save } from 'lucide-react';
import { saveRecipesToPinecone } from '../api/auth';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
        setSearchQuery('');  // Reset search when switching steps
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSaveToPinecone = async () => {
        try {
            // Call the saveToPinecone function from auth.js
            const result = await saveRecipesToPinecone();
            
            // Check if the response contains an error (matches your Flask endpoint)
            if (result.error) {
              throw new Error(result.error);
            }
            
            // Success case - show the message from your Flask endpoint
            alert(result.message || 'Recipes successfully saved to Pinecone!');
          } catch (error) {
            console.error('Pinecone save error:', error);
            
            // Show specific error messages from the endpoint or generic message
            alert(error.message || 'Failed to save recipes to Pinecone. Please try again.');
          } 
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user_id');        
        navigate('/');
    };

    return (
        <div className={styles.adminContainer}>
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
                    {/* New Save to Pinecone button */}
                    <li 
                            className={styles.navItem}
                            onClick={handleSaveToPinecone}
                        >
                            <Save size={18} className={styles.navIcon} />
                            <span className={styles.navText}>Save to Pinecone</span>
                            <ChevronRight size={16} className={styles.navArrow} />
                        </li>
                    </ul>
                </div>

                {/* Logout Button */}
                <div className={styles.logoutSection}>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        <LogOut size={18} className={styles.navIcon} />
                        <span className={styles.navText}>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
                <div className={styles.topBar}>
                    <button className={styles.menuToggle} onClick={toggleSidebar}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                    <div className={styles.searchContainer}>
                        <input 
                            type="text" 
                            placeholder={currentStep === 1 ? "Search users..." : "Search recipes..."} 
                            className={styles.searchInput} 
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className={styles.userMenu}>
                        <span className={styles.userAvatar}>A</span>
                    </div>
                </div>
                
                {currentStep === 1 && <UserList searchQuery={searchQuery} />}
                {currentStep === 2 && <AdminRecipes searchQuery={searchQuery} />}
            </div>
        </div>
    );
};

export default AdminPanel;