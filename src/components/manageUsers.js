import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserData, updateUserData, deleteUser } from '../api/apiRequests';

export const ManageUsersStep = ({ setCurrentStep }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedUserData, setSelectedUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchUsers();
            if (response.success) {
                setUsers(response.users);
            } else {
                setError(response.message);
            }
            setLoading(false);
        };
        fetchData();
    }, []);
    useEffect(() => {
        setError(null);
    }, [selectedUserData]);
    

    // Handle fetching detailed user data when a name is clicked
    const handleFetchUserData = async (userId) => {
        const response = await fetchUserData(userId);
        if (response.success) {
            setSelectedUserData(response.userDetails);
        } else {
            setError(response.message);
        }
    };

    // Handle input change for editable fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUserData((prevData) => ({
            ...prevData,
            [name]: value, // Update the specific field in selectedUserData
        }));
    };

    const handleUpdateUserData = async () => {
        try {
            if (!selectedUserData || !selectedUserData.user_id) {
                setError('User ID is missing.');
                return;
            }
            // Clear any previous errors before proceeding
            setError(null);
            console.log('Updating user with ID:', selectedUserData.user_id);

            const response = await updateUserData(selectedUserData);
            console.log('API Response:', response);

            if (response.success) {
                alert('User data updated successfully!');
            } else {
                setError(response.message || 'Failed to update user data.');
            }
        } catch (err) {
            console.error('Error updating user data:', err);
            setError('Network error while updating user data.');
        }
    };

    // Function to delete a user
    const handleDeleteUser = async (userId) => {
        const response = await deleteUser(userId);
        if (response.success) {
            alert('User deleted successfully!');
            // After deleting, remove the user from the users list
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
        } else {
            setError(response.message || 'Failed to delete user.');
        }
    };


    // Function to render form fields dynamically
    const renderInputField = (field, value) => {
        return (
            <div className="form-group" key={field}>
                <label htmlFor={field}>{field.replace(/_/g, ' ')}</label>
                <input
                    type="text"
                    id={field}
                    name={field} // Adding the name to allow controlled input
                    value={value || ''} // Ensure the input is always controlled (empty string fallback)
                    onChange={handleInputChange} // Handle input change
                    placeholder={field.replace(/_/g, ' ')} // Display field name as placeholder
                />
            </div>
        );
    };

    return (
        <div className="app-container">
            {/* Main Section */}
            <div className="form-container">
                {selectedUserData ? (
                    <>
                        <div className="form-header">
                            <h3>User Information</h3>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <form className="form">
                            {Object.entries(selectedUserData).map(([field, value]) => {
                                if (field === '_id' || field === 'user_id') return null; // Skip _id and user_id from form
                                return renderInputField(field, value);
                            })}
                        </form>

                        {/* Update Button */}
                        <button
                            onClick={() => {
                                if (selectedUserData) {
                                    handleUpdateUserData();
                                } else {
                                    setError('No user data selected for update.');
                                }
                            }}
                            className="submit-btn"
                        >
                            Update
                        </button>


                        {/* Back Button */}
                        <button onClick={() => setSelectedUserData(null)} className="back-btn">
                            Back to Users
                        </button>
                    </>
                ) : (
                    <>
                        {loading && <div className="loading">Loading...</div>}
                        {error && <div className="error">{error}</div>}

                        <div className="table-wrapper" style={{ overflowX: 'auto', marginTop: '20px' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
            <tr>
                <th style={{ padding: '12px 15px', backgroundColor: '#f4f4f4', textAlign: 'left', fontWeight: 'bold' }}>Email</th>
                <th style={{ padding: '12px 15px', backgroundColor: '#f4f4f4', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
                <th style={{ padding: '12px 15px', backgroundColor: '#f4f4f4', textAlign: 'left', fontWeight: 'bold' }}>Role</th>
                <th style={{ padding: '12px 15px', backgroundColor: '#f4f4f4' }}></th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px 15px' }}>{user.email}</td>
                    <td
                        onClick={() => handleFetchUserData(user.id)}
                        style={{
                            cursor: 'pointer',
                            color: 'blue',
                            textDecoration: 'underline',
                            padding: '12px 15px',
                            transition: 'color 0.3s',
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.color = 'blue'}
                    >
                        {user.fullName}
                    </td>
                    <td style={{ padding: '12px 15px' }}>{user.role}</td>
                    <td style={{ padding: '12px 15px' }}>
                        <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="delete-btn"
                            style={{
                                padding: '8px 12px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e53935'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

                    </>
                )}
            </div>
        </div>
    );
};