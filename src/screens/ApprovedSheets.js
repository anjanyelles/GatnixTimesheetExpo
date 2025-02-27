import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { handelUpdateAppreveTimeSheet } from './aftherlogin';

const ApprovedSheets = () => {
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Number of items per page
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handelUpdateAppreveTimeSheet();
        console.log("Response:", response.data);
        setAllData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const loadDataForPage = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return allData.slice(startIndex, startIndex + itemsPerPage);
  };

  const displayedData = loadDataForPage(currentPage);

  const nextPage = () => {
    if ((currentPage * itemsPerPage) < allData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const tableHeaders = [
    'T.ID', 'Employee Name', 'Period', 'Total Hours', 'Client', 'End Client', 'Status', 'Comments'
  ];

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return styles.statusApproved;
      case 'pending':
        return styles.statusPending;
      case 'rejected':
        return styles.statusRejected;
      case 'submitted':
        return styles.statusSubmitted;
      default:
        return styles.statusDefault;
    }
  };

  const handleRowPress = (item) => {
    navigation.navigate('Projectscreen', { projectId: item.projectId });
  };

  const renderRow = ({ item }) => (
    <TouchableOpacity onPress={() => handleRowPress(item)} style={styles.row}>
      <Text style={styles.cell}>{item.sheetId}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>
        {new Date(item.startDate * 1000).toLocaleDateString()} / {new Date(item.endDate * 1000).toLocaleDateString()}
      </Text>
      <Text style={styles.cell}>{item.billableHours}</Text>
      <Text style={styles.cell}>{item.clientName}</Text>
      <Text style={styles.cell}>{item.endClientName}</Text>
      <Text style={[styles.cell, getStatusStyle(item.status)]}>{item.status}</Text>
      <Text style={styles.cell}>{item.comments?.[item.comments.length - 1]?.comment || 'No comments'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Approved Time Sheets</Text>

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
            data={displayedData}
            renderItem={renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>

      <View style={styles.paginationWrapper}>
        <Button title="Prev" onPress={prevPage} disabled={currentPage === 1} />
        <Button title="Next" onPress={nextPage} disabled={currentPage * itemsPerPage >= allData.length} />
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
    textAlign: 'start',
    marginBottom: 20,
    color: '#333',
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
  statusApproved: {
    backgroundColor: 'green',
    color: 'white',
    padding: 4,
    borderRadius: 5,
    textAlign: 'center',
  },
  statusPending: {
    backgroundColor: 'orange',
    color: 'white',
    padding: 4,
    borderRadius: 5,
    textAlign: 'center',
  },
  statusRejected: {
    backgroundColor: 'red',
    color: 'white',
    padding: 4,
    borderRadius: 5,
    textAlign: 'center',
  },
  statusSubmitted: {
    backgroundColor: 'blue',
    color: 'white',
    padding: 4,
    borderRadius: 5,
    textAlign: 'center',
  },
  statusDefault: {
    backgroundColor: 'gray',
    color: 'white',
    padding: 4,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default ApprovedSheets;
