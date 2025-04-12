import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomDrawerContent from './src/screens/CustomDrawerContent';
import Dashboard from './src/screens/Dashboard';
import Timesheetpage from './src/screens/Timesheetpage';
import SubmittedSheets from './src/screens/SubmittedSheets';
import ApprovedSheets from './src/screens/ApprovedSheets';
import PendingSheets from './src/screens/PendingSheets';
import RejectedSheets from './src/screens/RejectedSheets';
import RecalledSheets from './src/screens/RecalledSheets';
import ProfilePage from './src/screens/ProfilePage';
import EditProfile from './src/screens/EditProfile';
import AddSkillsDetails from './src/screens/AddSkillsDetails';
import AddEducationDetails from './src/screens/AddEducationDetails';
import UpdateEducationDetails from './src/screens/UpdateEducationDetails';
import AddJobDetails from './src/screens/AddJobDetails';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MultipleLogin from './src/screens/MultipleLogin';
import Client from './src/screens/Approvalmanagers/Client';
import Project from './src/screens/Approvalmanagers/Project';
import Employee from './src/screens/Approvalmanagers/Employee';
import ClientSuperadmin from './src/screens/Superadmin/ClientSuperadmin';
import ApprovalManager from './src/screens/Superadmin/ApprovalManager';
import EmployeeSuperadmin from './src/screens/Superadmin/ClientSuperadmin';
import SignInScreen from './src/SignInScreen';
import Otp from './src/screens/Otp';
import TableContiner from './src/screens/TableContiner';
import TimesheetsSettings from './src/screens/Superadmin/TimesheetsSettings';
import OrganizationalSettings from './src/screens/Superadmin/OrganizationalSettings';
import OrganisationSettings from './src/screens/Superadmin/OrganizationalSettings';
import ProjectDetails from './src/screens/ProjectDetails';
import TimeSheetpagetable from './src/screens/TimeSheetpagetable';
import Timesheet from './src/screens/Timesheet';
import AddProject from './src/screens/Approvalmanagers/AddProject';
import AddEmployee from './src/screens/Approvalmanagers/AddEmployee';
import EditData from './src/screens/Approvalmanagers/Editdata';
import AddApprovalManager from './src/screens/Approvalmanagers/AddApprovalManager';
import AddClients from './src/screens/Superadmin/AddClients';
import EditClientData from './src/screens/Superadmin/EditClientData';
import ViewProject from './src/screens/Approvalmanagers/ViewProject';
import EditEmployeeDetails from './src/screens/Approvalmanagers/EditEmployeeDetails';
import EditProjectDetails from './src/screens/Approvalmanagers/EditProjectDetails';
import AddUserEducationDetails from './src/screens/Superadmin/AddUserEducationDetails';
import AddUserJobDetails from './src/screens/Superadmin/AddUserJobDetails';
import AddUserSkillsDetails from './src/screens/Superadmin/AddUserSkillsDetails';
import SubmitedSheetsDetails from './src/screens/SubmitedSheetsDetails';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: true, // Disable headers for drawer screens
      drawerStyle: {
        width: 240, // Set custom drawer width
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
    <Drawer.Screen name="SubmitedSheetsDetails" component={SubmitedSheetsDetails} />



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
    <Drawer.Screen name="AddEducationDetails" component={AddEducationDetails} />
    <Drawer.Screen name="UpdateEducationDetails" component={UpdateEducationDetails} />
    <Drawer.Screen name="AddJobDetails" component={AddJobDetails} />
    <Drawer.Screen name="AddSkillsDetails" component={AddSkillsDetails} />
    {/* Approval Managers */}
    <Drawer.Screen name="Client" component={Client} />
    {/* <Drawer.Screen name="Project" component={Project} /> */}
    <Drawer.Screen name="Employee" component={Employee} />
    <Drawer.Screen name="EditEmployeeDetails" component={EditEmployeeDetails} />
    {/* Superadmin */}
    <Drawer.Screen name="ClientSuperadmin" component={ClientSuperadmin} />
    <Drawer.Screen name="AddClients" component={AddClients} />
    <Drawer.Screen name="EditClientData" component={EditClientData} />
    <Drawer.Screen name="ApprovalManager" component={ApprovalManager} />
    <Drawer.Screen name="EmployeeSuperadmin" component={EmployeeSuperadmin} />

    <Drawer.Screen name="AddProject" component={AddProject} />

    <Drawer.Screen name="EditProjectDetails" component={EditProjectDetails} />

    <Drawer.Screen name="ViewProject" component={ViewProject} />
    <Drawer.Screen name="AddEmployee" component={AddEmployee} />
    <Drawer.Screen name="Editdata" component={EditData} />
    <Drawer.Screen name="approvalManagers" component={AddApprovalManager} />

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
 <Drawer.Screen name="skillDetails" component={AddUserSkillsDetails} options={({ route }) => ({
    title: route.params?.mode === "edit_skill"
      ? "Edit Skill Details"
      : "Add Skill Details",
   })}
   />



  </Drawer.Navigator>
);

// Main App
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Authentication Screens */}



        <Stack.Screen name="SignInScreen" component={SignInScreen} />

        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MultipleLogin" component={MultipleLogin} />


        <Stack.Screen name="Main" component={DrawerNavigator} />

        {/* Main App Drawer */}
        {/* <Stack.Screen name="Main" component={DrawerNavigator} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
