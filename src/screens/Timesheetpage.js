import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';

const Timesheetpage = () => {
  const allData = [
    { id: 'T011253', employeeName: 'Vishwa Tejaaaa', period: '2025-01-12 / 2025-01-18', totalHours: '45.0', status: 'Submitted' },
    { id: 'T011254', employeeName: 'John Doe', period: '2025-01-12 / 2025-01-18', totalHours: '40.0', status: 'Approved' },
    { id: 'T011255', employeeName: 'Jane Smith', period: '2025-01-19 / 2025-01-25', totalHours: '35.0', status: 'Pending' },
    { id: 'T011256', employeeName: 'Alex Johnson', period: '2025-01-19 / 2025-01-25', totalHours: '42.0', status: 'Rejected' },
  ];

  const activeData = allData.filter(item => item.status === 'Approved');
  const inactiveData = allData.filter(item => item.status === 'Rejected');
  const [selectedTab, setSelectedTab] = useState('All Projects');

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.period}</Text>
      <Text style={styles.cell}>{item.totalHours}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </View>
  );

  const getDataForTab = () => {
    if (selectedTab === 'Active Projects') {
      return activeData;
    } else if (selectedTab === 'Inactive Projects') {
      return inactiveData;
    } else {
      return allData;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Time Sheets</Text>

      {/* Tab Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.buttongroup,
            selectedTab === 'All Projects' && styles.selectedButton,
          ]}
          onPress={() => setSelectedTab('All Projects')}>
          <Text style={styles.buttonText}>All Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttongroup,
            selectedTab === 'Active Projects' && styles.selectedButton,
          ]}
          onPress={() => setSelectedTab('Active Projects')}>
          <Text style={styles.buttonText}>Active Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.buttongroup,
            selectedTab === 'Inactive Projects' && styles.selectedButton,
          ]}
          onPress={() => setSelectedTab('Inactive Projects')}>
          <Text style={styles.buttonText}>Inactive Projects</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={[styles.row, styles.header]}>
            {['T.ID', 'Employee Name', 'Period', 'Total Hours', 'Status'].map((header, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {header}
              </Text>
            ))}
          </View>

          {/* Table Data */}
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
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
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
    backgroundColor: '#ff5c35', // Active button color
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
});

export default Timesheetpage;
