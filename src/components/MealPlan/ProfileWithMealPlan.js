import React, { useState, useEffect } from 'react';
import MealPlanDisplay from './MealPlanDisplay';
import { generateMealPlan, getMealPlan } from '../../api/auth';
import styles from '../../assets/styles/MealPlanDisplay.module.css';

const ProfileWithMealPlan = ({ profileData, mealPlan, setMealPlan, onBack, currentStep }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('user_id');

    // Function to load existing meal plan
    const fetchMealPlan = async () => {
        if (!userId || mealPlan) return; // ✅ Prevent unnecessary calls

        try {
            setLoading(true);
            const response = await getMealPlan(userId);
            console.log("Fetched meal plan response:", response);

            if (response?.mealPlan && JSON.stringify(response.mealPlan) !== JSON.stringify(mealPlan)) {
                setMealPlan(response.mealPlan); // ✅ Only update if different
            }
        } catch (err) {
            console.error("Error fetching meal plan:", err);
        } finally {
            setLoading(false);
        }
    };

    //  Call fetchMealPlan only ONCE when component mounts
    useEffect(() => {
        fetchMealPlan();
    }, [profileData]);






    const saveMealPlanToDB = async (mealPlanData, matchedRecipes) => {
        try {
            const response = await fetch("http://localhost:5000/save_meal_plan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userId, // Include user ID
                    mealPlan: mealPlanData,
                    recipes: matchedRecipes
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Failed to save meal plan.");
            }

            console.log("Meal Plan saved successfully:", result.meal_plan_id);
        } catch (err) {
            console.error("Error saving meal plan:", err.message);
        }
    };



    const generatePlan = async () => {
        if (!profileData) {
            setError("Profile data is required to generate a meal plan.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const requestBody = {
                user_pref: profileData.user_pref?.join(", ") || "",
                user_likes: profileData.user_likes?.join(", ") || "",
                size: profileData.size || "large",
                protein_category: profileData.protein_category || "balance",
                meal_types: profileData.meal_types || ["dinner", "lunch", "evening_snack"],
                user_avoid_ingredients: profileData.allergenTags || [],
                user_dislikes: profileData.dislikeTags || [],
                query: `Spice Level: ${profileData.spice_level || "Medium"}, Cuisine: ${profileData.user_pref?.[0] || ""}, Popular Dishes: ${profileData.user_likes?.[0] || ""}`,
                num_days: 7
            };

            const response = await generateMealPlan(requestBody);
            setMealPlan(response.meal_plan); // 🔹 Store meal plan in state


            // Save the meal plan to MongoDB along with user_id
            await saveMealPlanToDB(response.meal_plan, response.matched_recipes);

        } catch (err) {
            setError(err.message || "Failed to generate meal plan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-with-meal-plan">
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={onBack}>Back to Profile</button>
                </div>
            )}

            {loading ? (
                <div className={styles.mealPlanOuterContainer}>
                    <div className={styles.mealPlanHeader}>
                        <h2>Personalized Meal Plan</h2>
                        <div className={styles.mealPlanActions}>
                            <button className={styles.secondaryButton}>Back</button>
                            <button className={styles.primaryButton}>Regenerate</button>
                        </div>
                    </div>
                    <div className={styles.scrollableContent}>
                        <div className={styles.mealPlanGrid}>
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className={styles.dayCard}>
                                    <div className={`${styles.shimmer} ${styles.dayTitleShimmer}`}></div>
                                    <div className={styles.mealsList}>
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className={styles.mealItem}>
                                                <div className={`${styles.shimmer} ${styles.mealTypeShimmer}`}></div>
                                                <div className={styles.mealDetails}>
                                                    {[...Array(4)].map((_, k) => (
                                                        <div key={k} className={styles.detailItem}>
                                                            <div className={`${styles.shimmer} ${styles.detailShimmer}`}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : mealPlan ? (
                <MealPlanDisplay mealPlan={mealPlan} onBack={onBack} onGenerate={generatePlan} />
            ) : (
                <div className={styles.mealPlanOuterContainer}>
                    <div className={styles.mealPlanHeader}>
                        <h2>Generate Meal Plan</h2>
                        <div className={styles.mealPlanActions}>
                            <button
                                className={styles.secondaryButton}
                                onClick={onBack}  // Added onClick handler
                            >Back to Profile</button>
                            <button
                                className={styles.primaryButton}
                                onClick={generatePlan}  // Added onClick handler
                            >Generate Plan</button>
                        </div>
                    </div>
                    <div className={styles.scrollableContent}>
                        <div className={styles.mealPlanGrid}>
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className={styles.dayCard}>
                                    <div className={`${styles.shimmer} ${styles.dayTitleShimmer}`}></div>
                                    <div className={styles.mealsList}>
                                        {[...Array(3)].map((_, j) => (
                                            <div key={j} className={styles.mealItem}>
                                                <div className={`${styles.shimmer} ${styles.mealTypeShimmer}`}></div>
                                                <div className={styles.mealDetails}>
                                                    {[...Array(4)].map((_, k) => (
                                                        <div key={k} className={styles.detailItem}>
                                                            <div className={`${styles.shimmer} ${styles.detailShimmer}`}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileWithMealPlan;
