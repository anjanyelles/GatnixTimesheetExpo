import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator, Modal,
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Importing Ionicons
import styles from "./styles"; // Importing styles from the styles.js file
import { getUserProfiledata } from "./aftherlogin";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EditEducationScreen from "../components/EditEducationScreen";

const ProfilePage = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
   const [modalVisible, setModalVisible] = useState(false);
  const handleDelete = () => {
    console.log("Deleted Successfully!");
    setModalVisible(false);
  };
  const handleSave = (updatedData) => {
    setEducationData(updatedData);
    setModalVisible(false);
    console.log("Updated Education Data:", updatedData);
  };
  useEffect(() => {
    const handelgetUserProfileData = async () => {
      try {
        const response = await getUserProfiledata();
        console.log("Response", response);
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    handelgetUserProfileData();
  }, []);

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
        <Text style={styles.profileName}>{`${
          userData?.user?.firstName || "N/A"
        } ${userData?.user?.lastName || ""}`}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton1}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.editText1}>EDIT</Text>
        <Icon name="add-circle-outline" size={18} color="#000" />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <InfoRow
          label="Name"
          value={`${userData?.user?.firstName || "N/A"} ${
            userData?.user?.lastName || ""
          }`}
        />
        <InfoRow label="E-Mail" value={userData?.user?.email || "N/A"} />
        <InfoRow
          label="Phone"
          value={`${userData?.user?.mobileCountryCode || ""} ${
            userData?.user?.mobile || "N/A"
          }`}
        />
        <InfoRow
          label="Experience"
          value={`${
            userData?.basicUserProfile?.totalExperience || "N/A"
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
            onPress={() => navigation.navigate("AddEducationalDetails")}
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
                    onPress={() => setModalVisible(true)}
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
            onPress={() => navigation.navigate("AddJobDetails")}
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
                      navigation.navigate("EditEducation", { edu })
                    }
                  >
                    <Icon name="create-outline" size={24} color="#f66e22" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setModalVisible(true)}
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
            onPress={() => navigation.navigate("AddSkillsDetails")}
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
                    onPress={() => navigation.navigate("EditSkill", { skill })} // Pass skill data
                  >
                    <Icon name="create-outline" size={24} color="#f66e22" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setModalVisible(true)}
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
