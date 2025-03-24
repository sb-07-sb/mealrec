import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/LoginForm.module.css';
import { registerUser, loginUser, getUserFormData } from '../api/auth';

const LoginForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsRegister(!isRegister);
        setErrors({});
        setFormData({ email: '', password: '', confirmPassword: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    const validateForm = () => {
        const newErrors = {};
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
        if (isRegister) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Required*';
            } else if (formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            setSubmitError('');
            try {
                let response;
                if (isRegister) {
                    response = await registerUser(formData.email, formData.password);
                    alert(response.message);
                    toggleForm();
                } else {
                    response = await loginUser(formData.email, formData.password);
                    alert(response.message);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('role', response.role);
                    localStorage.setItem('user_id', response.user_id);

                    // Use getUserFormData to fetch form data
                    const formDataJson = await getUserFormData(response.user_id);
                    console.log('Form Data Response:', formDataJson); // Debugging line

                    // Debugging: Log role and form data
                    console.log('User Role:', response.role); // Debugging line
                    console.log('Form Data:', formDataJson.data); // Debugging line


                    // Set a flag in local storage if form data exists
                    if (formDataJson.data && Object.keys(formDataJson.data).length > 0) {
                        localStorage.setItem('formSubmitted', 'true');
                    } else {
                        localStorage.setItem('formSubmitted', 'false');
                    }

                    // Redirect based on role after successful login
                    if (response.role === 'admin') {
                        navigate('/admin', { replace: true }); // Replace history entry
                    } else if (formDataJson.data && Object.keys(formDataJson.data).length > 0) {
                        navigate('/test', { replace: true }); // Navigate to another page if form data exists
                    }
                    else {
                        navigate('/user', { replace: true }); // Replace history entry
                    }
                }
            } catch (error) {
                setSubmitError(error.message);
            } finally {
                setIsLoading(false);
            }
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