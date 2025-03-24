import React, { useEffect, useState } from 'react';
import styles from '../../assets/styles/AdminRecipes.module.css';
import { fetchAllRecipesAdmin } from '../../api/auth';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await fetchAllRecipesAdmin();
        if (fetchedRecipes.error) {
          setError(fetchedRecipes.error);
        } else {
          setRecipes(fetchedRecipes);
        }
      } catch (error) {
        setError('An error occurred while fetching the recipes.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.recipeListContainer}>
        {/* Header Section */}
        <div className={styles.recipeListHeader}>
          <div className={styles.headerDishName}>Dish Name</div>
          <div className={styles.headerCuisine}>Cuisine</div>
          <div className={styles.headerMealCategory}>Meal Category</div>
          <div className={styles.headerDescription}>Description</div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            Loading...
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}

        {/* Recipe Cards */}
        {recipes.length === 0 && !loading && !error ? (
          <div className={styles.noRecipes}>No recipes available</div>
        ) : (
          recipes.map((recipe, index) => (
            <div key={index} className={styles.recipeCard}>
              <div className={styles.recipeName}>{recipe.dish_name}</div>
              <div className={styles.recipeCuisine}>{recipe.cuisine}</div>
              <div className={styles.recipeMealCategory}>{recipe.meal_category}</div>
              <div className={styles.recipeDescription}>{recipe.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRecipes;