import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const EditProfile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput style={styles.input} placeholder="Name" defaultValue="Vishwa Tejaaaa " />
      <TextInput style={styles.input} placeholder="Email" defaultValue="Vishwatejaaaa @mail.com" />
      <TextInput style={styles.input} placeholder="Location" defaultValue="London" />
      <TextInput style={styles.input} placeholder="Phone" defaultValue="+123456789" />
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;
