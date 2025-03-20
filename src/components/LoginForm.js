// import React, { useState } from 'react';
// import '../assets/styles/LoginForm.css';

// const LoginForm = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });

//     const [errors, setErrors] = useState({});
//     const [showPassword, setShowPassword] = useState(false);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const validationErrors = validateForm(formData);
//         if (Object.keys(validationErrors).length === 0) {
//             // Handle form submission (e.g., API call)
//             console.log('Form submitted successfully:', formData);
//         } else {
//             setErrors(validationErrors);
//         }
//     };

//     const validateForm = (data) => {
//         const errors = {};
//         if (!data.email) {
//             errors.email = 'Email is required';
//         } else if (!/\S+@\S+\.\S+/.test(data.email)) {
//             errors.email = 'Email address is invalid';
//         }
//         if (!data.password) {
//             errors.password = 'Password is required';
//         }
//         return errors;
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     return (
//         <div className="login-container">
//             <div className="login-content">
//                 <div className="login-sidebar">
//                     <div className="sidebar-header">
//                         <h1>Welcome Back!</h1>
//                         <p>Login to your account to continue.</p>
//                     </div>
//                     <div className="sidebar-illustration">
//                         <img src="/images/login-illustration.svg" alt="Login Illustration" />
//                     </div>
//                     <div className="sidebar-footer">
//                         <p>Don't have an account? <a href="/signup">Sign up</a></p>
//                     </div>
//                 </div>
//                 <div className="login-form">
//                     <form onSubmit={handleSubmit}>
//                         <div className="form-group">
//                             <label htmlFor="email">Email</label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleInputChange}
//                                 className={errors.email ? 'error' : ''}
//                                 placeholder="Enter your email"
//                             />
//                             {errors.email && <span className="error-message">{errors.email}</span>}
//                         </div>
//                         <div className="form-group password-group">
//                             <label htmlFor="password">Password</label>
//                             <div className="password-input-container">
//                                 <input
//                                     type={showPassword ? 'text' : 'password'}
//                                     id="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleInputChange}
//                                     className={errors.password ? 'error' : ''}
//                                     placeholder="Enter your password"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="password-toggle"
//                                     onClick={togglePasswordVisibility}
//                                 >
//                                     {/* {showPassword ? <PasswordHiddenIcon /> : <PasswordVisibleIcon />} */}
//                                 </button>
//                             </div>
//                             {errors.password && <span className="error-message">{errors.password}</span>}
//                         </div>
//                         <div className="form-options">
//                             <a href="/forgot-password" className="forgot-password">
//                                 Forgot Password?
//                             </a>
//                         </div>
//                         <div className="form-actions">
//                             <button type="submit" className="btn-login">
//                                 Login
//                             </button>
//                         </div>
//                         <div className="social-login">
//                             <p>Or login with:</p>
//                             <button type="button" className="btn-google">
//                                 {/* <GoogleIcon /> */}
//                                 <span>Login with Google</span>
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginForm;