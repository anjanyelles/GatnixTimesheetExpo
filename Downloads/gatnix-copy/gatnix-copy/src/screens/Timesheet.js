import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Timesheet = () => {
  const [startTime, setStartTime] = (useState < Date) | (null > null);
  const [endTime, setEndTime] = (useState < Date) | (null > null);

  const startTimer = () => setStartTime(new Date());
  const stopTimer = () => setEndTime(new Date());

  const calculateTotalHours = () => {
    if (startTime && endTime) {
      const diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      return diff.toFixed(2) + " hrs";
    }
    return "0 hrs";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timesheet</Text>

      <View style={styles.timerContainer}>
        <Text style={styles.label}>
          Start Time: {startTime ? startTime.toLocaleTimeString() : "--:--:--"}
        </Text>
        <Text style={styles.label}>
          End Time: {endTime ? endTime.toLocaleTimeString() : "--:--:--"}
        </Text>
        <Text style={styles.label}>Total Hours: {calculateTotalHours()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startTimer}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopTimer}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  timerContainer: { marginBottom: 30, alignItems: "center" },
  label: { fontSize: 18, marginBottom: 5 },
  buttonContainer: { flexDirection: "row", gap: 20 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8 },
  stopButton: { backgroundColor: "#dc3545" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default Timesheet;
