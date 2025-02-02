import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserData, updateUserData } from '../api/apiRequests';

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

                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.email}</td>
                                            <td
                                                onClick={() => handleFetchUserData(user.id)}
                                                style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                            >
                                                {user.fullName}
                                            </td>
                                            <td>{user.role}</td>
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