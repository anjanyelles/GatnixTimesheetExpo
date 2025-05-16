import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import CustomDrawerContent from "./src/screens/CustomDrawerContent";
import Dashboard from "./src/screens/Dashboard";
import Timesheetpage from "./src/screens/Timesheetpage";
import SubmittedSheets from "./src/screens/SubmittedSheets";
import ApprovedSheets from "./src/screens/ApprovedSheets";
import PendingSheets from "./src/screens/PendingSheets";
import RejectedSheets from "./src/screens/RejectedSheets";
import RecalledSheets from "./src/screens/RecalledSheets";
import ProfilePage from "./src/screens/ProfilePage";
import EditProfile from "./src/screens/EditProfile";
import AddUserJobDetails from "./src/screens/AddUserJobDetails";
import AddUserSkillsDetails from "./src/screens/AddUserSkillsDetails";
import AddUserEducationDetails from "./src/screens/AddUserEducationDetails";

import UpdateEducationDetails from "./src/screens/UpdateEducationDetails";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import MultipleLogin from "./src/screens/MultipleLogin";
import Client from "./src/screens/Approvalmanagers/Client";
import Project from "./src/screens/Approvalmanagers/Project";
import Employee from "./src/screens/Approvalmanagers/Employee";
import ClientSuperadmin from "./src/screens/Superadmin/ClientSuperadmin";
import ApprovalManager from "./src/screens/Superadmin/ApprovalManager";
import EmployeeSuperadmin from "./src/screens/Superadmin/ClientSuperadmin";
import SignInScreen from "./src/SignInScreen";
import Otp from "./src/screens/Otp";
import TableContiner from "./src/screens/TableContiner";
import TimesheetsSettings from "./src/screens/Superadmin/TimesheetsSettings";
import OrganizationalSettings from "./src/screens/Superadmin/OrganizationalSettings";
import OrganisationSettings from "./src/screens/Superadmin/OrganizationalSettings";
import ProjectDetails from "./src/screens/ProjectDetails";
import TimeSheetpagetable from "./src/screens/TimeSheetpagetable";
import SheetsDetails from './src/screens/SheetsDetails';

import Timesheet from "./src/screens/Timesheet";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: true, 
      drawerStyle: {
        width: 240, 
      },
    }}
  >
    <Drawer.Screen name="Dashboard" component={Dashboard} />

    <Drawer.Screen name="ProjectDetails" component={ProjectDetails} />

    <Drawer.Screen name="Project" component={Project} />

    <Drawer.Screen name="TimeSheetpagetable" component={TimeSheetpagetable} />

    <Drawer.Screen
      name="OrganisationSettings"
      component={OrganisationSettings}
    />

    <Drawer.Screen name="TimesheetsSettings" component={TimesheetsSettings} />

    <Drawer.Screen name="SubmittedSheets" component={SubmittedSheets} />
    <Drawer.Screen name="ApprovedSheets" component={ApprovedSheets} />

    <Drawer.Screen
      name="OrganizationalSettings"
      component={OrganizationalSettings}
    />
    {/* <Drawer.Screen name ="TimesheetsSettings" component={TimesheetsSettings}/> */}
    <Drawer.Screen name="Timesheet" component={Timesheet} />
    <Drawer.Screen name="Timesheetpage" component={Timesheetpage} />
    <Drawer.Screen name="TableContiner" component={TableContiner} />
    {/* <Drawer.Screen name="ApprovedSheets" component={ApprovedSheets} /> */}
    <Drawer.Screen name="PendingSheets" component={PendingSheets} />
    <Drawer.Screen name="RejectedSheets" component={RejectedSheets} />
    <Drawer.Screen name="RecalledSheets" component={RecalledSheets} />
    <Drawer.Screen name="ProfilePage" component={ProfilePage} />
    <Drawer.Screen name="EditProfile" component={EditProfile} />
    <Drawer.Screen name="workDetails" component={AddUserJobDetails} options={({route})=>({
      title: route.params?.mode === "edit_job" 
      ? "Edit Work Details" 
      : "Add Work Details",
    })} />
    <Drawer.Screen
  name="EducationDetails"
  component={AddUserEducationDetails}
  options={({ route }) => ({
    title: route.params?.mode === "edit_edu" 
      ? "Edit Education Details" 
      : "Add Education Details",
  })}
/>

    <Drawer.Screen
      name="UpdateEducationDetails"
      component={UpdateEducationDetails}
    />
    {/* <Drawer.Screen name="AddJobDetails" component={AddJobDetails} /> */}
    <Drawer.Screen name="skillDetails" component={AddUserSkillsDetails} options={({ route }) => ({
    title: route.params?.mode === "edit_skill" 
      ? "Edit Skill Details" 
      : "Add Skill Details",
   })}
   />
    <Drawer.Screen name="Client" component={Client} />
    {/* <Drawer.Screen name="Project" component={Project} /> */}
    <Drawer.Screen name="Employee" component={Employee} />
    {/* Superadmin */}
    <Drawer.Screen name="ClientSuperadmin" component={ClientSuperadmin} />
    <Drawer.Screen name="ApprovalManager" component={ApprovalManager} />
    <Drawer.Screen name="EmployeeSuperadmin" component={EmployeeSuperadmin} />
  </Drawer.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Authentication Screens */}
   <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="Login" component={LoginScreen} /> 
        <Stack.Screen name="Otp" component={Otp} /> 
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MultipleLogin" component={MultipleLogin} />
       
<Stack.Screen
    name="ApprovedSheetsDetails"
    component={SheetsDetails}
    options={{ headerShown: true, title: 'Approved Sheets Details' }}
  />
  <Stack.Screen
    name="RejectedSheetsDetails"
    component={SheetsDetails}
    options={{ headerShown: true, title: 'Rejected Sheets Details' }}
  />
  <Stack.Screen
    name="InprogressSheetsDetails"
    component={SheetsDetails}
    options={{ headerShown: true, title: 'Pending Sheets Details' }}
  />
  <Stack.Screen
    name="Recall RequestedSheetsDetails"
    component={SheetsDetails}
    options={{ headerShown: true, title: 'Recalled Sheets Details' }}
  />
 
  <Stack.Screen
    name="SubmittedSheetsDetails"
    component={SheetsDetails}
    options={{ headerShown: true, title: 'Submitted Sheets Details' }}
  />
      {/* <Stack.Screen name="Main" component={DrawerNavigator} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
