import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getClientdataById, getProjectDetailsById } from '../aftherlogin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewProject = ({ route }) => {
  const { projectId } = route.params;
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [client, setClient] = useState({});
  const navigation=useNavigation()
  
  useFocusEffect(
    useCallback(() => {
      getProjectDetailsByProjectId();
    }, [projectId])
  );
  
  const getProjectDetailsByProjectId = async () => {
    setLoading(true);
    try {
      const orgId = await AsyncStorage.getItem("orgId");
      console.log("OrgId:", orgId);


      const response = await getProjectDetailsById(projectId)
  
       
     console.log("View Project Details", response);
    
      
      const clientData = await getClientdataById(response.clientId);

      //console.log("View Client Details", clientData);
  
      
      setProject(response);
      setClient(clientData);
    } catch (err) {
      console.error("Error fetching project details:", err);
    } finally {
      setLoading(false);
    }
  };

  const editEmployeeDetails=(employeeId)=>{
    navigation.navigate('EditEmployeeDetails',{id:employeeId,page:"Project",role:"Employee"})
  }

  const handleEditProject=(projectId)=>{
    console.log("edit project id ",projectId)
    navigation.navigate('EditProjectDetails',{projectId:projectId})
  }

  const handleCloseProject = () => {
    Alert.alert(
      'Confirm Close Project', // Title of the alert
      'Are you sure you want to close the project?', // Message
      [
        {
          text: 'No', 
          style: 'cancel', // Style for cancel button (iOS/Android)
          onPress: () => console.log('Close project cancelled'),
        },
        {
          text: 'Yes', 
          style: 'destructive', 
          onPress: async () => {
            try {
              const orgId = await AsyncStorage.getItem("orgId");
              if(!orgId){
                Alert.alert('Error', 'Organization ID not found!');
                return;
              }
              console.log("Project before closing:",project)
              const updatedProject = { ...project, status: "closed",endDate: Math.floor(Date.now() / 1000) };
              console.log("Project before closing updated data:",updatedProject)

              const response=await fetch(`https://www.gatnix.com/api/v1/timesheet/${orgId}/project/${project.employeeId}/${project.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProject),
              });

              
              if(response){
                setProject(response)
                console.log("response after closeing :",response)
                Alert.alert('Success', 'Project closed successfully!');
                navigation.navigate('Project')
                
              }


            } catch (error) {
              console.error('Error closing project:', error);
              Alert.alert('Error', 'Failed to close the project.');
            }
          },
        },
      ],
      { cancelable: true } 
    );
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}

      {project ? (
        <ScrollView>


          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>Employee Details</Text>
              <Icon name="edit" size={24} color="#007bff" style={styles.editIcon} onPress={()=>editEmployeeDetails(project.employeeId)} />
            </View>

            {/* Separator Line */}
            <View style={styles.separator} />

            <Text style={styles.label}>Employee Name: <Text style={styles.value}>{project.employeeName}</Text></Text>
            <Text style={styles.label}>Email: <Text style={styles.value}>{project.employeeEmail}</Text></Text>
            <Text style={styles.label}>Phone Number: <Text style={styles.value}>{project.employeePhoneNumber}</Text></Text>
            <Text style={styles.label}>WhatsApp Number: <Text style={styles.value}>{project.employeeWhatsappNumber}</Text></Text>
          </View>



          {/* Add Space Between Sections */}
          <View style={styles.space} />


          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>Project Details</Text>
              <Icon
                name="edit"
                size={24}
                color="#007bff"
                style={styles.editIcon}
                onPress={() => handleEditProject(project.id)}
              />
            </View>
            <View style={styles.separator} />

            <Text style={styles.label}>Project ID: <Text style={styles.value}>{project.projectCode}</Text></Text>
            <Text style={styles.label}>Project Name: <Text style={styles.value}>{project.projectName}</Text></Text>
            <Text style={styles.label}>Start Date: <Text style={styles.value}>{new Date(project.startDate * 1000).toDateString()}</Text></Text>
            <Text style={styles.label}>
              End Date:{" "}
              <Text style={styles.value}>
                {isNaN(project.endDate) ? project.endDate : new Date(project.endDate * 1000).toDateString()}
              </Text>
            </Text>

            <Text style={styles.label}>Pay Rate: <Text style={styles.value}>{project.payRate} {project.currencyType}</Text></Text>
            <Text style={styles.label}>Pay Rate Type: <Text style={styles.value}>{project.payRateType}</Text></Text>
            <Text style={styles.label}>Pay Terms: <Text style={styles.value}>{project.payTerms}</Text></Text>
            <Text style={styles.label}>Total Hours: <Text style={styles.value}>{project.billableHours}</Text></Text>
            <Text style={styles.label}>Client Name: <Text style={styles.value}>{client.clientName}</Text></Text>
            <Text style={styles.label}>End Client: <Text style={styles.value}>{client.endClientName}</Text></Text>
            <Text style={styles.label}>Client Email: <Text style={styles.value}>{project.employeeEmail}</Text></Text>
            <Text style={styles.label}>Client Billing Email: <Text style={styles.value}>{client.clientBillingEmail || "N/A"}</Text></Text>
  <Text style={styles.label}>Client Additional Email: <Text style={styles.value}>{client.additionalEmail || "N/A"}</Text></Text>
  <Text style={styles.label}>Client Phone Number: <Text style={styles.value}>{client.clientPhoneNumber || "N/A"}</Text></Text>
  <Text style={styles.label}>Client Accounts Name: <Text style={styles.value}>{client.clientAccountName || "N/A"}</Text></Text>
          </View>

        {project.status==="active" ?
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseProject}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>:
      <View style={styles.disabled} isDisabled={true}>
      <Text style={styles.closeButtonTextProject}>Project is Closed</Text>
    </View>
}

        </ScrollView>
      ) : (
        !loading && <Text style={styles.errorText}>No Project Data Found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf5ee",
    padding: 16,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editIcon: {
    padding: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 3,
  },
  value: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#000",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom:10,
    marginTop:4
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign:'center',
    fontWeight: "bold",
  },
  closeButtonTextProject: {
    color: "#fff",
    fontSize: 18,
    textAlign:'center',
    fontWeight: "bold",
  },

  disabled: {
    marginTop: 20,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom:10,
    marginTop:4
  },
});

export default ViewProject;
