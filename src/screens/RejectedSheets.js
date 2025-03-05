import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Button } from 'react-native';
import { getRejectedsheetdata } from './aftherlogin';

const RejectedSheets = () => {
  const [allData, setAllData] = useState([]);  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [displayedData, setDisplayedData] = useState([]);

  const tableHeaders = [
    'T.ID',
    'Employee Name',
    'Period',
    'Total Hours',
    'Client',
    'End Client',
    'Status',
    'Comments',
  ];

  useEffect(() => {
    const fetchRejectedSheetData = async () => {
      try {
        const response = await getRejectedsheetdata();
        console.log('API Response:', response);  // Debugging the response

        if (response?.data) {
          const formattedData = response.data.map((item, index) => ({
            sheetId : item.sheetId || '',
            employeeName: item.employeeName || '',
            period: `${new Date(item.startDate * 1000).toLocaleDateString()} - ${new Date(item.endDate * 1000).toLocaleDateString()}`,
            totalHours: item.billableHours || '',
            client: item.clientName || '',
            endClient: item.endClientName || '',
            status: item.status || '',
            comments: item.comments?.length > 0 ? item.comments[0].comment : '',
          }));

          console.log('Formatted Data:', formattedData); // Debugging formatted data

          setAllData(formattedData);
          setDisplayedData(formattedData.slice(0, itemsPerPage)); // Show first page
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRejectedSheetData();
  }, []);  // Empty dependency array ensures this runs only once when component mounts

  // Load more data when user goes to the next page
  const loadDataForPage = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const newData = allData.slice(startIndex, startIndex + itemsPerPage);
    setDisplayedData(newData);
    setCurrentPage(page);
  };

  // Handle "Next" button click
  const nextPage = () => {
    if ((currentPage * itemsPerPage) < allData.length) {
      loadDataForPage(currentPage + 1);
    }
  };

  // Handle "Previous" button click
  const prevPage = () => {
    if (currentPage > 1) {
      loadDataForPage(currentPage - 1);
    }
  };

  // Render a single row in the table
  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.sheetId}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>
      <Text style={styles.cell}>{item.period}</Text>
      <Text style={styles.cell}>{item.totalHours}</Text>
      <Text style={styles.cell}>{item.client}</Text>
      <Text style={styles.cell}>{item.endClient}</Text>
      <Text style={styles.cell}>{item.status}</Text>
      <Text style={styles.cell}>{item.comments}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejected Time Sheets</Text>

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
          disabled={currentPage === 1} // Disable if on the first page
        />
        <Button
          title="Next"
          onPress={nextPage}
          disabled={currentPage * itemsPerPage >= allData.length} // Disable if on the last page
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
    width: 120, // Equal width for header cells
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
    width: 120, // Equal width for data cells
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
});

export default RejectedSheets;
