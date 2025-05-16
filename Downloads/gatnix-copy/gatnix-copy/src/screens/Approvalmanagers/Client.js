import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Client = () => {
  // Sample data for the table
  const allData = [
    {
      id: 'T011253',
      employeeName: 'Vishwa Tejaaaa',
      period: '2025-01-12 / 2025-01-18',
      totalHours: '45.0',
      client: 'Gatnix Time sheets',
      endClient: 'Infosyc',
      status: 'Submitted',
      comments: 'Timesheet ...',
      clientEmail: 'vishwa@gatnix.com',
    },
    {
      id: 'T011254',
      employeeName: 'John Doe',
      period: '2025-01-12 / 2025-01-18',
      totalHours: '40.0',
      client: 'Global Tech',
      endClient: 'TechCorp',
      status: 'Approved',
      comments: 'Approved by manager',
      clientEmail: 'john@globaltech.com',
    },
    {
      id: 'T011255',
      employeeName: 'Jane Smith',
      period: '2025-01-19 / 2025-01-25',
      totalHours: '35.0',
      client: 'XZY Solutions',
      endClient: 'TechHive',
      status: 'Pending',
      comments: 'Pending approval',
      clientEmail: 'jane@xyzsolutions.com',
    },
    {
      id: 'T011256',
      employeeName: 'Alex Johnson',
      period: '2025-01-19 / 2025-01-25',
      totalHours: '42.0',
      client: 'InovaTech',
      endClient: 'BizCorp',
      status: 'Rejected',
      comments: 'Rejected by manager',
      clientEmail: 'alex@inovatech.com',
    },
  ];

  const tableHeaders = [
    'T.ID',
    'Employee Name',
    'Period',
    'Total Hours',
    'Client',
    'Client Email',
    'End Client',
    'Status',
    'Comments',
  ];

  // Search and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(allData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = allData.filter(
      (item) =>
        item.client.toLowerCase().includes(text.toLowerCase()) ||
        item.clientEmail.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page on new search
  };

  const loadDataForPage = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const newData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    return newData;
  };

  const displayedData = loadDataForPage(currentPage);

  const nextPage = () => {
    if (currentPage * itemsPerPage < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.period}</Text>
      <Text style={styles.cell}>{item.totalHours}</Text>
      <Text style={styles.cell}>{item.client}</Text>
      <Text style={styles.cell}>{item.clientEmail}</Text>
      <Text style={styles.cell}>{item.endClient}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{item.comments}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Client Details</Text>

      <View style={styles.searchContainer}>
  <TextInput
    style={styles.searchInput}
    placeholder="Search by Client Name or Email..."
    value={searchQuery}
    onChangeText={handleSearch}
  />
  <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
</View>

      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={[styles.row, styles.header]}>
            {tableHeaders.map((header, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {header}
              </Text>
            ))}
          </View>

          {/* Table Data */}
          <FlatList
            data={displayedData}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View style={styles.paginationWrapper}>
        <Button
          title="Prev"
          onPress={prevPage}
          disabled={currentPage === 1}
        />
        <Button
          title="Next"
          onPress={nextPage}
          disabled={currentPage * itemsPerPage >= filteredData.length}
        />
      </View>
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
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 8,
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
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 14,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1, // Allow the input to take up available space
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10, // Add space between the input and icon
  },
  
});

export default Client;
