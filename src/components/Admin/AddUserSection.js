import React, { useState, useEffect } from 'react';
import styles from '../../assets/styles/AddUserSection.module.css';
import { fetchAllUsers, registerUser } from '../../api/auth';

const RegisterUser = ({ onUserAdded, onCancel }) => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [users, setUsers] = useState([]); // Store all users
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // ✅ Define isLoading state

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();
        setUsers(allUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    loadUsers();
  }, []);

  // ✅ Function to validate email format
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setError(''); // Clear error on change
  };

  const handleCancel = () => {
    window.location.reload(); // ✅ Reload page on cancel
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate email format
    if (!validateEmail(userData.email)) {
      setError('Invalid email format!');
      return;
    }

    // ✅ Check if email already exists (case-insensitive)
    const userExists = users.some(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (userExists) {
      setError('User with this email already exists!');
      return;
    }

    setIsLoading(true); // ✅ Set loading state to true

    try {
      const response = await registerUser(userData.email, userData.password);

      if (response.success) {
        window.location.reload();

        setError(response.error || 'Failed to add user. Try again.');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false); // ✅ Reset loading state
    }
  };

  return (
    <div className={styles.userDetailsContainer}>
      <h3>Add New User</h3>
      {error && <p className={styles.errorText}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.detailRow}>
          <label className={styles.detailLabel}>Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className={styles.editableInput}
            required
          />
        </div>

        <div className={styles.detailRow}>
          <label className={styles.detailLabel}>Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className={styles.editableInput}
            required
          />
        </div>

        <div className={styles.detailsActions}>
          <button type="submit" className={styles.saveButton} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add User'}
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleCancel} disabled={isLoading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterUser;
