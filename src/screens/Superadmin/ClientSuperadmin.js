import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getClientSuperadmindata } from '../aftherlogin';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const ClientSuperadmin = () => {
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
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigation()


  useFocusEffect(
    useCallback(() => {
     
      fetchClientSuperadmindata();
    }, [])
  );
  


  const fetchClientSuperadmindata = async () => {
    try {
      const response = await getClientSuperadmindata();
      if (response?.data) {
        const formattedData = response.data.map((item, index) => ({
          number: `${index + 1}`,
          id: item.id || '',
          clientName: item.clientName || '',
          clientEmail: item.clientBillingEmail || '',
          phone: item.clientPhoneNumber || '',
          endClient: item.endClientName || '',
          endClientEmail: item.endClientEmail || '',
        }));

        console.log('Formatted Data:', formattedData);
        setAllData(formattedData);
        setFilteredData(formattedData); 
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (!text) {
      setFilteredData(allData); 
      return;
    }

    const filtered = allData.filter(
      (item) =>
        item.clientName.toLowerCase().includes(text.toLowerCase()) ||
        item.clientEmail.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const loadDataForPage = (page) => {
    if (!filteredData.length) return []; // Prevent slice on undefined
    const startIndex = (page - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
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
    navigate.navigate('EditClientData', { clientId: id });
  };
  
  const handleDelete = async (id) => {
    console.log("deleting ID:", id)

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete this employee? (${id})`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion canceled"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {

              const response = await fetch(
                `https://www.gatnix.com/api/v1/timesheet/172/clients/${id}`,
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
                await fetchClientSuperadmindata();
              } else {
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





  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.number}</Text>
      <Text style={styles.cell}>{item.clientName}</Text>
      <Text style={styles.cell}>{item.clientEmail}</Text>
      <Text style={styles.cell}>{item.phone}</Text>
      <Text style={styles.cell}>{item.endClient}</Text>
      <Text style={styles.cell}>{item.endClientEmail}</Text>
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

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Client Details</Text>
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigate.navigate('AddClients')}
          >
            <Ionicons name="add-circle-outline" size={20} color="blue" />
            <Text style={styles.buttonText}> Add Client</Text>
          </TouchableOpacity>
        </View>
      </View>





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
        <TouchableOpacity onPress={nextPage} disabled={currentPage * itemsPerPage >= filteredData.length}>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },


});

export default ClientSuperadmin;
