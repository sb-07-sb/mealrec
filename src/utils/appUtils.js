// import { handleSignup, handleLogin, handleSaveUserData, fetchUserData, handleLogout } from './api/apiRequests.js';

// export const checkSession = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/check-session', {
//         method: 'GET',
//         credentials: 'include',  // Include credentials (cookies) in the request
//       });
//       const data = await response.json();

//       if (response.ok && data.success) {
//         // User is already logged in, skip login and move to the next step
//         setCurrentStep(currentStep + 1);

//         // Fetch user data and populate the form
//         const userDataResponse = await fetchUserData(data.userId);
//         console.log("Fetched User Data:", userDataResponse);
//         const textInputFields = ["fullName", "age", "height", "currentWeight", "targetWeight"];

//         if (userDataResponse.success && userDataResponse.userDetails) {


//           const formattedData = { ...userDataResponse.userDetails };
//           const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
//           // Dynamically process dropdown fields
//           Object.keys(formattedData).forEach((field) => {
//             if (!textInputFields.includes(field) && formattedData[field]) {
//               formattedData[field] = {
//                 value: formattedData[field],
//                 label: capitalizeFirstLetter(formattedData[field]),
//               };
//             }
//           });

//           setFormData(prevFormData => ({
//             ...prevFormData,
//             ...formattedData, // Merge formatted data
//           }));
//         }
//       } else {
//         setCurrentStep(1); // Show login step if no session
//       }
//     } catch (error) {
//       console.error("Error checking session:", error);
//     } finally {
//       setIsSessionChecked(true); // Mark session as checked
//     }

//     // Restore form data from sessionStorage (if available)
//     const storedFormData = JSON.parse(sessionStorage.getItem("formData"));
//     if (storedFormData) {
//       setFormData(storedFormData);
//     }
//   };

// //Handle logout
// export const logoutUser = async () => {
//     const logoutResponse = await handleLogout();

//     if (logoutResponse && logoutResponse.success) { // Ensure logoutResponse is not undefined
//         setCurrentStep(1); // Redirect user to login step
//         setHighestStepReached(1)
//     } else {
//         console.error("Logout failed:", logoutResponse?.message || "Unknown error");
//     }
// };


// //Handle user input validation
// export const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prev) => ({
//         ...prev,
//         [id]: value,
//     }));

//     // Clear the error when the field is filled
//     if (value && errors[id]) {
//         setErrors((prevErrors) => {
//             const { [id]: removedError, ...rest } = prevErrors;
//             return rest;
//         });
//     }
// };

// export const handleSelectChange = (value, action) => {
//     setFormData((prev) => ({
//       ...prev,
//       [action.name]: value,
//     }));

//     // Clear the error when the field is filled
//     if (value && errors[action.name]) {
//       setErrors((prevErrors) => {
//         const { [action.name]: removedError, ...rest } = prevErrors;
//         return rest;
//       });
//     }
//   };