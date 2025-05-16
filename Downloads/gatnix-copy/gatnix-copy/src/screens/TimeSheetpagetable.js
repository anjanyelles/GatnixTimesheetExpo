import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getTimesheetsdatacall } from "./aftherlogin";
import Icon from "react-native-vector-icons/FontAwesome";
const {width,height} =  Dimensions.get('window')

const TimeSheetpagetable = ({ navigation }) => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [weekPeriods, setWeekPeriods] = useState([]);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = ["2023", "2024", "2025", "2026"];

  const getMonthNumber = (monthName) => {
    const monthMap = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };
    return monthMap[monthName];
  };

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const monthNum = parseInt(getMonthNumber(selectedMonth));
      const yearNum = parseInt(selectedYear);

      const firstDay = new Date(yearNum, monthNum - 1, 1);

      const periods = [];
      let currentDate = new Date(firstDay);

      for (let week = 1; week <= 5; week++) {
        const weekStart = new Date(currentDate);
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);

        // Format the dates like "(22 May 2025 / 28 May 2025)"
        const formatDate = (date) => {
          return `${date.getDate()} ${
            months[date.getMonth()]
          } ${date.getFullYear()}`;
        };

        periods.push({
          weekNumber: week,
          period: `(${formatDate(weekStart)} / ${formatDate(weekEnd)})`,
        });

        currentDate.setDate(currentDate.getDate() + 7);
      }

      setWeekPeriods(periods);
    }
  }, [selectedMonth, selectedYear]);

  const fetchgetTimesheets = async () => {
    if (!selectedMonth || !selectedYear) {
      Alert.alert("Please select both a month and a year.");
      return;
    }

    setLoader(true);
    const monthNumber = getMonthNumber(selectedMonth);

    try {
      const response = await getTimesheetsdatacall(selectedYear, monthNumber);

      if (response?.data) {
        const formattedData = response.data.map((item) => {
          const weekData = [1, 2, 3, 4, 5].map((weekNumber) => {
            const week = item.weeks?.find((w) => w.weekNumber === weekNumber);
            return {
              hours: week?.billableHours || "0",
              status: week?.status || " ",
            };
          });

          const totalHours = weekData.reduce((sum, week) => {
            return sum + (parseFloat(week.hours) || 0);
          }, 0);

          return {
            projectId: item.projectCode || "",
            employee: item.employeeName || "",
            client: item.endClientName || "",
            week1: weekData[0],
            week2: weekData[1],
            week3: weekData[2],
            week4: weekData[3],
            week5: weekData[4],
            totalHours: totalHours.toFixed(1),
          };
        });

        setTimeSheetData(formattedData);
      }
    } catch (error) {
      console.error("Error Fetching Timesheets: ", error);
      Alert.alert("Error", "Failed to fetch timesheet data");
    } finally {
      setLoader(false);
    }
  };

  const handleDownload = (rowData) => {
    Alert.alert("Download", `Downloading timesheet for ${rowData.employee}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Sheets</Text>
      <Text style={styles.subtitle}>Monthly Reports</Text>

      <View style={styles.filtersContainer}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Month</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedMonth}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
              prompt="Select Month"
            >
              <Picker.Item label="Select Month" value="" enabled={false} />
              {months.map((month) => (
                <Picker.Item key={month} label={month} value={month} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Year</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedYear}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
              prompt="Select Year"
            >
              <Picker.Item label="Select Year" value="" enabled={false} />
              {years.map((year) => (
                <Picker.Item key={year} label={year} value={year} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          onPress={fetchgetTimesheets}
          style={styles.searchButton}
          disabled={!selectedMonth || !selectedYear}
        >
          <Icon
            name="search"
            size={20}
            color={!selectedMonth || !selectedYear ? "#999" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {loader ? (
        <View style={styles.loaderContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={styles.mainTableHeader}>
              <Text style={[styles.headerCell, styles.projectIdCell]}>
                Project Id
              </Text>
              <Text style={[styles.headerCell, styles.nameCell]}>
                Employee Name
              </Text>
              <Text style={[styles.headerCell, styles.clientCell]}>
                End Client
              </Text>

              {weekPeriods.map((week, index) => (
                <View key={index} style={styles.weekBlock}>
                  <View style={styles.weekHeader}>
                    <Text style={styles.weekTitle}>Week {week.weekNumber}</Text>
                    <Text style={styles.weekPeriod}>{week.period}</Text>
                  </View>
                  <View style={styles.weekSubHeader}>
                    <Text style={styles.weekColumn}>Hours</Text>
                    <Text style={styles.weekColumn}>Status</Text>
                  </View>
                </View>
              ))}

              <View style={styles.totalHeader}>
                <Text style={styles.totalTitle}>Total</Text>
                <View style={styles.totalSubHeader}>
                  <Text style={styles.totalColumn}>Hours</Text>
                  <Text style={styles.totalColumn}>Actions</Text>
                </View>
              </View>
            </View>

            <ScrollView>
              {timeSheetData.length > 0 ? (
                timeSheetData.map((row, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ProjectDetails")}
                      style={[styles.dataCell, styles.projectIdCell]}
                    >
                      <Text style={styles.link}>{row.projectId}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("EmployeeDetails", {
                          employee: row.employee,
                        })
                      }
                      style={[styles.dataCell, styles.nameCell]}
                    >
                      <Text style={styles.link}>{row.employee}</Text>
                    </TouchableOpacity>

                    <Text style={[styles.dataCell, styles.clientCell]}>
                      {row.client}
                    </Text>

                    {weekPeriods.map((week, index) => (
                      <View key={index} style={styles.weekDataContainer}>
                        <Text style={styles.hoursCell}>
                          {row[`week${week.weekNumber}`]?.hours || "-"}
                        </Text>
                        <View style={styles.statusCellContainer}>
                        <Text
  style={[
    styles.statusCell,
    row[`week${week.weekNumber}`]?.status === 'approved' && { backgroundColor: '#d4edda', color: '#155724' },
    row[`week${week.weekNumber}`]?.status === 'inprogress' && { backgroundColor: '#fff3cd', color: '#856404' },
    row[`week${week.weekNumber}`]?.status === 'Rejected' && { backgroundColor: '#f8d7da', color: '#721c24' },
    !row[`week${week.weekNumber}`]?.status && { backgroundColor: 'transparent', color: 'transparent' }
  ]}
>
  {row[`week${week.weekNumber}`]?.status || ' '}
</Text>

                        </View>
                      </View>
                    ))}

                    <View style={styles.totalDataContainer}>
                      <Text style={styles.totalHoursCell}>
                        {row.totalHours}
                      </Text>
                      <View style={styles.actionCell}>
                        <TouchableOpacity onPress={() => handleDownload(row)}>
                          <Icon name="download" size={20} color="#333" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>
                  {selectedMonth && selectedYear
                    ? "No Timesheet Data Available"
                    : "Please select month and year to view timesheets"}
                </Text>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAEDE6",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "flex-end",
  },
  dropdownContainer: {
    flex: 1,
    marginRight: 10,
  },
  dropdownLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 5,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  searchButton: {
    backgroundColor: "#FF9F7A",
    width: 40,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:10
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
 
  mainTableHeader: {
    justifyContent:"center",
    textAlign:"center",
    alignSelf:"center",
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#DDD",
    height:height/7
  },
  headerCell: {
    padding: 12,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DDD",
    height:height/8
  },
  weekBlock: {
    width: 200,
  },
  weekHeader: {
    backgroundColor: "#FFF",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DDD",
    padding: 8,
    height:height/13
  },
  weekTitle: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
    textAlign: "center",
  },
  weekPeriod: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  weekSubHeader: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  weekColumn: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderColor: "#DDD",
  },
  totalHeader: {
    width: 200,
    height:height/13
  },
  totalTitle: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    padding: 8,
    backgroundColor: "#FFF",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  totalSubHeader: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  totalColumn: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    borderRightWidth: 1,
    borderColor: "#DDD",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },
  evenRow: {
    backgroundColor: "#FFF",
  },
  oddRow: {
    backgroundColor: "#F9F9F9",
  },
  dataCell: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#DDD",
  },
  projectIdCell: {
    width: 100,
  },
  nameCell: {
    width: 150,
  },
  clientCell: {
    width: 150,
  },
  weekDataContainer: {
    flexDirection: "row",
    width: 200,
  },
  hoursCell: {
    flex: 1,
    textAlign: "center",
    padding: 12,
    borderRightWidth: 1,
    borderColor: "#DDD",
  },
  statusCellContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#DDD",
  },
  statusCell: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#DDD",
    textAlign: "center",
    fontSize: 12,
    color: "#555",
    minWidth: 60,
  },
  totalDataContainer: {
    flexDirection: "row",
    width: 200,
  },
  totalHoursCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    padding: 12,
    borderRightWidth: 1,
    borderColor: "#DDD",
  },
  actionCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#DDD",
  },
  link: {
    color: "#3366BB",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
});

export default TimeSheetpagetable;
