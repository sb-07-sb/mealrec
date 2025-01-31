import React, { useState, useEffect } from "react";
import Select from "react-select/creatable";
import stepsAdmin from "./components/stepsAdminConfig.js";  // Import stepsAdmin from the new configuration file
import { validateStep } from "./utils/formValidation.js"; // Import the validation function
import { handleAdminLogin ,handleNextStep, fetchUsers } from './api/apiRequests.js';  // Import the login function (for admin login)
 
// import "./assets/styles/MealStepper.css";

const AdminDashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);  // Define users state here
 


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
  
  const handleNextStep = async () => {
      if (currentStep === 0) {
        const loginResponse = await handleAdminLogin(formData.email, formData.password);
        if (loginResponse.success) {
          setCurrentStep(currentStep + 1);  // Move to admin dashboard after successful login
        } else {
          alert(loginResponse.message);
          return;  // Prevent moving to the next step if login fails
        }
      }
    
     

    //   // If all validations pass, and we're not in Step 1 or 0, proceed to save user data
    //   if (currentStep === stepsAdmin.length - 1) {
    //     if (true) {
    //       alert("admin!");
    //       console.log("Form data:", formData); // Optionally log the form data
    //     }
    //   } else {
    //     if (currentStep < stepsAdmin.length - 1) {
    //       setCurrentStep(currentStep + 1); // Move to the next step
    //       const nextStep = currentStep + 1;

    //     }
    //   }
    };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <h4 className="title">Admin Dashboard</h4>
        <ul className="steps">
          {stepsAdmin.slice(0).map((step, index) => (
            <li
              key={index}
              className={`step ${index +1 === currentStep ? "active" : ""}`}
              onClick={() => {
               
                                 
                    setCurrentStep(index + 1);
                  
                }
              }
              style={{
                cursor:  'pointer' ,
                opacity:  1 
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
          <h3>{stepsAdmin[currentStep].title}</h3>
          <p>{stepsAdmin[currentStep].description}</p>
        </div>

        <div className="form">
          {stepsAdmin[currentStep].content({
            formData,
            handleInputChange,
            errors,
            setCurrentStep,
          })}
        </div>

        <button onClick={handleNextStep} className="submit-btn">
          {currentStep < stepsAdmin.length - 1 ? "Next Step" : "Submit"}
        </button>

        {/* Short Stepper (Dots with a Dash for current step) */}
        <div className="short-stepper">
          {stepsAdmin.map((_, index) => (
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
}

export default AdminDashboard;
