import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchActiveEmployeesApiData, fetchInactiveEmployees, handlegetAllEmpoyeeDataApi } from '../aftherlogin';
import { Button, Switch } from 'react-native-paper';
import axios from 'axios';

const ApprovalManager = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('All Employees');
  const [allData, setAllData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchEmployeeData();
  }, []);
  
  const fetchEmployeeData = async () => {
    try {
      const response = await handlegetAllEmpoyeeDataApi();
      if (response && response.data) {
        const formattedData = response.data.map((employee) => ({
          id: employee.id,
          userId: employee.id, // Use 'id' as 'userId'
          orgId: employee.organizationId, // Map 'organizationId' to 'orgId'
          userUUID: employee.userUUID,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          associatedRole: employee.role, // Map 'role' to 'associatedRole'
          managingEmployerId: employee.managingEmployerId || null,
          managingAdminId: employee.managingAdminId || null,
          loginStatus: employee.loginStatus || false,
          schedulerStatus: employee.schedulerStatus || false,
          associatedDate: employee.createdDate, // Map 'createdDate' to 'associatedDate'
          mobileCountryCode: employee.mobileCountryCode,
          mobileIsoCode: employee.mobileIsoCode,
          mobileNumber: employee.mobile,
          whatsappCountryCode: employee.whatsappCountryCode,
          whatsappIsoCode: employee.whatsappIsoCode,
          whatsAppNumber: employee.whatsAppNumber,
          phone: employee.mobile,
          associationId: employee.associationId, // Add 'associationId' if needed
        }));
        setAllData(formattedData);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };
  

  const fetchActiveEmployees = async (page, pageSize, istrue) => {
    try {
      const response = await fetchActiveEmployeesApiData(page, pageSize, istrue)
      const data = response;
      if (data && data.data) {
        const formattedData = data.data.map((employee) => ({
          id: employee.id,
          userId: employee.userId,
          orgId: employee.orgId,
          userUUID: employee.userUUID,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          associatedRole: employee.associatedRole,
          managingEmployerId: employee.managingEmployerId,
          managingAdminId: employee.managingAdminId,
          loginStatus: employee.loginStatus || false,
          schedulerStatus: employee.schedulerStatus || false,
          associatedDate: employee.associatedDate,
          mobileCountryCode: employee.mobileCountryCode,
          mobileIsoCode: employee.mobileIsoCode,
          mobileNumber: employee.mobileNumber,
          whatsappCountryCode: employee.whatsappCountryCode,
          whatsappIsoCode: employee.whatsappIsoCode,
          whatsAppNumber: employee.whatsAppNumber,
          phone: employee.mobile,
        }));
        setAllData(formattedData);
        console.log("formdata", formattedData)
      }
    } catch (error) {
      console.error("Error fetching active employees:", error);
    }
  };

  const getValidValue = (value, fallback = null) => (value !== undefined && value !== null ? value : fallback);

  const toggleLoginStatus = async (item) => {

    console.log("iyoyo", item)
    try {
      // Validate essential fields
      if (!item || !item.userId || !item.orgId) {
        console.error("Invalid item data:", item);
        Alert.alert("Error", "Invalid user data. Cannot update login status.");
        return;
      }
  
      // Create a new object with updated loginStatus
      const updatedData = {
        id: getValidValue(item.id),
        userId: item.userId,
        orgId: item.orgId,
        userUUID: getValidValue(item.userUUID, ""),
        firstName: getValidValue(item.firstName, ""),
        lastName: getValidValue(item.lastName, ""),
        email: getValidValue(item.email, ""),
        associatedRole: getValidValue(item.associatedRole, "user"),
        managingEmployerId: getValidValue(item.managingEmployerId, null),
        managingAdminId: getValidValue(item.managingAdminId, null),
        loginStatus: !item.loginStatus, // Toggle login status
        schedulerStatus: getValidValue(item.schedulerStatus, false),
        associatedDate: getValidValue(item.associatedDate, new Date().toISOString().split('T')[0]),
        mobileCountryCode: getValidValue(item.mobileCountryCode, ""),
        mobileIsoCode: getValidValue(item.mobileIsoCode, ""),
        mobileNumber: getValidValue(item.mobileNumber, ""),
        whatsappCountryCode: getValidValue(item.whatsappCountryCode, ""),
        whatsappIsoCode: getValidValue(item.whatsappIsoCode, ""),
        whatsAppNumber: getValidValue(item.whatsAppNumber, "")
      };
  
      // Check critical fields before sending
      if (!updatedData.userId || !updatedData.orgId) {
        console.error("Critical data missing. userId or orgId is invalid.");
        Alert.alert("Error", "Critical data missing. Cannot update login status.");
        return;
      }
  
      const apiUrl = `https://www.gatnix.com/api/v1/org-user-association/update/${item.userId}`;
      console.log(`Updating user ${item.firstName} ${item.lastName} (ID: ${item.userId})`);
      console.log("Payload to send:", updatedData);
  
      // Send the update request
      const response = await axios.put(apiUrl, updatedData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response && response.data) {
        console.log("API response:", response.data);
  
        // Update local state to reflect the change
        setAllData((prevData) =>
          prevData.map((employee) =>
            employee.userId === item.userId
              ? { ...employee, loginStatus: !item.loginStatus }
              : employee
          )
        );
  
        Alert.alert(
          "Success",
          `${item.firstName || "User"}'s login status updated to ${!item.loginStatus ? "Active" : ""}`
        );
      } else {
        Alert.alert("Error", "Failed to update login status. No response from server.");
      }
    } catch (error) {
      console.error("Error updating login status:", error);
      Alert.alert("Error", `Failed to update login status for ${item.firstName} ${item.lastName}: ${error.message}`);
    }
  };
  
  
  // Let me know if you want me to add more checks or handle edge cases! 🚀
  
   
  useEffect(() => {
    if (selectedTab === 'Active') {
      fetchActiveEmployees(page, pageSize, "true");
    } 
    else if (selectedTab === 'Inactive') {
      fetchActiveEmployees(page, pageSize, "false");
    }
    else {
      fetchEmployeeData();
    }
    setPage(0); // Reset to the first page when switching tabs
  }, [selectedTab]);

  const getFilteredData = () => {
    return allData.filter(
      (item) =>
        item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.phone && item.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.id.toString().includes(searchQuery)
    );
  };

  const paginatedData = () => {
    const filteredData = getFilteredData();
    const startIndex = page * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  };

  const renderRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1 + page * pageSize}</Text>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.phone || item.mobileNumber}</Text>
      <View style={styles.cell}>
      <Switch
  value={item.loginStatus}
  onValueChange={() => toggleLoginStatus(item)}
  color="#4CAF50"
/>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => console.log(`Edit employee with ID: ${item.id}`)}>
          <Ionicons name="create" size={20} color="#FFC107" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log(`Delete employee with ID: ${item.id}`)}>
          <Ionicons name="trash" size={20} color="#F44336" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approval Manager</Text>
     
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by Name, Period, Status, or ID"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      
      <Button style={styles.smallButton} onPress={() => navigation.navigate('Addapprovalmanager')}>
        <Text style={styles.smallButtonText}>
          Add
        </Text>
      </Button>
      
      <View style={styles.buttonRow}>
        {['All Employees', 'Active', 'Inactive'].map((tab) => (
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
            {['S.No', 'First Name', 'Last Name', 'Email', 'Phone No', 'Login Status', 'Actions'].map((header, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>{header}</Text>
            ))}
          </View>

          <FlatList
            data={paginatedData()}
            renderItem={renderRow}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No Data Found</Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.pageButton, page === 0 && styles.disabledButton]}
          onPress={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>

        <Text style={styles.pageText}>Page {page + 1}</Text>

        <TouchableOpacity
          style={[styles.pageButton, pageSize * (page + 1) >= getFilteredData().length && styles.disabledButton]}
          onPress={() => setPage((prev) => prev + 1)}
          disabled={pageSize * (page + 1) >= getFilteredData().length}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f9fa' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc' },
  searchIcon: { marginHorizontal: 10 },
  searchBar: { flex: 1, height: 40, paddingHorizontal: 10, borderRadius: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 5 },
  buttongroup: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#F39237', borderRadius: 10, flex: 1, alignItems: 'center', color:'#ffff' },
  selectedButton: { backgroundColor: '#ff5c35', color:'#ffff' },
  header: { backgroundColor: '#FF6F20', flexDirection: 'row', paddingVertical: 8 },
  headerText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 14, width: 120 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10, alignItems: 'center' },
  cell: { width: 120, textAlign: 'center' },
  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  pageButton: { padding: 8, marginHorizontal: 10, backgroundColor: '#F39237', borderRadius: 5 },
  disabledButton: { backgroundColor: '#ccc' },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  smallButton: {
backgroundColor: 'rgb(108, 108, 108)',
display:'flex',
paddingVertical: 1,
paddingHorizontal: 5,
borderRadius: 6,
alignItems: 'center',
justifyContent: 'flex-end',
width:80,
marginBottom:20,
},
smallButtonText: {
color: '#FFF',
fontSize: 14,
fontWeight: 'bold',
width:80,
},
  noDataText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  pageText: { fontSize: 14, fontWeight: 'bold' },
});

export default ApprovalManager;
