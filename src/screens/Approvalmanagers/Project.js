import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getactiveprojectdetailsdata, getProjectdetailsdata } from '../aftherlogin';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Project = () => {
  const [allData, setAllData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All Projects');

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fullprojectData,setFullProjectData]=useState([])
  
  

    useFocusEffect(
      useCallback(() => {
        fetchProjectData();
      }, [])
    );

  const fetchProjectData = async () => {
    const orgId=await AsyncStorage.getItem("orgId")
    console.log(orgId)
    setLoading(true)
    try {
      const response = await getProjectdetailsdata();
      console.log("Response Data:", response.data); // Log full response

      if (response?.data) {
        const formattedData = response.data.map((item, index) => {
            const parsedEndDate = Number(item.endDate); 
    
            return {
                id: item.id,
                sno: index + 1,
                employeeName: item.employeeName || '',
                employeeEmail: item.employeeEmail || '',
                employeePhoneNumber: item.employeePhoneNumber || '',
                employeeWhatsappNumber: item.employeeWhatsappNumber || '',
                clientName: item.clientName || '',
                endClientName: item.endClientName || '',
                payRate: item.payRate || '',
                approvalManagers: item.approvalManagers?.map(manager => `${manager.firstName} ${manager.lastName}`).join(", ") || '',
                startDate: new Date(item.startDate * 1000).toLocaleDateString("en-GB"), 
                endDate: !isNaN(parsedEndDate) ? new Date(parsedEndDate * 1000).toLocaleDateString("en-GB")
                    : item.endDate ,
            };
        });

    
            

        setAllData(formattedData);
        setFullProjectData(response.data)
    }
    } catch (error) {
      console.error("Error fetching the project data:", error);
    }
    finally{
      setLoading(false)
    }
  };

  
  const activeData = allData.filter(item => item.status === 'Approved');
  const inactiveData = allData.filter(item => item.status === 'Rejected');

  useEffect(() => {
    const fetchProjects = async (status) => {
      console.log(`Fetching ${selectedTab} Data with status:`, status);
      try {
        const response = await getactiveprojectdetailsdata(status);

        if (response?.data) {
          const formattedData = response.data.map((item, index) => {
              const parsedEndDate = Number(item.endDate); 
      
              return {
                  id: item.id,
                  sno: index + 1,
                  employeeName: item.employeeName || '',
                  employeeEmail: item.employeeEmail || '',
                  employeePhoneNumber: item.employeePhoneNumber || '',
                  employeeWhatsappNumber: item.employeeWhatsappNumber || '',
                  clientName: item.clientName || '',
                  endClientName: item.endClientName || '',
                  payRate: item.payRate || '',
                  approvalManagers: item.approvalManagers?.map(manager => `${manager.firstName} ${manager.lastName}`).join(", ") || '',
                  startDate: new Date(item.startDate * 1000).toLocaleDateString("en-GB"), 
                  endDate: !isNaN(parsedEndDate) ? new Date(parsedEndDate * 1000).toLocaleDateString("en-GB")
                      : item.endDate ,
              };
          });

      
            

          setAllData(formattedData);
      }
      
      } catch (error) {
        console.error(`Error fetching ${selectedTab} project data:`, error);
      }
    };
  
    if (selectedTab === 'Active Projects') {
      fetchProjects("active");  
    } else if (selectedTab === "Inactive Projects") {
      fetchProjects("closed"); 
    }else{
      fetchProjects("all")
    }
  
  }, [selectedTab]);   
  
  const getDataForTab = () => {
    if (selectedTab === 'All Projects') return allData;
    if (selectedTab === 'Active Projects') return allData; 
    if (selectedTab === 'Inactive Projects') return inactiveData;
    return allData;
  };

  const handleView =(id)=>{
    navigation.navigate('ViewProject', { projectId: id })
  
    console.log(id)
  }
  const handleEdit=(id)=>{
    navigation.navigate('AddProject1', { projectId: id })
    console.log(id)
  }

  const handleDelete=(id)=>{
    console.log(id);
    const projectDetails=fullprojectData.find(data=>data.id==id)
    console.log("deleting project id is :",projectDetails)
     Alert.alert(
            "Confirm Deletion", 
            `Are you sure you want to delete this
             project? ${id} (${projectDetails.employeeId})`, 
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Deletion canceled"),
                    style: "cancel",
                },
                {   
                    text: "OK",
                    onPress: async () => {

                      const orgId = await AsyncStorage.getItem("orgId");
                      if(!orgId){
                        Alert.alert('Error', 'Organization ID not found!');
                        return;
                      }
                        
                        try {
    
                            const response = await fetch(
                                `https://www.gatnix.com/api/v1/timesheet/${orgId}/project/${projectDetails.employeeId}/${id}`,
                                {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            );
    
                           
    
                            if (response.status==204) {
                                console.log("Deletion successful:", response);
                                await  fetchProjectData()
                            } else {
                                console.error("Deletion failed:", data);
                            }
                            
                        } catch (error) {
                            console.error("Error deleting employee:", error);
                        }
                    },
                },
            ],
            { cancelable: false }
        )

  }
  

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.sno}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.employeeEmail}</Text>
      <Text style={styles.cell}>{item.employeePhoneNumber}</Text>
      <Text style={styles.cell}>{item.employeeWhatsappNumber}</Text>
      <Text style={styles.cell}>{item.clientName}</Text>
      <Text style={styles.cell}>{item.endClientName}</Text>
      <Text style={styles.cell}>{item.approvalManagers}</Text>
      <Text style={styles.cell}>{item.payRate}</Text>
      <Text style={styles.cell}>{item.startDate}</Text>
      <Text style={styles.cell}>{item.endDate}</Text>


      <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => handleView(item.id)}>
                <Ionicons name="eye" size={20} color="#4CAF50" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> handleEdit(item.id)}>
                <Ionicons name="create" size={20} color="#FFC107" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>handleDelete(item.id)} >
                <Ionicons name="trash" size={20} color="#F44336" style={styles.icon} />
              </TouchableOpacity>
            </View>



    </View>
  );

  return (

    <>
        {loading && (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    )}


    <View style={styles.container}>
       <View style={styles.headerContainer}>
      <Text style={styles.title}>Project</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProject')}>
        <Text style={styles.addButtonText}>+ Add Project</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        {['All Projects', 'Active Projects', 'Inactive Projects'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.buttongroup, selectedTab === tab && styles.selectedButton]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={styles.buttonText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.header]}>
            {['S.No', 'Employee Name', 'Employee Email', 'Employee Phone', 'WhatsApp', 'Client Name', 'End Client', 'Approval Managers', 'Pay Rate','Start Date','End Date','Actions'].map((header, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {header}
              </Text>
            ))}
          </View>
          <FlatList
            data={getDataForTab()}
            renderItem={renderRow}
            keyExtractor={(item) => item.id}
          />
        </View>
      </ScrollView>
    </View>
    </>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f9fa' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center',marginLeft:20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#D4D4D4', padding: 4, borderRadius: 16 },
  buttongroup: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#F39237', borderRadius: 10, flex: 1, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  selectedButton: { backgroundColor: '#ff5c35' },
  header: { backgroundColor: '#FF6F20', borderRadius: 5, marginBottom: 5, flexDirection: 'row' },
  headerText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 14, padding: 4, width: 120 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10 },
  cell: { flex: 1, fontSize: 14, textAlign: 'center', color: '#333', paddingHorizontal: 5, width: 120 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#28a745', 
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight:20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default Project;
