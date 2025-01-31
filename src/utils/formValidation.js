

export const validateStep = (step, formData, setErrors) => {
    const newErrors = {};

    if (step === 0) {
      if (!formData.semail) newErrors.semail = "Required";
      else if (!/\S+@\S+\.\S+/.test(formData.semail)) newErrors.semail = "Invalid email";
      if (!formData.spassword) newErrors.spassword = "Required";
      else if (formData.spassword.length < 6) newErrors.spassword = "Password must be at least 6 characters";
    }

    if (step === 1) {
      if (!formData.email) newErrors.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
      if (!formData.password) newErrors.password = "Required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    }

    if (step === 2) {
      if (!formData.fullName) newErrors.fullName = "Required";
      if (!formData.gender) newErrors.gender = "Required";
      if (!formData.age) newErrors.age = "Required";
      if (!formData.height) newErrors.height = "Required";
      if (!formData.currentWeight) newErrors.currentWeight = "Required";
      if (!formData.targetWeight) newErrors.targetWeight = "Required";
    }

    if (step === 3) {
      if (!formData.healthConditions) newErrors.healthConditions = "Required";
      if (!formData.allergies) newErrors.allergies = "Required";
      if (!formData.chronicConditions) newErrors.chronicConditions = "Required";
      if (!formData.bloodSugar) newErrors.bloodSugar = "Required";
      if (!formData.currentMedications) newErrors.currentMedications = "Required";

    }
    if (step === 4) {
        // Validate Dietary Preferences
        if (!formData.ethnicity) newErrors.ethnicity = "Required";
        if (!formData.dietType) newErrors.dietType = "Required";
        if (!formData.foodPreferences) newErrors.foodPreferences = "Required";
        if (!formData.mealFrequency) newErrors.mealFrequency = "Required";
        if (!formData.nutrientSensitivities) newErrors.nutrientSensitivities = "Required";
      }
  
      if (step === 5) {
        // Validate Dietary Preferences
        if (!formData.activityLevel) newErrors.activityLevel = "Required";
        if (!formData.injuries) newErrors.injuries = "Required";
        if (!formData.exerciseType) newErrors.exerciseType = "Required";
        if (!formData.exerciseFrequency) newErrors.exerciseFrequency = "Required";
        if (!formData.exerciseDuration) newErrors.exerciseDuration = "Required";
        if (!formData.fitnessGoal) newErrors.fitnessGoal = "Required";
  
      }
  
      if (step === 6) {
        // Validate Nutrition & Meal Plan Customization
        console.log("Validating step 6 fields..."); // Debugging line
  
        if (!formData.caloricIntake) newErrors.caloricIntake = "Required";
        if (!formData.macronutrientPreference) newErrors.macronutrientPreference = "Required";
        if (!formData.mealTiming) newErrors.mealTiming = "Required";
        if (!formData.supplements) newErrors.supplements = "Required";
      }
  
     

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
