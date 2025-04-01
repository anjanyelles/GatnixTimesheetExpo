 import { StyleSheet, Text, View,KeyboardAvoidingView,TextInput,ScrollView,TouchableOpacity,Platform,Alert,Dimensions} from 'react-native'
import React ,{useState,useEffect}from 'react'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
const {width,height} = Dimensions.get("window")
const AddUserEducationDetails = ({route}) => {
  console.log("from route",route.params);
  const { mode, edu} = route.params || {}; 

  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [orgId, setOrgId] = useState(null);
const [userId, setUserId] = useState(null);
const [education,setEducation] =useState({
  foundation:"",
  qualification:"",
  startDate:"",
  endDate:"",
  location:"",
  foundation_Error:false,
  qualification_Error:false,
  startDate_Error:false,
  endDate_Error:false,
  location_Error:false,
  foundation_ErrorText:"",
  qualification_ErrorText:"",
  startDate_ErrorText:"",
  endDate_ErrorText:"",
  location_ErrorText:"",
  
})

const navigation = useNavigation();


useEffect(() => {
  if (mode === "edit_edu" && edu) {
    setEducation({
      foundation: edu.establishment || "",
      qualification: edu.level || "",
      startDate: edu.startDate ? edu.startDate.split("T")[0] : "",
      endDate: edu.endDate ? edu.endDate.split("T")[0] : "",
      location: edu.location || "",
      foundation_Error: false,
      qualification_Error: false,
      startDate_Error: false,
      endDate_Error: false,
      location_Error: false,
      foundation_ErrorText: "",
      qualification_ErrorText: "",
      startDate_ErrorText: "",
      endDate_ErrorText: "",
      location_ErrorText: "",
    });
  }

  const fetchData = async () => {
    try {
      const storedOrgId = await AsyncStorage.getItem("orgId");
      const storedUserId = await AsyncStorage.getItem("id");

      if (storedOrgId) {
        setOrgId(storedOrgId);
      }
      if (storedUserId) {
        // setUserId(JSON.parse(storedUserId)); 
        setUserId(storedUserId);
      }
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };

  fetchData();
}, [mode,edu]);

  // Function to validate date format (YYYY-MM-DD)
  const validateDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; 
    return regex.test(date);
  };

  const handleSave = async() => {
    let isValid = true;
    let updatedEducation = { ...education };
  
    if (!education.foundation.trim()) {
      updatedEducation.foundation_Error = true;
      updatedEducation.foundation_ErrorText = "Institution Name is required.";
      isValid = false;
    } else {
      updatedEducation.foundation_Error = false;
      updatedEducation.foundation_ErrorText = "";
    }
  
    if (!education.qualification.trim()) {
      updatedEducation.qualification_Error = true;
      updatedEducation.qualification_ErrorText = "Qualification is required.";
      isValid = false;
    } else {
      updatedEducation.qualification_Error = false;
      updatedEducation.qualification_ErrorText = "";
    }
  
    if (!validateDate(education.startDate)) {
      updatedEducation.startDate_Error = true;
      updatedEducation.startDate_ErrorText = "Enter a valid Start Date (YYYY-MM-DD).";
      isValid = false;
    } else {
      updatedEducation.startDate_Error = false;
      updatedEducation.startDate_ErrorText = "";
    }
  
    if (!validateDate(education.endDate)) {
      updatedEducation.endDate_Error = true;
      updatedEducation.endDate_ErrorText = "Enter a valid End Date (YYYY-MM-DD).";
      isValid = false;
    } else {
      updatedEducation.endDate_Error = false;
      updatedEducation.endDate_ErrorText = "";
    }
  
    if (!education.location.trim()) {
      updatedEducation.location_Error = true;
      updatedEducation.location_ErrorText = "Location is required.";
      isValid = false;
    } else {
      updatedEducation.location_Error = false;
      updatedEducation.location_ErrorText = "";
    }
  
    setEducation(updatedEducation);
  
    if (!isValid) {
      return; 
    }
  
// *Prepare Data for API Request*
const requestData = {
  
  establishment: education.foundation,
  level: education.qualification,
  startDate: education.startDate,
  endDate: education.endDate,
  location: education.location,
  userId: userId, 
  organizationId: orgId, 
  ...(mode === "edit_edu" && { id: edu?.id })
};
console.log("Request Data:", requestData);

try {
  let response;
  
  if (mode === "edit_edu" && edu?.id) {
    response = await axios.put(
      `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/educationDetails/${edu?.id}`, 
      requestData, 
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("edited response:", response);
    // console.log("edited response status:", response.status);

    if (response.status === 200) {
      console.log("✅ Response 200 detected (PUT), executing alert...");
      Alert.alert(
        'Success',
        'Education details updated successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
      );
    }
  } 
  else {
    response = await axios.post(
      `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/eductionDetails/association/super-admin`,
      requestData,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("added response:", response);
    // console.log("added response status:", response.status);

    if (response.status === 201) {
      Alert.alert(
        'Success',
        'Education details saved successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('ProfilePage') }]
      );
    } else if (response.status === 200) {
      Alert.alert(
        'Success',
        'Education details updated successfully!',
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.outerContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.mainContainer}>
          <Text style={styles.headerText}>{edu?.id?"Update Education Details":"Add Education Details"}</Text>
          
          <Text style={styles.label}>Foundation</Text>
          <TextInput 
           style={[styles.input, education.foundation_Error && styles.errorInput]}           
          placeholder='Enter Institution Name'
          value={education.foundation}
          onChangeText={(text) => setEducation({ ...education, foundation: text, foundation_Error: false, foundation_ErrorText: "" })}
          />
          {education.foundation_Error && <Text style={styles.errorText}>{education.foundation_ErrorText}</Text>}

          <Text style={styles.label}>Qualification</Text>
          <TextInput 
            style={[styles.input, education.qualification_Error && styles.errorInput]} 
            placeholder='Enter Your Qualification'
            value={education.qualification}
            onChangeText={(text) => setEducation({...education, qualification: text, qualification_Error: false, qualification_ErrorText: ""})}
          />
          {education.qualification_Error && <Text style={styles.errorText}>{education.qualification_ErrorText}</Text>}

          <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
          <TextInput 
            style={[styles.input, education.startDate_Error && styles.errorInput]} 
            placeholder='YYYY-MM-DD' 
            keyboardType='numeric'
            value={education.startDate}
            onChangeText={(text) => setEducation({...education, startDate: text,startDate_Error: false, startDate_ErrorText: ""})}
          />
          {education.startDate_Error && <Text style={styles.errorText}>{education.startDate_ErrorText}</Text>}

          <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
          <TextInput 
            style={[styles.input, education.endDate_Error && styles.errorInput]} 
            placeholder='YYYY-MM-DD' 
            keyboardType='numeric'
            value={education.endDate}
            onChangeText={(text) => setEducation({...education, endDate: text,endDate_Error: false, endDate_ErrorText: ""})}
          />
          {education.endDate_Error && <Text style={styles.errorText}>{education.endDate_ErrorText}</Text>}

          <Text style={styles.label}>Location</Text>
          <TextInput 
            style={[styles.input, education.location_Error && styles.errorInput]} 
            placeholder='Enter Location'
            value={education.location}
            onChangeText={(text) => setEducation({...education, location: text, location_Error: false, location_ErrorText: ""})}
          />
          {education.location_Error && <Text style={styles.errorText}>{education.location_ErrorText}</Text>}
          <View style={{alignSelf:"center"}}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
            <Text style={styles.submitButtonText}>{edu?.id?"Update Details":"Save Details"}</Text>
          </TouchableOpacity>
         
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddUserEducationDetails;

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
    width:width/2
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
