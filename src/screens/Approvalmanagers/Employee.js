import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator ,Switch} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getEmplyeedata } from '../aftherlogin';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert } from "react-native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Employee = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All Employees');
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(true); 
const navigation = useNavigation();



  // useEffect(() => {
  //   fetchEmployees("ALL");
  // }, []);

  useFocusEffect(
    useCallback(()=>{
      fetchEmployees("ALL");
    },[])
  )

  const fetchEmployees = async (status="ALL") => {
    try {
      setLoading(true); 

      const response = await getEmplyeedata(status);
        console.log("resposeall", response)

      if (response?.data) {
        setEmployees(response.data);
      } else {
        console.error("Invalid API response:", response);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);  
    }
  };




  const handleStatusToggle = async (id, currentStatus) => {
    const updatedEmployee = employees.find(emp => emp.id === id);
    if (!updatedEmployee) return;
  
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
      loginStatus: !currentStatus,
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
  
      if (!response.ok) {
        throw new Error(`Failed to update employee status: ${response.status}`);
      }
  
      const responseData = await response.json();
     
      await handelActive(selectedTab);
  
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };
  
  

  const handelActive = async (tab) => {
    let status;
    
    // Set the correct status based on the selected tab
    if (tab === 'All Employees') {
      status = 'All';
    } else if (tab === 'Active') {
      status = true;
    } else if (tab === 'InActive') {
      status = false;
    }
  
    try {
      setLoading(true); // Show loading indicator
      const response = await getEmplyeedata(status);
      
      console.log('Response:', response);
      
      if (response?.data) {
        setEmployees(response.data);
      } else {
        console.error('Invalid API response:', response);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };
  
  
  const getFilteredData = () => {
    return employees.filter(
      (item) =>
        item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.mobile.includes(searchQuery) ||
        item.id.toString().includes(searchQuery)
    );
  };

 

  const editEmployeeDetails=(employeeId)=>{
      navigation.navigate('EditEmployeeDetails',{id:employeeId,page:"Employee",role:"Employee"})
   }

  const handleView = (id) => {
    console.log(`View employee with ID: ${id}`);
    navigation.navigate("Editdata", {id });
 
  };

  const handleDelete = async (id, name, associationId) => {
    console.log("deleting employee id is:",id)
    Alert.alert(
        "Confirm Deletion", 
        `Are you sure you want to delete this employee? ${name} (${id})`, 
        [
            {
                text: "Cancel",
                onPress: () => console.log("Deletion canceled"),
                style: "cancel",
            },
            {   
                text: "OK",
                onPress: async () => {
                    console.log(`Deleting employee with ID: ${id} and Association ID: ${associationId}`);
                    
                    try {

                        const response = await fetch(
                            `https://www.gatnix.com/api/v1/timesheet/172/project/employee/delete/${id}/association/${associationId}/false`,
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
                          alert(JSON.stringify(data.message)); 
                        
                          await handelActive(selectedTab);
                      }
                        else {
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
  const renderRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
     
      <View style={styles.cell}>
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
      <Text style={styles.cell}>{item.mobile}</Text>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleView(item.id)}>
          <Ionicons name="eye" size={20} color="#4CAF50" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => editEmployeeDetails(item.id)}>
          <Ionicons name="create" size={20} color="#FFC107" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id,item.firstName ,item.associationId)}>
          <Ionicons name="trash" size={20} color="#F44336" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by Name, Email, or ID"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Tab Buttons */}
      <View style={styles.buttonRow}>
  {['All Employees', 'Active', 'InActive'].map((tab) => (
    <TouchableOpacity
      key={tab}
      style={[styles.buttongroup, selectedTab === tab && styles.selectedButton]}
      onPress={() => {
        setSelectedTab(tab);
        handelActive(tab); // Correct function call
      }}>
      <Text style={styles.buttonText}>{tab}</Text>
    </TouchableOpacity>
  ))}
</View>



<View style={styles.addButtonContainer}>
  <TouchableOpacity 
    style={styles.addButton} 
    onPress={() =>{
      navigation.navigate('AddEmployee')
    
    }}
  >
    <Ionicons name="add-circle-outline" size={20} color="#fff" />
    <Text style={styles.buttonText}> Add Employee</Text> 
  </TouchableOpacity>
</View>



{loading ? (
  <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
) : (
  <ScrollView horizontal>
    <View>
      {/* Table Header */}
      <View style={[styles.row, styles.header]}>
        {['S.No', 'First Name', 'Last Name', 'Email','Login Status', 'Phone No', 'Actions'].map((header, index) => (
          <Text key={index} style={[styles.cell, styles.headerText]}>
            {header}
          </Text>
        ))}
      </View>

      {/* Table Data */}
      {getFilteredData().length >=0  ? (
        <FlatList
          data={getFilteredData()}
          renderItem={renderRow}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Data Available</Text>
        </View>
      )}
    </View>
  </ScrollView>
)}

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
    backgroundColor: 'rgb(15, 23, 42)',
    textAlign:'center'
  },
  header: {
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: 'row',
  },
  headerText: {
    color: 'rgb(74, 73, 73)',
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
    color: 'rgb(74, 73, 73)',
    width: 120,
    alignItems: 'center', // Center the switch and text
    justifyContent: 'center',
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
  statusText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },

});

export default Employee;
