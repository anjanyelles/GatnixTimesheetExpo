import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import DatePicker from "react-native-datepicker";
import moment from "moment";

const AddJobDetails = ({ navigation }) => {
  const [form, setForm] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!form.jobTitle) newErrors.jobTitle = "Job Title is required";
    if (!form.companyName) newErrors.companyName = "Company Name is required";
    if (!form.startDate) newErrors.startDate = "Start Date is required";
    if (!form.endDate) newErrors.endDate = "End Date is required";
    if (!form.description) newErrors.description = "Description is required";
    else if (
      moment(form.endDate, "DD-MM-YYYY").isBefore(
        moment(form.startDate, "DD-MM-YYYY")
      )
    ) {
      newErrors.endDate = "End Date must be after Start Date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert("Success", "Job details saved successfully!");
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Job Details</Text>

      <Text style={styles.label}>Job Title*</Text>
      <TextInput
        style={[styles.input, errors.jobTitle && styles.errorInput]}
        placeholder="Enter Job Title"
        value={form.jobTitle}
        onChangeText={(text) => setForm({ ...form, jobTitle: text })}
      />
      {errors.jobTitle && (
        <Text style={styles.errorText}>{errors.jobTitle}</Text>
      )}

      <Text style={styles.label}>Company Name*</Text>
      <TextInput
        style={[styles.input, errors.companyName && styles.errorInput]}
        placeholder="Enter Company Name"
        value={form.companyName}
        onChangeText={(text) => setForm({ ...form, companyName: text })}
      />
      {errors.companyName && (
        <Text style={styles.errorText}>{errors.companyName}</Text>
      )}

      <Text style={styles.label}>Start Date*</Text>
      <DatePicker
        style={styles.datePicker}
        date={form.startDate}
        mode="date"
        placeholder="dd-mm-yyyy"
        format="DD-MM-YYYY"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{ dateInput: styles.dateInput }}
        onDateChange={(date) => setForm({ ...form, startDate: date })}
      />
      {errors.startDate && (
        <Text style={styles.errorText}>{errors.startDate}</Text>
      )}

      <Text style={styles.label}>End Date*</Text>
      <DatePicker
        style={styles.datePicker}
        date={form.endDate}
        mode="date"
        placeholder="dd-mm-yyyy"
        format="DD-MM-YYYY"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{ dateInput: styles.dateInput }}
        onDateChange={(date) => setForm({ ...form, endDate: date })}
      />
      {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

      <Text style={styles.label}>Description*</Text>
      <TextInput
        style={[styles.input, errors.description && styles.errorInput]}
        placeholder="Enter Job Description"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
      />
      {errors.description && (
        <Text style={styles.errorText}>{errors.description}</Text>
      )}

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
    margin: 10,
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
    marginTop: 10,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 5,
    backgroundColor: "#fff",
  },
  datePicker: {
    width: "100%",
    marginTop: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignItems: "flex-start",
    paddingLeft: 10,
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  errorInput: {
    borderColor: "red",
  },
});

export default AddJobDetails;
