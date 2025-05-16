import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";

const EditProfile = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [experience, setExperience] = useState("");
  const [jobRole, setJobRole] = useState("");
 const [errors, setErrors] = useState({
   firstName: "",
   lastName: "",
   jobRole: "",
   phone: "",
   whatsapp: "",
   experience: "",
 });

 const validateForm = () => {
   let valid = true;
   let newErrors = {
     firstName: "",
     lastName: "",
     jobRole: "",
     phone: "",
     whatsapp: "",
     experience: "",
   };

   // Text Validations
   if (!firstName.trim()) {
     newErrors.firstName = "First Name is required.";
     valid = false;
   }

   if (!lastName.trim()) {
     newErrors.lastName = "Last Name is required.";
     valid = false;
   }

   if (!jobRole.trim()) {
     newErrors.jobRole = "Job Role is required.";
     valid = false;
   }

   // Phone Number Validation
   const phoneRegex = /^\+?[1-9]\d{7,14}$/; // Allows optional '+' and 8-15 digits
   if (!phone.trim()) {
     newErrors.phone = "Phone number is required.";
     valid = false;
   } else if (!phoneRegex.test(phone)) {
     newErrors.phone = "Invalid phone number format.";
     valid = false;
   }

   // WhatsApp Number Validation
   if (!whatsapp.trim()) {
     newErrors.whatsapp = "WhatsApp number is required.";
     valid = false;
   } else if (!phoneRegex.test(whatsapp)) {
     newErrors.whatsapp = "Invalid WhatsApp number format.";
     valid = false;
   }

   // Experience Validation
   if (!experience.trim()) {
     newErrors.experience = "Experience is required.";
     valid = false;
   } else if (isNaN(experience) || parseInt(experience) < 0) {
     newErrors.experience = "Experience must be a valid number.";
     valid = false;
   }

   setErrors(newErrors);
   return valid;
 };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert("Success", "User details updated successfully!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Update User Details</Text>
      <Text style={styles.label}>{" "}</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      {errors.firstName ? (
        <Text style={{ color: "red" }}>{errors.firstName}</Text>
      ) : null}
      {/* <Text style={styles.label}>Last Name</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {errors.lastName ? (
        <Text style={{ color: "red" }}>{errors.lastName}</Text>
      ) : null}
      {/* <Text style={styles.label}>Phone Number</Text> */}
      <PhoneInput
        defaultCode="IN"
        layout="first"
        onChangeFormattedText={setPhone}
        containerStyle={styles.phoneInputContainer}
        textContainerStyle={styles.textContainer}
        flagButtonStyle={styles.flagButton}
        textInputStyle={styles.phoneNumberInput}
      />
      {errors.phone ? (
        <Text style={{ color: "red" }}>{errors.phone}</Text>
      ) : null}
      {/* <Text style={styles.label}>Whatsapp Number</Text> */}
      <PhoneInput
        defaultCode="IN"
        layout="first"
        onChangeFormattedText={setWhatsapp}
        containerStyle={styles.phoneInputContainer}
        textContainerStyle={styles.textContainer}
        flagButtonStyle={styles.flagButton}
        textInputStyle={styles.phoneNumberInput}
      />
      {errors.whatsapp ? (
        <Text style={{ color: "red" }}>{errors.whatsapp}</Text>
      ) : null}
      {/* <Text style={styles.label}>Experience</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Experience (years)"
        value={experience}
        onChangeText={setExperience}
        keyboardType="numeric"
      />
      {errors.experience ? (
        <Text style={{ color: "red" }}>{errors.experience}</Text>
      ) : null}
      {/* <Text style={styles.label}>Job Role</Text> */}
      <TextInput
        style={styles.input}
        placeholder="Job Role"
        value={jobRole}
        onChangeText={setJobRole}
      />
      {errors.jobRole ? (
        <Text style={{ color: "red" }}>{errors.jobRole}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    margin: 8,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#ff6600",
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
   label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop:4,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  phoneInputContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  textContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flex: 1,
    paddingVertical: 5,
  },
  flagButton: {
    width: 60, // Adjust width for country code
    justifyContent: "center",
    alignItems: "center",
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#FFA500", // Orange background
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#FF4500", // Red-Orange for cancel
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#ffffff", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#ffffff", // White text for better readability
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;
