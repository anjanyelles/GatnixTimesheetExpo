import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import {
  getOrganizationalSettingsdata,
  getOrganizationalSettingsdatas,
} from "../aftherlogin";

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

      const updatedModuleNames = [];
      if (updatedSelected.SAT) updatedModuleNames.push("sat");
      if (updatedSelected.TIMESHEET) updatedModuleNames.push("timesheet");
      if (updatedSelected.JOB_PORTAL) updatedModuleNames.push("jobPortal");

      const updatedData = { ...allData, moduleName: updatedModuleNames };
      setAllData(updatedData);

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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Organisation Settings</Text>

      <View style={styles.card}>
        <Text style={styles.subHeading}>Product Access</Text>

        <View style={styles.checkboxContainer}>
          {["SAT", "TIMESHEET", "JOB_PORTAL"].map((item) => (
            <View key={item} style={styles.checkboxWrapper}>
              <TouchableOpacity
                style={[styles.checkbox, selected[item] && styles.checked]}
                onPress={() => toggleCheckbox(item)}
              >
                <Text
                  style={[
                    styles.checkboxText,
                    selected[item] && styles.checkedText,
                  ]}
                >
                  {selected[item] ? "✔" : " "}
                </Text>
              </TouchableOpacity>
              <Text style={styles.label}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  
    marginBottom: 16,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  checkboxContainer: {
    marginTop: 10,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#888",
  },
  checked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  checkedText: {
    color: "#fff",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});

export default OrganisationSettings;
