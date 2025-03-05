// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   ScrollView,
// } from "react-native";
// import { Input, Button } from "react-native-elements";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Formik } from "formik";
// import * as Yup from "yup";

// const validationSchema = Yup.object().shape({
//   establishment: Yup.string().required("Establishment name is required."),
//   educationLevel: Yup.string().required("Education level is required."),
//   location: Yup.string().required("Location is required."),
//   startDate: Yup.date().required("Start date is required."),
//   endDate: Yup.date()
//     .required("End date is required.")
//     .min(Yup.ref("startDate"), "End date cannot be before start date."),
// });

// const AddEducationDetails = ({ navigation }) => {
//   const [isStartDatePickerVisible, setStartDatePickerVisibility] =
//     useState(false);
//   const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

//   return (
//     <Formik
//       initialValues={{
//         establishment: "",
//         educationLevel: "",
//         startDate: new Date(),
//         endDate: new Date(),
//         location: "",
//       }}
//       validationSchema={validationSchema}
//       onSubmit={(values) => {
//         alert("Educational details saved successfully!");
//       }}
//     >
//       {({
//         values,
//         errors,
//         touched,
//         handleChange,
//         setFieldValue,
//         handleSubmit,
//       }) => (
//         <ScrollView contentContainerStyle={styles.container}>
//           <Text style={styles.title}>Add Educational Details</Text>

//           <Input
//             label="Establishment"
//             placeholder="Enter Institution Name"
//             value={values.establishment}
//             onChangeText={handleChange("establishment")}
//             errorMessage={touched.establishment && errors.establishment}
//           />

//           <Input
//             label="Education Level"
//             placeholder="Enter Degree / Diploma"
//             value={values.educationLevel}
//             onChangeText={handleChange("educationLevel")}
//             errorMessage={touched.educationLevel && errors.educationLevel}
//           />

//           <Text style={styles.label}>Start Date</Text>
//           <TouchableOpacity
//             style={styles.dateInput}
//             onPress={() => setStartDatePickerVisibility(true)}
//           >
//             <Text>{values.startDate.toDateString()}</Text>
//           </TouchableOpacity>
//           <DateTimePickerModal
//             isVisible={isStartDatePickerVisible}
//             mode="date"
//             onConfirm={(date) => {
//               setStartDatePickerVisibility(false);
//               setFieldValue("startDate", date);
//             }}
//             onCancel={() => setStartDatePickerVisibility(false)}
//           />

//           <Text style={styles.label}>End Date</Text>
//           <TouchableOpacity
//             style={styles.dateInput}
//             onPress={() => setEndDatePickerVisibility(true)}
//           >
//             <Text>{values.endDate.toDateString()}</Text>
//           </TouchableOpacity>
//           <DateTimePickerModal
//             isVisible={isEndDatePickerVisible}
//             mode="date"
//             onConfirm={(date) => {
//               setEndDatePickerVisibility(false);
//               setFieldValue("endDate", date);
//             }}
//             onCancel={() => setEndDatePickerVisibility(false)}
//           />
//           {touched.endDate && errors.endDate && (
//             <Text style={styles.errorText}>{errors.endDate}</Text>
//           )}

//           <Input
//             label="Location"
//             placeholder="Enter Location"
//             value={values.location}
//             onChangeText={handleChange("location")}
//             errorMessage={touched.location && errors.location}
//           />

//           <View style={styles.buttonContainer}>
//             <Button
//               title="Save"
//               buttonStyle={styles.saveButton}
//               onPress={handleSubmit}
//             />
//             <Button
//               title="Cancel"
//               buttonStyle={styles.cancelButton}
//               onPress={() => navigation.goBack()}
//             />
//           </View>
//         </ScrollView>
//       )}
//     </Formik>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#333",
//   },
//   label: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 5,
//   },
//   dateInput: {
//     width: "100%",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 15,
//   },
//   saveButton: {
//     backgroundColor: "#28a745",
//     padding: 15,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: "center",
//     marginRight: 5,
//   },
//   cancelButton: {
//     backgroundColor: "#dc3545",
//     padding: 15,
//     borderRadius: 8,
//     flex: 1,
//     alignItems: "center",
//     marginLeft: 5,
//   },
// });

// export default AddEducationDetails;
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

const AddEducationDetails = ({ navigation }) => {
  const [form, setForm] = useState({
    establishment: "",
    educationLevel: "",
    startDate: "",
    endDate: "",
    location: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!form.establishment)
      newErrors.establishment = "Establishment is required";
    if (!form.educationLevel)
      newErrors.educationLevel = "Education Level is required";
    if (!form.startDate) newErrors.startDate = "Start Date is required";
    if (!form.endDate) newErrors.endDate = "End Date is required";
    if (!form.location) newErrors.location = "Location is required";
    else if (
      moment(form.endDate, "DD-MM-YYYY").isBefore(
        moment(form.startDate, "DD-MM-YYYY")
      )
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert("Success", "Education details saved successfully!");
      navigation.goBack(); // Navigate back or perform an API call
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Education Details</Text>

      {/* Establishment Input */}
      <Text style={styles.label}>Establishment*</Text>
      <TextInput
        style={[styles.input, errors.establishment && styles.errorInput]}
        placeholder="Enter Here"
        value={form.establishment}
        onChangeText={(text) => setForm({ ...form, establishment: text })}
      />
      {errors.establishment && (
        <Text style={styles.errorText}>{errors.establishment}</Text>
      )}

      {/* Education Level Input */}
      <Text style={styles.label}>Education Level*</Text>
      <TextInput
        style={[styles.input, errors.educationLevel && styles.errorInput]}
        placeholder="Enter Here"
        value={form.educationLevel}
        onChangeText={(text) => setForm({ ...form, educationLevel: text })}
      />
      {errors.educationLevel && (
        <Text style={styles.errorText}>{errors.educationLevel}</Text>
      )}

      {/* Start Date Picker */}
      <Text style={styles.label}>Start Date*</Text>
      <DatePicker
        style={styles.datePicker}
        date={form.startDate}
        mode="date"
        placeholder="dd-mm-yyyy"
        format="DD-MM-YYYY"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateInput: styles.dateInput,
        }}
        onDateChange={(date) => setForm({ ...form, startDate: date })}
      />
      {errors.startDate && (
        <Text style={styles.errorText}>{errors.startDate}</Text>
      )}

      {/* End Date Picker */}
      <Text style={styles.label}>End Date*</Text>
      <DatePicker
        style={styles.datePicker}
        date={form.endDate}
        mode="date"
        placeholder="dd-mm-yyyy"
        format="DD-MM-YYYY"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateInput: styles.dateInput,
        }}
        onDateChange={(date) => setForm({ ...form, endDate: date })}
      />
      {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

      {/* Location Input */}
      <Text style={styles.label}>Location*</Text>
      <TextInput
        style={[styles.input, errors.location && styles.errorInput]}
        placeholder="Enter Location"
        value={form.location}
        onChangeText={(text) => setForm({ ...form, location: text })}
      />
      {errors.location && (
        <Text style={styles.errorText}>{errors.location}</Text>
      )}

      {/* Save & Cancel Buttons */}
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

export default AddEducationDetails;
