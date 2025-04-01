const API_BASE_URL = 'http://localhost:5000';

export const registerUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};

export const getUserFormData = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/get-form-data?user_id=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    
    const data = await response.json(); // This is where we extract the JSON
    return data;


};


/**
* Fetch all users and their form data
* @returns {Promise<Array>} - Array of user objects
*/
export const fetchAllUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return response.json();
};


export const fetchAllRecipesAdmin = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error(`Error fetching recipes: ${response.status}`);
        }

        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error('An error occurred while fetching recipes:', error);
        return { error: error.message };  // Return an error message
    }
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/delete_user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

export const handleSave = async (userId, formData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/update-profile`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                ...formData
            }),
        });

        const textResponse = await response.text(); // Read response as text
        console.log("Raw Response:", textResponse); // Log raw response

        return JSON.parse(textResponse); // Parse JSON manually
    } catch (error) {
        console.error('Error saving profile:', error);
        throw error;
    }
};
