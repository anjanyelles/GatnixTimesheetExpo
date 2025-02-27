import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const EmployeeForm = ({ onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileCountryCode, setMobileCountryCode] = useState("+1");
  const [mobileIsoCode, setMobileIsoCode] = useState("us");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("+1");
  const [whatsappIsoCode, setWhatsappIsoCode] = useState("us");
  const [sameAsMobile, setSameAsMobile] = useState(false);

  const handleSameAsMobile = () => {
    setSameAsMobile(!sameAsMobile);
    if (!sameAsMobile) {
      setWhatsappNumber(mobile);
      setWhatsappCountryCode(mobileCountryCode);
      setWhatsappIsoCode(mobileIsoCode);
    } else {
      setWhatsappNumber("");
      setWhatsappCountryCode("+1");
      setWhatsappIsoCode("us");
    }
  };

  const handleSubmit = async () => {
    const payload = {
      firstName,
      lastName,
      email,
      password,
      mobile,
      mobileCountryCode,
      mobileIsoCode,
      whatsAppNumber: whatsappNumber,
      whatsappCountryCode,
      whatsappIsoCode,
      organizationId: "226",
      role: "approvalManagers",
      username: email.split("@")[0], // Use email prefix as username
      loginStatus: true,
      schedulerStatus: true,
      createdDate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch("https://www.gatnix.com/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Employee registered successfully!");
      } else {
        Alert.alert("Error", data.message || "Failed to register employee.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* First Name & Last Name */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      {/* Email & Password */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Mobile Number with Country Code */}
      <View style={styles.row}>
        <TextInput
          style={styles.countryCodeInput}
          placeholder="+1"
          keyboardType="phone-pad"
          value={mobileCountryCode}
          onChangeText={setMobileCountryCode}
        />
        <TextInput
          style={[styles.input, styles.flex]}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text);
            if (sameAsMobile) {
              setWhatsappNumber(text);
            }
          }}
        />
      </View>

      {/* WhatsApp Number Checkbox */}
      <View style={styles.whatsappRow}>
        <TouchableOpacity
          style={[styles.checkbox, sameAsMobile && styles.checkboxChecked]}
          onPress={handleSameAsMobile}
        >
          {sameAsMobile && <Ionicons name="checkmark" size={14} color="white" />}
        </TouchableOpacity>
        <Text style={styles.whatsappLabel}>Same As Mobile Number</Text>
      </View>

      {/* WhatsApp Number with Country Code */}
      <View style={styles.row}>
        <TextInput
          style={styles.countryCodeInput}
          placeholder="+1"
          keyboardType="phone-pad"
          value={whatsappCountryCode}
          onChangeText={setWhatsappCountryCode}
          editable={!sameAsMobile}
        />
        <TextInput
          style={[styles.input, styles.flex]}
          placeholder="WhatsApp Number"
          keyboardType="phone-pad"
          value={whatsappNumber}
          onChangeText={setWhatsappNumber}
          editable={!sameAsMobile}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  countryCodeInput: {
    width: 60,
    height: 45,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  flex: {
    flex: 1,
  },
  whatsappRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#007bff",
  },
  whatsappLabel: {
    fontSize: 14,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default EmployeeForm;
