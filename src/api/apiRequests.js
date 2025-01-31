// Handle Signup API request
export const handleSignup = async (semail, spassword) => {
    try {
        // Send POST request to the signup API with the email and password
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ semail, spassword }),
        }); 
        // Parse the response to JSON
        const result = await response.json();
        // Check if the response is successful  
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, message: result.error };
        }
    } catch (error) {
        console.error("Signup error:", error);
        return { success: false, message: "Something went wrong" };
    }
};
 

// Handle Login API request
export const handleLogin = async (email, password) => {
    try {
        // Send POST request to the login API with the email and password
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        // Parse the response to JSON
        const result = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, message: result.error };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Something went wrong" };
    }
};


// Handle Admin Login API request
export const handleAdminLogin = async (email, password) => {
    try {
        // Send POST request to the admin-login API with the email and password
        const response = await fetch("http://localhost:5000/admin-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        // Parse the response to JSON
        const result = await response.json();
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, message: result.error };
        }
    } catch (error) {
        console.error("Admin Login error:", error);
        return { success: false, message: "Something went wrong" };
    }
};


// Save user data API request
export const handleSaveUserData = async (data) => {
    try {
        // Send POST request to the save user data API with the user data
        const response = await fetch('http://localhost:5000/save_user_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        // Check if the response is successful 
        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, message: result.error || 'Failed to save user data' };
        }
    } catch (error) {
        return { success: false, message: 'Network error, please try again' };
    }
};


// API Request to fetch users for admin
export const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/get_users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      const result = await response.json();
      console.log("Raw API Response:", result); // Debugging
  
      if (response.ok && Array.isArray(result.users)) {
        return { success: true, users: result.users }; // Ensure users is always an array
      } else {
        console.warn("Unexpected API response format:", result);
        return { success: false, users: [], message: result.error || "Failed to fetch users." };
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      return { success: false, users: [], message: "Something went wrong while fetching users." };
    }
  };
  

// API Request to fetch user data for admin
export const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/admin/get_user_data/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    console.log("Raw API Response:", result); // Debugging

    if (response.ok && result.success && result.user_data) {
      return { success: true, userDetails: result.user_data }; // Corrected to match the response field name
    } else {
      console.warn("Unexpected API response format:", result);
      return {
        success: false,
        userDetails: null,
        message: result.message || "Failed to fetch user data.",
      };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      success: false,
      userDetails: null,
      message: "Something went wrong while fetching user data.",
    };
  }
};

  
export const updateUserData = async (userData) => {
  try {
      const response = await fetch(`http://localhost:5000/admin/update_user_data/${userData._id}`, { // Update the URL to your Flask API
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json', // Make sure to set this header
          },
          body: JSON.stringify(userData), // Send the data as JSON
      });

      const data = await response.json();
      return data;
  } catch (err) {
      return { success: false, message: 'Error updating user data' };
  }
};


  
  // API Request to delete user
  export const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/admin/delete-user/${userId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: result.error || "Failed to delete user." };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, message: "Something went wrong while deleting user." };
    }
  };
  
