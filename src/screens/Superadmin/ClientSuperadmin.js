import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EmployeeSuperadmin = () => {
  const allData = [
    {
      id: 'T011253',
      employeeName: 'Vishwa Tejaaaa',
      endClient: 'Infosyc',
      status: 'Submitted',
      comments: 'Timesheet ...',
      clientEmail: 'vishwa@gatnix.com',
    },
    {
      id: 'T011254',
      employeeName: 'John Doe',
      endClient: 'TechCorp',
      status: 'Approved',
      comments: 'Approved by manager',
      clientEmail: 'john@globaltech.com',
    },
    {
      id: 'T011255',
      employeeName: 'Jane Smith',
      endClient: 'TechHive',
      status: 'Pending',
      comments: 'Pending approval',
      clientEmail: 'jane@xyzsolutions.com',
    },
    {
      id: 'T011256',
      employeeName: 'Alex Johnson',
      endClient: 'BizCorp',
      status: 'Rejected',
      comments: 'Rejected by manager',
      clientEmail: 'alex@inovatech.com',
    },
  ];

  const tableHeaders = [
    'T.ID',
    'Client Name',
    'Client Email',
    'Phone Number',
    'End Client',
    'End Client Email',
    'Action',
  ];

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
    setCurrentPage(1);
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

  const handleEdit = (id) => {
    console.log(`Edit item with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete item with ID: ${id}`);
  };

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.clientEmail}</Text>
      <Text style={styles.cell}>{item.endClient}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{item.comments}</Text>
      <View style={styles.actionCell}>
        <TouchableOpacity onPress={() => handleEdit(item.id)}>
          <Icon name="create-outline" size={20} color="blue" style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Icon name="trash-outline" size={20} color="red" style={styles.actionIcon} />
        </TouchableOpacity>
      </View>
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
        <TouchableOpacity onPress={prevPage} disabled={currentPage === 1}>
          <Text style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}>Prev</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextPage}
          disabled={currentPage * itemsPerPage >= filteredData.length}
        >
          <Text
            style={[
              styles.paginationButton,
              currentPage * itemsPerPage >= filteredData.length && styles.disabledButton,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
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
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    marginLeft: 10,
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
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 5,
    width: 120,
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: 120,
  },
  actionIcon: {
    marginHorizontal: 5,
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  paginationButton: {
    padding: 10,
    fontSize: 14,
    color: 'blue',
  },
  disabledButton: {
    color: 'gray',
  },
});

export default EmployeeSuperadmin;
