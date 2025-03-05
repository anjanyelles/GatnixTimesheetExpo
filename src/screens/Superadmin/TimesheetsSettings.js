// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Text, ScrollView } from 'react-native';
// import { Checkbox } from 'react-native-paper';
// import { getTimesheetsettingsdata, getTimesheetsettingsgetcall, getTimesheetsettingspatch ,getTimesheetsettingsputcall} from '../aftherlogin';

// const TimesheetsSettings = () => {
//     // Default notification types
//     const defaultOptions = ["Email", "Sms", "Whatsapp"];

//     // State variables
//     const [alertNotification, setAlertNotification] = useState([]);
//     const [remainder, setRemainder] = useState([]);
//     const [alldata, setAllData] = useState({});
//     const [recall, setRecall] = useState({
//         approvalManagerApproval: true,
//         id: 11,
//         orgId: 209,
//         superAdminApproval: false,
//     });

// const fetchgetTimesheetSettingsputdata = async ()=>{
//     try{
  
//         const response = await getTimesheetsettingsputcall(recall);
        
//         console.log("response3",response);
//     }
//     catch{
//         console.log("error", error);
//     }
// } 

// useEffect(() => {
//     fetchgetTimesheetSettingsputdata(recall);
//     console.log("Updated recall:", recall);
// }, [recall]); // Runs only when recall changes

// const handleCheckboxChangeFor = (type) => {
//     if (type === "Any One") {
//         setRecall((prev) => ({ ...prev, approvalManagerApproval: true, superAdminApproval: true }));
//     } else if (type === "Only Super Admin") {
//         setRecall((prev) => ({ ...prev, approvalManagerApproval: false, superAdminApproval: true }));
//     } else if (type === "Only Approval Manager") {
//         setRecall((prev) => ({ ...prev, approvalManagerApproval: true, superAdminApproval: false }));
//     }
// };

    
//     useEffect(() => {
//         const fetchSettings = async () => {
//             try {
//                 const response = await getTimesheetsettingsdata();
//                 console.log("API Response:", response);

//                 if (response) {
//                     setAlertNotification(response.alertNotification || []);
//                     setRemainder(response.remainder || []);
//                     setAllData(response);
//                 }
//             } catch (error) {
//                 console.error("Error fetching timesheet settings:", error);
//             }
//         };
//   const fetchTimesheetsettingsgetcall = async ()=>{
//     try{
//     const response = await getTimesheetsettingsgetcall();
//     console.log("response",response);
//     setRecall(response)
//     }
//  catch (error) {
//     console.error("Error fetching timesheet settings:", error);
// }
//   }
//         fetchSettings();
//         fetchTimesheetsettingsgetcall();
//     }, []);

//     // Function to toggle checkbox values
//     const handleCheckboxChange = async (type, value) => {
//         let updatedValues;

//         if (type === "alert") {
//             updatedValues = alertNotification.includes(value)
//                 ? alertNotification.filter(item => item !== value)  // Remove if already selected
//                 : [...alertNotification, value];  // Add if not selected
//             setAlertNotification(updatedValues);
//         } else if (type === "reminder") {
//             updatedValues = remainder.includes(value)
//                 ? remainder.filter(item => item !== value)
//                 : [...remainder, value];
//             setRemainder(updatedValues);
//         }

//         // Merge existing API data with updated values
//         const updatedData = {
//             ...alldata, 
//             alertNotification: type === "alert" ? updatedValues : alertNotification,
//             remainder: type === "reminder" ? updatedValues : remainder,
//         };

//         try {
//             await getTimesheetsettingspatch(updatedData);
//             console.log("Settings updated successfully:", updatedData);
//         } catch (error) {
//             console.error("Error updating settings:", error);
//         }
//     };



//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.header}>Time Sheets Settings</Text>

//             {/* Reminder Notifications */}
//             <Text style={styles.sectionTitle}>Reminder Notifications</Text>
//             <View style={styles.checkboxRow}>
//                 {defaultOptions.map((item) => (
//                     <Checkbox.Item
//                         key={item}
//                         label={item}
//                         status={remainder.includes(item) ? "checked" : "unchecked"}
//                         onPress={() => handleCheckboxChange("reminder", item)}
//                         labelStyle={styles.checkboxLabel}
//                     />
//                 ))}
//             </View>

