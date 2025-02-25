import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { getactiveprojectdetailsdata, getProjectdetailsdata } from '../aftherlogin';

const Project = () => {
  const [allData, setAllData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('All Projects');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await getProjectdetailsdata();
        console.log("Response Data:", JSON.stringify(response, null, 2)); // Log full response

        if (response?.data) {
          const formattedData = response.data.map((item, index) => ({
            id: index.toString(),
            sno: index + 1,
            employeeName: item.employeeName || '',
            employeeEmail: item.employeeEmail || '',
            employeePhoneNumber: item.employeePhoneNumber || '',
            employeeWhatsappNumber: item.employeeWhatsappNumber || '',
            clientName: item.clientName || '',
            endClientName: item.endClientName || '',
            payRate: item.payRate || '',
            firstName: item.approvalManagers?.[0]?.firstName || '',  // Access from array
            lastName: item.approvalManagers?.[0]?.lastName || '',   // Access from array
          }));
          setAllData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching the project data:", error);
      }
    };
    fetchProjectData();
  }, []);


  
  const activeData = allData.filter(item => item.status === 'Approved');
  const inactiveData = allData.filter(item => item.status === 'Rejected');

  useEffect(() => {
    const fetchProjects = async (status) => {
      console.log(`Fetching ${selectedTab} Data with status:`, status);
      try {
        const response = await getactiveprojectdetailsdata(status);
        if (response?.data) {
          const formattedData = response.data.map((item, index) => ({
            id: index.toString(),
            sno: index + 1,
            employeeName: item.employeeName || '',
            employeeEmail: item.employeeEmail || '',
            employeePhoneNumber: item.employeePhoneNumber || '',
            employeeWhatsappNumber: item.employeeWhatsappNumber || '',
            clientName: item.clientName || '',
            endClientName: item.endClientName || '',
            payRate: item.payRate || '',
            firstName: item.approvalManagers?.[0]?.firstName || '',
            lastName: item.approvalManagers?.[0]?.lastName || '',
          }));
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
    }
  
  }, [selectedTab]);   
  
  const getDataForTab = () => {
    if (selectedTab === 'All Projects') return allData;
    if (selectedTab === 'Active Projects') return allData; 
    if (selectedTab === 'Inactive Projects') return inactiveData;
    return allData;
  };
  

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.sno}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.employeeEmail}</Text>
      <Text style={styles.cell}>{item.employeePhoneNumber}</Text>
      <Text style={styles.cell}>{item.employeeWhatsappNumber}</Text>
      <Text style={styles.cell}>{item.clientName}</Text>
      <Text style={styles.cell}>{item.endClientName}</Text>
      <Text style={styles.cell}>{item.firstName}</Text> 
      <Text style={styles.cell}>{item.lastName}</Text> 
      <Text style={styles.cell}>{item.payRate}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project</Text>
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
            {['S.No', 'Employee Name', 'Employee Email', 'Employee Phone', 'WhatsApp', 'Client Name', 'End Client', 'First Name', 'Last Name', 'Pay Rate'].map((header, index) => (
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f9fa' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#D4D4D4', padding: 4, borderRadius: 16 },
  buttongroup: { paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#F39237', borderRadius: 10, flex: 1, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 12, color: '#fff', fontWeight: 'bold' },
  selectedButton: { backgroundColor: '#ff5c35' },
  header: { backgroundColor: '#FF6F20', borderRadius: 5, marginBottom: 5, flexDirection: 'row' },
  headerText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 14, padding: 4, width: 120 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingVertical: 10 },
  cell: { flex: 1, fontSize: 14, textAlign: 'center', color: '#333', paddingHorizontal: 5, width: 120 },
});

export default Project;
