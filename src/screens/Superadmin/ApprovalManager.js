import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getApprovalManagerdata } from '../aftherlogin';

const ApprovalManager = () => {
  const [allData, setAllData] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All Employees');

  useEffect(() => {
    const fetchApprovalManagerData = async () => {
      try {
        const response = await getApprovalManagerdata();
        if (response?.data) {
          
          const formattedData = response.data.map((item, index) => ({
            id: `${index + 1}`, // Ensure ID is a string
            firstName: item.firstName || '',
            lastName: item.lastName || '',
            email: item.email || '',
            phone: item.mobile || '',
          }));
          console.log("formattedData",formattedData)
          setAllData(formattedData); // ✅ Update allData with API response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchApprovalManagerData();
  }, []);

  const getFilteredData = () => {
    if (!searchQuery) return allData; // Return all data if search is empty

    return allData.filter((item) =>
      [item.firstName, item.lastName, item.email, item.phone, String(item.id)] // Ensure ID is a string
        .filter(Boolean) // Remove undefined/null values
        .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleEdit = (id) => console.log(`Edit employee with ID: ${id}`);
  const handleView = (id) => console.log(`View employee with ID: ${id}`);
  const handleDelete = (id) => console.log(`Delete employee with ID: ${id}`);

  const renderRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text> 
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.phone}</Text>
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

      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.header]}>
            {['S.No', 'First Name', 'Last Name', 'Email', 'Phone No', 'Actions'].map((header, index) => (
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
});

export default ApprovalManager;