//             {/* Alert Notifications */}
//             <Text style={styles.sectionTitle}>Alert Notifications</Text>
//             <View style={styles.checkboxRow}>
//                 {defaultOptions.map((item) => (
//                     <Checkbox.Item
//                         key={item}
//                         label={item}
//                         status={alertNotification.includes(item) ? "checked" : "unchecked"}
//                         onPress={() => handleCheckboxChange("alert", item)}
//                         labelStyle={styles.checkboxLabel}
//                     />
//                 ))}
//             </View>
//             <Text style={styles.sectionTitle}>Recall Settings</Text>
//             <View style={styles.container11}>
//             <Checkbox.Item
//                 label="Any One"
//                 status={recall.approvalManagerApproval && recall.superAdminApproval ? "checked" : "unchecked"}
//                 onPress={() => handleCheckboxChangeFor("Any One")}
//             />
//             <Checkbox.Item
//                 label="Super Admin"
//                 status={!recall.approvalManagerApproval && recall.superAdminApproval ? "checked" : "unchecked"}
//                 onPress={() => handleCheckboxChangeFor("Only Super Admin")}
//             />
//             <Checkbox.Item
//                 label="Approval Manager"
//                 status={recall.approvalManagerApproval && !recall.superAdminApproval ? "checked" : "unchecked"}
//                 onPress={() => handleCheckboxChangeFor("Only Approval Manager")}
//             />
//         </View>
          
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     backgroundColor: "#fff", // Add background color for better visibility
//     flexGrow: 1, // Ensure full height in ScrollView
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 12,
//     textAlign: "center", // Center align for better mobile layout
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 12,
//     marginBottom: 6,
//     color: "#333", // Darker text for better readability
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between", // Adjust to avoid tight spacing
//     marginBottom: 10,
//   },
//   checkboxLabel: {
//     fontSize: 14,
//   },
//   container11: {
//     flexDirection: "column",
//     marginTop: 10,
//   },
// });


// export default TimesheetsSettings;
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { Checkbox } from "react-native-paper";
import {
  getTimesheetsettingsdata,
  getTimesheetsettingsgetcall,
  getTimesheetsettingspatch,
  getTimesheetsettingsputcall,
} from "../aftherlogin";

const TimesheetsSettings = () => {
  const defaultOptions = ["Email", "Sms", "Whatsapp"];
  const [alertNotification, setAlertNotification] = useState([]);
  const [remainder, setRemainder] = useState([]);
  const [alldata, setAllData] = useState({});
  const [recall, setRecall] = useState({
    approvalManagerApproval: true,
    id: 11,
    orgId: 209,
    superAdminApproval: false,
  });

  const fetchTimesheetSettings = async () => {
    try {
      const response = await getTimesheetsettingsdata();
      if (response) {
        setAlertNotification(response.alertNotification || []);
        setRemainder(response.remainder || []);
        setAllData(response);
      }
    } catch (error) {
      console.error("Error fetching timesheet settings:", error);
    }
  };

  const fetchRecallSettings = async () => {
    try {
      const response = await getTimesheetsettingsgetcall();
      setRecall(response);
    } catch (error) {
      console.error("Error fetching recall settings:", error);
    }
  };

  useEffect(() => {
    fetchTimesheetSettings();
    fetchRecallSettings();
  }, []);

  const handleCheckboxChange = async (type, value) => {
    let updatedValues =
      type === "alert" ? [...alertNotification] : [...remainder];

    if (updatedValues.includes(value)) {
      updatedValues = updatedValues.filter((item) => item !== value);
    } else {
      updatedValues.push(value);
    }

    const updatedData = {
      ...alldata,
      alertNotification: type === "alert" ? updatedValues : alertNotification,
      remainder: type === "reminder" ? updatedValues : remainder,
    };

    try {
      await getTimesheetsettingspatch(updatedData);
      type === "alert"
        ? setAlertNotification(updatedValues)
        : setRemainder(updatedValues);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const handleCheckboxChangeFor = (type) => {
    const updatedRecall = {
      approvalManagerApproval:
        type === "Any One" || type === "Only Approval Manager",
      superAdminApproval: type === "Any One" || type === "Only Super Admin",
    };
    setRecall((prev) => ({ ...prev, ...updatedRecall }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Time Sheets Settings</Text>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Reminder Notifications</Text>
        {defaultOptions.map((item) => (
          <Checkbox.Item
            key={item}
            label={item}
            status={remainder.includes(item) ? "checked" : "unchecked"}
            onPress={() => handleCheckboxChange("reminder", item)}
            style={styles.checkboxItem}
          />
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Alert Notifications</Text>
        {defaultOptions.map((item) => (
          <Checkbox.Item
            key={item}
            label={item}
            status={alertNotification.includes(item) ? "checked" : "unchecked"}
            onPress={() => handleCheckboxChange("alert", item)}
            style={styles.checkboxItem}
          />
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recall Settings</Text>
        <Checkbox.Item
          label="Any One"
          status={
            recall.approvalManagerApproval && recall.superAdminApproval
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleCheckboxChangeFor("Any One")}
        />
        <Checkbox.Item
          label="Only Super Admin"
          status={
            !recall.approvalManagerApproval && recall.superAdminApproval
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleCheckboxChangeFor("Only Super Admin")}
        />
        <Checkbox.Item
          label="Only Approval Manager"
          status={
            recall.approvalManagerApproval && !recall.superAdminApproval
              ? "checked"
              : "unchecked"
          }
          onPress={() => handleCheckboxChangeFor("Only Approval Manager")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionContainer: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  checkboxItem: {
    marginLeft: -10,
  },
});

export default TimesheetsSettings;
