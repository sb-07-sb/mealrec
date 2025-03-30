import React, { useEffect, useState } from 'react';
import styles from '../../assets/styles/AdminRecipes.module.css';
import { fetchAllRecipesAdmin } from '../../api/auth';
import { ChevronRight } from 'lucide-react';

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: '',
    category: ''
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = await fetchAllRecipesAdmin();
        setRecipes(fetchedRecipes);
        setFilteredRecipes(fetchedRecipes);
      } catch (error) {
        setError('Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    let result = recipes;
    if (filters.cuisine) {
      result = result.filter(recipe => 
        recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())
      );
    }
    if (filters.category) {
      result = result.filter(recipe => 
        recipe.meal_category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    setFilteredRecipes(result);
  }, [filters, recipes]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const uniqueValues = (key) => {
    return [...new Set(recipes.map(recipe => recipe[key]))].filter(Boolean);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recipes</h2>
        <div className={styles.filterContainer}>
          <button 
            className={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filter <ChevronRight size={16} className={`${styles.filterIcon} ${showFilters ? styles.rotated : ''}`} />
          </button>
          
          {showFilters && (
            <div className={styles.filterDropdown}>
              <div className={styles.filterGroup}>
                <label>Cuisine</label>
                <select
                  name="cuisine"
                  value={filters.cuisine}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">All Cuisines</option>
                  {uniqueValues('cuisine').map((cuisine, i) => (
                    <option key={i} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className={styles.filterSelect}
                >
                  <option value="">All Categories</option>
                  {uniqueValues('meal_category').map((category, i) => (
                    <option key={i} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.gridContainer}>
        {/* Header Row */}
        <div className={`${styles.gridRow} ${styles.headerRow}`}>
          <div className={styles.colDish}>Dish Name</div>
          <div className={styles.colCuisine}>Cuisine</div>
          <div className={styles.colCategory}>Category</div>
          <div className={styles.colDesc}>Description</div>
        </div>

        {/* Content Area with Scroll */}
        <div className={styles.gridContent}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              Loading recipes...
            </div>
          ) : error ? (
            <div className={styles.errorState}>{error}</div>
          ) : filteredRecipes.length === 0 ? (
            <div className={styles.emptyState}>
              {recipes.length === 0 ? 'No recipes found' : 'No recipes match your filters'}
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <div key={recipe._id} className={styles.gridRow}>
                <div className={styles.colDish}>
                  <span className={styles.dishName}>{recipe.dish_name}</span>
                </div>
                <div className={styles.colCuisine}>
                  <span className={styles.cuisine}>{recipe.cuisine}</span>
                </div>
                <div className={styles.colCategory}>
                  <span className={styles.category}>{recipe.meal_category}</span>
                </div>
                <div className={styles.colDesc}>
                  <p className={styles.description}>
                    {recipe.description || 'No description'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRecipes;