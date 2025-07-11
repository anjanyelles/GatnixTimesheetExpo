import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Button,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getSubmittedsheetdata } from "./aftherlogin";
import { ActivityIndicator } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as XLSX from "xlsx";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

const SubmittedSheets = () => {
  const navigation=useNavigation()
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullData, setFullData] = useState([]);
  const [downloadData, setDownloadData] = useState({});
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
    fetchSubmissionSheetdata();
  }, []);

  const fetchSubmissionSheetdata = async () => {
    setLoading(true);
    try {
      const response = await getSubmittedsheetdata();
      if (response?.data) {
        setFullData(response.data);
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

    finally{
      setLoading(false);
    }
  };

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

  const downloadRowAsExcel = async (sheetId) => {
    setLoading(true);
    try {
      console.log("Download Excel for sheet ID:", sheetId);
      const selectedRow = fullData.find((item) => item.sheetId === sheetId);

      const formattedData = {
        sheetId: selectedRow.sheetId,
        employeeName: selectedRow.employeeName,
        clientName: selectedRow.clientName,
        endClientName: selectedRow.endClientName,
        startDate: new Date(selectedRow.startDate * 1000).toLocaleDateString(),
        endDate: new Date(selectedRow.endDate * 1000).toLocaleDateString(),
        billableHours: selectedRow.billableHours,
        nonBillableHours: selectedRow.nonBillableHours,
        status: selectedRow.status,
      };

      setDownloadData(formattedData);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([formattedData]);

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });


      const fileUri =
        FileSystem.documentDirectory + `Timesheet_${sheetId}.xlsx`;

      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      }).then(() => {
        Sharing.shareAsync(fileUri)
      });

     // Alert.alert("Success", `Excel file saved`);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to download Excel");
    }
    finally {
      setLoading(false);
    }
  };

  const handleTimesheetDetails=(sheetId)=>{
    const selectedRow = fullData.find((item) => item.sheetId === sheetId);

    navigation.navigate("SubmitedSheetsDetails", { selectedRowData:selectedRow,projectId:selectedRow.projectId });

    console.log("Sheet ID:",sheetId);
  }


   if (loading) {
      return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    }

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.sheetId}</Text>
      <Text style={styles.cell}>{item.employeeName}</Text>

      <TouchableOpacity onPress={() => handleTimesheetDetails(item.sheetId)}>
      <Text style={[styles.cell, {textDecorationLine: "underline",color:"blue"}]}>{item.period}</Text>
    </TouchableOpacity>


      <Text style={styles.cell}>{item.totalHours}</Text>
      <Text style={styles.cell}>{item.client}</Text>
      <Text style={styles.cell}>{item.endClient}</Text>


      <View
        style={[styles.cell, { flexDirection: "row", alignItems: "center" }]}
      >
        <Text style={styles.status}>{item.status}</Text>
        <TouchableOpacity
          onPress={() => downloadRowAsExcel(item.sheetId)}
          style={{ marginLeft: 6 }}
        >
          <Feather name="download" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>


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
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default SubmittedSheets;
