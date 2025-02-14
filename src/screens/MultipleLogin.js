import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MultipleLogin = ({ data }) => {
  const navigation = useNavigation(); // ✅ Use navigation hook



  const handleSuperAdminSubmit = async () => {
    try {
      // Retrieve email and orgId from AsyncStorage
      const storedEmail = await AsyncStorage.getItem("email");
      const orgId = await AsyncStorage.getItem("id"); // Ensure this key is correct
  
      if (!storedEmail) {
        alert("Email not found in AsyncStorage.");
        return;
      }
  
      if (!orgId) {
        alert("Organization ID not found in AsyncStorage.");
        return;
      }
  
      // ✅ Correct API URL (Replace {orgId} with actual value)
      const apiUrl = `https://www.gatnix.com/api/v1/${orgId}/reset-password/request-password-reset`;
  
      // API Request Body
      const requestBody = { email: storedEmail };
  
      // Make POST Request
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      // ✅ Read response as text
      const rawResponse = await response.text();
  
      // ✅ Log response
      console.log("Raw API Response:", rawResponse);
  
      // ✅ Handle success & failure cases
      if (response.ok) {
        alert("OTP sent successfully!");
        navigation.navigate("Otp"); // Navigate to OTP screen
      } else {
        alert(`Error: ${rawResponse || "Failed to send OTP"}`);
      }
    } catch (error) {
      console.error("Error in handleSuperAdminSubmit:", error);
      alert("An error occurred. Please try again.");
    }
  };
  

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Select Your Role</Text>

        <View style={styles.cardContainer}>
          {data?.orgUserAssociations?.map((association, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={async () => {
                try {
                  await AsyncStorage.setItem("role", association.associatedRole);

                  if (association.associatedRole === "super-admin") {
                    handleSuperAdminSubmit();
                  } else {
                    navigation.navigate("Main");
                  }
                } catch (error) {
                  console.error("Error saving role to AsyncStorage", error);
                }
              }}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={{ uri: 'https://static-00.iconduck.com/assets.00/avatar-icon-2048x2048-ilrgk6vk.png' }}
                  style={styles.icon}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{association.associatedRole}</Text>
                <Text style={styles.cardDescription}>
                  Modules: {association.organization.moduleName.join(", ")}
                </Text>
              </View>

              <View style={styles.ribbon} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  iconContainer: {
    backgroundColor: '#E3EBFF',
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  ribbon: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 30,
    backgroundColor: '#FF5A5F',
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
});

export default MultipleLogin;
