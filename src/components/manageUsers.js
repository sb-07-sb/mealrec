import React, { useState, useEffect } from 'react';
import { fetchUsers, fetchUserData, updateUserRole, deleteUser, handleSaveUserData } from '../api/apiRequests';
// import '../assets/styles/ManageUsersStep.css'; // Assuming you will add CSS styles

export const ManageUsersStep = ({ setCurrentStep }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

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


    const handleGetUserDetails = async (userId) => {
        // Set a loading state or any other status variable if needed
        setLoading(true);
        
        // Fetch user data from the API
        const response = await fetchUserData(userId);
        
        // If the response is successful, set the user details in the state
        if (response.success) {
            setUsers(response.users);  // Assuming you have setUserDetails state function
        } else {
            setError(response.message);  // Set an error message if something goes wrong
        }
    
        // Stop loading once the request completes
        setLoading(false);
    };
    


    const handleUpdateRole = async (userId, currentRole) => {
        const newRole = currentRole === 'user' ? 'admin' : 'user';
        const response = await updateUserRole(userId, newRole);
        if (response.success) {
            setUsers(users.map(user =>
                user._id === userId ? { ...user, role: newRole } : user
            ));
        } else {
            setError(response.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        const response = await deleteUser(userId);
        if (response.success) {
            setUsers(users.filter(user => user._id !== userId));
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="step-manage-users">
            <h2 className="title">Manage Users</h2>
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    {/* <button
                                        className="update-role-btn"
                                        onClick={() => handleUpdateRole(user._id, user.role)}
                                    >
                                        {user.role === 'user' ? 'Make Admin' : 'Make User'}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleGetUserDetails(user._id)}
                                    >
                                        Delete
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="link-container">
                <a className="back-link" href="#" onClick={() => setCurrentStep(0)}>
                    Back to Dashboard
                </a>
            </div>
        </div>
    );
};
