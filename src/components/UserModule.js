import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/UserModule.module.css';
import { User, Utensils, ChevronRight, LogOut } from 'lucide-react';
import ProfileView from './User/ProfileView';
import ProfileWithMealPlan from './MealPlan/ProfileWithMealPlan';
import { getUserFormData, generateMealPlan } from '../api/auth'; // Ensure this function exists in your API

const UserModule = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [profileData, setProfileData] = useState(null);
    const [mealPlan, setMealPlan] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getUserFormData(userId);
                if (response && response.data) {
                    setProfileData(response.data);
                } else {
                    throw new Error('No profile data received.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleGeneratePlan = async () => {
        try {
            if (!profileData) {
                console.error("Profile data is required to generate a meal plan.");
                return;
            }
            const response = await generateMealPlan(userId); // API call to generate meal plan
            setMealPlan(response.data);
            setCurrentStep(2); // Move to Meal Plan Step
        } catch (error) {
            console.error("Error generating meal plan:", error);
        }
    };

    const handleNavItemClick = (step) => {
        setCurrentStep(step);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user_id');
        navigate('/');
    };

    return (
        <div className={styles.userContainer}>
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <h2 className={styles.appLogo}>NutriSync</h2>
                </div>
                <div className={styles.navSection}>
                    <ul className={styles.navList}>
                        <li className={`${styles.navItem} ${currentStep === 1 ? styles.activeNavItem : ''}`} onClick={() => handleNavItemClick(1)}>
                            <User size={18} className={styles.navIcon} />
                            <span className={styles.navText}>My Profile</span>
                            <ChevronRight size={16} className={styles.navArrow} />
                        </li>
                        <li className={`${styles.navItem} ${currentStep === 2 ? styles.activeNavItem : ''}`} onClick={() => handleNavItemClick(2)}>
                            <Utensils size={18} className={styles.navIcon} />
                            <span className={styles.navText}>Meal Plan</span>
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

            <div className={styles.mainContent}>
                {loadingProfile ? (
                    <div className={styles.profileLoading}>
                        <div className={`${styles.shimmer} ${styles.profileHeaderShimmer}`}></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles.profileFieldShimmer}>
                                <div className={`${styles.shimmer} ${styles.labelShimmer}`}></div>
                                <div className={`${styles.shimmer} ${styles.valueShimmer}`}></div>
                            </div>
                        ))}
                    </div>) : (
                    <>
                        {currentStep === 1 && (
                            <ProfileView
                                profileData={profileData}
                                setProfileData={setProfileData}
                                onGeneratePlan={() => setCurrentStep(2)}  // Pass function to button
                            />
                        )}
                        {currentStep === 2 && (
                            <ProfileWithMealPlan
                                profileData={profileData}
                                mealPlan={mealPlan}
                                setMealPlan={setMealPlan}
                                onBack={() => setCurrentStep(1)}
                                currentStep={currentStep}


                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserModule;
