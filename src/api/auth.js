// Define the base URL for the API
const url = "http://192.168.1.14:8000";

// Define an asynchronous function for user login
export const apiLogin = async (username, password) => {
  try {
    // Make a POST request to the login endpoint with the username and password
    const response = await fetch(`${url}/auth/token/`, {
      method: "POST", // HTTP method is POST
      headers: { "Content-Type": "application/json" }, // Setting content type to JSON
      body: JSON.stringify({ username: username, password: password }), // Send credentials as JSON
    });

    // Parse the response data
    const data = await response.json();

    // Check if the response is not ok
    if (!response.ok) {
      return { success: false, data }; // Return failure with response data
    }

    // Return success with the response data if the login is successful
    return { success: true, data };
  } catch (error) {
    // Return failure if an error occurs during the request
    return { success: false, data: null };
  }
};

// Define an asynchronous function for user registration
export const apiRegister = async (username, email, password) => {
  try {
    // Make a POST request to the registration endpoint with username, email, and password
    const response = await fetch(`${url}/auth/users/`, {
      method: "POST", // HTTP method is POST
      headers: { "Content-Type": "application/json" }, // Setting content type to JSON
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }), // Send registration data as JSON
    });

    // Parse the response data
    const data = await response.json();

    // Check if the response is not ok (e.g., username already exists)
    if (!response.ok) {
      return { success: false, data }; // Return failure with response data
    }

    // Return success with the response data if the registration is successful
    return { success: true, data };
  } catch (error) {
    // Return failure if an error occurs during the request
    return { success: false, data: null };
  }
};
