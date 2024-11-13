import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { apiLogin, apiRegister } from "../api/auth";
import { Platform } from "react-native";

export const AuthContext = createContext();

// AuthProvider component wraps the app and provides authentication state to children
export const AuthProvider = ({ children }) => {
  // State variables to manage authentication status and tokens
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Detect if the app is running in a web environment
  const isWeb = Platform.OS === "web";

  // Function to retrieve an item from local storage or SecureStore based on platform
  const getItem = async (key) => {
    if (isWeb) {
      return localStorage.getItem(key); // Use localStorage for web platform
    } else {
      return SecureStore.getItemAsync(key); // Use SecureStore for React Native
    }
  };

  // Function to store an item in local storage or SecureStore based on platform
  const setItem = async (key, value) => {
    if (isWeb) {
      localStorage.setItem(key, value); // Use localStorage for web platform
    } else {
      await SecureStore.setItemAsync(key, value); // Use SecureStore for React Native
    }
  };

  // Function to delete an item from local storage or SecureStore based on platform
  const deleteItem = async (key) => {
    if (isWeb) {
      localStorage.removeItem(key); // Use localStorage for web platform
    } else {
      await SecureStore.deleteItemAsync(key); // Use SecureStore for React Native
    }
  };

  // useEffect hook to check authentication status when the component mounts
  useEffect(() => {
    checkIsAuthenticated(); // Call the function to verify if the user is authenticated
  }, []);

  // Function to check if the user is authenticated by verifying stored tokens
  const checkIsAuthenticated = async () => {
    try {
      const storedAuthToken = await getItem("accessToken");
      const storedRefreshToken = await getItem("refreshToken");

      // If both access and refresh tokens exist, consider the user authenticated
      if (storedAuthToken && storedRefreshToken) {
        setAccessToken(storedAuthToken);
        setRefreshToken(storedRefreshToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("User Not Authenticated"); // Log error if token retrieval fails
    } finally {
      setLoading(false); // Set loading to false after checking authentication status
    }
  };

  // Function to handle login logic
  const login = async (username, password) => {
    try {
      const response = await apiLogin(username, password); // Call the apiLogin function to authenticate

      // Check if login was successful
      if (response.success) {
        const { access, refresh } = response.data;

        // If both tokens are present, store them and set authentication status
        if (access && refresh) {
          setAccessToken(access);
          setRefreshToken(refresh);

          await setItem("accessToken", access); // Store access token
          await setItem("refreshToken", refresh); // Store refresh token

          setIsAuthenticated(true); // Set the user as authenticated
          return { success: true }; // Return success status
        } else {
          // If tokens are missing, return failure with error details
          return { success: false, data: response.data };
        }
      } else {
        // If login failed, return failure with error details
        return { success: false, data: response.data };
      }
    } catch (error) {
      // Return failure if there's a network error during login
      return { success: false, message: "Network Error" };
    }
  };

  // Function to handle registration logic
  const register = async (username, email, password) => {
    try {
      const response = await apiRegister(username, email, password); // Call the apiRegister function to register user

      // Check if registration was successful
      if (response.success) {
        return { success: true }; // Return success if registration is successful
      } else {
        // If registration failed, return failure with error details
        return { success: false, data: response.data };
      }
    } catch (error) {
      // Return failure if there's a network error during registration
      return { success: false, message: "Network Error" };
    }
  };

  // Function to handle user logout logic
  const logout = async () => {
    // Clear authentication data and tokens from state and storage
    setAccessToken(null);
    setRefreshToken(null);

    await deleteItem("accessToken"); // Remove access token from storage
    await deleteItem("refreshToken"); // Remove refresh token from storage

    setIsAuthenticated(false); // Set authentication status to false (logged out)
  };

  // Provide authentication state and functions to the children components
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        refreshToken,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
