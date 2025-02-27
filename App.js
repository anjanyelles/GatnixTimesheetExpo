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
import AddEducationDetails from './src/screens/AddEducationDetails';
import Projectscreen from './src/screens/Projectscreen';
import EmployeeFormModal from './src/screens/EmployeeFormModal';
import ClientEditForm from './src/screens/Superadmin/ClientEditForm';
import ClientNewdataForm from './src/screens/Superadmin/ClientNewdataForm';
import Addapprovalmanager from './src/screens/Approvalmanager/Addapprovalmanager';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Drawer Navigator
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
   
   {/* <Drawer.Screen name="EmployeeFormModal" component={EmployeeFormModal} /> */}
   
   <Drawer.Screen name="ApprovalManager" component={ApprovalManager} />
   <Drawer.Screen name="Addapprovalmanager" component={Addapprovalmanager} />

   
   <Drawer.Screen name="ClientSuperadmin" component={ClientSuperadmin} />
   <Drawer.Screen name="ClientEditForm" component={ClientEditForm} />
   <Drawer.Screen name="ClientNewdataForm" component={ClientNewdataForm} />
   

   <Drawer.Screen name="Employee" component={Employee} />
    <Drawer.Screen name="Dashboard" component={Dashboard} />



   <Drawer.Screen name="ApprovedSheets" component={ApprovedSheets} />
   <Drawer.Screen name="Projectscreen" component={Projectscreen} />
        <Drawer.Screen name="AddEducation" component={AddEducationDetails} />
        <Drawer.Screen name="ProfilePage" component={ProfilePage} />
    <Drawer.Screen name="TableContiner" component={TableContiner} />
    
        <Drawer.Screen name="SubmittedSheets" component={SubmittedSheets} />

        
    <Drawer.Screen name="Timesheetpage" component={Timesheetpage} />


    <Drawer.Screen name="PendingSheets" component={PendingSheets} />
    <Drawer.Screen name="RejectedSheets" component={RejectedSheets} />
    <Drawer.Screen name="RecalledSheets" component={RecalledSheets} />

    <Drawer.Screen name="EditProfile" component={EditProfile} />
    {/* Approval Managers */}
    <Drawer.Screen name="Client" component={Client} />
    <Drawer.Screen name="Project" component={Project} />

    {/* Superadmin */}
    {/* <Drawer.Screen name="ClientSuperadmin" component={ClientSuperadmin} /> */}
 
    <Drawer.Screen name="EmployeeSuperadmin" component={EmployeeSuperadmin} />
  </Drawer.Navigator>
);

// Main App
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Authentication Screens */}
     
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MultipleLogin" component={MultipleLogin} />
        {/* Main App Drawer */}
        {/* <Stack.Screen name="Main" component={DrawerNavigator} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
