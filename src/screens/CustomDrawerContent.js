import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawerContent = (props) => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenuUser, setshowSubMenuUser] = useState(false);
  
  const [userData, setUserData] = useState();

  const toggleSubMenu = () => {
    setShowSubMenu((prev) => !prev);
  };

  const toggleSubMenuUser = () => {
    setshowSubMenuUser((prev) => !prev);
  };
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem("role");
       
        alert(role)
        console.log("role",role)
        setUserData(role); // Update state with retrieved role
      } catch (error) {
        console.error("Error fetching role from AsyncStorage", error);
      }
    };

    fetchUserRole(); // Call function when component mounts
  }, []);
  
  return (
    <DrawerContentScrollView {...props}>
       {userData === "approvalManagers" && (
        <>
          {/* Dashboard */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Dashboard")}
            activeOpacity={0.7}
          >
            <Icon name="grid-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("ProfilePage")}
            activeOpacity={0.7}
          >
            <Icon name="person-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          {/* Employee */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Employee")}
            activeOpacity={0.7}
          >
            <Icon name="people-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Employee</Text>
          </TouchableOpacity>

          {/* Client */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Client")}
            activeOpacity={0.7}
          >
            <Icon name="briefcase-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Client</Text>
          </TouchableOpacity>

          {/* Project */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Project")}
            activeOpacity={0.7}
          >
            <Icon name="folder-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Project</Text>
          </TouchableOpacity>

          {/* Timesheet with Submenu */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={toggleSubMenu}
            activeOpacity={0.7}
          >
            <Icon name="time-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Timesheet</Text>
            <Icon
              name={showSubMenu ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>

          {/* Submenu Items */}
          {showSubMenu && (
            <View style={styles.subMenu}>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Timesheetpage")}
                activeOpacity={0.7}
              >
                <Icon name="document-text-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Sheet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("SubmittedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-done-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Submitted Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("ApprovedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-circle-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Approved Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("PendingSheets")}
                activeOpacity={0.7}
              >
                <Icon name="hourglass-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Pending Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("RejectedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="close-circle-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Rejected Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("RecalledSheets")}
                activeOpacity={0.7}
              >
                <Icon name="reload-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Recalled Sheets</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Help Desk */}
             <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("HelpDesk")}
            activeOpacity={0.7}
          >
            <Icon name="help-circle-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Help Desk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("HelpDesk")}
            activeOpacity={0.7}
          >
            <Icon name="help-circle-outline" size={20} color="#333" />
            <Text style={styles.menuText}>LogOut</Text>
          </TouchableOpacity>
        </>
      )}
        {userData === "super-admin" && (
        <>
          {/* Dashboard */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Dashboard")}
            activeOpacity={0.7}
          >
            <Icon name="grid-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("ProfilePage")}
            activeOpacity={0.7}
          >
            <Icon name="person-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>



    {/* Timesheet with Submenu */}
    <TouchableOpacity
            style={styles.menuItem}
            onPress={toggleSubMenuUser}
            activeOpacity={0.7}
          >
            <Icon name="time-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Users
</Text>
            <Icon
              name={showSubMenuUser ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>

          {/* Submenu Items */}
          {showSubMenuUser && (
            <View style={styles.subMenu}>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("ApprovalManager")}
                activeOpacity={0.7}
              >
                <Icon name="document-text-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Approval Manager</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("EmployeeSuperadmin")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-done-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("ClientSuperadmin")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-circle-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Client</Text>
              </TouchableOpacity>

            </View>
          )}


          {/* Timesheet with Submenu */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={toggleSubMenu}
            activeOpacity={0.7}
          >
            <Icon name="time-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Timesheet</Text>
            <Icon
              name={showSubMenu ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>

          {/* Submenu Items */}
          {showSubMenu && (
            <View style={styles.subMenu}>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Timesheetpage")}
                activeOpacity={0.7}
              >
                <Icon name="document-text-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Sheet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("SubmittedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-done-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Submitted Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("ApprovedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-circle-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Approved Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("PendingSheets")}
                activeOpacity={0.7}
              >
                <Icon name="hourglass-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Pending Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("RejectedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="close-circle-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Rejected Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("RecalledSheets")}
                activeOpacity={0.7}
              >
                <Icon name="reload-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Recalled Sheets</Text>
              </TouchableOpacity>
            </View>
          )}



<TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Organization Settings")}
            activeOpacity={0.7}
          >
            <Icon name="person-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Organization Settings</Text>
          </TouchableOpacity>

          {/* Help Desk */}
             <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("HelpDesk")}
            activeOpacity={0.7}
          >
            <Icon name="help-circle-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Help Desk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("HelpDesk")}
            activeOpacity={0.7}
          >
            <Icon name="help-circle-outline" size={20} color="#333" />
            <Text style={styles.menuText}>LogOut</Text>
          </TouchableOpacity>
        </>
      )}
      {userData === "employee" && (
        <>
          {/* Dashboard */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("Dashboard")}
            activeOpacity={0.7}
          >
            <Icon name="home-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("ProfilePage")}
            activeOpacity={0.7}
          >
            <Icon name="home-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          {/* Timesheet with Submenu */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={toggleSubMenu}
            activeOpacity={0.7}
          >
            <Icon name="time-outline" size={20} color="#333" />
            <Text style={styles.menuText}>Timesheet</Text>
            <Icon
              name={showSubMenu ? "chevron-up-outline" : "chevron-down-outline"}
              size={20}
              color="#333"
            />
          </TouchableOpacity>

          {/* Submenu Items */}
          {showSubMenu && (
            <View style={styles.subMenu}>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("Timesheetpage")}
                activeOpacity={0.7}
              >
                <Icon name="document-text-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Sheet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("SubmittedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-done-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Submitted Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("ApprovedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="checkmark-circle-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Approved Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("PendingSheets")}
                activeOpacity={0.7}
              >
                <Icon name="hourglass-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Pending Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("RejectedSheets")}
                activeOpacity={0.7}
              >
                <Icon name="close-circle-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Rejected Sheets</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={() => props.navigation.navigate("RecalledSheets")}
                activeOpacity={0.7}
              >
                <Icon name="reload-outline" size={18} color="#666" />
                <Text style={styles.subMenuText}>Recalled Sheets</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  subMenu: {
    paddingLeft: 20,
    backgroundColor: "#f9f9f9",
    marginTop: 5,
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 6,
    marginVertical: 2,
  },
  subMenuText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  // Add hover-like effect for submenu items
  subMenuItemHovered: {
    backgroundColor: "#e0e0e0",
  },
});

export default CustomDrawerContent;
