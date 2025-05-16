import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios'; // Import Axios
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Button, Snackbar } from 'react-native-paper'; // Import Snackbar for custom alerts
import OTPTime from "../components/OTPTime";
import { useNavigation } from "@react-navigation/native";

export default function Otp({ route }) {
  const [otp, setOtp] = useState(["", "", "", ""]); // State to hold OTP input values
  const [loading, setLoading] = useState(false); 
  const [userEmail, setUserEmail] = useState(""); 
  const [userToken, setUserToken] = useState("");   
  const [alertMessage, setAlertMessage] = useState(""); 
  const [visible, setVisible] = useState(false); 
  const otpInputs = useRef([]);
  const navigation = useNavigation(); 

  useEffect(() => {
    const getUserDataFromStorage = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        const token = await AsyncStorage.getItem("token");

        if (email !== null) {
          setUserEmail(email); // Set the email if it exists in storage
        }
        if (token !== null) {
          setUserToken(token); // Set the token if it exists in storage
        }
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage", error);
      }
    };

    getUserDataFromStorage(); // Call the function when the component mounts
  }, []);

  const handleOtpValidation = async () => {

    const otpString = otp.join(""); // Convert OTP array to string
  
    if (otpString.length !== 4) {
      setAlertMessage("Please enter all 4 OTP digits.");
      setVisible(true);
      return;
    }

  
    try {
      // Retrieve email & orgId from AsyncStorage
      const storedEmail = await AsyncStorage.getItem("email");
      const orgId = await AsyncStorage.getItem("id");
  
      if (!storedEmail || !orgId) {
        setAlertMessage("User email or organization ID not found.");
        setVisible(true);
        return;
      }
  
      // ✅ Correctly format API URL using orgId
      const apiUrl = `https://www.gatnix.com/api/v1/${orgId}/reset-password/email-validation`;
  
      // Make API request
      const response = await axios.post(
        apiUrl,
        {
          resetToken: otpString, // OTP entered by user
          email: storedEmail,    // Email stored in AsyncStorage
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
 
      // ✅ Handle valid response
      console.log("response", response) 
      AsyncStorage.setItem("response", response)
      if (response) {
        setAlertMessage("OTP validated successfully.");
        setVisible(true);

        navigation.navigate("Main"); // Navigate after successful OTP validation

      } else {
        setAlertMessage("Invalid OTP or email.");
        setVisible(true);
      }
    } catch (error) {
      
      console.error("Error in handleOtpValidation:", error);
  
      // ✅ Handle API errors
      if (error.response) {
        setAlertMessage(error.response.data || "Invalid OTP.");
      } else {
        setAlertMessage("Something went wrong. Please try again.");
      }
      setVisible(true);
    }
  };
  

  // Function to handle OTP input change and focus to the next field
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move focus to the next input field when a digit is entered
    if (text && index < otp.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  // Function to handle focus on the previous input field if needed
  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>OTP</Text>
        <Text style={styles.subtitle}>
          Please enter the 4-digit OTP sent to your email.
        </Text>
        <View>
          <OTPTime  navigation={navigation}/>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              value={digit}
              onChangeText={(text) => {
                handleOtpChange(text, index);
                handleBackspace(text, index); // Handle backspace to move focus back
              }}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              autoFocus={index === 0}
              ref={(ref) => (otpInputs.current[index] = ref)} // Assign refs dynamically
            />
          ))}
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleOtpValidation} disabled={loading}>
          <Text style={styles.signUpButtonText}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Text>
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

        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
          <Text style={styles.signInText}>
            Already Have An Account? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert using Snackbar */}
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={styles.snackbar}
      >
        {alertMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  otpInput: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    width: 60,
    textAlign: "center",
    fontSize: 18,
    margin: 2,
  },
  signUpButton: {
    backgroundColor: "#5A55CA",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
    maxWidth: 350,
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
  snackbar: {
    backgroundColor: "#5A55CA", // Custom background color for Snackbar
    color: "#fff", // Text color
    marginBottom: 150, // To avoid overlap with the button
  },
});
