import React, { useState, useEffect } from "react";
import Select from "react-select/creatable";
import stepsAdmin from "./components/stepsAdminConfig.js";  // Import stepsAdmin from the new configuration file
import { validateStep } from "./utils/formValidation.js"; // Import the validation function
import { handleAdminLogin, handleNextStep, fetchUsers, handleLogout } from './api/apiRequests.js';  // Import the login function (for admin login)
import "./assets/styles/ManageUsersStep.css";

const AdminDashboard = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);  // Define users state here
  const [editingUserId, setEditingUserId] = useState(null);
  const [editData, setEditData] = useState({ email: "", role: "" });
  const [isSessionChecked, setIsSessionChecked] = useState(false); // To track if session has been checked

  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/check-session', {
        method: 'GET',
        credentials: 'include',  // Include credentials (cookies) in the request
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // User is already logged in, skip login and move to the next step

          setCurrentStep(1);

        } else {
          // User is not logged in, show the login step
          setCurrentStep(0);
        }
       
    } catch (error) {
      console.error('Error checking session:', error);
    }finally {
      setIsSessionChecked(true); // Mark session as checked
    }
  };

  useEffect(() => {
    checkSession();
  }, []);  // Empty dependency array means this runs only once when the component mounts

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
  const logoutUser = async () => {
    const logoutResponse = await handleLogout();

    if (logoutResponse && logoutResponse.success) { // Ensure logoutResponse is not undefined
      setCurrentStep(0); // Redirect user to login step

    } else {
      console.error("Logout failed:", logoutResponse?.message || "Unknown error");
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 0) {
      const loginResponse = await handleAdminLogin(formData.email, formData.password);
      if (loginResponse.success) {
        const userData = loginResponse.userDetails; // Use corrected key
        console.log(userData)
        setCurrentStep(1);  // Move to admin dashboard after successful login

      } else {
        alert(loginResponse.message);
        return;  // Prevent moving to the next step if login fails
      }
    }



    // If all validations pass, and we're not in Step 1 or 0, proceed to save user data
    if (currentStep === stepsAdmin.length - 1) {
      if (true) {
        alert("admin!");
        console.log("Form data:", formData); // Optionally log the form data
      }
      // } else {
      //   if (currentStep < stepsAdmin.length - 1) {
      //     setCurrentStep(currentStep + 1); // Move to the next step
      //     const nextStep = currentStep + 1;

      //   }
    }
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
              className={`step ${index === currentStep ? "active" : ""}`}
              
              onClick={() => {
                const loginResponse = handleAdminLogin(formData.email, formData.password);
                if (loginResponse.success) {
                  setCurrentStep(index);
                }
              }
              }
              style={{
                cursor: 'pointer',
                opacity: 1
              }}
            >
              <span className="checkmark">{"✔"}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
          <li onClick={logoutUser} className="logout-btn">logout</li>

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

        <div className="admin-form">
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
