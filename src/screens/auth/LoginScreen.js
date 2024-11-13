import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen = ({ navigation }) => {
  // State variables for storing user input and error messages
  const [username, setUsername] = useState(""); // Store the username input
  const [password, setPassword] = useState(""); // Store the password input
  const [errorMessage, setErrorMessage] = useState(""); // Store the error message

  // Destructure the login function from the authentication hook
  const { login } = useAuth();

  // Function to handle the login process
  const handleLogin = async () => {
    // Check if both fields are filled
    if (!username || !password) {
      setErrorMessage("Both fields are required."); // Set error message if fields are empty
      return;
    }

    // Call the login function from the useAuth hook
    const result = await login(username, password);

    // If login fails, display the error message returned by the API
    if (!result.success) {
      setErrorMessage(result.data.detail); // Set the error message from the API response
    } else {
      setErrorMessage(""); // Clear any error messages if login is successful
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {/* Username input field */}
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername} // Update the username state on input change
          style={styles.input}
        />
        {/* Password input field */}
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword} // Update the password state on input change
          secureTextEntry // Hide the password input for security
          style={styles.input}
        />
        {/* Display error message if present */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        {/* Login button */}
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        {/* Navigate to the Register screen if user doesn't have an account */}
        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerText}>
            Don't have an account? Register here
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

// Styling for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    color: "#007BFF",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
