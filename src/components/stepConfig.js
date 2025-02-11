import React from 'react';
import Select from 'react-select/creatable';

import "../assets/styles/MealStepper.css"
// Steps configuration: Each step has a title, description, and a content component.
const steps = [
  {
    title: "Create your account",
    description: "Set your email and password for the account.",
    content: ({ formData, handleInputChange, errors, setCurrentStep }) => (
      <div className="step--1">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="semail">Email Address</label>
            <div className="input-container">
              <input
                type="semail"
                id="semail"
                placeholder="Enter your email"
                value={formData.semail}
                onChange={handleInputChange}
                // className={errors.semail ? "error" : ""}
              />
              {errors.semail && <span className="error-message">{errors.semail}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="spassword">Password</label>
            <div className="input-container">
              <input
                type="spassword"
                id="spassword"
                placeholder="Enter your password"
                value={formData.spassword}
                onChange={handleInputChange}
                // className={errors.spassword ? "error" : ""}
              />
              {errors.spassword && (
                <span className="error-message">{errors.spassword}</span>
              )}
            </div>
          </div>
        </form>
        <div className="link-container">
          <a
            href="#"
            onClick={() => setCurrentStep(1)} // Navigate to the login step
          >
            Already have an account? Sign in
          </a>
        </div>
      </div>
    ),
  },
  {
    title: "Email & Password",
    description: "Set your email and password for the account.",
    content: ({ formData, handleInputChange, errors, setCurrentStep }) => (
      <div className="step-0">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                //className={errors.email ? "error" : ""}

              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                // className={errors.password ? "error" : ""}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          </div>
        </form>
        <div className="link-container">
          <a
            href="#"
            onClick={() => setCurrentStep(0)} // Navigate to the Sign-Up step
          >
            Don’t have an account? Sign up
          </a>
        </div>
      </div>
    ),
  },
  {
    title: "Personal Information",
    description: "Provide basic details for your meal plan.",
    content: ({ formData, handleInputChange, errors, handleSelectChange }) => (
      <div className="step-1">

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="full-name">Full Name</label>
            <div className="input-container">

              <input
                type="text"
                id="fullName" // Update this to match the key in formData
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                // className={errors.fullName ? "error" : ""}

                required
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
          </div>
          {/* Gender */}

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <Select
              id="gender"
              name="gender"
              isClearable
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              placeholder="Select your gender"

              isSearchable
              isCreatable // This enables typing and adding custom options
              className="custom-select"
              value={formData.gender}
              onChange={(value) => handleSelectChange(value, { name: "gender" })}
            />
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>


          {/* Age and Height */}
          <div className="row-group">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                placeholder="Enter your age"

                min="10"
                max="100"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  if (value < 10) {
                    formData.age = "";
                    e.target.value = "";
                  }
                  if (value > 100) {
                    formData.age = "";
                    e.target.value = "";
                  }

                }}
                required
                value={formData.age}
                onChange={handleInputChange}

                className={errors.age ? "error" : ""}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}

            </div>
            <div className="form-group">
              <label htmlFor="height">Height (in cm)</label>
              <input
                type="number"
                id="height"
                placeholder="Enter your height"
                min="50" // Minimum value for height
                max="300" // Maximum value for height
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  if (value < 100) {
                    formData.height = "";
                    e.target.value = "";
                  }
                  if (value > 300) {
                    formData.height = "";
                    e.target.value = "";
                  }
                }}
                value={formData.height}
                onChange={handleInputChange}
                className={errors.height ? "error" : ""}
              />
              {errors.height && <span className="error-message">{errors.height}</span>}

            </div>
          </div>

          {/* Current Weight and Target Weight */}
          <div className="row-group">
            <div className="form-group">
              <label htmlFor="current-weight">Current Weight (in kg)</label>
              <input
                type="number"
                id="currentWeight"
                min="50" // Minimum value for height
                max="300" // Maximum value for height
                placeholder="Enter your current weight"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  if (value < 30) {
                    e.target.value = "";
                    formData.currentWeight = "";
                  }
                  if (value > 300) {
                    e.target.value = "";
                    formData.currentWeight = "";
                  }


                }}
                required
                value={formData.currentWeight}
                onChange={handleInputChange}
                className={errors.currentWeight ? "error" : ""}
              />
              {errors.currentWeight && <span className="error-message">{errors.currentWeight}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="target-weight">Target Weight (in kg)</label>
              <input
                type="number"
                id="targetWeight"

                placeholder="Enter your target weight"
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '+') {
                    e.preventDefault();
                  }
                }}
                onBlur={(e) => {
                  const value = parseInt(e.target.value);
                  if (value < 30) {
                    e.target.value = "";
                    formData.targetWeight = "";
                  }
                  if (value > 300) {
                    e.target.value = "";
                    formData.targetWeight = "";
                  }
                }}
                value={formData.targetWeight}
                onChange={handleInputChange}
                required
                className={errors.targetWeight ? "error" : ""}
              />
              {errors.targetWeight && <span className="error-message">{errors.targetWeight}</span>}
            </div>
          </div>

          {/* Body Type */}
          <div className="form-group">
            <label htmlFor="body-type">Body Type</label>
            <Select
              isClearable
              options={[
                { value: "ectomorph", label: "Ectomorph" },
                { value: "mesomorph", label: "Mesomorph" },
                { value: "endomorph", label: "Endomorph" },
              ]}
              placeholder="Select your body type"
              className="custom-select"
              value={formData.bodyType}
              onChange={(value) => handleSelectChange(value, { name: "bodyType" })}
            />
            {errors.bodyType && <span className="error-message">{errors.bodyType}</span>}
          </div>
        </form>
      </div>
    ),
  },
  {
    title: "Health & Medical Information",
    description:
      "Provide your health, allergy, and medical details.",
    content: ({ formData, handleInputChange, errors, handleSelectChange }) => (
      <div className="step-2">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Health Conditions Dropdown */}
          <div className="form-group">
            <label htmlFor="health-conditions">Health Conditions</label>
            <Select
              id="healthConditions"
              name="healthConditions"
              isClearable
              options={[
                { value: "diabetes", label: "Diabetes" },
                { value: "hypertension", label: "Hypertension" },
                { value: "none", label: "None" },
              ]}
              placeholder="Select or type a condition"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.healthConditions}
              onChange={handleSelectChange}
            />
            {errors.healthConditions && <span className="error-message">{errors.healthConditions}</span>}

          </div>

          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <Select
              id="allergies"
              name="allergies"
              isClearable
              options={[
                { value: "gluten", label: "Gluten" },
                { value: "dairy", label: "Dairy" },
                { value: "nuts", label: "Nuts" },
                { value: "none", label: "None" },
              ]}
              placeholder="Select or type an allergy"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.allergies}
              onChange={handleSelectChange}
            />
            {errors.allergies && <span className="error-message">{errors.allergies}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="chronic-conditions">Chronic Conditions</label>
            <Select
              id="chronicConditions"
              name="chronicConditions"
              isClearable
              options={[
                { value: "asthma", label: "Asthma" },
                { value: "autoimmune", label: "Autoimmune Disorders" },
                { value: "none", label: "None" },
              ]}
              placeholder="Select or type a chronic condition"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.chronicConditions}
              onChange={handleSelectChange}
            />
            {errors.chronicConditions && <span className="error-message">{errors.chronicConditions}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="blood-sugar">Blood Sugar Regulation</label>
            <Select
              id="bloodSugar"
              name="bloodSugar"
              isClearable
              options={[
                { value: "insulin-resistance", label: "Insulin Resistance" },
                { value: "hypoglycemia", label: "Hypoglycemia" },
                { value: "none", label: "None" },
              ]}
              placeholder="Select blood sugar regulation issues"
              className="custom-select"
              isSearchable
              value={formData.bloodSugar}
              onChange={handleSelectChange}
            />
            {errors.bloodSugar && <span className="error-message">{errors.bloodSugar}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="current-medications">Current Medications</label>
            <Select
              id="currentMedications"
              name="currentMedications"
              isClearable
              options={[
                { value: "medication1", label: "Medication 1" },
                { value: "medication2", label: "Medication 2" },
                { value: "none", label: "None" },
              ]}
              placeholder="Select or type your medication"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.currentMedications}
              onChange={handleSelectChange}
            />
            {errors.currentMedications && <span className="error-message">{errors.currentMedications}</span>}
          </div>
        </form>
      </div>
    ),
  },
  {
    title: "Dietary Preferences",
    description: "Provide your eating habits and dietary preferences.",
    content: ({ formData, handleInputChange, errors, handleSelectChange }) => (
      <div className="step-3">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Ethnicity/Cultural Background Dropdown */}
          <div className="form-group">
            <label htmlFor="ethnicity">Ethnicity / Cultural Background</label>
            <Select
              id="ethnicity"
              name="ethnicity"
              isClearable
              options={[
                { value: 'indian', label: 'Indian' },
                { value: 'mediterranean', label: 'Mediterranean' },
                { value: 'asian', label: 'Asian' },
                { value: 'latin-american', label: 'Latin American' },
                { value: 'african', label: 'African' },
                { value: 'middle-eastern', label: 'Middle Eastern' },
                { value: 'european', label: 'European' },
                { value: 'caribbean', label: 'Caribbean' },
              ]}
              placeholder="Select or type your cultural background"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.ethnicity}
              onChange={handleSelectChange}
            />
            {errors.ethnicity && <span className="error-message">{errors.ethnicity}</span>}

          </div>

          {/* Diet Type Dropdown */}
          <div className="form-group">
            <label htmlFor="diet-type">Diet Type</label>
            <Select
              id="dietType"
              name="dietType"
              isClearable
              options={[
                { value: 'vegan', label: 'Vegan' },
                { value: 'keto', label: 'Keto' },
                { value: 'paleo', label: 'Paleo' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'gluten-free', label: 'Gluten-Free' },
                { value: 'low-carb', label: 'Low-Carb' },
                { value: 'low-sugar', label: 'Low-Sugar' },
                { value: 'intermittent-fasting', label: 'Intermittent Fasting' },
                { value: 'mediterranean', label: 'Mediterranean' },
                { value: 'none', label: 'None' }
              ]}
              placeholder="Select or type your diet type"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.dietType}
              onChange={handleSelectChange}
            />
            {errors.dietType && <span className="error-message">{errors.dietType}</span>}

          </div>

          {/* Food Preferences Dropdown */}
          <div className="form-group">
            <label htmlFor="food-preferences">Food Preferences</label>
            <Select
              id="foodPreferences"
              name="foodPreferences"
              isClearable
              options={[
                { value: 'likes-fruits', label: 'Likes Fruits' },
                { value: 'likes-vegetables', label: 'Likes Vegetables' },
                { value: 'dislikes-dairy', label: 'Dislikes Dairy' },
                { value: 'dislikes-meat', label: 'Dislikes Meat' },
                { value: 'likes-gluten', label: 'Likes Gluten' },
                { value: 'likes-seafood', label: 'Likes Seafood' },
                { value: 'avoids-sugar', label: 'Avoids Sugar' },
                { value: 'avoids-carbs', label: 'Avoids Carbs' },
                { value: 'none', label: 'None' }
              ]}
              placeholder="Select or type food preferences"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.foodPreferences}
              onChange={handleSelectChange}
            />
            {errors.foodPreferences && <span className="error-message">{errors.foodPreferences}</span>}

          </div>

          {/* Meal Frequency Dropdown */}
          <div className="form-group">
            <label htmlFor="meal-frequency">Meal Frequency</label>
            <Select
              id="mealFrequency"
              name="mealFrequency"
              isClearable
              options={[
                { value: '3-meals-2-snacks', label: '3 Meals + 2 Snacks' },
                { value: 'intermittent-fasting', label: 'Intermittent Fasting' },
                { value: '5-meals', label: '5 Meals' },
                { value: '3-meals', label: '3 Meals' },
                { value: '1-meal', label: '1 Meal' },
                { value: 'snack-only', label: 'Snack Only' },
              ]}
              placeholder="Select or type meal frequency"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.mealFrequency}
              onChange={handleSelectChange}
            />
            {errors.mealFrequency && <span className="error-message">{errors.mealFrequency}</span>}

          </div>

          {/* Nutrient Sensitivities Dropdown */}
          <div className="form-group">
            <label htmlFor="nutrient-sensitivities">Nutrient Sensitivities</label>
            <Select
              id="nutrientSensitivities"
              name="nutrientSensitivities"

              isClearable
              options={[
                { value: 'low-carb', label: 'Low-Carb' },
                { value: 'low-sugar', label: 'Low-Sugar' },
                { value: 'high-protein', label: 'High-Protein' },
                { value: 'high-fiber', label: 'High-Fiber' },
                { value: 'low-fat', label: 'Low-Fat' },
                { value: 'gluten-free', label: 'Gluten-Free' },
                { value: 'lactose-intolerant', label: 'Lactose Intolerant' },
                { value: 'none', label: 'None' }
              ]}
              placeholder="Select or type nutrient sensitivities"
              className="custom-select"
              isSearchable
              isCreatable
              value={formData.nutrientSensitivities}
              onChange={handleSelectChange}
            />
            {errors.nutrientSensitivities && <span className="error-message">{errors.nutrientSensitivities}</span>}

          </div>

        </form>
      </div>
    ),
  },

  {
    title: "Fitness & Activity Level",
    description: "Provide your fitness and activity details.",
    content: ({ formData, handleInputChange, errors, handleSelectChange }) => (
      <div className="step-4">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Activity Level Dropdown */}
          <div className="form-group">
            <label htmlFor="activity-level">Activity Level</label>
            <Select
              id="activityLevel"
              name="activityLevel"
              isClearable
              options={[
                { value: 'sedentary', label: 'Sedentary' },
                { value: 'lightly-active', label: 'Lightly Active' },
                { value: 'very-active', label: 'Very Active' }
              ]}
              placeholder="Select your activity level"
              className="custom-select"
              isSearchable
              value={formData.activityLevel}
              onChange={handleSelectChange}
            />
            {errors.activityLevel && <span className="error-message">{errors.activityLevel}</span>}

          </div>

          {/* Injuries or Limitations Dropdown */}
          <div className="form-group">
            <label htmlFor="injuries">Injuries or Limitations</label>
            <Select
              id="injuries"
              name="injuries"
              isClearable
              options={[
                { value: 'knee-pain', label: 'Knee Pain' },
                { value: 'back-issues', label: 'Back Issues' },
                { value: 'none', label: 'None' }
              ]}
              placeholder="Select or type any injuries or limitations"
              className="custom-select"
              isSearchable
              value={formData.injuries}
              onChange={handleSelectChange}
            />
            {errors.injuries && <span className="error-message">{errors.injuries}</span>}

          </div>

          {/* Exercise Type Dropdown */}
          <div className="form-group">
            <label htmlFor="exercise-type">Exercise Type</label>
            <Select
              id="exerciseType"
              name="exerciseType"
              isClearable
              options={[
                { value: 'cardio', label: 'Cardio' },
                { value: 'strength-training', label: 'Strength Training' },
                { value: 'yoga', label: 'Yoga' },
                { value: 'hiit', label: 'HIIT' },
                { value: 'none', label: 'None' }

              ]}
              placeholder="Select your preferred exercise type"
              className="custom-select"
              isSearchable
              value={formData.exerciseType}
              onChange={handleSelectChange}
            />
            {errors.exerciseType && <span className="error-message">{errors.exerciseType}</span>}

          </div>



          {/* Row Group for Exercise Type and Exercise Duration */}
          <div className="row-group">
            {/* Exercise Type Dropdown */}
            <div className="form-group">
              <label htmlFor="exercise-frequency">Exercise Frequency</label>
              <Select
                id="exerciseFrequency"
                name="exerciseFrequency"
                isClearable
                options={[
                  { value: '3-days-week', label: '3 days/week' },
                  { value: '5-days-week', label: '5 days/week' },
                  { value: 'daily', label: 'Daily' }
                ]}
                placeholder="Frequency"
                className="custom-select"
                isSearchable
                value={formData.exerciseFrequency}
                onChange={handleSelectChange}
              />
              {errors.exerciseFrequency && <span className="error-message">{errors.exerciseFrequency}</span>}

            </div>

            {/* Exercise Duration Dropdown */}
            <div className="form-group">
              <label htmlFor="exercise-duration">Exercise Duration</label>
              <Select
                id="exerciseDuration"
                name="exerciseDuration"

                isClearable
                options={[
                  { value: '30-mins', label: '30 mins' },
                  { value: '1-hour', label: '1 hour' },
                  { value: 'more-than-1-hour', label: 'More than 1 hour' }
                ]}
                placeholder="Duration"
                className="custom-select"
                isSearchable
                value={formData.exerciseDuration}
                onChange={handleSelectChange}
              />
              {errors.exerciseDuration && <span className="error-message">{errors.exerciseDuration}</span>}

            </div>
          </div>

          {/* Fitness Goal Dropdown */}
          <div className="form-group">
            <label htmlFor="fitness-goal">Fitness Goal</label>
            <Select
              id="fitnessGoal"
              name="fitnessGoal"
              isClearable
              options={[
                { value: 'weight-loss', label: 'Weight Loss' },
                { value: 'muscle-gain', label: 'Muscle Gain' },
                { value: 'maintain', label: 'Maintain' }
              ]}
              placeholder="Select your fitness goal"
              className="custom-select"
              value={formData.fitnessGoal}
              onChange={handleSelectChange}
              isSearchable
            />
            {errors.fitnessGoal && <span className="error-message">{errors.fitnessGoal}</span>}

          </div>

          {/* Body Fat Percentage */}
          <div className="form-group">
            <label htmlFor="body-fat">Body Fat Percentage (if known)</label>
            <input
              type="number"
              id="body-fat"
              placeholder="Enter your body fat percentage"
            />
          </div>
        </form>
      </div>
    ),
  },

  {
    title: "Nutrition & Meal Plan Customization",
    description: "Provide your nutrition goals and preferences.",
    content: ({ formData, handleInputChange, errors, handleSelectChange }) => (
      <div className="step-5">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Daily Caloric Intake Goal Dropdown */}
          <div className="form-group">
            <label htmlFor="caloric-intake">Daily Caloric Intake Goal</label>
            <Select
              id="caloricIntake"
              name="caloricIntake"
              isClearable
              options={[
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'deficit', label: 'Deficit' },
                { value: 'surplus', label: 'Surplus' }
              ]}
              placeholder="Select your daily caloric intake goal"
              className="custom-select"
              isSearchable

              value={formData.caloricIntake}
              onChange={handleSelectChange}
            />
            {errors.caloricIntake && <span className="error-message">{errors.caloricIntake}</span>}
          </div>

          {/* Macronutrient Preference Dropdown */}
          <div className="form-group">
            <label htmlFor="macronutrient-preference">Macronutrient Preference</label>
            <Select
              id="macronutrientPreference"
              name="macronutrientPreference"

              isClearable
              options={[
                { value: 'balanced', label: 'Balanced' },
                { value: 'high-protein', label: 'High Protein' },
                { value: 'low-carb', label: 'Low Carb' }
              ]}
              placeholder="Select your macronutrient preference"
              className="custom-select"
              isSearchable

              value={formData.macronutrientPreference}
              onChange={handleSelectChange}
            />
            {errors.macronutrientPreference && <span className="error-message">{errors.macronutrientPreference}</span>}
          </div>

          {/* Meal Timing Preferences Dropdown */}
          <div className="form-group">
            <label htmlFor="meal-timing">Meal Timing Preferences</label>
            <Select
              id="mealTiming"
              name="mealTiming"
              isClearable
              options={[
                { value: 'breakfast-heavy', label: 'Breakfast-heavy' },
                { value: 'pre-post-workout', label: 'Pre/Post-workout' },
                { value: 'intermittent-fasting', label: 'Intermittent Fasting' }
              ]}
              placeholder="Select your meal timing preference"
              className="custom-select"
              isSearchable

              value={formData.mealTiming}

              onChange={handleSelectChange}
            />
            {errors.mealTiming && <span className="error-message">{errors.mealTiming}</span>}

          </div>

          {/* Supplements Dropdown */}
          <div className="form-group">
            <label htmlFor="supplements">Supplements</label>
            <Select
              id="supplements"
              name="supplements"
              isClearable
              options={[
                { value: 'protein-powder', label: 'Protein Powder' },
                { value: 'vitamins', label: 'Vitamins' },
                { value: 'omega-3', label: 'Omega-3' },
                { value: 'none', label: 'None' }
              ]}
              placeholder="Select your supplements"
              className="custom-select"
              isSearchable

              value={formData.supplements}
              onChange={handleSelectChange}
            />
            {errors.supplements && <span className="error-message">{errors.supplements}</span>}

          </div>
        </form>
      </div>
    ),
  },


];

export default steps;
