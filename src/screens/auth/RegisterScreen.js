import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";

const RegisterScreen = ({ navigation }) => {
  // State variables to hold user input and error messages
  const [username, setUsername] = useState("");  // Store the username input
  const [email, setEmail] = useState("");  // Store the email input
  const [password, setPassword] = useState("");  // Store the password input
  const [confirmPassword, setConfirmPassword] = useState("");  // Store the password confirmation input
  const [errorMessages, setErrorMessages] = useState([]);  // Store an array of error messages

  // Destructure the register function from the useAuth hook
  const { register } = useAuth();

  // Function to handle the registration process
  const handleRegister = async () => {
    let errors = [];  // Initialize an array to collect errors

    // Check if all fields are filled
    if (!username || !email || !password || !confirmPassword) {
      errors.push("All fields are required.");  // Add error if any field is empty
    }

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address.");  // Add error if email format is invalid
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");  // Add error if passwords don't match
    }

    // If there are validation errors, set the error messages and stop the registration
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }

    // Proceed with the registration API call
    const result = await register(username, email, password);

    // If registration fails, flatten the errors from the API response
    if (!result.success) {
      const errorsFromServer = result.data || {};
      let flattenedErrors = [];

      // Flatten any nested errors from the response
      for (const field in errorsFromServer) {
        if (Array.isArray(errorsFromServer[field])) {
          flattenedErrors = [...flattenedErrors, ...errorsFromServer[field]];
        }
      }

      setErrorMessages(flattenedErrors);  // Set the flattened error messages
    } else {
      setErrorMessages([]);  // Clear error messages on successful registration
      // Optionally, navigate to the Login screen after successful registration
      navigation.navigate("Login");
    }
  };

  // Function to render error messages
  const renderErrors = () => {
    return errorMessages.map((error, index) => (
      <View key={index} style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text> 
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword} 
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry 
          style={styles.input}
        />

        {renderErrors()}

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text> 
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Login")}>
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
  errorContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    fontSize: 14,
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

export default RegisterScreen;
