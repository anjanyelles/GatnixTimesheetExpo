import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { getTimesheetsettingsdata, getTimesheetsettingsgetcall, getTimesheetsettingspatch ,getTimesheetsettingsputcall} from '../aftherlogin';

const TimesheetsSettings = () => {
    // Default notification types
    const defaultOptions = ["Email", "Sms", "Whatsapp"];

    // State variables
    const [alertNotification, setAlertNotification] = useState([]);
    const [remainder, setRemainder] = useState([]);
    const [alldata, setAllData] = useState({});
    const [recall, setRecall] = useState({
        approvalManagerApproval: true,
        id: 11,
        orgId: 209,
        superAdminApproval: false,
    });

const fetchgetTimesheetSettingsputdata = async ()=>{
    try{
  
        const response = await getTimesheetsettingsputcall(recall);
        
        console.log("response3",response);
    }
    catch{
        console.log("error", error);
    }
} 

useEffect(() => {
    fetchgetTimesheetSettingsputdata(recall);
    console.log("Updated recall:", recall);
}, [recall]); // Runs only when recall changes

const handleCheckboxChangeFor = (type) => {
    if (type === "Any One") {
        setRecall((prev) => ({ ...prev, approvalManagerApproval: true, superAdminApproval: true }));
    } else if (type === "Only Super Admin") {
        setRecall((prev) => ({ ...prev, approvalManagerApproval: false, superAdminApproval: true }));
    } else if (type === "Only Approval Manager") {
        setRecall((prev) => ({ ...prev, approvalManagerApproval: true, superAdminApproval: false }));
    }
};

    
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await getTimesheetsettingsdata();
                console.log("API Response:", response);

                if (response) {
                    setAlertNotification(response.alertNotification || []);
                    setRemainder(response.remainder || []);
                    setAllData(response);
                }
            } catch (error) {
                console.error("Error fetching timesheet settings:", error);
            }
        };
  const fetchTimesheetsettingsgetcall = async ()=>{
    try{
    const response = await getTimesheetsettingsgetcall();
    console.log("response",response);
    setRecall(response)
    }
 catch (error) {
    console.error("Error fetching timesheet settings:", error);
}
  }
        fetchSettings();
        fetchTimesheetsettingsgetcall();
    }, []);

    // Function to toggle checkbox values
    const handleCheckboxChange = async (type, value) => {
        let updatedValues;

        if (type === "alert") {
            updatedValues = alertNotification.includes(value)
                ? alertNotification.filter(item => item !== value)  // Remove if already selected
                : [...alertNotification, value];  // Add if not selected
            setAlertNotification(updatedValues);
        } else if (type === "reminder") {
            updatedValues = remainder.includes(value)
                ? remainder.filter(item => item !== value)
                : [...remainder, value];
            setRemainder(updatedValues);
        }

        // Merge existing API data with updated values
        const updatedData = {
            ...alldata, 
            alertNotification: type === "alert" ? updatedValues : alertNotification,
            remainder: type === "reminder" ? updatedValues : remainder,
        };

        try {
            await getTimesheetsettingspatch(updatedData);
            console.log("Settings updated successfully:", updatedData);
        } catch (error) {
            console.error("Error updating settings:", error);
        }
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Time Sheets Settings</Text>

            {/* Reminder Notifications */}
            <Text style={styles.sectionTitle}>Reminder Notifications</Text>
            <View style={styles.checkboxRow}>
                {defaultOptions.map((item) => (
                    <Checkbox.Item
                        key={item}
                        label={item}
                        status={remainder.includes(item) ? "checked" : "unchecked"}
                        onPress={() => handleCheckboxChange("reminder", item)}
                        labelStyle={styles.checkboxLabel}
                    />
                ))}
            </View>

            {/* Alert Notifications */}
            <Text style={styles.sectionTitle}>Alert Notifications</Text>
            <View style={styles.checkboxRow}>
                {defaultOptions.map((item) => (
                    <Checkbox.Item
                        key={item}
                        label={item}
                        status={alertNotification.includes(item) ? "checked" : "unchecked"}
                        onPress={() => handleCheckboxChange("alert", item)}
                        labelStyle={styles.checkboxLabel}
                    />
                ))}
            </View>
            <Text style={styles.sectionTitle}>Recall Settings</Text>
            <View style={styles.container11}>
            <Checkbox.Item
                label="Any One"
                status={recall.approvalManagerApproval && recall.superAdminApproval ? "checked" : "unchecked"}
                onPress={() => handleCheckboxChangeFor("Any One")}
            />
            <Checkbox.Item
                label="Super Admin"
                status={!recall.approvalManagerApproval && recall.superAdminApproval ? "checked" : "unchecked"}
                onPress={() => handleCheckboxChangeFor("Only Super Admin")}
            />
            <Checkbox.Item
                label="Approval Manager"
                status={recall.approvalManagerApproval && !recall.superAdminApproval ? "checked" : "unchecked"}
                onPress={() => handleCheckboxChangeFor("Only Approval Manager")}
            />
        </View>
          
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    checkboxRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 5,
    },
    checkboxLabel: {
        fontSize: 14,
    },
    container11: {
        display:'flex',
        flexDirection:'column',
        gap:1,

    }
});

export default TimesheetsSettings;
