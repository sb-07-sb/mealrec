import React, { useState, useEffect } from "react";
import Select from "react-select/creatable";
import steps from "./components/stepConfig.js";
import { validateStep } from "./utils/formValidation.js"; // Import the validation function
import { handleSignup, handleLogin, handleSaveUserData } from './api/apiRequests.js';
import { fetchUserData } from "./api/apiRequests.js";

import "./assets/styles/MealStepper.css";

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Track the highest step reached separately
  const [highestStepReached, setHighestStepReached] = useState(1);

  const [formData, setFormData] = useState({
    semail: "",
    spassword: "",
    email: "",
    password: "",
    fullName: "",
    gender: null,
    age: "",
    height: "",
    currentWeight: "",
    targetWeight: "",
    bodyType: null,
    healthConditions: "",
    allergies: "",
    chronicConditions: "",
    bloodSugar: "",
    currentMedications: "",
    ethnicity: "",
    dietType: "",
    foodPreferences: "",
    mealFrequency: "",
    nutrientSensitivities: "",
    activityLevel: "",
    injuries: "",
    exerciseType: "",
    exerciseFrequency: "",
    exerciseDuration: "",
    fitnessGoal: "",
    caloricIntake: "",
    macronutrientPreference: "",
    mealTiming: "",
    supplements: "",
  }
  );

  const [errors, setErrors] = useState({});
  const [isSessionChecked, setIsSessionChecked] = useState(false); // To track if session has been checked

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/check-session', {
          method: 'GET',
          credentials: 'include',  // Include credentials (cookies) in the request
        });
        const data = await response.json();

        if (response.ok && data.success) {
          // User is already logged in, skip login and move to the next step
          setCurrentStep(currentStep + 1);

          // Fetch user data and populate the form
          const userDataResponse = await fetchUserData(data.userId);
          console.log("Fetched User Data:", userDataResponse);
          const textInputFields = ["fullName", "age", "height", "currentWeight", "targetWeight"];

          if (userDataResponse.success && userDataResponse.userDetails) {
            

            const formattedData = { ...userDataResponse.userDetails };
            const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            // Dynamically process dropdown fields
            Object.keys(formattedData).forEach((field) => {
              if (!textInputFields.includes(field) && formattedData[field]) {
                formattedData[field] = {
                  value: formattedData[field],
                  label: capitalizeFirstLetter(formattedData[field]),
                };
              }
            });

            setFormData(prevFormData => ({
              ...prevFormData,
              ...formattedData, // Merge formatted data
            }));
          }
        } else {
          setCurrentStep(1); // Show login step if no session
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsSessionChecked(true); // Mark session as checked
      }

      // Restore form data from sessionStorage (if available)
      const storedFormData = JSON.parse(sessionStorage.getItem("formData"));
      if (storedFormData) {
        setFormData(storedFormData);
      }
    };

    checkSession();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear the error when the field is filled
    if (value && errors[id]) {
      setErrors((prevErrors) => {
        const { [id]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleSelectChange = (value, action) => {
    setFormData((prev) => ({
      ...prev,
      [action.name]: value,
    }));

    // Clear the error when the field is filled
    if (value && errors[action.name]) {
      setErrors((prevErrors) => {
        const { [action.name]: removedError, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleNextStep = async () => {
    const isValid = validateStep(currentStep, formData, setErrors); // Validate form data for the current step
    if (isValid) {

      // Handle Signup (Step 0)
      if (currentStep === 0) {
        const signupResponse = await handleSignup(formData.semail, formData.spassword);
        if (signupResponse.success) {
          setCurrentStep(currentStep + 1); // Move to login step after successful signup
        } else {
          alert(signupResponse.message);
        }
      }

      // Handle Login (Step 1)
      if (currentStep === 1) {
        const loginResponse = await handleLogin(formData.email, formData.password);
        if (loginResponse.success) {
          const userData = loginResponse.userDetails; // Use corrected key
          console.log(userData)
          // if (userData) {
          //   setFormData(userData); // Populate form with user data
          //   sessionStorage.setItem("formData", JSON.stringify(userData)); 
          //   // Fetch user data after successful login
          //   console.log("User ID after login:", loginResponse.userId);

          const userDataResponse = await fetchUserData(loginResponse.userId);
          console.log("User Data Response:", userDataResponse.userDetails);



          setCurrentStep(currentStep + 1); // Move to user data collection after successful login
        } else {
          alert(loginResponse.message);
          return; // Prevent moving to the next step if login fails
        }
      }

      // If all validations pass, and we're not in Step 1 or 0, proceed to save user data
      if (currentStep === steps.length - 1) {
        const saveUserDataResponse = await handleSaveUserData(formData);
        if (saveUserDataResponse.success) {
          alert("Data submission completed!");
          console.log("Form data:", formData); // Optionally log the form data
        }
      } else {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1); // Move to the next step
          const nextStep = currentStep + 1;

          // Update highest step reached
          setHighestStepReached(Math.max(highestStepReached, nextStep));
        }
      }
    }
  };

  return (

    <div className="app-container">

      {/*Left Sidebar */}
      <div className="sidebar">
        <h4 className="title">Untitled UI</h4>
        <ul className="steps">
          {steps.slice(1).map((step, index) => (
            <li
              key={index}
              className={`step ${index + 1 === currentStep ? "active" : ""}`}
              onClick={() => {
                // Validate the current step before allowing navigation to another step
                const isValid = validateStep(currentStep, formData, setErrors);

                if (isValid || currentStep === highestStepReached) {
                  // Allow clicking if step has been reached before
                  if ((index + 1) <= highestStepReached) {
                    setCurrentStep(index + 1);
                  }
                }
              }}
              style={{
                cursor: (index + 1) <= highestStepReached ? 'pointer' : 'default',
                opacity: (index + 1) <= highestStepReached ? 1 : 0.5
              }}
            >
              <span className="checkmark">{"✔"}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Main Form */}
      <div className="form-container">
        <div className="form-header">
          <div className="icon">
            <span role="img" aria-label="icon">
              🎯
            </span>
          </div>
          <h3>{steps[currentStep].title}</h3>
          <p>{steps[currentStep].description}</p>
        </div>

        {/* <div className="form">{steps[currentStep].content} */}
        <div className="form">
          {steps[currentStep].content({
            formData,
            handleInputChange,
            errors,
            handleSelectChange,
            setCurrentStep,
          })}
        </div>
        <button onClick={handleNextStep} className="submit-btn">
          {currentStep < steps.length - 1 ? "Next Step" : "Submit"}
        </button>

        {/* Short Stepper (Dots with a Dash for current step) */}
        <div className="short-stepper">
          {steps.map((_, index) => (
            <React.Fragment key={index}>
              {index === currentStep ? (
                <span className="dash"></span> // Dash for the active step
              ) : (
                <span className={`dot ${index < currentStep ? "active" : ""}`}>
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>

  );
};

export default App;