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

const AddUserSkillsDetails = ({route}) => {
  console.log("AddUserSkillsDetails route:",route.params);
  const {mode,skill} = route.params ||{};
  const [orgId, setOrgId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [skillDetails, setSkillDetails] = useState({
    skillName: "",
    rating: "",
    version: "",
    skillName_Error: false,
    rating_Error: false,
    version_Error: false,
    skillName_ErrorText: "",
    rating_ErrorText: "",
    version_ErrorText: "",
  });

  const navigation = useNavigation();
  
  useEffect(() => {
    if(mode === "edit_skill"&&skill){
      setSkillDetails({
        skillName: skill.skill||"",
        rating: skill.level||"",
        version: skill.version,
        skillName_Error: false,
        rating_Error: false,
        version_Error: false,
        skillName_ErrorText: "",
        rating_ErrorText: "",
        version_ErrorText: "",
      });
     }
    const fetchData = async () => {
      try {
        const storedOrgId = await AsyncStorage.getItem("orgId");
        const storedUserId = await AsyncStorage.getItem("id");
       const role = await AsyncStorage.getItem("role");

        if (storedOrgId) setOrgId(storedOrgId);
        if (storedUserId) setUserId(storedUserId);
          if (role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    };

    fetchData();
  }, [mode,skill]);

  const handleSave = async () => {
    let isValid = true;
    let updatedSkillDetails = { ...skillDetails };

    if (!skillDetails.skillName.trim()) {
      updatedSkillDetails.skillName_Error = true;
      updatedSkillDetails.skillName_ErrorText = "Skill name is required.";
      isValid = false;
    } else {
      updatedSkillDetails.skillName_Error = false;
      updatedSkillDetails.skillName_ErrorText = "";
    }

    if (!skillDetails.rating.trim()) {
      updatedSkillDetails.rating_Error = true;
      updatedSkillDetails.rating_ErrorText = "Rating is required.";
      isValid = false;
    } else {
      updatedSkillDetails.rating_Error = false;
      updatedSkillDetails.rating_ErrorText = "";
    }

    if (!skillDetails.version.trim()) {
      updatedSkillDetails.version_Error = true;
      updatedSkillDetails.version_ErrorText = "Version is required.";
      isValid = false;
    } else {
      updatedSkillDetails.version_Error = false;
      updatedSkillDetails.version_ErrorText = "";
    }

    setSkillDetails(updatedSkillDetails);
    if (!isValid) return;

    // const requestData = {
    //   skill: skillDetails.skillName,
    //   level: skillDetails.rating,
    //   version: skillDetails.version,
    //   userId: userId,
    //   organizationId: orgId,
    //   ...(mode === "edit_skill" && { id: skill.id }),
    // };
    // console.log("Request Data:", requestData);

    // try {
    //   let response;
      
    //   if (mode === "edit_skill" && skill?.id) {
    //     response = await axios.put(
    //       `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/skills/${skill?.id}`, 
    //       requestData, 
    //       { headers: { 'Content-Type': 'application/json' } }
    //     );
    
    //     console.log("edited response:", response);
    //     // console.log("edited response status:", response.status);
    
    //     if (response.status === 200) {
    //       console.log("✅ Response 200 detected (PUT), executing alert...");
    //       Alert.alert(
    //         'Success',
    //         'Skill details updated successfully!',
    //         [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
    //       );
    //     }
    //   } 
    //   else {
    //     response = await axios.post(
    //       `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/skills/association/super-admin`,
    //       requestData,
    //       { headers: { 'Content-Type': 'application/json' } }
    //     );
    
    //     console.log("added response:", response);
    //     // console.log("added response status:", response.status);
    
    //     if (response.status === 201) {
    //       Alert.alert(
    //         'Success',
    //         'Skill details saved successfully!',
    //         [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
    //       );
    //     } else if (response.status === 200) {
    //       Alert.alert(
    //         'Success',
    //         'Skill details updated successfully!',
    //         [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
    //       );
    //     } else {
    //       Alert.alert('Error', response.data.message || 'Failed to save education details.');
    //     }
    //   }
    // } catch (error) {
    //   console.error('API Error:', error);
    //   Alert.alert('Error', 'Something went wrong. Please try again.');
    // }


   const requestData = {
      skill: skillDetails.skillName,
      level: skillDetails.rating,
      version: skillDetails.version,
      userId: userId,
      organizationId: orgId,
      ...(mode === "edit_skill" && { id: skill.id }),
    };
    console.log("Request Data:", requestData);
    
    try {
      let response;
    
      if (["approvalManagers", "super-admin", "employee"].includes(userRole)) {
        // --- Edit Mode 
        if (mode === "edit_skill" && skill?.id) {
          response = await axios.put(
            `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/skills/${skill.id}`,
            requestData,
            { headers: { "Content-Type": "application/json" } }
          );
    
          if (response.status === 200) {
            Alert.alert("Success", "Skill details updated successfully!", [
              { text: "OK", onPress: () => navigation.navigate("ProfilePage") },
            ]);
          } else {
            Alert.alert("Error", "Failed to update skill details.");
          }
        } 
        // --- Add Mode 
        else {
          response = await axios.post(
            `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/skills/association/${userRole}`,
            requestData,
            { headers: { "Content-Type": "application/json" } }
          );
    
          if (response.status === 201) {
            Alert.alert("Success", "Skill details saved successfully!", [
              { text: "OK", onPress: () => navigation.navigate("ProfilePage") },
            ]);
          } else if (response.status === 200) {
            Alert.alert("Success", "Skill details updated successfully!", [
              { text: "OK", onPress: () => navigation.navigate("ProfilePage") },
            ]);
          } else {
            Alert.alert(
              "Error",
              response.data.message || "Failed to save skill details."
            );
          }
        }
      } else {
        Alert.alert("Access Denied", "Your role does not allow this action.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.mainContainer}>
          <Text style={styles.headerText}>{skill?.id?"Update Skill Details":"Add Skill Details"}</Text>

          <Text style={styles.label}>Skill Name</Text>
          <TextInput
            style={[styles.input, skillDetails.skillName_Error && styles.errorInput]}
            placeholder="Enter Skill Name"
            value={skillDetails.skillName}
            onChangeText={(text) => setSkillDetails({ ...skillDetails, skillName: text, skillName_Error: false })}
          />
          {skillDetails.skillName_Error && <Text style={styles.errorText}>{skillDetails.skillName_ErrorText}</Text>}

          <Text style={styles.label}>Rating/100</Text>
          <TextInput
            style={[styles.input, skillDetails.rating_Error && styles.errorInput]}
            placeholder="Enter Rating"
            keyboardType="numeric"
            value={skillDetails.rating}
            onChangeText={(text) => setSkillDetails({ ...skillDetails, rating: text, rating_Error: false })}
          />
          {skillDetails.rating_Error && <Text style={styles.errorText}>{skillDetails.rating_ErrorText}</Text>}

          <Text style={styles.label}>Version</Text>
          <TextInput
            style={[styles.input, skillDetails.version_Error && styles.errorInput]}
            placeholder="Enter Version"
            value={skillDetails.version}
            onChangeText={(text) => setSkillDetails({ ...skillDetails, version: text, version_Error: false })}
          />
          {skillDetails.version_Error && <Text style={styles.errorText}>{skillDetails.version_ErrorText}</Text>}

           <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
           <Text style={styles.submitButtonText}>{skill?.id?"Update Details":"Save Details"}</Text>
           </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddUserSkillsDetails;

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#F9F9F9" },
  scrollViewContainer: { flexGrow: 1, padding: 20, justifyContent: "center" },
  mainContainer: { backgroundColor: "#FFF", borderRadius: 10, padding: 20, elevation: 3 },
  headerText: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 5, color: "#555" },
  input: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, backgroundColor: "#FFF", marginBottom: 15 },
  submitButton: { backgroundColor: "#007BFF", paddingVertical: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  submitButtonText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  errorInput: { borderColor: "red", borderWidth: 1 },
  errorText: { color: "red", fontSize: 14, marginBottom: 10 },
});