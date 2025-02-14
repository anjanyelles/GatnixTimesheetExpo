import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Importing Ionicons

import styles from "./styles"; // Importing styles from the styles.js file

const ProfilePage = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg", // Replace with an actual image URL
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Vishwa Tejaaaa</Text>
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

          <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")} // Navigate to EditProfile
        >
          <Icon name="person-outline" size={22} color="#000" />
          <Text style={styles.menuText}> Vishwa Tejaaaa </Text>
          {/* Add a new icon beside the "Edit Profile" text */}
          <Icon name="pencil-outline" size={20} color="#000" style={styles.editIcon} />
       
        </TouchableOpacity>
 
        <View style={styles.menuItem}>
          <Icon name="mail-outline" size={22} color="#000" />
          <Text style={styles.menuText}>E-Mail: tejavishwa012@gmail.com</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="call-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Phone: +1 87904393933</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="briefcase-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Experience: 3 years</Text>
        </View>
        <View style={styles.menuItem}>
          <Icon name="construct-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Job Role: Software Engineer</Text>
        </View>
      </View>

     {/* Action Menu Section */}
     <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")} // Navigate to EditProfile
        >
          <Icon name="person-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Educational Details</Text>
          {/* Add a new icon beside the "Edit Profile" text */}
          <Icon name="pencil-outline" size={20} color="#000" style={styles.editIcon} />
         
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Work Experience</Text>

        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="notifications-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Skill Set</Text>
          <Icon name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person-add-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Add</Text>

        </TouchableOpacity>
      </View>

      {/* Action Menu Section */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")} // Navigate to EditProfile
        >
          <Icon name="person-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Edit Profile</Text>
          {/* Add a new icon beside the "Edit Profile" text */}
          <Icon name="pencil-outline" size={20} color="#000" style={styles.editIcon} />
 
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="settings-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Settings</Text>
          <Icon name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="notifications-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Notifications</Text>
          <Icon name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="help-circle-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Help</Text>
          <Icon name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="person-add-outline" size={22} color="#000" />
          <Text style={styles.menuText}>Invite a Friend</Text>
          <Icon name="chevron-forward" size={20} color="#aaa" />
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
