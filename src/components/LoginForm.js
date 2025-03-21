import React, { useState } from 'react';
import styles from '../assets/styles/LoginForm.module.css';
import { registerUser, loginUser } from '../api/auth'; // Import service functions

const LoginForm = () => {
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login and Register
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setErrors({}); // Clear errors when toggling forms
    setFormData({ email: '', password: '', confirmPassword: '' }); // Reset form data
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for the field being edited
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations for both forms
    if (!formData.email) {
      newErrors.email = 'Required*';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Required*';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Additional validations for the Register form
    if (isRegister) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Required*';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        if (isRegister) {
          // Handle registration
          const response = await registerUser(formData.email, formData.password);
          alert(response.message); // Show success message
          toggleForm(); // Switch to login form after successful registration
        } else {
          // Handle login
          const response = await loginUser(formData.email, formData.password);
          alert(response.message); // Show success message
          console.log('Logged in user ID:', response.user_id);
          // Redirect or update state as needed
        }
      } catch (error) {
        alert(error.message); // Show error message
      }
    } else {
      console.log('Form has errors');
    }
  };

  return (
    <div className={styles.stepperContainer}>
      <div className={styles.stepperContent}>
        <div className={styles.stepperSidebar}>
          <div className={styles.sidebarHeader}>
            <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
            <p>{isRegister ? 'Register to get started' : 'Please login to continue'}</p>
          </div>
        </div>
        <div className={styles.stepperForm}>
          <div className={styles.formHeader}>
            <div className={styles.iconContainer}>
              <svg className={styles.userIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
          </div>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.labelContainer}>
                <label htmlFor="email">Email</label>
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formGroup}>
              <div className={styles.labelContainer}>
                <label htmlFor="password">Password</label>
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {isRegister && (
              <div className={styles.formGroup}>
                <div className={styles.labelContainer}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  {errors.confirmPassword && (
                    <span className={styles.error}>{errors.confirmPassword}</span>
                  )}
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className={styles.formActions}>
              <button type="button" className={styles.btnBack} onClick={toggleForm}>
                {isRegister ? 'Back to Login' : 'Register'}
              </button>
              <button type="submit" className={styles.btnNext}>
                {isRegister ? 'Sign Up' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;