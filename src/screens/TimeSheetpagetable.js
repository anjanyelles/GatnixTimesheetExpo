import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getTimesheetsdatacall } from "./aftherlogin";


const TimeSheetpagetable = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [timeSheetData, setTimeSheetData] = useState([]); // ✅ Initialized as an array

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];
  const years = ["2023", "2024", "2025", "2026"];

  useEffect(() => {
    const fetchgetTimesheets = async () => {
      try {
        const response = await getTimesheetsdatacall();
        console.log("response", response);

        if (response?.data) {
          const formattedData = response.data.map((item) => ({
            projectId: item.projectCode || '',
            employee: item.employeeName || '', 
            client: item.endClientName || '',
          }));
          setTimeSheetData(formattedData);
        }
      } catch (error) {
        console.error("Error Fetching Timesheets: ", error);
      }
    };

    fetchgetTimesheets();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Sheets</Text>

      <Text style={styles.title}>Time Sheet Monthly Reports</Text>
      <View style={styles.dropdownRow}>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedMonth(itemValue)}
        >
          {months.map((month) => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
        >
          {years.map((year) => (
            <Picker.Item key={year} label={year} value={year} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonRow}>
        {/* <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Download ▼</Text></TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Monthly ▼</Text></TouchableOpacit */}
      </View>

      <ScrollView horizontal>
        <View>
          <View style={styles.tableHeaderContainer}>
            <Text style={styles.headerGroup}>Project Id</Text>
            <Text style={styles.headerGroup}>Employee Name</Text>
            <Text style={styles.headerGroup}>End Client</Text>
            <Text style={styles.headerGroup}>Week 1{"\n"}Hours | Status</Text>
            <Text style={styles.headerGroup}>Week 2{"\n"}Hours | Status</Text>
            <Text style={styles.headerGroup}>Week 3{"\n"}Hours | Status</Text>
            <Text style={styles.headerGroup}>Week 4{"\n"}Hours | Status</Text>
            <Text style={styles.headerGroup}>Week 5{"\n"}Hours | Status</Text>
          </View>

          {timeSheetData.length > 0 ? (
            timeSheetData.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ProjectDetails")}
                >
                  <Text style={[styles.cell, styles.link]}>
                    {row.projectId}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EmployeeDetails", {
                      employee: row.employee,
                    })
                  }
                >
                  <Text style={[styles.cell, styles.link]}>{row.employee}</Text>
                </TouchableOpacity>
                <Text style={styles.cell}>{row.client}</Text>
                <Text style={styles.cell}>{row.week1Hours}</Text>
                <Text style={styles.cell}>{row.week2Hours}</Text>
                <Text style={styles.cell}>{row.week3Hours}</Text>
                <Text style={styles.cell}>{row.week4Hours}</Text>
                <Text style={styles.cell}>{row.week5Hours}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No Timesheet Data Available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAEDE6", padding: 15 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "start",
    marginBottom: 20,
    color: "#333",
  },
  dropdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  picker: { flex: 1, backgroundColor: "#fff", borderRadius: 5 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  tableHeaderContainer: {
    flexDirection: "row",
    backgroundColor: "#FFA07A",
    paddingVertical: 10,
    borderRadius: 5,
  },
  headerGroup: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: { flex: 1, textAlign: "center", padding: 10, fontSize: 14 },
  link: { color: "blue", textDecorationLine: "underline" },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default TimeSheetpagetable;
