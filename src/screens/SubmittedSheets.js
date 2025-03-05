import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Button,
  Platform,
} from "react-native";
import { getSubmittedsheetdata } from "./aftherlogin";

const SubmittedSheets = () => {
  const [allData, setAllData] = useState([]);
  const tableHeaders = [
    "T.ID",
    "Employee Name",
    "Period",
    "Total Hours",
    "Client",
    "End Client",
    "Status",
    "Comments",
  ];

  useEffect(() => {
    const fetchSubmissionSheetdata = async () => {
      try {
        const response = await getSubmittedsheetdata();
        console.log(response.data[0].startDate); // Debugging output

        if (response?.data) {
          const formattedData = response.data.map((item, index) => ({
            sheetId: item.sheetId || "",
            employeeName: item.employeeName || "",
            period: `${new Date(
              item.startDate * 1000
            ).toLocaleDateString()} - ${new Date(
              item.endDate * 1000
            ).toLocaleDateString()}`,
            totalHours: item.billableHours || "",
            client: item.clientName || "",
            endClient: item.endClientName || "",
            status: item.status || "",
            comments: item.comments.length > 0 ? item.comments[0].comment : "",
          }));

          setAllData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSubmissionSheetdata();
  }, []);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [displayedData, setDisplayedData] = useState([]);

  useEffect(() => {
    setDisplayedData(allData.slice(0, itemsPerPage));
  }, [allData]);

  const loadDataForPage = (page) => {
    const startIndex = (page - 1) * itemsPerPage;
    setDisplayedData(allData.slice(startIndex, startIndex + itemsPerPage));
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage * itemsPerPage < allData.length) {
      loadDataForPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      loadDataForPage(currentPage - 1);
    }
  };

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
      <Text style={styles.title}>Submitted Time Sheets</Text>

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
        <Button title="Prev" onPress={prevPage} disabled={currentPage === 1} />
        <Button
          title="Next"
          onPress={nextPage}
          disabled={currentPage * itemsPerPage >= allData.length}
        />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "start",
    marginBottom: 20,
    color: "#333",
  },
  header: {
    backgroundColor: "#e5e7eb",
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: "row",
  },
  headerText: {
    color: "rgb(74, 73, 73)",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    width: 120,
    padding: 4,
    fontFamily: Platform.select({
      ios: "San Francisco",
      android: "Roboto",
      default: "System",
    }),
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    color: "#333",
    paddingHorizontal: 5,
    fontFamily: Platform.select({
      ios: "San Francisco",
      android: "Roboto",
      default: "System",
    }),
    width: 120,
  },
  paginationWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
});

export default SubmittedSheets;
