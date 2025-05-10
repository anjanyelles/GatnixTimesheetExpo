// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';

// const MultipleLogin = ({ data }) => {
//   const navigation = useNavigation(); // ✅ Use navigation hook



//   const handleSuperAdminSubmit = async () => {
//     try {
//       // Retrieve email and orgId from AsyncStorage
//       const storedEmail = await AsyncStorage.getItem("email");
//       const orgId = await AsyncStorage.getItem("id"); // Ensure this key is correct

//       if (!storedEmail) {
//         alert("Email not found in AsyncStorage.");
//         return;
//       }

//       if (!orgId) {
//         alert("Organization ID not found in AsyncStorage.");
//         return;
//       }

//       // ✅ Correct API URL (Replace {orgId} with actual value)
//       const apiUrl = `https://www.gatnix.com/api/v1/${orgId}/reset-password/request-password-reset`;

//       // API Request Body
//       const requestBody = { email: storedEmail ,emailType:"login",location:"Unknown Location",applicationName:"Timesheet"};
//       console.log("request body is :",requestBody)

//       // Make POST Request
//       const response = await fetch(apiUrl, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });



//       // ✅ Read response as text
//       const rawResponse = await response.text();

//       // ✅ Log response
//       console.log("Raw API Response:", rawResponse);

//       // ✅ Handle success & failure cases
//       if (response.ok) {
//         alert("OTP sent successfully!");
//         navigation.navigate("Otp"); // Navigate to OTP screen
//       } else {
//         alert(`Error: ${rawResponse || "Failed to send OTP"}`);
//       }
//     } catch (error) {
//       console.error("Error in handleSuperAdminSubmit:", error);
//       alert("An error occurred. Please try again.");
//     }
//   };


//   return (
//     <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>Select Your Role</Text>

//         <View style={styles.cardContainer}>
//           {data?.orgUserAssociations?.map((association, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.card}
//               onPress={async () => {
//                 try {
//                   await AsyncStorage.setItem("role", association.associatedRole);

//                   if (association.associatedRole === "super-admin") {
//                     handleSuperAdminSubmit();
//                   } else {
//                     navigation.navigate("Main");
//                   }
//                 } catch (error) {
//                   console.error("Error saving role to AsyncStorage", error);
//                 }
//               }}
//             >
//               <View style={styles.iconContainer}>
//                 <Image
//                   source={{ uri: 'https://static-00.iconduck.com/assets.00/avatar-icon-2048x2048-ilrgk6vk.png' }}
//                   style={styles.icon}
//                 />
//               </View>

//               <View style={styles.textContainer}>
//                 <Text style={styles.cardTitle}>{association.associatedRole}</Text>
//                 <Text style={styles.cardDescription}>
//                   Modules: {association.organization.moduleName.join(", ")}
//                 </Text>
//               </View>

//               <View style={styles.ribbon} />
//             </TouchableOpacity>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     textAlign: 'center',
//   },
//   cardContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   card: {
//     width: '90%',
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     position: 'relative',
//   },
//   iconContainer: {
//     backgroundColor: '#E3EBFF',
//     padding: 10,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   icon: {
//     width: 30,
//     height: 30,
//     resizeMode: 'contain',
//   },
//   textContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cardDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 3,
//   },
//   ribbon: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     width: 20,
//     height: 30,
//     backgroundColor: '#FF5A5F',
//     borderTopRightRadius: 12,
//     borderBottomLeftRadius: 8,
//   },
// });

// export default MultipleLogin;




import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import axios from 'axios';


