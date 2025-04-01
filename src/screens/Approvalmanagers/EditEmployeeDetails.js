import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import PhoneInput from "react-native-phone-input";
import { getApprovalManagersdataById, getEmployeedataById, updateEmployeedandApprovalManagerDataById } from "../aftherlogin";
import { useNavigation } from "@react-navigation/native";

const EditEmployeeDetails = ({ route }) => {
  const { id, page, role } = route.params;
  const navigation = useNavigation();
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);

  // State for phone details
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneIsoCode, setPhoneIsoCode] = useState("in");

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("+91");
  const [whatsappIsoCode, setWhatsappIsoCode] = useState("in");

  const phoneInputRef = useRef(null);
  const whatsappInputRef = useRef(null);

  useEffect(() => {
    if (role === "Employee") {
      fetchEmployeeDetails();
    } else if (role === "ApprovalManager") {
      fetchApprovalManagerDetails();
    }
  }, [id, role]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await getEmployeedataById(id);
      console.log("employee data is :",response)
      setEmployee(response);
      populateFields(response);
    } catch (error) {
      console.log("Error fetching employee details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovalManagerDetails = async () => {
    setLoading(true);
    try {
      const response = await getApprovalManagersdataById(id);
      console.log("approval managers  data is :",response)

      setEmployee(response);
      populateFields(response);
    } catch (error) {
      console.log("Error fetching approval manager details:", error);
    } finally {
      setLoading(false);
    }
  };

  const populateFields = (data) => {
    setPhoneCountryCode(data.mobileCountryCode || "+91");
    setPhoneNumber(data.mobileNumber || "");
    setPhoneIsoCode(data.mobileIsoCode || "in");

    setWhatsappCountryCode(data.whatsappCountryCode || "+91");
    setWhatsappNumber(data.whatsAppNumber || "");
    setWhatsappIsoCode(data.whatsappIsoCode || "in");
  };

  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    if (phoneInputRef.current) {
      setPhoneCountryCode(phoneInputRef.current.getCountryCode());
      setPhoneIsoCode(phoneInputRef.current.getISOCode());
    }
  };

  const handleWhatsappNumberChange = (text) => {
    setWhatsappNumber(text);
    if (whatsappInputRef.current) {
      setWhatsappCountryCode(whatsappInputRef.current.getCountryCode());
      setWhatsappIsoCode(whatsappInputRef.current.getISOCode());
    }
  };

  const handleUpdate = async () => {
    if (!employee) return;

    const updatedData = {
      ...employee,
      mobileCountryCode: phoneCountryCode,
      mobileIsoCode: phoneIsoCode,
      mobileNumber: phoneNumber,
      whatsappCountryCode: whatsappCountryCode,
      whatsappIsoCode: whatsappIsoCode,
      whatsAppNumber: whatsappNumber,
    };

    try {
      const updatedEmployee = await updateEmployeedandApprovalManagerDataById(updatedData);
      if (updatedEmployee) {
        alert(`${role} details updated successfully!`);
        navigation.navigate(page);
      }
    } catch (error) {
      console.log("Error updating details:", error);
      alert("Failed to update details.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit {role} Details</Text>

      {employee ? (
        <View style={styles.details}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput
            style={styles.nameInput}
            value={employee?.firstName || ""}
            onChangeText={(text) => setEmployee({ ...employee, firstName: text })}
          />

          <Text style={styles.label}>Last Name:</Text>
          <TextInput
            style={styles.nameInput}
            value={employee?.lastName || ""}
            onChangeText={(text) => setEmployee({ ...employee, lastName: text })}
          />

          {/* Mobile Number */}
          <Text style={styles.label}>Mobile Number:</Text>
          <View style={styles.phoneContainer}>
            <PhoneInput
              ref={phoneInputRef}
              initialValue={phoneCountryCode}
              onChangePhoneNumber={handlePhoneNumberChange}
              style={styles.phonePicker}
            />
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
            />
          </View>

          {/* WhatsApp Number */}
          <Text style={styles.label}>WhatsApp Number:</Text>
          <View style={styles.phoneContainer}>
            <PhoneInput
              ref={whatsappInputRef}
              initialValue={whatsappCountryCode}
              onChangePhoneNumber={handleWhatsappNumberChange}
              style={styles.phonePicker}
            />
            <TextInput
              style={styles.input}
              value={whatsappNumber}
              onChangeText={handleWhatsappNumberChange}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>No details found.</Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate(page)}>
        <Text style={styles.closeButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  details: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  nameInput: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 5,
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phonePicker: {
    width: 80,
    marginRight: 10,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
  },
  submitButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 50,
  },
});

export default EditEmployeeDetails;
