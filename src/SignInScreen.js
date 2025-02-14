import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios'; // Import Axios
import { Snackbar } from 'react-native-paper'; // Import Snackbar for custom messages
import MultipleLogin from "./screens/MultipleLogin";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("tejavishwa012@gmail.com");
  const [password, setPassword] = useState("Test@123");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState(""); // For Snackbar message
  const [snackVisible, setSnackVisible] = useState(false); // Snackbar visibility
  const [loginData ,setLoginData] =useState([])
  const [carddata , setcarddata]=useState(false)

  // Function to handle login API request using Axios
  const handleLogin = async () => {
    if (!email || !password) {
      setSnackMessage("Please fill in all fields.");
      setSnackVisible(true);
      return;
    }
  
    try {
      const response = await axios.post(
        "https://www.gatnix.com/api/v1/auth/login/timesheet", // Ensure this is correct
        {
          email: email, // Match API parameter names
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("API Response:", response.data); // Log the entire response
  
      if (response.data) {
        const responseBody = response.data;
  
        // Extract token and user ID properly
        const token = responseBody.accessToken || responseBody.token || null;
        const userId = responseBody.id || null;
  
        // Debugging logs
        // console.log("responselll",responseBody.orgUserAssociations[0].organization.id)
        console.log("Token:", token);
        console.log("User ID:", userId);
        console.log("Email:", email);
  
        // Ensure values are not null before storing them
        if (token) await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("orgId", String(responseBody.orgUserAssociations[0].organization.id));
        

        if (userId) await AsyncStorage.setItem("id", JSON.stringify(userId));
        await AsyncStorage.setItem("email", email);
  
        setLoginData(response.data);
        setcarddata(true);
        // Show success message
        setSnackMessage("Login successful. Redirecting...");
        setSnackVisible(true);
  
        // Navigate to OTP screen
        navigation.navigate("OtpScreen", { email });
      } else {
        setSnackMessage(response.data?.message || "Invalid email or password.");
        setSnackVisible(true);
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setSnackMessage(error.response?.data?.message || "Something went wrong. Try again.");
      setSnackVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back to Top */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setSnackMessage("Back to top triggered!");
          setSnackVisible(true);
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

  {carddata ? <><MultipleLogin data={loginData} /></> : <>    <View style={styles.formContainer}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Sign in to get started with the power of Gatnix AI.
        </Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color="grey"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
          <Text style={styles.signUpButtonText}>Sign In</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Or</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-google" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SignUpScreen", { screen: "SignUpScreen" })
          }
        >
          <Text style={styles.signInText}>
            Already Have An Account? <Text style={styles.signInLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Snackbar for success/error messages */}
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={snackMessage.includes("success") ? styles.snackbarSuccess : styles.snackbarError}
      >
        {snackMessage}
      </Snackbar></>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center", // Centers the form vertically
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center", // Centers the content vertically within the form
    alignItems: "center", // Centers the content horizontally
    width: "100%", // Ensures the form takes up full width
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "grey",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    width: "100%", // Ensures inputs are not too narrow
    maxWidth: 350, // Optional: Limits the width of the inputs
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    zIndex: 1,
  },
  signUpButton: {
    backgroundColor: "#5A55CA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    maxWidth: 350, // Optional: Limits the width of the button
  },
  signUpButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    fontSize: 14,
    color: "grey",
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  signInText: {
    textAlign: "center",
    fontSize: 14,
  },
  signInLink: {
    color: "#5A55CA",
    fontWeight: "bold",
  },
  snackbarSuccess: {
    backgroundColor: "#4caf50", // Green for success
    color: "#fff", // Text color
  },
  snackbarError: {
    backgroundColor: "#f44336", // Red for error
    color: "#fff", // Text color
  },
});
