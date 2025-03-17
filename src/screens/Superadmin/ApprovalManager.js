import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView,Switch,Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getApprovalManagerdata } from '../aftherlogin';
import { useFocusEffect, useNavigation } from '@react-navigation/native';


const ApprovalManager = () => {
  const [allData, setAllData] = useState([]); 
  const [fullManagerData, setFullManagerData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All Employees');
  const navigation=useNavigation()

  const fetchApprovalManagerData = async () => {  
    try {
      const response = await getApprovalManagerdata();
      console.log("ApprovalManagerData:", response.data);
      
      if (response?.data) {
        const formattedData = response.data.map((item, index) => ({
          number: `${index + 1}`,
          id: item.id || '',
          firstName: item.firstName || '',
          lastName: item.lastName || '',
          email: item.email || '',
          phone: item.mobile || '',
          loginStatus: item.loginStatus || false,
        }));

        setFullManagerData(response.data);
        setAllData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   fetchApprovalManagerData(); 
  // }, []);

  useFocusEffect(
    useCallback(()=>{
      fetchApprovalManagerData(); 
    },[])
  )


   const handleDelete = async (id) => {

    const updatedManager = fullManagerData.find(emp => emp.id === id);

    console.log("ID:", id);
    console.log("Updated Employee:", updatedManager);

      Alert.alert(
          "Confirm Deletion", 
          `Are you sure you want to delete this employee? (${id})`, 
          [
              {
                  text: "Cancel",
                  onPress: () => console.log("Deletion canceled"),
                  style: "cancel",
              },
              {   
                  text: "OK",
                  onPress: async () => {
                      console.log(`Deleting employee with ID: ${updatedManager.id} and Association ID: ${updatedManager.associationId}`);
                      
                      try {
  
                          const response = await fetch(
                              `https://www.gatnix.com/api/v1/timesheet/172/project/approval-manager/delete/${updatedManager.id}/association/${updatedManager.associationId}`,
                              {
                                  method: 'DELETE',
                                  headers: {
                                      'Content-Type': 'application/json',
                                  },
                              }
                          );
  
                          const data = await response.json(); 
  
                          if (response) {
                              console.log("Deletion successful:", data);
                              fetchApprovalManagerData();                             
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
      );
  };



  const getFilteredData = () => {
    if (!searchQuery) return allData; 

    return allData.filter((item) =>
      [item.firstName, item.lastName, item.email, item.phone, String(item.id)] 
        .filter(Boolean) 
        .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleEdit = (id) => console.log(`Edit employee with ID: ${id}`);
  const handleView = (id) => console.log(`View employee with ID: ${id}`);

  const handleStatusToggle = async (id, currentStatus) => {
    const updatedEmployee = fullManagerData.find(emp => emp.id === id);

    console.log("ID:", id);
    console.log("Current Status:", currentStatus);
    console.log("Updated Employee:", updatedEmployee);
    if (!updatedEmployee) {
      console.error(`Employee with ID ${id} not found.`);
      return;
    }

  
    const updatedData = {
      id: updatedEmployee.associationId,
      userId: updatedEmployee.id,
      orgId: updatedEmployee.organizationId,
      userUUID: updatedEmployee.userUUID,
      firstName: updatedEmployee.firstName,
      lastName: updatedEmployee.lastName,
      email: updatedEmployee.email,
      associatedRole: updatedEmployee.role,
      managingEmployerId: updatedEmployee.managingEmployerId,
      managingAdminId: updatedEmployee.managingAdminId,
      loginStatus: !currentStatus, // Toggle the status
      schedulerStatus: updatedEmployee.schedulerStatus,
      associatedDate: updatedEmployee.createdDate,
      mobileCountryCode: updatedEmployee.mobileCountryCode,
      mobileIsoCode: updatedEmployee.mobileIsoCode,
      mobileNumber: updatedEmployee.mobile,
      whatsappCountryCode: updatedEmployee.whatsappCountryCode,
      whatsappIsoCode: updatedEmployee.whatsappIsoCode,
      whatsAppNumber: updatedEmployee.whatsAppNumber
    };
  
    try {
      console.log("Updated Data:", updatedData);
      console.log(`Updating status for ID: ${id} to ${!currentStatus}...`);
  
      const response = await fetch(
        `https://www.gatnix.com/api/v1/org-user-association/update/${updatedData.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        }
      );
  
      if (!response) {
        throw new Error(`Failed to update employee status: ${response.status}`);
      }
  
      const responseData = await response.json();

     
       fetchApprovalManagerData();
  
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };
  




  const renderRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text> 
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.phone}</Text>


      <View style={[styles.cell, styles.toggleContainer]}>
  <Switch
    value={item.loginStatus}
    onValueChange={() => handleStatusToggle(item.id, item.loginStatus)}
    trackColor={{ false: '#767577', true: '#81b0ff' }}
    thumbColor={item.loginStatus ? '#4CAF50' : '#f4f3f4'}
  />
  <Text style={[styles.statusText, { color: item.loginStatus ? '#4CAF50' : '#F44336' }]}>
    {item.loginStatus ? 'Active' : 'Inactive'}
  </Text>
</View>


      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleView(item.id)}>
          <Ionicons name="eye" size={20} color="#4CAF50" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Ionicons name="create" size={20} color="#FFC107" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash" size={20} color="#F44336" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by Name, Email, Phone, or ID"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.buttonRow}>
        {['All Employees', 'Active', 'InActive'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.buttongroup, selectedTab === tab && styles.selectedButton]}
            onPress={() => setSelectedTab(tab)}>
            <Text style={styles.buttonText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => 
          {
            navigation.navigate('approvalManagers')
            
          }
          }
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>  Add </Text> 
        </TouchableOpacity>
      </View>


      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.header]}>
            {['S.No', 'First Name', 'Last Name', 'Email', 'Phone No', 'Login Status','Actions'].map((header, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {header}
              </Text>
            ))}
          </View>

          <FlatList
            data={getFilteredData()}
            renderItem={renderRow}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text style={styles.noDataText}>No employees found</Text>}
          />
        </View>
      </ScrollView>
    </View>   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  toggleContainer: {
    justifyContent: 'center',  
    alignItems: 'center',      
    flexDirection: 'column',    
    flex: 1,                  
  },
  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 5,
  },
  buttongroup: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F39237',
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#ff5c35',
  },
  header: {
    backgroundColor: '#FF6F20',
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'row',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
    width: 120,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    width: 120,
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
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F39237',
    borderRadius: 10,
    width: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    
  }, 
  buttonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default ApprovalManager;



