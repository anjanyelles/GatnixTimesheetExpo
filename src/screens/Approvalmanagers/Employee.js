import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getEmplyeedata } from '../aftherlogin';

const Employee = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All Employees');
  const [employees, setEmployees] = useState([]); // Store employee data from API
  const [loading, setLoading] = useState(true); // Loading state for API call

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true); // Show loading indicator
        const response = await getEmplyeedata();
        
        if (response?.data) {
          setEmployees(response.data);
        } else {
          console.error("Invalid API response:", response);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    };

    fetchEmployees();
  }, []);


  
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

  const handleEdit = (id) => {
    console.log(`Edit employee with ID: ${id}`);
  };

  const handleView = (id) => {
    console.log(`View employee with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete employee with ID: ${id}`);
  };

  const renderRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{index + 1}</Text>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.mobile}</Text>

      {/* Action Buttons */}
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
        {['All Employees', 'Active Employees', 'Inactive Employees'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.buttongroup, selectedTab === tab && styles.selectedButton]}
            onPress={() => setSelectedTab(tab)}>
            <Text style={styles.buttonText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View style={[styles.row, styles.header]}>
              {['S.No', 'First Name', 'Last Name', 'Email', 'Phone No', 'Actions'].map((header, index) => (
                <Text key={index} style={[styles.cell, styles.headerText]}>
                  {header}
                </Text>
              ))}
            </View>

            {/* Table Data */}
            <FlatList
              data={getFilteredData()}
              renderItem={renderRow}
              keyExtractor={(item) => item.id.toString()}
            />
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

export default Employee;
