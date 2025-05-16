import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmployeeSuperadmin = () => {
  const allData = [
    { id: 'T011253', firstName: 'Karthik', lastName: 'Karthik', email: 'tejavishwa0408@gmail.com', phone: '77024 43766' },
    { id: 'T011254', firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com', phone: '12345 67890' },
    { id: 'T011255', firstName: 'Jane', lastName: 'Smith', email: 'janesmith@example.com', phone: '23456 78901' },
    { id: 'T011256', firstName: 'Alex', lastName: 'Johnson', email: 'alexjohnson@example.com', phone: '34567 89012' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All Employees');

  const getFilteredData = () => {
    const filteredData = allData.filter(
      (item) =>
        item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filteredData; // No filtering by tab selected here for simplicity
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
      <Text style={styles.cell}>{index + 1}</Text> {/* Display row index as S.No */}
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.phone}</Text>

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
          placeholder="Search by Name, Period, Status, or ID"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>

      {/* Tab Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.buttongroup,
            selectedTab === 'All Employees' && styles.selectedButton,
          ]}
          onPress={() => setSelectedTab('All Employees')}>
          <Text style={styles.buttonText}>All Employees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttongroup,
            selectedTab === 'Active Employees' && styles.selectedButton,
          ]}
          onPress={() => setSelectedTab('Active Employees')}>
          <Text style={styles.buttonText}>Active Employees</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttongroup,
            selectedTab === 'Inactive Employees' && styles.selectedButton,
          ]}
          onPress={() => setSelectedTab('Inactive Employees')}>
          <Text style={styles.buttonText}>Inactive Employees</Text>
        </TouchableOpacity>
      </View>

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
            keyExtractor={(item) => item.id}
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

export default EmployeeSuperadmin;
