import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, Modal,
  StyleSheet, ToastAndroid, Alert,
  Linking
} from "react-native";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/Ionicons";

import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getUserProfiledata } from "./aftherlogin";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EditEducationScreen from "../components/EditEducationScreen";
import { use } from "react";

const ProfilePage = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [orgId, setOrgId] = useState(null);
  const [userId, setUserId] = useState(null);

  const [socialLinks, setSocialLinks] = useState({
    id:'',
    userId:'',
    userOrgAssociationId:'',
    facebook: '',
    twitter: '',
    github: '',
    instagram:'',
    linkedIn:'' ,
  });

  const fetchData = async () => {
    try {
      const storedOrgId = await AsyncStorage.getItem("orgId");
      const storedUserId = await AsyncStorage.getItem("id");

      if (storedOrgId) setOrgId(storedOrgId);
      if (storedUserId) setUserId(storedUserId);
    } catch (error) {
      console.error("Error fetching data from AsyncStorage:", error);
    }
  };




  const handleRemove = async (type, id) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete this ${type} record?`,
      [
        {
          text: "No",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            console.log("Removing item:", type, id);

            try {
              let endpoint = "";
              switch (type) {
                case "education":
                  endpoint = `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/educationDetails/${id}`;
                  break;
                case "workDetails":
                  endpoint = `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/workDetails/${id}`;
                  break;
                case "skills":
                  endpoint = `https://www.gatnix.com/api/v1/org/${orgId}/user/${userId}/user-profile/skills/${id}`;
                  break;
                default:
                  return;
              }

              const response = await fetch(endpoint, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                alert(`${type} removed successfully!`);
                setUserData((prevData) => ({
                  ...prevData,
                  [type]: prevData[type].filter((item) => item.id !== id),
                }));
              } else {
                alert("Failed to remove item.");
              }
            } catch (error) {
              console.error("Error removing item:", error);
              alert("An error occurred while removing the item.");
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    console.log("Deleted Successfully!");
    setModalVisible(false);
  };
  const handleSave = (updatedData) => {
    setEducationData(updatedData);
    setModalVisible(false);
    console.log("Updated Education Data:", updatedData);
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
      const handelgetUserProfileData = async () => {
        try {
          const response = await getUserProfiledata();
          console.log("user data Response", response);
          console.log("user education id", response.education[0]?.id);
          console.log("user job id", response.workDetails[0]?.id);
          console.log("user skill id", response.skills[0]?.id);
          setUserData(response);
          setSocialLinks({
            id: response.socialLinks.id,
            userId: response.socialLinks.userId,
            userOrgAssociationId: response.socialLinks.userOrgAssociationId,
            facebook: response.socialLinks.facebook!=null ? response.socialLinks.facebook : "https://timesheet.gatnix.com/timesheet",
            twitter: response.socialLinks.twitter!=null ? response.socialLinks.twitter : "https://timesheet.gatnix.com/timesheet",  
            instagram: response.socialLinks.instagram!=null ? response.socialLinks.instagram : "https://timesheet.gatnix.com/timesheet",
            twitter: response.socialLinks.twitter!=null ? response.socialLinks.twitter : "https://timesheet.gatnix.com/timesheet",
            github: response.socialLinks.github!=null ? response.socialLinks.github : "https://timesheet.gatnix.com/timesheet",
            linkedIn: response.socialLinks.linkedIn!=null ? response.socialLinks.linkedIn : "https://timesheet.gatnix.com/timesheet",
          })
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      handelgetUserProfileData();
    }, [])
  );

  const openURL = (url) => {
    const finalURL =  url.trim() !== "" ? url : "https://timesheet.gatnix.com/timesheet";
  
    Linking.openURL(finalURL).catch((err) => 
      Alert.alert("Error", "Failed to open URL")
    );
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: userData?.profilePic
              ? `https://your-api-url.com/uploads/${userData.profilePic}`
              : "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{`${userData?.user?.firstName || "N/A"
          } ${userData?.user?.lastName || ""}`}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton1}
        onPress={() => navigation.navigate("EditProfile", { userId: userId ,usage:"profile" })}
      >
        <Text style={styles.editText1}>EDIT</Text>
        <Icon name="pencil" size={18} color="#000" />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <InfoRow
          label="Name"
          value={`${userData?.user?.firstName || "N/A"} ${userData?.user?.lastName || ""
            }`}
        />
        <InfoRow label="E-Mail" value={userData?.user?.email || "N/A"} />
        <InfoRow
          label="Phone"
          value={`${userData?.user?.mobileCountryCode || ""} ${userData?.user?.mobile || "N/A"
            }`}
        />
        <InfoRow
          label="Experience"
          value={`${userData?.basicUserProfile?.totalExperience || "N/A"
            } years`}
        />
        <InfoRow
          label="Job Role"
          value={userData?.basicUserProfile?.description || "N/A"}
        />
      </View>

      {/*Education Details */}

      <View style={styles.sectionContainer}>
        {/* Header with Title and Edit Button */}
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Education Details</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EducationDetails", { mode: "add" })}
          >
            <Text style={styles.buttonText}>ADD</Text>
            <Icon name="add-circle-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll for Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnLarge]}>
                Establishment
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnMedium]}>
                Education Level
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                Start Date
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                End Date
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnMedium]}>
                Location
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                Actions
              </Text>
            </View>

            {/* Table Body */}
            {userData?.education?.map((edu, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.columnLarge]}>
                  {edu.establishment}
                </Text>
                <Text style={[styles.tableCell, styles.columnMedium]}>
                  {edu.level}
                </Text>
                <Text style={[styles.tableCell, styles.columnSmall]}>
                  {new Date(edu.startDate).toLocaleDateString()}
                </Text>
                <Text style={[styles.tableCell, styles.columnSmall]}>
                  {new Date(edu.endDate).toLocaleDateString()}
                </Text>
                <Text style={[styles.tableCell, styles.columnMedium]}>
                  {edu.location}
                </Text>
                {/* Actions */}
                <View
                  style={[
                    styles.tableCell,
                    styles.columnSmall,
                    styles.actionButtons,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate("EducationDetails", { mode: "edit_edu", edu })}

                  // onPress={() => setModalVisible(true)}
                  >
                    <Icon name="create-outline" size={24} color="#f66e22" />
                  </TouchableOpacity>

                  {/* <EditEducationScreen
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    educationData={educationData}
                    onSave={handleSave}
                  /> */}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemove("education", edu.id)}
                  >
                    <Icon name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                  <DeleteConfirmationModal
                    visible={modalVisible}
                    onConfirm={handleDelete}
                    onCancel={() => setModalVisible(false)}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/*Experince details Details */}

      <View style={styles.sectionContainer}>
        {/* Header with Title and Edit Button */}
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("workDetails", { mode: "add" })}
          >
            <Text style={styles.buttonText}>ADD</Text>
            <Icon name="add-circle-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll for Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnLarge]}>
                Job Title
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnMedium]}>
                Company
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                Start Date
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                End Date
              </Text>

              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                Actions
              </Text>
            </View>

            {/* Table Body */}
            {userData?.workDetails?.map((edu, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.columnLarge]}>
                  {edu.jobTitle}
                </Text>
                <Text style={[styles.tableCell, styles.columnMedium]}>
                  {edu.company}
                </Text>
                <Text style={[styles.tableCell, styles.columnSmall]}>
                  {new Date(edu.startDate).toLocaleDateString()}
                </Text>
                <Text style={[styles.tableCell, styles.columnSmall]}>
                  {new Date(edu.endDate).toLocaleDateString()}
                </Text>

                {/* Actions */}
                <View
                  style={[
                    styles.tableCell,
                    styles.columnSmall,
                    styles.actionButtons,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      navigation.navigate("workDetails", { mode: "edit_job", edu })
                    }
                  >
                    <Icon name="create-outline" size={24} color="#f66e22" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemove("workDetails", edu.id)}
                  >
                    <Icon name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                  <DeleteConfirmationModal
                    visible={modalVisible}
                    onConfirm={handleDelete}
                    onCancel={() => setModalVisible(false)}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/*Skill Set Details */}

      <View style={styles.sectionContainer}>
        {/* Header with Title and Edit Button */}
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Skill Set</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("skillDetails", { mode: "add" })}
          >
            <Text style={styles.buttonText}>ADD</Text>
            <Icon name="add-circle-outline" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Scroll for Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                S.No
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnMedium]}>
                Skill Name
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                Rating
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                Version
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnSmall]}>
                Actions
              </Text>
            </View>

            {/* Table Body */}
            {userData?.skills?.map((skill, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.columnSmall]}>
                  {index + 1}
                </Text>
                <Text style={[styles.tableCell, styles.columnMedium]}>
                  {skill.skill}
                </Text>
                <Text style={[styles.tableCell, styles.columnSmall]}>
                  {skill.level}
                </Text>
                <Text style={[styles.tableCell, styles.columnSmall]}>
                  {skill.version}
                </Text>

                {/* Actions */}
                <View
                  style={[
                    styles.tableCell,
                    styles.columnSmall,
                    styles.actionButtons,
                  ]}
                >
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate("skillDetails", { mode: "edit_skill", skill })}
                  >
                    <Icon name="create-outline" size={24} color="#f66e22" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemove("skills", skill.id)}
                  >
                    <Icon name="trash-outline" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                  <DeleteConfirmationModal
                    visible={modalVisible}
                    onConfirm={handleDelete}
                    onCancel={() => setModalVisible(false)}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => openURL()} style={styles.icon}>
          <FontAwesomeIcon name="facebook" size={30} color="#3b5998" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openURL("")} style={styles.icon}>
          <FontAwesomeIcon name="twitter" size={30} color="#1DA1F2" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openURL("")} style={styles.icon}>
          <FontAwesomeIcon name="github" size={30} color="#000000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openURL("")} style={styles.icon}>
          <FontAwesomeIcon name="instagram" size={30} color="#E4405F" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openURL("")} style={styles.icon}>
          <FontAwesomeIcon name="linkedin" size={30} color="#0077B5" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { userId: userId ,usage:"socialmedia" })}
        >
          <Text style={styles.editText}>EDIT</Text>
          <Icon name="pencil" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </View>

    </ScrollView>
  );
};
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default ProfilePage;