const MultipleLogin = ({ data }) => {
  const navigation = useNavigation();


  const [locationName, setLocationName] = useState("Unknown Location");
  const [isLoading, setIsLoading] = useState(true);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  // Check location permission and get location on component mount
  useEffect(() => {
    getLocationData();
  }, []);

  const getLocationData = async () => {
    try {
      console.log("Requesting location permission...");
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Location permission denied");
        setSnackMessage('Location permission denied');
        setSnackVisible(true);
        setIsLoading(false);
        return;
      }

      console.log("Permission granted, getting current position...");
      // Get current position with high accuracy and timeout
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        mayShowUserSettingsDialog: true
      });

      console.log("Position obtained:", location.coords);
      const { latitude, longitude } = location.coords;

      // Make reverse geocoding API call using OpenStreetMap
      console.log("Making OpenStreetMap API call...");
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'TimeSheetApp/1.0'
          }
        }
      );

      console.log("OpenStreetMap response:", response.data);

      // Format location name from the API response
      let formattedLocation = "Unknown Location";
      const address = response.data.address;

      if (address) {
        if (address.city && address.state) {
          formattedLocation = `${address.city}, ${address.state}`;
        } else if (address.town && address.state) {
          formattedLocation = `${address.town}, ${address.state}`;
        } else if (address.city) {
          formattedLocation = address.city;
        } else if (address.town) {
          formattedLocation = address.town;
        } else if (address.state) {
          formattedLocation = address.state;
        }
      }

      console.log("Formatted location:", formattedLocation);
      setLocationName(formattedLocation);
    } catch (error) {
      console.error('Error fetching location:', error);
      setSnackMessage('Failed to get location information');
      setSnackVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuperAdminSubmit = async () => {
    try {

      const storedEmail = await AsyncStorage.getItem("email");
      const orgId = await AsyncStorage.getItem("id");

      if (!storedEmail) {
        alert("Email not found in AsyncStorage.");
        return;
      }

      if (!orgId) {
        alert("Organization ID not found in AsyncStorage.");
        return;
      }

      const apiUrl = `https://www.gatnix.com/api/v1/${orgId}/reset-password/request-password-reset`;
      const requestBody = {
        email: storedEmail,
        emailType: "login",
        location: locationName,
        applicationName: "Timesheet"
      };

      console.log("request body is :", requestBody);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const rawResponse = await response.text();
      console.log("Raw API Response:", rawResponse);

      if (response.ok) {
        alert("OTP sent successfully!");
        navigation.navigate("Otp");
      } else {
        alert(`Error: ${rawResponse || "Failed to send OTP"}`);
      }
    } catch (error) {
      console.error("Error in handleSuperAdminSubmit:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Group organizations
  const groupedOrgs = {};
  data?.orgUserAssociations?.forEach(association => {
    const orgId = association.organization.id;
    const orgName = association.organization.name;

    if (!groupedOrgs[orgId]) {
      groupedOrgs[orgId] = {
        name: orgName,
        roles: []
      };
    }

    groupedOrgs[orgId].roles.push({
      id: association.id,
      role: association.associatedRole,
      modules: association.organization.moduleName.join(', '),
      status: association.userStatus?.loginStatus ? "Active" : "Inactive"
    });
  });


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Module</Text>
        <Text style={styles.headerSubtitle}>Choose a module to access from your organizations</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        {Object.entries(groupedOrgs).map(([orgId, org], index) => (
          <View key={orgId} style={styles.orgSection}>
            <View style={styles.orgHeader}>
              <Image
                source={{ uri: 'https://static-00.iconduck.com/assets.00/building-icon-256x256-qn408i0i.png' }}
                style={styles.orgIcon}
              />
              <Text style={styles.orgName}>{org.name}</Text>
            </View>

            {org.roles.map((role, roleIndex) => {
              const isActive = role.status === "Active";
              return (
                <TouchableOpacity
                  key={roleIndex}
                  style={[
                    styles.roleCard,
                    !isActive && styles.inactiveRoleCard
                  ]}
                  disabled={!isActive}
                  onPress={async () => {
                    try {
                      await AsyncStorage.setItem("role", role.role);
                      await AsyncStorage.setItem("orgId", orgId);

                      if (role.role === "super-admin") {
                        handleSuperAdminSubmit();
                      } else {
                        navigation.navigate("Main");
                      }
                    } catch (error) {
                      console.error("Error saving role to AsyncStorage", error);
                    }
                  }}
                >
                  <View style={styles.roleContent}>
                    <View style={styles.roleIconContainer}>
                      {role.role.toLowerCase().includes('admin') ? (
                        <Image
                          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png' }}
                          style={[styles.roleIcon, !isActive && styles.inactiveIcon]}
                        />
                      ) : role.role === 'employee' ? (
                        <Image
                          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1251/1251743.png' }}
                          style={[styles.roleIcon, !isActive && styles.inactiveIcon]}
                        />
                      ) : role.role === 'approvalManagers' ? (
                        <Image
                          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1251/1251743.png' }}
                          style={[styles.roleIcon, !isActive && styles.inactiveIcon]}
                        />
                      ) : (
                        <Image
                          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6299/6299353.png' }}
                          style={[styles.roleIcon, !isActive && styles.inactiveIcon]}
                        />
                      )}
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={[styles.roleName, !isActive && styles.inactiveText]}>
                        {role.role.toUpperCase()}
                      </Text>
                      <Text style={[styles.modules, !isActive && styles.inactiveText]}>Modules: {role.modules}</Text>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, { color: isActive ? "#4CAF50" : "#F44336" }]}>
                      {isActive ? "Active" : "Inactive"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );



};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FF9800',
    padding: 15,
    alignItems: 'center',

    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 3,
  },
  scrollContent: {
    flex: 1,
  },
  orgSection: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingBottom: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f8f8',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  orgIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  roleCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  roleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIconContainer: {
    marginRight: 12,
  },
  roleIcon: {
    width: 24,
    height: 24,
  },
  roleInfo: {
    flex: 1,
  },
  roleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modules: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  statusContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});

export default MultipleLogin;
