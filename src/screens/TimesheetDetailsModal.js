import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const TimesheetDetailsModal = ({ visible, onClose, timesheetData }) => {
  const [loading, setLoading] = useState(false);
  const [detailedData, setDetailedData] = useState([]);

  useEffect(() => {
    if (visible && timesheetData) {
      prepareData();
    }
  }, [visible, timesheetData]);

  const prepareData = () => {
    setLoading(true);
    try {
      if (timesheetData && Array.isArray(timesheetData.sheets)) {
        const formattedData = timesheetData.sheets.map((sheet) => {
          const timestamp = parseInt(sheet.date, 10);
          const date = new Date(timestamp * 1000);
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return {
            ...sheet,
            formattedDate,
          };
        });
        setDetailedData(formattedData);
      }
    } catch (error) {
      console.error("Error preparing timesheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hours) => {
    if (!hours) return "0h";
    const h = parseFloat(hours);
    return `${h}h`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff6700" />
          ) : (
            <View style={styles.horizontalTableContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View style={styles.gridTable}>
                  <View style={styles.gridHeader}>
                    <Text style={styles.gridCellHeader}>Date</Text>
                    <Text style={styles.gridCellHeader}>Billable</Text>
                    <Text style={styles.gridCellHeader}>Non-Billable</Text>
                    <Text style={styles.gridCellHeader}>Total</Text>
                  </View>

                  {detailedData.map((item, index) => {
                    const billable = parseFloat(item.billableHours || 0);
                    const nonBillable = parseFloat(item.nonBillableHours || 0);
                    const total = billable + nonBillable;

                    return (
                      <View
                        key={index}
                        style={[
                          styles.gridRow,
                          index % 2 === 0 ? styles.evenRow : styles.oddRow,
                        ]}
                      >
                        <Text style={styles.gridCell}>{item.formattedDate}</Text>
                        <Text style={styles.gridCell}>{billable}h</Text>
                        <Text style={styles.gridCell}>{nonBillable}h</Text>
                        <Text style={styles.gridCell}>{total}h</Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Total Billable:</Text>{" "}
              {formatTime(timesheetData?.billableHours)}
            </Text>
            <Text style={styles.summaryText}>
              <Text style={styles.summaryLabel}>Total Non-Billable:</Text>{" "}
              {formatTime(timesheetData?.nonBillableHours)}
            </Text>
          </View>

          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  horizontalTableContainer: {
    marginBottom: 15,
    maxHeight: 300,
  },
  gridTable: {
    flexDirection: "column",
  },
  gridHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 8,
  },
  gridRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  gridCellHeader: {
    width: 100,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  gridCell: {
    width: 100,
    textAlign: "center",
    color: "#444",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#ffffff",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 5,
  },
  summaryText: {
    fontSize: 15,
  },
  summaryLabel: {
    fontWeight: "bold",
  },
  closeModalButton: {
    backgroundColor: "#ff6700",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  },
  closeModalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TimesheetDetailsModal;
