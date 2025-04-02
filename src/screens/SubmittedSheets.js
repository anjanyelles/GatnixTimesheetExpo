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
        if (response?.data) {
          const formattedData = response.data.map((item) => ({
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
      <Text style={[styles.cell, styles.status]}>{item.status}</Text>
      <Text style={styles.cell}>{item.comments}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submitted Time Sheets</Text>
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
        <Text style={styles.pageIndicator}>Page {currentPage}</Text>
        <Button
          title="Next"
          onPress={nextPage}
          disabled={currentPage * itemsPerPage >= allData.length}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#F0F4F8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#374151",
  },
  header: {
    backgroundColor: "#4F46E5",
    borderRadius: 5,
    marginBottom: 5,
    flexDirection: "row",
    padding: 10,
  },
  headerText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
    width: 120,
    padding: 6,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginBottom: 4,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    color: "#374151",
    paddingHorizontal: 5,
    width: 120,
  },
  status: {
    fontWeight: "bold",
    color: "#16A34A",
  },
  paginationWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "#374151",
  },
});

export default SubmittedSheets;