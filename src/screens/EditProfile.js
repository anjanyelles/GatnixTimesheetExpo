import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import PhoneInput from "react-native-phone-input";
import { getUserProfiledata } from "./aftherlogin";
import { ActivityIndicator } from "react-native-paper";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";


const EditProfile = ({ route }) => {
  const { userId, usage } = route.params;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [experience, setExperience] = useState("");
  const [jobRole, setJobRole] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [phoneIsoCode, setPhoneIsoCode] = useState("in");

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappCountryCode, setWhatsappCountryCode] = useState("+91");
  const [whatsappIsoCode, setWhatsappIsoCode] = useState("in");

  const phoneInputRef = useRef(null);
  const whatsappInputRef = useRef(null);

  const [socialLinks, setSocialLinks] = useState({
    id: '',
    userId: '',
    userOrgAssociationId: '',
    facebook: null,
    twitter: null,
    git: null,
    instagram: null,
    linkedIn: null,
    organizationId:''
  });



  const [userdetails, setUserDetails] = useState({});
  const [basicuserprofile, setBasicUserProfile] = useState({});
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchUserProfileData();
    }, [userId])
  );

  const fetchUserProfileData = async () => {
    setLoading(true);
    try {
      const response = await getUserProfiledata();
      //console.log("User Profile Data:", response);
      setUserDetails(response.user);

      if (usage === "profile") {

        setBasicUserProfile(response.basicUserProfile);


        setFirstName(response.user.firstName || "");
        setLastName(response.user.lastName || "");
        setExperience(response.basicUserProfile.totalExperience || "");
        setJobRole(response.basicUserProfile.description || "");


        setPhoneNumber(response.user.mobile || "");
        setPhoneCountryCode(response.user.mobileCountryCode || "+91");
        setPhoneIsoCode(response.user.mobileIsoCode || "in");

        setWhatsappNumber(response.user.whatsAppNumber || "");
        setWhatsappCountryCode(response.user.whatsappCountryCode || "+91");
        setWhatsappIsoCode(response.user.whatsappIsoCode || "in");
      }
      else {
        setSocialLinks({
          id: response.socialLinks.id,
          userId: response.socialLinks.userId,
          userOrgAssociationId: response.socialLinks.userOrgAssociationId,
          facebook: response.socialLinks.facebook != null ? response.socialLinks.facebook : null,
          twitter: response.socialLinks.twitter != null ? response.socialLinks.twitter : null,
          instagram: response.socialLinks.instagram != null ? response.socialLinks.instagram : null,
          twitter: response.socialLinks.twitter != null ? response.socialLinks.twitter : null,
          git: response.socialLinks.git != null ? response.socialLinks.git : null,
          linkedIn: response.socialLinks.linkedIn != null ? response.socialLinks.linkedIn : null,
          organizationId: String(response.organizationId),
        })
      }

    } catch (error) {
      console.error("Error fetching user profile data:", error);
    } finally {
      setLoading(false);
    }
  };


  const handlePhoneNumberChange = (text) => {
    setPhoneNumber(text);
    if (phoneInputRef.current) {
      setPhoneCountryCode(phoneInputRef.current.getCountryCode());
      setPhoneIsoCode(phoneInputRef.current.getISOCode());
    }
  };

  const handleWhatsappNumberChange = (text) => {
    setWhatsappNumber(text);
    if (whatsappInputRef.current) {
      setWhatsappCountryCode(whatsappInputRef.current.getCountryCode());
      setWhatsappIsoCode(whatsappInputRef.current.getISOCode());
    }
  };

  const handleProfileSave = async () => {
    if (!firstName.trim()) {
      Alert.alert("Validation Error", "First Name is required.");
      return;
    }
    if (!lastName.trim()) {
      Alert.alert("Validation Error", "Last Name is required.");
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Validation Error", "Phone Number is required.");
      return;
    }
    if (!whatsappNumber.trim()) {
      Alert.alert("Validation Error", "WhatsApp Number is required.");
      return;
    }
    if (!experience.trim()) {
      Alert.alert("Validation Error", "Experience is required.");
      return;
    }
    if (!jobRole.trim()) {
      Alert.alert("Validation Error", "Job Role/Description is required.");
      return;
    }

    try {
      setLoading(true);

      const updatedUserData = {
        id: userdetails.associationId,
        userId: userdetails.id,
        orgId: userdetails.organizationId,
        firstName,
        lastName,
        mobileNumber: phoneNumber,
        mobileIsoCode: phoneIsoCode,
        mobileCountryCode: phoneCountryCode,
        whatsAppNumber: whatsappNumber,
        whatsappIsoCode: whatsappIsoCode,
        whatsappCountryCode: whatsappCountryCode,
        loginStatus: userdetails.loginStatus,
        schedulerStatus: userdetails.schedulerStatus,
        managingAdminId: userdetails.managingAdminId || null,
        managingEmployerId: userdetails.managingEmployerId || null,
        associatedRole: userdetails.role,
        userUUID: userdetails.userUUID,
        email: userdetails.email,
      };

      const updatedProfileData = {
        id: basicuserprofile.id,
        description: jobRole,
        jobRole: basicuserprofile.jobRole,
        totalExperience: experience,
        ssn: basicuserprofile.ssn,
        dl: basicuserprofile.dl,
        visa: basicuserprofile.visa,
        resumePath: basicuserprofile.resumePath,
        profilePic: basicuserprofile.profilePic,
        userId: basicuserprofile.userId,
        userOrgAssociationId: basicuserprofile.userOrgAssociationId,
        organizationId: userdetails.organizationId,
      };

      const userUpdateResponse = await fetch(
        `https://www.gatnix.com/api/v1/org-user-association/update/${userdetails.associationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      const profileUpdateResponse = await fetch(
        `https://www.gatnix.com/api/v1/org/${userdetails.organizationId}/user/${userdetails.id}/user-profile/basicDetails/${basicuserprofile.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfileData),
        }
      );

      console.log("User Update Response:", userUpdateResponse);
      console.log("Profile Update Response:", profileUpdateResponse);

      if (userUpdateResponse && profileUpdateResponse) {
        Alert.alert("Success", "User details updated successfully!");
        navigation.navigate("ProfilePage");
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      Alert.alert("Error", "Failed to update user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleSocialMediaSave = async () => {

    try {
      setLoading(true);

      const updatedSocialLinks = {
        ...socialLinks,
        userId: userId,
        userOrgAssociationId: socialLinks.userOrgAssociationId,

      };
      console.log("Updated Social Links:", updatedSocialLinks);

      console.log(`https://www.gatnix.com/api/v1/org/${userdetails.organizationId}/user/${userId}/user-profile/socialLinks/${socialLinks.id}`)
      const response = await fetch(
        `https://www.gatnix.com/api/v1/org/${userdetails.organizationId}/user/${userId}/user-profile/socialLinks/${socialLinks.id}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSocialLinks),
        }
      );

      console.log("Social Links Update Response:", response);

      if (response) {
        Alert.alert("Success", "Social media links updated successfully!");
        navigation.navigate("ProfilePage");
      } else {
        Alert.alert("Error", "Failed to update social media links. Please try again.");
      }
    } catch (error) {
      console.error("Error updating social media links:", error);
      Alert.alert("Error", "Failed to update social media links. Please try again.");
    } finally {
      setLoading(false);
    }
  }



  if (loading) {
    return (
      loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  return (
    <>
      {
        usage === "profile" ? (<View style={styles.container}>
          <Text style={styles.header}>Update User Details</Text>

          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setUserDetails(prev => ({ ...prev, firstName: text }));
            }}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setUserDetails(prev => ({ ...prev, lastName: text }));
            }}
          />
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneInputContainer}>
            <PhoneInput
              ref={phoneInputRef}
              style={{ width: 100 }}
              initialValue={phoneCountryCode}

              onChangeText={handlePhoneNumberChange}
            />
            <TextInput
              style={{ flex: 1, marginLeft: 10 }}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
            />
          </View>
          <Text style={styles.label}>WhatsApp Number</Text>
          <View style={styles.phoneInputContainer}>
            <PhoneInput
              ref={whatsappInputRef}
              initialValue={whatsappCountryCode}
              style={{ width: 100 }}
              onChangeText={handleWhatsappNumberChange}

            />
            <TextInput
              style={{
                flex: 1, marginLeft: 10, padding: 12,
                borderRadius: 10,
              }} // Allow input to take remaining space
              value={whatsappNumber}
              keyboardType="phone-pad"
              onChangeText={handleWhatsappNumberChange}

            />
          </View>
          <Text style={styles.label}>Experience </Text>
          <TextInput
            style={styles.input}
            placeholder="Experience (years)"
            value={experience}
            onChangeText={(text) => {
              setExperience(text);
              setBasicUserProfile(prev => ({ ...prev, totalExperience: text }));
            }}

          />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Job Role"
            value={jobRole}
            onChangeText={(text) => {
              setJobRole(text);
              setBasicUserProfile(prev => ({ ...prev, description: text }));
            }}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={handleProfileSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("ProfilePage")}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>)
          :
          (
            <View style={styles.container}>
              <Text style={styles.header}>Add Social Media Links</Text>
              <View style={styles.socialContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}> Facebook URL</Text>
                  <FontAwesomeIcon name="facebook" size={20} color="#3b5998" style={{marginLeft:5}} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Facebook URL"
                  value={socialLinks.facebook}
                  onChangeText={(text) => {
                    setSocialLinks(prev => ({ ...prev, facebook: text }));
                  }}
                />
              </View>
              <View style={styles.socialContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}> Twitter URL</Text>
                  <FontAwesomeIcon name="twitter" size={20} color="#1DA1F2" style={{marginLeft:5}} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Twitter URL"
                  value={socialLinks.twitter}
                  onChangeText={(text) => {
                    setSocialLinks(prev => ({ ...prev, twitter: text }));
                  }}
                />
              </View>
              <View style={styles.socialContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}> Github URL</Text>
                  <FontAwesomeIcon name="github" size={20} color="#000000" style={{marginLeft:5}} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Github URL"
                  value={socialLinks.git}
                  onChangeText={(text) => {
                    setSocialLinks(prev => ({ ...prev, git: text }));
                  }}
                />
              </View>
              <View style={styles.socialContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}> Instagram URL</Text>
                  <FontAwesomeIcon name="instagram" size={20} color="#E4405F" style={{marginLeft:5}} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Instagram URL"
                  value={socialLinks.instagram}
                  onChangeText={(text) => {
                    setSocialLinks(prev => ({ ...prev, instagram: text }));
                  }}
                />
              </View>
              <View style={styles.socialContainer}>
                <View style={styles.labelContainer}>
                  <Text style={styles.label}> Linkedin URL</Text>
                  <FontAwesomeIcon name="linkedin" size={20} color="#0077B5" style={{marginLeft:5}} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Linkedin URL"
                  value={socialLinks.linkedIn}
                  onChangeText={(text) => {
                    setSocialLinks(prev => ({ ...prev, linkedIn: text }));
                  }}
                />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={handleSocialMediaSave}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("ProfilePage")}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
      }
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    margin: 8,
    elevation: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#ff6600",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    marginBottom: 4,
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Adjust spacing
    width: "100%",
    backgroundColor: "#fff",
    paddingHorizontal: 10, // Optional: Adjust padding
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  saveButton: {
    backgroundColor: "#FFA500", // Orange background
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "#FF4500", // Red-Orange for cancel
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginLeft: 10,
  },
  saveButtonText: {
    color: "#ffffff", // White text for contrast
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#ffffff", // White text for better readability
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 50,
  },
  labelContainer: {

    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

});

export default EditProfile;