import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getOrganizationalSettingsdata, getOrganizationalSettingsdatas } from '../aftherlogin'; // Ensure this API function is correct

const OrganisationSettings = () => {
  const [selected, setSelected] = useState({
    SAT: false,
    TIMESHEET: true,
    JOB_PORTAL: false,
  });

  const [allData, setAllData] = useState();

  useEffect(() => {
    const fetchOrganizationalSettingsdata = async () => {
      try {
        const response = await getOrganizationalSettingsdata();
        console.log("Response:", response);

        if (response) {
          setAllData(response);
          const moduleNames = response?.moduleName || [];

          // Update checkboxes based on API response
          setSelected({
            SAT: moduleNames.includes("sat"),
            TIMESHEET: moduleNames.includes("timesheet"),
            JOB_PORTAL: moduleNames.includes("jobPortal"),
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to fetch organizational settings");
      }
    };

    fetchOrganizationalSettingsdata();
  }, []);

  const toggleCheckbox = async (key) => {
    setSelected((prevSelected) => {
      const updatedSelected = { ...prevSelected, [key]: !prevSelected[key] };

      // Generate new moduleName array based on the updated state
      const updatedModuleNames = [];
      if (updatedSelected.SAT) updatedModuleNames.push("sat");
      if (updatedSelected.TIMESHEET) updatedModuleNames.push("timesheet");
      if (updatedSelected.JOB_PORTAL) updatedModuleNames.push("jobPortal");

      // Update allData with new moduleName
      const updatedData = { ...allData, moduleName: updatedModuleNames };
      setAllData(updatedData);

      // Send updated data to API
      sendUpdatedData(updatedData);

      return updatedSelected;
    });
  };

  const sendUpdatedData = async (updatedData) => {
    try {
      const response = await getOrganizationalSettingsdatas(updatedData);
      console.log("API Response:", response);
      Alert.alert("Success", "Settings updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
      Alert.alert("Error", "Failed to update organizational settings");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Organisation Settings</Text>

      <View style={styles.card}>
        <Text style={styles.subHeading}>Product Access</Text>

        <View style={styles.checkboxContainer}>
          {/* SAT Checkbox */}
          <TouchableOpacity
            style={[styles.checkboxWrapper, selected.SAT && styles.checked]}
            onPress={() => toggleCheckbox("SAT")}
          >
            <Text style={[styles.checkbox, selected.SAT && styles.checkedText]}>
              {selected.SAT ? "✔" : " "}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>SAT</Text>

          {/* TIMESHEET Checkbox */}
          <TouchableOpacity
            style={[styles.checkboxWrapper, selected.TIMESHEET && styles.checked]}
            onPress={() => toggleCheckbox("TIMESHEET")}
          >
            <Text style={[styles.checkbox, selected.TIMESHEET && styles.checkedText]}>
              {selected.TIMESHEET ? "✔" : " "}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>TIMESHEET</Text>

          {/* JOB PORTAL Checkbox */}
          <TouchableOpacity
            style={[styles.checkboxWrapper, selected.JOB_PORTAL && styles.checked]}
            onPress={() => toggleCheckbox("JOB_PORTAL")}
          >
            <Text style={[styles.checkbox, selected.JOB_PORTAL && styles.checkedText]}>
              {selected.JOB_PORTAL ? "✔" : " "}
            </Text>
          </TouchableOpacity>
          <Text style={styles.label}>JOB PORTAL</Text>
        </View>
      </View>
    </View>
  );
};

// Styles for React Native (Expo)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E67E22',
    marginBottom: 12,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 14,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 5, // Adds shadow effect for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  checkbox: {
    fontSize: 18,
    color: '#888',
  },
  checkedText: {
    color: '#4CAF50', // Color for checked text
  },
  label: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  checked: {
    backgroundColor: '#d3ffd8', // Green background when checked
  },
});

export default OrganisationSettings;
