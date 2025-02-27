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
const handleApiRequestAfterLoginService = async (endpoint, method = "GET", data = null, headers = {}) => {
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
  const orgId  = await AsyncStorage.getItem("orgId");
    // alert(orgId);
    // alert(id);
  return await handleApiRequestAfterLoginService(`timesheet/${orgId}/summary/counts`, "GET");
};

// ✅ Send WhatsApp OTP
export const sendWhatsappOtpapi = async (whatsappData, value) => {
  return await handleApiRequestAfterLoginService("send-otp", "POST", { whatsappData, value });
};

export const getEmplyeedata = async (status) => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`org-user-association/${orgId}/get-users/userId/${id}/role/employee/status/${status}?page=0&size=10`, "POST", {});
};



export const handelGetProfileData = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`org/${orgId}/user/${id}/user-profile/role/super-admin`, "GET", {});
};




export const handelUpdateProfileData = async (data) => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`org-user-association/update/${id}`, "PUT", data);
};



export const handelUpdateAppreveTimeSheet = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/226/date_to_date/690/status/approved/association/super-admin?page=0&size=10&sort=id,desc`, "GET",);
};




export const handlegetAllEmpoyeeDataApi = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`226/users?role=approvalManagers&page=0&size=10`, "GET",);
};


export const fetchActiveEmployeesApiData = async (page, pageSize , istrue) => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`226/user-role/approvalManagers/user-status?login_status=${istrue}&page=${page}&size=${pageSize}cs`, "GET",);
};


export const handlegetAllClinetDataApi = async (page, pageSize ) => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/226/clients/search?page=0&size=10`, "POST",{});
};


export const handleDeleteUser = async (deleteId) => {
  const id = await AsyncStorage.getItem("id");
  const orgId  = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/226/clients/${deleteId}`, "DELETE");
};

export const getApprovalManagerdata = async () => {
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`${orgId}/users?role=approvalManagers&page=0&size=10` ,"GET",{});
};

export const getClientSuperadmindata = async ()=>{
  const id = await AsyncStorage.getItem("id");
    const orgId = await AsyncStorage.getItem("orgId");
    return await handleApiRequestAfterLoginService(`timesheet/${orgId}/clients/search?page=0&size=10`,"POST",{});
};

export const getSubmittedsheetdata = async ()=>{
  const id =await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage .getItem("orgId");
  return await handleApiRequestAfterLoginService (`timesheet/209/date_to_date/607/status/submitted/association/super-admin?page=0&size=10&sort=id,desc`, "GET",{});
};

export const getApprovedsheetdata = async ()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService (`timesheet/209/date_to_date/607/status/approved/association/super-admin?page=0&size=10&sort=id,desc`, "GET",{});
};

export const getPendingsheetdata = async ()=>{
  const id = await AsyncStorage.getItem ("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/209/date_to_date/607/status/inprogress/association/super-admin?page=0&size=10&sort=id,desc`, "GET",{});
};
 export const getRejectedsheetdata = async ()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/209/date_to_date/607/status/rejected/association/super-admin?page=0&size=10&sort=id,desc`,"GET",{});
 };

 export const getRecalledsheetdata = async ()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService (`timesheet/209/date_to_date/607/status/recall%20Requested/association/super-admin?page=0&size=10&sort=id,desc`,"GET",{})
 };

export const getTimesheetsettingsdata = async ()=>{
const id = await AsyncStorage.getItem("id");
const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/209/timesheet_notification_settings/by-org-id`,"GET", {});
};


export const getOrganizationalSettingsdata = async()=>{
const id = await AsyncStorage.getItem("id"); 
const orgId = await AsyncStorage.getItem("orgId");
return await handleApiRequestAfterLoginService(`organization/orgId/209`,"GET",{});
};




export const getOrganizationalSettingsdatas = async (data)=>{
  const id = await AsyncStorage.getItem("id");
  const orgId =await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`organization/209`,"PUT",data);
};


export const getTimesheetsettingspatch = async (data)=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
    return await handleApiRequestAfterLoginService(`timesheet/209/timesheet_notification_settings/13`,"PUT", data);
  };
 
  export const getTimesheetsettingsgetcall = async ()=>{
    const id = await AsyncStorage.getItem("id");
    const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/209/recall_settings/607/association/408`,"GET",{});
}
  
export const getTimesheetsettingsputcall = async (data)=>{
  console.log("data", data);
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
return await handleApiRequestAfterLoginService(`timesheet/209/recall_settings/607/11`,"PUT",{data});
}

export const getTimesheetsdatacall = async ()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/209/date_to_date/2/2025?page=0&size=10&sort=id,desc`,"GET",{})
};


export const getProjectdetailsdata = async ()=>{
  const id = await AsyncStorage.getItem("id");
  const orgId = await AsyncStorage.getItem("orgId");
  return await handleApiRequestAfterLoginService(`timesheet/209/project/employee/status/all/search?page=0&size=10&sort=id,desc`,"POST",{});
};

export const getactiveprojectdetailsdata = async (status)=>{
const id = await AsyncStorage.getItem("id");
const orgId = await AsyncStorage.getItem("orgId");
return await handleApiRequestAfterLoginService(`timesheet/209/project/employee/status/${status}/search?page=0&size=10&sort=id,desc`, "POST",{});
}