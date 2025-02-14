import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this library is installed

const Project = () => {
  const allData = [
    { id: 'T011253', employeeName: 'Vishwa Tejaaaa', period: '2025-01-12 / 2025-01-18', totalHours: '45.0', status: 'Submitted' },
    { id: 'T011254', employeeName: 'John Doe', period: '2025-01-12 / 2025-01-18', totalHours: '40.0', status: 'Approved' },
    { id: 'T011255', employeeName: 'Jane Smith', period: '2025-01-19 / 2025-01-25', totalHours: '35.0', status: 'Pending' },
    { id: 'T011256', employeeName: 'Alex Johnson', period: '2025-01-19 / 2025-01-25', totalHours: '42.0', status: 'Rejected' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All Employees');

  const getFilteredData = () => {
    const filteredData = allData.filter(
      (item) =>
        item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (selectedTab === 'Active Employees') {
      return filteredData.filter(item => item.status === 'Approved');
    } else if (selectedTab === 'Inactive Employees') {
      return filteredData.filter(item => item.status === 'Rejected');
    } else {
      return filteredData;
    }
  };

  const handleAction = (action, item) => {
    console.log(`${action} clicked for`, item);
    // Implement your action logic here
  };

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.period}</Text>
      <Text style={styles.cell}>{item.totalHours}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity onPress={() => handleAction('Edit', item)}>
          <Icon name="edit" size={20} color="#FFC107" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAction('View', item)}>
          <Icon name="visibility" size={20} color="#28A745" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAction('Delete', item)}>
          <Icon name="delete" size={20} color="#DC3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee </Text>

      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
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
            {['T.ID', 'Employee Name', 'Period', 'Total Hours', 'Status', 'Action'].map((header, index) => (
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
    fontSize: 20,
    color: '#888',
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
    backgroundColor: '#D4D4D4',
    padding: 4,
    borderRadius: 16,
  },
  buttongroup: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F39237',
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 5,
    width: 120,
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 120,
  },
});

export default Project;
