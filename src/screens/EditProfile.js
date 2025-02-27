import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { handelGetProfileData, handelUpdateProfileData } from "./aftherlogin";
import { parseISO, differenceInYears, differenceInMonths } from "date-fns";

const EditProfile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    mobileCountryCode: "+91", // Default country code
    whatsAppNumber: "",
    whatsappCountryCode: "+91",
  });

  const [workDetails, setWorkDetails] = useState([{ jobTitle: "", startDate: "", endDate: "" }]);
  const [experience, setExperience] = useState("");

  // Fetch Profile Data
  useEffect(() => {
    const getProfileDetails = async () => {
      const response = await handelGetProfileData();
      if (response) {
        setUser({
          firstName: response.user?.firstName || "",
          lastName: response.user?.lastName || "",
          mobile: response.user?.mobile || "",
          mobileCountryCode: response.user?.mobileCountryCode || "+91",
          whatsAppNumber: response.user?.whatsAppNumber || "",
          whatsappCountryCode: response.user?.whatsappCountryCode || "+91",
        });

        if (response.workDetails?.length > 0) {
          setWorkDetails(response.workDetails);
          const exp = calculateExperience(response.workDetails[0]?.startDate, response.workDetails[0]?.endDate);
          setExperience(exp);
        }
      }
    };

    getProfileDetails();
  }, []);

  // Calculate Experience
  const calculateExperience = (start, end) => {
    if (!start || !end) return "";
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    const years = differenceInYears(endDate, startDate);
    const months = differenceInMonths(endDate, startDate) % 12;
    return `${years} years ${months} months`;
  };

  // Handle Save Changes
  const handleSaveProfile = async () => {
    const updatedData = {
      id: 263, // If available from user data
      userId: 609, // If available from user data
      orgId: 172, // If available from user data
      firstName: user.firstName,
      lastName: user.lastName,
      mobileNumber: user.mobile, // Mapping to mobileNumber
      mobileIsoCode: "in", // Assuming "in" for India, modify accordingly
      mobileCountryCode: user.mobileCountryCode,
      whatsAppNumber: user.whatsAppNumber,
      whatsappIsoCode: "in", // Assuming "in" for India, modify accordingly
      whatsappCountryCode: user.whatsappCountryCode,
      loginStatus: true, // Set as per requirement
      schedulerStatus: true, // Set as per requirement
      managingAdminId: null, // Set if applicable
      managingEmployerId: null, // Set if applicable
      associatedRole: "super-admin", // Set user role dynamically if needed
      userUUID: "bb9f0498-7fe9-43da-8c65-17a9d0a098eb", // Set dynamically if needed
      email: "tejavishwa012@gmail.com", // Set user email dynamically if needed
      jobTitle: workDetails[0]?.jobTitle, // Job title from workDetails
    };
    
      

    try {
      const response = await handelUpdateProfileData(updatedData);
      console.log("response",response)
      if (response) {
        Alert.alert("Success", "Profile updated successfully!");
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={user.firstName}
        onChangeText={(text) => setUser({ ...user, firstName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={user.lastName}
        onChangeText={(text) => setUser({ ...user, lastName: text })}
      />

      {/* Mobile Number with Country Code */}
      <View style={styles.row}>
        <TextInput
          style={styles.countryCodeInput}
          placeholder="+91"
          value={user.mobileCountryCode}
          onChangeText={(text) => setUser({ ...user, mobileCountryCode: text })}
        />
        <TextInput
          style={styles.phoneInput}
          placeholder="Phone Number"
          value={user.mobile}
          onChangeText={(text) => setUser({ ...user, mobile: text })}
        />
      </View>

      {/* WhatsApp Number with Country Code */}
      <View style={styles.row}>
        <TextInput
          style={styles.countryCodeInput}
          placeholder="+91"
          value={user.whatsappCountryCode}
          onChangeText={(text) => setUser({ ...user, whatsappCountryCode: text })}
        />
        <TextInput
          style={styles.phoneInput}
          placeholder="WhatsApp Number"
          value={user.whatsAppNumber}
          onChangeText={(text) => setUser({ ...user, whatsAppNumber: text })}
        />
      </View>

      <TextInput style={styles.input} placeholder="Experience" value={experience} editable={false} />
      
      <TextInput
        style={styles.input}
        placeholder="Job Role"
        value={workDetails[0]?.jobTitle}
        onChangeText={(text) =>
          setWorkDetails([{ ...workDetails[0], jobTitle: text }])
        }
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  countryCodeInput: {
    width: "20%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
    textAlign: "center",
  },
  phoneInput: {
    width: "75%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;
