import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const userisIn = "prod"; // Change to "local" if needed
const API_BASE_URL =
  userisIn === "local"
    ? "http://ec2-15-207-239-145.ap-south-1.compute.amazonaws.com:8080/oxyloans/v1/user/"
    : "https://www.gatnix.com/api/v1/";

// const id = await AsyncStorage.getItem("id");
// const token = await AsyncStorage.getItem("token");
// const orgType = await AsyncStorage.getItem("orgType");
// const roles = await AsyncStorage.getItem("roles");
// const userName = await AsyncStorage.getItem("userName");
// const userEmail = await AsyncStorage.getItem("userEmail");
// const associationId = await AsyncStorage.getItem("associationId");



 
// ✅ Reusable API Request Function
const handleApiRequestAfterLoginService = async (
  endpoint,
  method = "GET",
  data = null,
  headers = {}
) => {
  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method,
      data,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Request Error:", error.response?.data || error.message);
    throw error;
  }
};

// ✅ Get Deal Details by ID
export const handelgetDashboardCardApi = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  // alert(orgId);
  // alert(id);
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/summary/counts`,
    "GET"
  );
};

// ✅ Send WhatsApp OTP
export const sendWhatsappOtpapi = async (whatsappData, value) => {
  return await handleApiRequestAfterLoginService("send-otp", "POST", {
    whatsappData,
    value,
  });
};

export const getEmplyeedata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `org-user-association/${orgId}/get-users/userId/${id}/role/employee/status/ALL?page=0&size=10`,
    "POST",
    {}
  );
};

export const getApprovalManagerdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `${orgId}/users?role=approvalManagers&page=0&size=10`,
    "GET",
    {}
  );
};

export const getClientSuperadmindata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/clients/search?page=0&size=10`,
    "POST",
    {}
  );
};

export const getSubmittedsheetdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/date_to_date/${id}/status/submitted/association/super-admin?page=0&size=10&sort=id,desc`,
    "GET",
    {}
  );
};

export const getApprovedsheetdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/date_to_date/${id}/status/approved/association/super-admin?page=0&size=10&sort=id,desc`,
    "GET",
    {}
  );
};

export const getPendingsheetdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/date_to_date/${id}/status/inprogress/association/super-admin?page=0&size=10&sort=id,desc`,
    "GET",
    {}
  );
};
export const getRejectedsheetdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/date_to_date/${id}/status/rejected/association/super-admin?page=0&size=10&sort=id,desc`,
    "GET",
    {}
  );
};

export const getRecalledsheetdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/date_to_date/${id}/status/recall%20Requested/association/super-admin?page=0&size=10&sort=id,desc`,
    "GET",
    {}
  );
};

export const getTimesheetsettingsdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/timesheet_notification_settings/by-org-id`,
    "GET",
    {}
  );
};

export const getOrganizationalSettingsdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `organization/orgId/209`,
    "GET",
    {}
  );
};

export const getOrganizationalSettingsdatas = async (data) => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `organization/209`,
    "PUT",
    data
  );
};

export const getTimesheetsettingspatch = async (data) => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/209/timesheet_notification_settings/13`,
    "PUT",
    data
  );
};

export const getTimesheetsettingsgetcall = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/209/recall_settings/607/association/408`,
    "GET",
    {}
  );
};

export const getTimesheetsettingsputcall = async (data) => {
  console.log("data", data);
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/209/recall_settings/607/11`,
    "PUT",
    { data }
  );
};

export const getTimesheetsdatacall = async (year, monthNumber) => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");

  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/date_to_date/${monthNumber}/${year}?page=0&size=10&sort=id,desc`,
    "GET",
    {}
  );
};



export const getProjectdetailsdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/${orgId}/project/employee/status/all/search?page=0&size=10&sort=id,desc`,
    "POST",
    {}
  );
};

export const getactiveprojectdetailsdata = async (status) => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `timesheet/209/project/employee/status/${status}/search?page=0&size=10&sort=id,desc`,
    "POST",
    {}
  );
};

export const getSuperAdminProfiledata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `org/${orgId}/user/${id}/user-profile/role/super-admin`,
    "GET",
    {}
  );
};

export const updateUserProfileDetails = async (status) => {
  const id = await AsyncStorage.getItem("id");
  // const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(
    `org-user-association/update/${id}`,
    "PUT",
    {}
  );
};

// about employees data 
export const getEmployeeProfileData = async()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");    
   const apiurl = `https://www.gatnix.com/api/v1/org/${orgId}/user/${id}/user-profile/role/employee`;
   console.log("apiurl", apiurl);
   


const response =await axios.get(apiurl)
console.log("response", response);
return response;

 }

 export const getEmployeeNotifications = async()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");    
  return await handleApiRequestAfterLoginService(
    `https://www.gatnix.com/api/v1/timesheet/${orgId}/notifications/userId/${id}/user-role/employee`,
    "GET",
    {}
  );
 }

 export const getEmployeeSummary = async()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");    
  return await handleApiRequestAfterLoginService(
    `https://www.gatnix.com/api/v1/timesheet/${orgId}/summary/employee/${id}`,
    "GET",
    {}
  );  
 }

 export const getEmployeeWeeklyCount = async()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");    
  return await handleApiRequestAfterLoginService(
    `https://www.gatnix.com/api/v1/timesheet/${orgId}/summary/employee/weekly-counts?date=2025-05-07&employeeId=${id}`,
    "GET",
    {}
  );  
 }

 // approval  manager data 
export const getApprovalManagerProfileData = async()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");    
   const apiurl = `https://www.gatnix.com/api/v1/org/${orgId}/user/${id}/user-profile/role/approvalManagers`;
   console.log("apiurl", apiurl);
   


const response =await axios.get(apiurl)
console.log("response", response);
return response;

 }