import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, TouchableOpacity, ActivityIndicator ,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { handleDeleteUser, handlegetAllClinetDataApi } from '../aftherlogin';
import ClientEditForm from './ClientEditForm';
import { Button } from 'react-native-paper';


const EmployeeSuperadmin = ({navigation}) => {
  const tableHeaders = ['T.ID', 'Client Name', 'Client Email', 'Phone Number', 'End Client', 'End Client Email', 'Action'];

  const [searchQuery, setSearchQuery] = useState('');
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);  const [selectedId, setSelectedId]=useState()
  const [modalVisible  ,setModalVisible]=useState(false);

  const itemsPerPage = 10;

  const fetchClientData = async (page) => {
    setLoading(true);
    try {
      const response = await handlegetAllClinetDataApi(page, itemsPerPage);
      console.log("API Response:", response);

      if (response && response.data) {
        const formattedData = response.data.map((client) => ({
          id: client.id,
          clientName: client.clientName,
          clientEmail: client.clientBillingEmail,
          phoneNumber: client.clientPhoneNumber,
          endClient: client.endClientName,
          endClientEmail: client.endClientEmail,
        }));

        setAllData(formattedData);
        setFilteredData(formattedData);
        setTotalPages(response.metaData.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData(currentPage);
  }, [currentPage]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = allData.filter(
      (item) =>
        item.clientName.toLowerCase().includes(text.toLowerCase()) ||
        item.clientEmail.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleEdit = (id) => {
 
    
    navigation.navigate('ClientEditForm', { id });
    // Or if using a modal:
    setSelectedId(id);
    setModalVisible(true);
  };



  

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this client?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await handleDeleteUser(id);
              if(response.message === "Client Has Association With Project"){
                Alert.alert("You can't Delete this user because", response.message);
              }
              Alert.alert(response.message || "Client deleted successfully");
              console.log(`Delete item with ID: ${id}`);
            } catch (error) {
              Alert.alert("Error", "Failed to delete client");
              console.error("Delete error:", error);
            }
          },
        },
      ]
    );
  };
  

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.clientName}</Text>
      <Text style={styles.cell}>{item.clientEmail}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
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
      <Text style={styles.title}>Client Details</Text>
      <Button style={styles.smallButton}  onPress={() => navigation.navigate('ClientNewdataForm')}>
        <Text style={styles.smallButtonText}>
        Add
        </Text>
      </Button>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Client Name or Email..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon name="search-outline" size={20} color="#999" style={styles.searchIcon} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <ScrollView horizontal>
          <View>
            <View style={[styles.row, styles.header]}>
              {tableHeaders.map((header, index) => (
                <Text key={index} style={[styles.cell, styles.headerText]}>
                  {header}
                </Text>
              ))}
            </View>
            <FlatList
              data={filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
              renderItem={renderRow}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
      )}
{modalVisible && <ClientEditForm id={selectedId} onClose={() => setModalVisible(false)} />}
      <View style={styles.paginationWrapper}>
        <TouchableOpacity onPress={prevPage} disabled={currentPage === 1}>
          <Text style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}>Prev</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>Page {currentPage} of {totalPages}</Text>
        <TouchableOpacity onPress={nextPage} disabled={currentPage === totalPages}>
          <Text style={[styles.paginationButton, currentPage === totalPages && styles.disabledButton]}>Next</Text>
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
