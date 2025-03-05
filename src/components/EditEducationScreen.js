// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import Icon from "react-native-vector-icons/Ionicons";

// const EditEducationScreen = ({ visible, onClose, educationData, onSave }) => {
//   const [formData, setFormData] = useState({ ...educationData });
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);

//   const handleInputChange = (key, value) => {
//     setFormData((prev) => ({ ...prev, [key]: value }));
//   };

//   return (
//     <Modal visible={visible} transparent={true} animationType="fade">
//       <View style={styles.modalBackground}>
//         <View style={styles.modalContainer}>
//           <View style={styles.header}>
//             <Text style={styles.modalTitle}>Update Education Details</Text>
//             <TouchableOpacity onPress={onClose}>
//               <Icon name="close-circle-outline" size={24} color="#FF5733" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.formContainer}>
//             <Text style={styles.label}>Establishment*</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.establishment}
//               onChangeText={(text) => handleInputChange("establishment", text)}
//             />

//             <Text style={styles.label}>Education Level*</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.educationLevel}
//               onChangeText={(text) => handleInputChange("educationLevel", text)}
//             />

//             <Text style={styles.label}>Start Date*</Text>
//             <TouchableOpacity
//               onPress={() => setShowStartDatePicker(true)}
//               style={styles.datePicker}
//             >
//               <Text>{formData.startDate || "Select Date"}</Text>
//               <Icon name="calendar-outline" size={20} color="#333" />
//             </TouchableOpacity>
//             {showStartDatePicker && (
//               <DateTimePicker
//                 value={new Date(formData.startDate)}
//                 mode="date"
//                 display="default"
//                 onChange={(event, selectedDate) => {
//                   setShowStartDatePicker(false);
//                   if (selectedDate)
//                     handleInputChange(
//                       "startDate",
//                       selectedDate.toISOString().split("T")[0]
//                     );
//                 }}
//               />
//             )}

//             <Text style={styles.label}>End Date*</Text>
//             <TouchableOpacity
//               onPress={() => setShowEndDatePicker(true)}
//               style={styles.datePicker}
//             >
//               <Text>{formData.endDate || "Select Date"}</Text>
//               <Icon name="calendar-outline" size={20} color="#333" />
//             </TouchableOpacity>
//             {showEndDatePicker && (
//               <DateTimePicker
//                 value={new Date(formData.endDate)}
//                 mode="date"
//                 display="default"
//                 onChange={(event, selectedDate) => {
//                   setShowEndDatePicker(false);
//                   if (selectedDate)
//                     handleInputChange(
//                       "endDate",
//                       selectedDate.toISOString().split("T")[0]
//                     );
//                 }}
//               />
//             )}

//             <Text style={styles.label}>Location*</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.location}
//               onChangeText={(text) => handleInputChange("location", text)}
//             />
//           </View>

//           <View style={styles.buttonContainer}>
//             <TouchableOpacity
//               style={styles.saveButton}
//               onPress={() => onSave(formData)}
//             >
//               <Text style={styles.buttonText}>Save ✓</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//               <Text style={styles.buttonText}>Cancel ✖</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContainer: {
//     width: "90%",
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "orange",
//   },
//   formContainer: {
//     backgroundColor: "#f2f2f2",
//     padding: 10,
//     borderRadius: 5,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "orange",
//     borderRadius: 5,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   datePicker: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "orange",
//     borderRadius: 5,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     marginTop: 20,
//   },
//   saveButton: {
//     backgroundColor: "#007BFF",
//     padding: 10,
//     borderRadius: 5,
//   },
//   cancelButton: {
//     backgroundColor: "#FF5733",
//     padding: 10,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default EditEducationScreen;
