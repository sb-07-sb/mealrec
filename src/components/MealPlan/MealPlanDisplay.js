import React from 'react';
import styles from '../../assets/styles/MealPlanDisplay.module.css';

const WEEKDAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealPlanDisplay = ({ mealPlan, onBack, onGenerate }) => {
    if (!mealPlan) {
        return (
            <div className={styles.emptyState}>
                <p>No meal plan generated yet.</p>
                <button className={styles.primaryButton} onClick={onGenerate}>
                    Generate Meal Plan
                </button>
                <button className={styles.secondaryButton} onClick={onBack}>
                    Back to Profile
                </button>
            </div>
        );
    }

    // Convert meal plan to array and sort by weekday order
    const mealPlanDays = typeof mealPlan === 'object' && mealPlan !== null 
        ? Object.entries(mealPlan)
              .map(([day, meals]) => ({ day, meals }))
              .sort((a, b) => WEEKDAY_ORDER.indexOf(a.day) - WEEKDAY_ORDER.indexOf(b.day))
        : [];

    const parseMealDescription = (description) => {
        if (!description) return {};
        
        // Try to split the description into parts
        const parts = description.split(' - ');
        return {
            dishName: parts[0] || 'Not specified',
            proteinOption: parts[1] || 'Not specified',
            cuisine: parts[2] || 'Not specified',
            mealType: parts[3] || 'Not specified'
        };
    };

    return (
        <div className={styles.mealPlanOuterContainer}>
            <div className={styles.mealPlanHeader}>
                <h2>Personalized Meal Plan</h2>
                <div className={styles.mealPlanActions}>
                    <button className={styles.secondaryButton} onClick={onBack}>
                        Back to Profile
                    </button>
                    <button className={styles.primaryButton} onClick={onGenerate}>
                        Regenerate
                    </button>
                </div>
            </div>

            <div className={styles.scrollableContent}>
                {mealPlanDays.length > 0 ? (
                    <div className={styles.mealPlanGrid}>
                        {mealPlanDays.map(({ day, meals }) => (
                            <div key={day} className={styles.dayCard}>
                                <h3 className={styles.dayTitle}>{day}</h3>
                                <div className={styles.mealsList}>
                                    {meals && typeof meals === 'object' && Object.entries(meals).map(([mealType, mealDescription]) => {
                                        const mealDetails = parseMealDescription(mealDescription);
                                        return (
                                            <div key={mealType} className={styles.mealItem}>
                                                <div className={styles.mealType}>{mealType.replace('_', ' ')}</div>
                                                <div className={styles.mealDetails}>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>Dish Name</span>
                                                        <span className={styles.detailValue}>{mealDetails.dishName}</span>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>Protein Option</span>
                                                        <span className={styles.detailValue}>{mealDetails.proteinOption}</span>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>Cuisine</span>
                                                        <span className={styles.detailValue}>{mealDetails.cuisine}</span>
                                                    </div>
                                                    <div className={styles.detailItem}>
                                                        <span className={styles.detailLabel}>Dish Type</span>
                                                        <span className={styles.detailValue}>{mealDetails.mealType}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p>No meal plan data available.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MealPlanDisplay;