import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";


import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const AddUserJobDetails = ({route}) => {
  console.log("from route", route.params);
  const {mode,edu}=route.params||{}
  
  const [orgId, setOrgId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [jobDetails, setJobDetails] = useState({
    jobTitle: "",
    companyName: "",
    startDate: "",
    endDate: "",
    description: "",
    jobTitle_Error: false,
    companyName_Error: false,
    startDate_Error: false,
    endDate_Error: false,
    description_Error: false,
    jobTitle_ErrorText: "",
    companyName_ErrorText: "",
    startDate_ErrorText: "",
    endDate_ErrorText: "",
    description_ErrorText: "",
  });

  const navigation = useNavigation();

  useEffect(() => {
    if(mode==="edit_job"&&edu){
      setJobDetails({
        jobTitle: edu.jobTitle||"",
        companyName: edu.companyName||"",
        startDate:  edu.startDate ? edu.startDate.split("T")[0] : "",
        endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
        description: edu.description,
        jobTitle_Error: false,
        companyName_Error: false,
        startDate_Error: false,
        endDate_Error: false,
        description_Error: false,
        jobTitle_ErrorText: "",
        companyName_ErrorText: "",
        startDate_ErrorText: "",
        endDate_ErrorText: "",
        description_ErrorText: "",
      });
    }
    const fetchData = async () => {
      try {
        const storedOrgId = await AsyncStorage.getItem("orgId");
        const storedUserId = await AsyncStorage.getItem("id");

        if (storedOrgId) setOrgId(storedOrgId);
        if (storedUserId) setUserId(storedUserId);
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, [mode,edu]);

  // Function to validate date format (YYYY-MM-DD)
  const validateDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

  const handleSave = async () => {
    let isValid = true;
    let updatedJobDetails = { ...jobDetails };

    if (!jobDetails.jobTitle.trim()) {
      updatedJobDetails.jobTitle_Error = true;
      updatedJobDetails.jobTitle_ErrorText = "Job title is required.";
      isValid = false;
    } else {
      updatedJobDetails.jobTitle_Error = false;
      updatedJobDetails.jobTitle_ErrorText = "";
    }

    if (!jobDetails.companyName.trim()) {
      updatedJobDetails.companyName_Error = true;
      updatedJobDetails.companyName_ErrorText = "Company name is required.";
      isValid = false;
    } else {
      updatedJobDetails.companyName_Error = false;
      updatedJobDetails.companyName_ErrorText = "";
    }

    if (!validateDate(jobDetails.startDate)) {
      updatedJobDetails.startDate_Error = true;
      updatedJobDetails.startDate_ErrorText = "Enter a valid Start Date (YYYY-MM-DD).";
      isValid = false;
    } else {
      updatedJobDetails.startDate_Error = false;
      updatedJobDetails.startDate_ErrorText = "";
    }

    if (!validateDate(jobDetails.endDate)) {
      updatedJobDetails.endDate_Error = true;
      updatedJobDetails.endDate_ErrorText = "Enter a valid End Date (YYYY-MM-DD).";
      isValid = false;
    } else {
      updatedJobDetails.endDate_Error = false;
      updatedJobDetails.endDate_ErrorText = "";
    }

    if (!jobDetails.description.trim()) {
      updatedJobDetails.description_Error = true;
      updatedJobDetails.description_ErrorText = "Job description is required.";
      isValid = false;
    } else {
      updatedJobDetails.description_Error = false;
      updatedJobDetails.description_ErrorText = "";
    }

    setJobDetails(updatedJobDetails);
    if (!isValid) return;

    // Prepare Data for API Request
    const requestData = {
      jobTitle: jobDetails.jobTitle,
      company: jobDetails.companyName,
      startDate: jobDetails.startDate,
      endDate: jobDetails.endDate,
      description: jobDetails.description,
      userId: userId,
      organizationId: orgId,
      ...(mode === "edit_job" && { id: edu?.id })

    };
    console.log("Request Data:", requestData);

    try {
      let response;
      
      if (mode === "edit_edu" && edu?.id) {
        response = await axios.put(
          `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/workDetails/${edu?.id}`, 
          requestData, 
          { headers: { 'Content-Type': 'application/json' } }
        );
    
        console.log("edited response:", response);
        // console.log("edited response status:", response.status);
    
        if (response.status === 200) {
          // console.log("✅ Response 200 detected (PUT), executing alert...");
          Alert.alert(
            'Success',
            'Job details updated successfully!',
            [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
          );
        }
      } 
      else {
        response = await axios.post(
          `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/workDetails/association/super-admin
`,
          requestData,
          { headers: { 'Content-Type': 'application/json' } }
        );
    
        console.log("added response:", response);
        // console.log("added response status:", response.status);
    
        if (response.status === 201) {
          Alert.alert(
            'Success',
            'Job details saved successfully!',
            [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
          );
        } else if (response.status === 200) {
          Alert.alert(
            'Success',
            'Job details updated successfully!',
            [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
          );
        } else {
          Alert.alert('Error', response.data.message || 'Failed to save education details.');
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.mainContainer}>
          <Text style={styles.headerText}>{edu?.id?"Update Job Details":"Add Job Details"}</Text>

          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={[styles.input, jobDetails.jobTitle_Error && styles.errorInput]}
            placeholder="Enter Job Title"
            value={jobDetails.jobTitle}
            onChangeText={(text) => setJobDetails({ ...jobDetails, jobTitle: text, jobTitle_Error: false })}
          />
          {jobDetails.jobTitle_Error && <Text style={styles.errorText}>{jobDetails.jobTitle_ErrorText}</Text>}

          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={[styles.input, jobDetails.companyName_Error && styles.errorInput]}
            placeholder="Enter Company Name"
            value={jobDetails.companyName}
            onChangeText={(text) => setJobDetails({ ...jobDetails, companyName: text, companyName_Error: false })}
          />
          {jobDetails.companyName_Error && <Text style={styles.errorText}>{jobDetails.companyName_ErrorText}</Text>}

          <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
          <TextInput
            style={[styles.input, jobDetails.startDate_Error && styles.errorInput]}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
            value={jobDetails.startDate}
            onChangeText={(text) => setJobDetails({ ...jobDetails, startDate: text, startDate_Error: false })}
          />
          {jobDetails.startDate_Error && <Text style={styles.errorText}>{jobDetails.startDate_ErrorText}</Text>}

          <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
          <TextInput
            style={[styles.input, jobDetails.endDate_Error && styles.errorInput]}
            placeholder="YYYY-MM-DD"
            keyboardType="numeric"
            value={jobDetails.endDate}
            onChangeText={(text) => setJobDetails({ ...jobDetails, endDate: text, endDate_Error: false })}
          />
          {jobDetails.description_Error && <Text style={styles.errorText}>{jobDetails.description_ErrorText}</Text>}
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, jobDetails.description_Error && styles.errorInput]}
            placeholder="Description"
            multiline={true}
            numberOfLines={3}
            value={jobDetails.description}
            onChangeText={(text) => setJobDetails({ ...jobDetails, description: text, description_Error: false })}
          />
          {jobDetails.description_Error && <Text style={styles.errorText}>{jobDetails.description_ErrorText}</Text>}

           <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
             <Text style={styles.submitButtonText}>{edu?.id?"Update Details":"Save Details"}</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddUserJobDetails;
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  mainContainer: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorInput: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  
});