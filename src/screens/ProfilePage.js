import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Importing Ionicons

import styles from "./styles"; // Importing styles from the styles.js file
import { handelGetProfileData } from "./aftherlogin";

const ProfilePage = ({ navigation }) => {
  const [profileData, setProfileData] = useState({});
  const [user, setUser] = useState({});
  const [userProfileSettings, setuserProfileSettings] = useState({});
  const [basicUserProfile, setbasicUserProfile] = useState({});
  const [workDetails, setworkDetails] = useState({});
  const [education, seteducation] = useState({});
  const [skills, setskills] = useState({});
  const [socialLinks, setsocialLinks] = useState({});

  useEffect(() => {
    const getProfileDetails = async () => {
      const response = await handelGetProfileData();
  
      if (response) {  // Ensure response is not empty
        console.log(response.user)
        setProfileData(response);  // Access the first object
        setUser(response.user);  // Access 'user' inside the first object
        setworkDetails(response.workDetails)
        seteducation(response.education)
        setskills(response.skills)
        setsocialLinks(response.socialLinks)
        setbasicUserProfile(response.basicUserProfile)

      }
    };
  
    getProfileDetails();
  }, []);
  

 
  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
      <Image
  source={{
    uri: !basicUserProfile.profilePic
      ? `https://your-image-server.com/${basicUserProfile.profilePic}` // Replace with actual base URL if needed
      : "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
  }}
  style={styles.profileImage}
/>
        <Text style={styles.profileName}>{user.firstName}</Text>
        <View style={styles.profileActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubble-ellipses-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="call-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="ellipsis-horizontal-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.menuSection}>


      <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.facebook || 'https://facebook.com')}>
    
    <Text style={{fontWeight:'600',fontSize:16}} >Personal Information</Text>

  </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")} // Navigate to EditProfile
        >
          <Icon name="person-outline" size={22} color="#000" />
          <Text style={styles.menuText}> {user.firstName} </Text>
          {/* Add a new icon beside the "Edit Profile" text */}
          <Icon
            name="pencil-outline"
            size={20}
            color="#000"
            style={styles.editIcon}
          />
        </TouchableOpacity>

        <View style={styles.menuItem}>
          <Icon name="mail-outline" size={22} color="#000" />
          <Text style={styles.menuText}>E-Mail: {user.email}</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="call-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Phone: {user.mobile}</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="briefcase-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Experience: {user.email} </Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="construct-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Job Role:  {workDetails[0]?.jobTitle}</Text>
        </View>
      </View>

      {/* Action Menu Section */}



      <View style={styles.menuSection}>
  {/* Education Establishment */}
  <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.facebook || 'https://facebook.com')}>
    
    <Text style={{fontWeight:'600',fontSize:16}} >Education Establishment</Text>

  </TouchableOpacity>
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="school-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Education Establishment:</Text>
    <Text style={styles.menuValue}>{education[0]?.establishment}</Text>
  </TouchableOpacity>

  {/* Education Level */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="book-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Education Leve:</Text>
    <Text style={styles.menuValue}>{education[0]?.level}</Text>
  </TouchableOpacity>

  {/* Start Date */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="calendar-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Start Date:</Text>
    <Text style={styles.menuValue}>
      {new Date(education[0]?.startDate).toLocaleDateString()}
    </Text>
  </TouchableOpacity>

  {/* End Date */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="calendar-outline" size={22} color="#000" />
    <Text style={styles.menuText}>End Date:</Text>
    <Text style={styles.menuValue}>
      {new Date(education[0]?.endDate).toLocaleDateString()}
    </Text>
  </TouchableOpacity>

  {/* Location */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="location-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Location:</Text>
    <Text style={styles.menuValue}>{education[0]?.location}</Text>
  </TouchableOpacity>
</View>


<View style={styles.menuSection}>
  {/* Job Title */}
  <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.facebook || 'https://facebook.com')}>
    
    <Text style={{fontWeight:'600',fontSize:16}} >Job Title</Text>

  </TouchableOpacity>
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="briefcase-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Job Title:</Text>
    <Text style={styles.menuValue}>{workDetails[0]?.jobTitle}</Text>
  </TouchableOpacity>

  {/* Company */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="business-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Company:</Text>
    <Text style={styles.menuValue}>{workDetails[0]?.company}</Text>
  </TouchableOpacity>

  {/* State */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="location-outline" size={22} color="#000" />
    <Text style={styles.menuText}>State:</Text>
    <Text style={styles.menuValue}>{workDetails[0]?.state}</Text>
  </TouchableOpacity>

  {/* City */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="location-city" size={22} color="#000" />
    <Text style={styles.menuText}>City:</Text>
    <Text style={styles.menuValue}>{workDetails[0]?.city?.trim()}</Text>
  </TouchableOpacity>

  {/* Start Date */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="calendar-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Start Date:</Text>
    <Text style={styles.menuValue}>
      {new Date(workDetails[0]?.startDate).toLocaleDateString()}
    </Text>
  </TouchableOpacity>

  {/* End Date */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="calendar-outline" size={22} color="#000" />
    <Text style={styles.menuText}>End Date:</Text>
    <Text style={styles.menuValue}>
      {new Date(workDetails[0]?.endDate).toLocaleDateString()}
    </Text>
  </TouchableOpacity>

  {/* Actions - Edit / Delete (Optional) */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="create-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Edit</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem}>
    <Icon name="trash-outline" size={22} color="red" />
    <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
  </TouchableOpacity>
</View>


<View style={styles.menuSection}>
  {/* Skill Name */}

  <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.facebook || 'https://facebook.com')}>
    
    <Text style={{fontWeight:'600',fontSize:16}} >Skill Set</Text>

  </TouchableOpacity>
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="code-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Skill Name:</Text>
    <Text style={styles.menuValue}>{skills[0]?.skill}</Text>
  </TouchableOpacity>

  {/* Skill Rating */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="star-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Rating:</Text>
    <Text style={styles.menuValue}>{skills[0]?.level}</Text>
  </TouchableOpacity>

  {/* Version */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="git-branch-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Version:</Text>
    <Text style={styles.menuValue}>{skills[0]?.version}</Text>
  </TouchableOpacity>

  {/* Actions - Edit / Delete */}
  <TouchableOpacity style={styles.menuItem}>
    <Icon name="create-outline" size={22} color="#000" />
    <Text style={styles.menuText}>Edit</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem}>
    <Icon name="trash-outline" size={22} color="red" />
    <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
  </TouchableOpacity>
</View>





<View style={styles.menuSection}>
  {/* Facebook */}

  <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.facebook || 'https://facebook.com')}>
    
    <Text style={{fontWeight:'600',fontSize:16}} >Social Links</Text>

  </TouchableOpacity>
  <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.facebook || 'https://facebook.com')}>
    <Icon name="logo-facebook" size={22} color="#1877F2" />
    <Text style={styles.menuText}>Facebook</Text>
    <TouchableOpacity onPress={() => Clipboard.setString(socialLinks?.facebook || '')}>
      <Icon name="copy-outline" size={20} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("EditSocial", { type: "facebook" })}>
      <Icon name="create-outline" size={20} color="#000" />
    </TouchableOpacity>
  </TouchableOpacity>

  {/* Instagram */}
  <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.instagram || 'https://instagram.com')}>
    <Icon name="logo-instagram" size={22} color="#E4405F" />
    <Text style={styles.menuText}>Instagram</Text>
    <TouchableOpacity onPress={() => Clipboard.setString(socialLinks?.instagram || '')}>
      <Icon name="copy-outline" size={20} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("EditSocial", { type: "instagram" })}>
      <Icon name="create-outline" size={20} color="#000" />
    </TouchableOpacity>
  </TouchableOpacity>

  {/* LinkedIn */}
  <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL(socialLinks?.linkedIn || 'https://linkedin.com')}>
    <Icon name="logo-linkedin" size={22} color="#0077B5" />
    <Text style={styles.menuText}>LinkedIn</Text>
    <TouchableOpacity onPress={() => Clipboard.setString(socialLinks?.linkedIn || '')}>
      <Icon name="copy-outline" size={20} color="#000" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation.navigate("EditSocial", { type: "linkedIn" })}>
      <Icon name="create-outline" size={20} color="#000" />
    </TouchableOpacity>
  </TouchableOpacity>
</View>



      {/* Add Friends Button */}
      <TouchableOpacity style={styles.addFriendsButton}>
        <Text style={styles.addFriendsText}>Add Friends</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfilePage;
