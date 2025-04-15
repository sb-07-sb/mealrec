import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchMealRecipes } from '../../api/auth';
import styles from '../../assets/styles/Dashboard.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

// Fixed protein categories for consistency
const PROTEIN_CATEGORIES = {
  MEAT: 'Meat',
  POULTRY: 'Poultry',
  SEAFOOD: 'Seafood',
  VEGETARIAN: 'Vegetarian',
  VEGAN: 'Vegan'
};

const NutritionDashboard = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchMealRecipes(userId);
        setRecipes(response.recipes || []);
      } catch (error) {
        console.error("Error loading recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  // Process data for charts and metrics
  const processData = () => {
    const cuisineCount = {};
    const spiceLevels = {};
    const mealCategories = {};
    const proteinCategories = {};
    const allergenCounts = {};
    const dishTypes = {};
    
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;
    let recipeCount = recipes.length;

    recipes.forEach(recipe => {
      // Cuisine distribution
      cuisineCount[recipe.cuisine] = (cuisineCount[recipe.cuisine] || 0) + 1;
      
      // Spice levels
      spiceLevels[recipe.spice_level] = (spiceLevels[recipe.spice_level] || 0) + 1;
      
      // Meal categories
      mealCategories[recipe.meal_category] = (mealCategories[recipe.meal_category] || 0) + 1;

      // Protein categories - using fixed categories
      const proteinCategory = recipe.protein_category || 'Other';
      proteinCategories[proteinCategory] = (proteinCategories[proteinCategory] || 0) + 1;
      
      // Allergens tracking
      if (recipe.allergens && Array.isArray(recipe.allergens)) {
        recipe.allergens.forEach(allergen => {
          allergenCounts[allergen] = (allergenCounts[allergen] || 0) + 1;
        });
      }

      // Dish types
      if (recipe.dish_type && Array.isArray(recipe.dish_type)) {
        recipe.dish_type.forEach(type => {
          dishTypes[type] = (dishTypes[type] || 0) + 1;
        });
      }
      
      // Nutrition values (per recipe)
      totalCalories += recipe.kcal || 0;
      totalCarbs += recipe.carb || 0;
      totalFat += recipe.fat || 0;
      totalProtein += recipe.protein || 0;
    });

    return { 
      cuisineCount, 
      spiceLevels, 
      mealCategories,
      proteinCategories,
      allergenCounts,
      dishTypes,
      averages: {
        calories: recipeCount ? totalCalories / recipeCount : 0,
        carbs: recipeCount ? totalCarbs / recipeCount : 0,
        fat: recipeCount ? totalFat / recipeCount : 0,
        protein: recipeCount ? totalProtein / recipeCount : 0
      },
      totals: {
        calories: totalCalories,
        carbs: totalCarbs,
        fat: totalFat,
        protein: totalProtein
      },
      recipeCount
    };
  };

  // Enhanced color generation for better visual distinction
  const getChartColors = (count, baseColor = '#2563eb') => {
    const colors = [];
    
    // Convert hex to RGB for manipulation
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    const rgbToHex = (r, g, b) => {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    const [r, g, b] = hexToRgb(baseColor);
    
    // Create an array of shades
    for (let i = 0; i < count; i++) {
      const shade = i / (count * 0.7); // Factor to control color variation
      
      // Adjust the RGB values for different shades
      const adjustedR = Math.min(255, r + (shade * 100));
      const adjustedG = Math.min(255, g + (shade * 100));
      const adjustedB = Math.min(255, b + (shade * 55));
      
      colors.push(rgbToHex(Math.round(adjustedR), Math.round(adjustedG), Math.round(adjustedB)));
    }
    
    // Add some alternative blue shades for variety
    if (count > 3) {
      colors.push('#1e40af'); // darker blue
      colors.push('#3b82f6'); // lighter blue
      colors.push('#1d4ed8'); // royal blue
      colors.push('#60a5fa'); // sky blue
    }
    
    return colors.slice(0, count);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.shimmerWrapper}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.shimmerItem} />
          ))}
        </div>
        <p>Loading your nutrition analytics...</p>
      </div>
    );
  }
  
  if (recipes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg viewBox="0 0 24 24" width="64" height="64" stroke="#2563eb" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <circle cx="12" cy="12" r="4"></circle>
            <line x1="3.27" y1="6.96" x2="12" y2="12"></line>
            <line x1="12" y1="12" x2="20.73" y2="6.96"></line>
            <line x1="3.27" y1="17.04" x2="12" y2="12"></line>
            <line x1="12" y1="12" x2="20.73" y2="17.04"></line>
          </svg>
        </div>
        <h3>Your Nutrition Dashboard Awaits</h3>
        <p>Add recipes to your meal plan to see personalized analytics and insights</p>
        <button className={styles.emptyStateButton}>Create Meal Plan</button>
      </div>
    );
  }

  const { 
    cuisineCount, 
    spiceLevels, 
    mealCategories,
    proteinCategories,
    allergenCounts,
    dishTypes,
    averages,
    totals,
    recipeCount
  } = processData();

  // Cuisine Distribution Chart
  const cuisineLabels = Object.keys(cuisineCount);
  const cuisineData = Object.values(cuisineCount);
  const cuisineChart = {
    labels: cuisineLabels,
    datasets: [{
      data: cuisineData,
      backgroundColor: getChartColors(cuisineLabels.length),
      borderWidth: 1,
      borderColor: '#ffffff',
    }]
  };

  // Spice Level Chart
  const spiceLabels = Object.keys(spiceLevels);
  const spiceData = Object.values(spiceLevels);
  const spiceChart = {
    labels: spiceLabels,
    datasets: [{
      data: spiceData,
      backgroundColor: getChartColors(spiceLabels.length, '#3b82f6'),
      borderWidth: 1,
      borderColor: '#ffffff',
    }]
  };

  // Meal Category Chart
  const mealLabels = Object.keys(mealCategories);
  const mealData = Object.values(mealCategories);
  const mealChart = {
    labels: mealLabels,
    datasets: [{
      data: mealData,
      backgroundColor: getChartColors(mealLabels.length, '#4f46e5'),
      borderWidth: 1,
      borderColor: '#ffffff',
    }]
  };

  // Protein Category Chart - using fixed categories
  const proteinLabels = Object.keys(proteinCategories);
  const proteinData = Object.values(proteinCategories);
  const proteinChart = {
    labels: proteinLabels,
    datasets: [{
      data: proteinData,
      backgroundColor: getChartColors(proteinLabels.length, '#1d4ed8'),
      borderWidth: 1,
      borderColor: '#ffffff',
    }]
  };

  // Enhanced chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          color: '#475569'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        titleFont: {
          size: 13,
          weight: 'bold',
          family: "'Inter', sans-serif"
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif"
        },
        cornerRadius: 6,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Calculate macro ratios for macro breakdown chart
  const totalMacros = averages.carbs + averages.fat + averages.protein;
  const macroPercentages = {
    carbs: totalMacros ? Math.round((averages.carbs / totalMacros) * 100) : 0,
    fat: totalMacros ? Math.round((averages.fat / totalMacros) * 100) : 0,
    protein: totalMacros ? Math.round((averages.protein / totalMacros) * 100) : 0
  };

  const macroChart = {
    labels: ['Carbs', 'Fat', 'Protein'],
    datasets: [{
      data: [macroPercentages.carbs, macroPercentages.fat, macroPercentages.protein],
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',  // Carbs - lighter blue
        'rgba(30, 64, 175, 0.7)',   // Fat - darker blue
        'rgba(37, 99, 235, 0.7)'    // Protein - medium blue
      ],
      borderWidth: 1,
      borderColor: '#ffffff',
    }]
  };

  // Top allergens (up to 5)
  const topAllergens = Object.entries(allergenCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h2>Nutrition & Recipe Analytics</h2>
        <div className={styles.dashboardMeta}>
          <span className={styles.recipesCount}>{recipeCount} Recipes</span>
          <span className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </header>
      
      <div className={styles.dashboardCards}>
        {/* Nutrition Summary Card */}
        <div className={styles.summaryCard}>
          <h3>Nutrition Overview</h3>
          <div className={styles.nutritionInfo}>
            <div className={styles.chartWrapper}>
              <div className={styles.chartContainer}>
                <Doughnut data={macroChart} options={chartOptions} />
              </div>
              <div className={styles.macroPercentages}>
                <div className={styles.macroLabel}>Macro Ratio</div>
                <div className={styles.macroValues}>
                  <span className={styles.macroBadge} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'rgba(59, 130, 246, 1)' }}>
                    {macroPercentages.carbs}% Carbs
                  </span>
                  <span className={styles.macroBadge} style={{ backgroundColor: 'rgba(30, 64, 175, 0.1)', color: 'rgba(30, 64, 175, 1)' }}>
                    {macroPercentages.fat}% Fat
                  </span>
                  <span className={styles.macroBadge} style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'rgba(37, 99, 235, 1)' }}>
                    {macroPercentages.protein}% Protein
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.nutritionMetrics}>
              <div className={styles.metricItem}>
                <div className={styles.metricValue}>{Math.round(averages.calories)}</div>
                <div className={styles.metricLabel}>Avg. Calories</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricValue}>{Math.round(averages.carbs)}g</div>
                <div className={styles.metricLabel}>Avg. Carbs</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricValue}>{Math.round(averages.fat)}g</div>
                <div className={styles.metricLabel}>Avg. Fat</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricValue}>{Math.round(averages.protein)}g</div>
                <div className={styles.metricLabel}>Avg. Protein</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Cards - Row 1 */}
        <div className={styles.chartRow}>
          <div className={styles.chartCard}>
            <h3>Cuisine Distribution</h3>
            <div className={styles.chartContainer}>
              <Doughnut data={cuisineChart} options={chartOptions} />
            </div>
          </div>
          
          <div className={styles.chartCard}>
            <h3>Meal Categories</h3>
            <div className={styles.chartContainer}>
              <Doughnut data={mealChart} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {/* Chart Cards - Row 2 */}
        <div className={styles.chartRow}>
          <div className={styles.chartCard}>
            <h3>Spice Levels</h3>
            <div className={styles.chartContainer}>
              <Doughnut data={spiceChart} options={chartOptions} />
            </div>
          </div>
          
          <div className={styles.chartCard}>
            <h3>Protein Categories</h3>
            <div className={styles.chartContainer}>
              <Doughnut data={proteinChart} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <h3>Recipe Diversity</h3>
            <div className={styles.statList}>
              <div className={styles.statItem}>
                <span>Total Recipes</span>
                <strong>{recipeCount}</strong>
              </div>
              <div className={styles.statItem}>
                <span>Unique Cuisines</span>
                <strong>{Object.keys(cuisineCount).length}</strong>
              </div>
              <div className={styles.statItem}>
                <span>Dish Types</span>
                <strong>{Object.keys(dishTypes).length}</strong>
              </div>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <h3>Top Allergens</h3>
            <div className={styles.statList}>
              {topAllergens.length > 0 ? (
                topAllergens.map(([allergen, count]) => (
                  <div key={allergen} className={styles.statItem}>
                    <span>{allergen}</span>
                    <strong>{count} recipes</strong>
                  </div>
                ))
              ) : (
                <div className={styles.noDataMessage}>No allergen data available</div>
              )}
            </div>
          </div>
          
          <div className={styles.statCard}>
            <h3>Meal Categories</h3>
            <div className={styles.statList}>
              {Object.entries(mealCategories).map(([category, count]) => (
                <div key={category} className={styles.statItem}>
                  <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  <strong>{count} recipes</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDashboard;