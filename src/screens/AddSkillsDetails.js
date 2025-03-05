// import React from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { Slider } from "react-native-elements";
// import { Formik } from "formik";
// import * as Yup from "yup";

// // Validation Schema
// const SkillSchema = Yup.object().shape({
//   skillName: Yup.string().trim().required("Skill name is required"),
//   skillVersion: Yup.string().trim().required("Version is required"),
//   skillRating: Yup.number()
//     .min(1, "Rating must be at least 1")
//     .max(100, "Rating must be at most 100")
//     .required("Rating is required"),
// });

// const AddSkillsDetails = ({ navigation }) => {
//   return (
//     <Formik
//       initialValues={{ skillName: "", skillRating: 50, skillVersion: "" }}
//       validationSchema={SkillSchema}
//       onSubmit={(values) => {
//         alert(`Skill saved: ${JSON.stringify(values, null, 2)}`);
//       }}
//     >
//       {({
//         values,
//         errors,
//         touched,
//         handleChange,
//         handleSubmit,
//         setFieldValue,
//       }) => (
//         <View style={styles.container}>
//           <Text style={styles.title}>Add Skill Details</Text>

//           {/* Skill Name */}
//           <Text style={styles.label}>Skill Name</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter Skill Name"
//             value={values.skillName}
//             onChangeText={handleChange("skillName")}
//           />
//           {touched.skillName && errors.skillName && (
//             <Text style={styles.errorText}>{errors.skillName}</Text>
//           )}

//           {/* Skill Rating (Input Field) */}
//           <Text style={styles.label}>Rating (1 - 100)</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter Rating"
//             keyboardType="numeric"
//             value={values.skillRating.toString()}
//             onChangeText={(text) => {
//               const num = parseInt(text) || 0;
//               if (num >= 1 && num <= 100) {
//                 setFieldValue("skillRating", num);
//               }
//             }}
//           />
//           {touched.skillRating && errors.skillRating && (
//             <Text style={styles.errorText}>{errors.skillRating}</Text>
//           )}
//           <Slider
//             value={values.skillRating}
//             onValueChange={(value) =>
//               setFieldValue("skillRating", Math.round(value))
//             }
//             minimumValue={1}
//             maximumValue={100}
//             step={1}
//             thumbTintColor="#007bff"
//             minimumTrackTintColor="#007bff"
//             maximumTrackTintColor="#ddd"
//           />
//           <Text style={styles.ratingText}>{values.skillRating}/100</Text>
//           {/* Skill Rating (Slider) */}
//           {/* <Slider
//             value={values.skillRating}
//             onValueChange={(value) =>
//               setFieldValue("skillRating", Math.round(value))
//             }
//             minimumValue={1}
//             maximumValue={100}
//             step={1}
//             thumbTintColor="#007bff"
//             minimumTrackTintColor="#007bff"
//             maximumTrackTintColor="#ddd"
//           />
//           <Text style={styles.ratingText}>{values.skillRating}/100</Text> */}

//           {/* Version */}
//           <Text style={styles.label}>Version</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter Version"
//             value={values.skillVersion}
//             onChangeText={handleChange("skillVersion")}
//           />
//           {touched.skillVersion && errors.skillVersion && (
//             <Text style={styles.errorText}>{errors.skillVersion}</Text>
//           )}

//           {/* Buttons */}
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={styles.saveButton}
//               activeOpacity={0.8}
//               onPress={handleSubmit}
//             >
//               <Text style={styles.buttonText}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.cancelButton}
//               activeOpacity={0.8}
//               onPress={() => navigation.goBack()}
//             >
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </Formik>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#f8f9fa",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "500",
//     marginBottom: 12,
//     color: "#333",
//   },
//   label: {
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 5,
//   },
//   input: {
//     width: "100%",
//     backgroundColor: "#fff",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   errorText: {
//     color: "red",
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   ratingText: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 10,
//     fontWeight: "bold",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 10,
//   },
//   saveButton: {
//     backgroundColor: "#f0f0f0", // Light Gray
//     padding: 15,
//     borderRadius: 10,
//     flex: 1,
//     alignItems: "center",
//     marginRight: 10,
//   },
//   cancelButton: {
//     backgroundColor: "#f0f0f0", // Gray
//     padding: 15,
//     borderRadius: 10,
//     flex: 1,
//     alignItems: "center",
//     marginLeft: 10,
//   },
//   buttonText: {
//     color: "#FFA500", // Orange
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default AddSkillsDetails;


import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";

// Validation Schema
const SkillSchema = Yup.object().shape({
  skillName: Yup.string().trim().required("Skill name is required"),
  skillVersion: Yup.string().trim().required("Version is required"),
  skillRating: Yup.number()
    .typeError("Rating must be a number")
    .min(1, "Rating must be at least 1")
    .max(100, "Rating must be at most 100")
    .required("Rating is required"),
});

const AddSkillsDetails = ({ navigation }) => {
  return (
    <Formik
      initialValues={{ skillName: "", skillRating: "", skillVersion: "" }}
      validationSchema={SkillSchema}
      onSubmit={(values) => {
        Alert.alert("Success", "Skill saved successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <View style={styles.container}>
          <Text style={styles.header}>Add Skill Details</Text>

          {/* Skill Name */}
          <Text style={styles.label}>Skill Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Skill Name"
            value={values.skillName}
            onChangeText={handleChange("skillName")}
          />
          {touched.skillName && errors.skillName && (
            <Text style={styles.errorText}>{errors.skillName}</Text>
          )}

          {/* Skill Rating (Numeric Input) */}
          <Text style={styles.label}>Rating (1 - 100)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Rating"
            keyboardType="number-pad"
            value={values.skillRating}
            onChangeText={(text) => {
              const num = text.replace(/[^0-9]/g, ""); // Allow only numbers
              if (num === "" || (parseInt(num) >= 1 && parseInt(num) <= 100)) {
                setFieldValue("skillRating", num);
              }
            }}
          />
          {touched.skillRating && errors.skillRating && (
            <Text style={styles.errorText}>{errors.skillRating}</Text>
          )}

          {/* Version */}
          <Text style={styles.label}>Version</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Version"
            value={values.skillVersion}
            onChangeText={handleChange("skillVersion")}
          />
          {touched.skillVersion && errors.skillVersion && (
            <Text style={styles.errorText}>{errors.skillVersion}</Text>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={handleSubmit} // Now triggers Formik validation and submission
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
      )}
    </Formik>
  );
};

// Styles
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
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
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
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddSkillsDetails;
