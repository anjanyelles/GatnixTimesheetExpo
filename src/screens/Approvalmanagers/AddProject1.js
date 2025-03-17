import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import {
  addProject,
  getApprovalManagerdataForProjects,
  getClientDataForProjects,
  getEmplyeedataForProjects,
} from "../aftherlogin";
import DropDownPicker from "react-native-dropdown-picker";
import { ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { use } from "react";

const AddProject1 = () => {
  const route =useRoute()
  const  projectId=route.params
  console.log(projectId)

  const navigation = useNavigation();

  const [clientData, setClientData] = useState([]);
  const [fullClientData, setFullClientData] = useState([]);
  const [openClientDropdown, setOpenClientDropdown] = useState(false);

  const [approvalManagerData, setApprovalManagerData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [fullemployeesData, setFullEmployeesData] = useState([]);

  const [openEmployeeDropdown, setOpenEmployeeDropdown] = useState(false);
  const [openApprovalDropdown, setOpenApprovalDropdown] = useState(false);
  const [openCurrencyDropdown, setOpenCurrencyDropdown] = useState(false);
  const [openDurationDropdown, setOpenDurationDropdown] = useState(false);
  const [openProjectTypeDropdown, setOpenProjectTypeDropdown] = useState(false);
  const [openPayTermsDropdown, setOpenPayTermsDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    id: 0,
    orgId: "",
    employeeId: "",
    employeeName: "",
    projectName: "",
    projectType: "",
    payTerms: "",
    projectCode: "",
    employeeEmail: "",
    employeePhoneNumber: "",
    employeeWhatsappNumber: "",
    client: {},
    clientId: "",
    clientName: "",
    endClientName: "",
    payRate: "",
    startDate: "",
    endDate: "",
    billableHours: 0,
    nonBillableHours: 0,
    currencyType: "",
    payRateType: "",
    status: "active",
    approvalManagerIds: [],
    approvalManagers: [
      {
        id: 0,
        userUUID: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        mobile: "",
        whatsAppNumber: "",
        role: "",
        managingEmployerId: "",
        managingAdminId: "",
        loginStatus: false, 
        schedulerStatus: false,
        createdDate: "",
      },
    ],
  });

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
   // console.log(`key is ${name} and value is ${value}`);
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchrequiredDetails();
    }, [])
  );

  const fetchrequiredDetails = async () => {
    setLoading(true);
    try {
      const orgId = await AsyncStorage.getItem("orgId");
     // console.log("OrgId:", orgId);
      setForm((prevForm) => ({
        ...prevForm,
        orgId: orgId,
      }));

      const [clients, approvalManagers, employees] = await Promise.all([
        getClientDataForProjects(),
        getApprovalManagerdataForProjects(),
        getEmplyeedataForProjects(),
      ]);

      if (clients?.data) {
      //  console.log("Clients Data:", clients.data);

        const formattedClients = clients.data.map((client) => ({
          label: `${client.clientName}`,
          value: client.id,
        }));

        setClientData(formattedClients);
        setFullClientData(clients.data);
       // console.log("Dropdown client  Data:", clientData);
      }

      if (approvalManagers?.data) {
       // console.log("Approval Manager Data:", approvalManagers.data);
        setApprovalManagerData(approvalManagers.data);
      }

      if (employees?.data) {
       // console.log("Employees Data:", employees.data);
        const formattedEmployees = employees.data.map((emp) => ({
          label: `${emp.firstName}${emp.lastName} - (${emp.email})`,
          value: emp.id,
        }));

        setEmployeesData(formattedEmployees);
        setFullEmployeesData(employees.data);

        // console.log("Dropdown Data:", employeesData);
      }
    } catch (error) {
      console.log("Error fetching the project data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form.employeeName) {
      handleEmployeeSelect(form.employeeName);
    }
  }, [form.employeeName]);

  const handleEmployeeSelect = (value) => {
    //console.log("Selected Employee ID:", value);

    const selectedEmp = fullemployeesData.find((emp) => emp.id === value);
    setForm((prevForm) => ({
      ...prevForm,
      employeeId: value,
      projectName: `${selectedEmp.firstName}${selectedEmp.lastName} - (${selectedEmp.email})`,
      employeeEmail: selectedEmp.email,
      employeePhoneNumber: selectedEmp.mobileCountryCode + selectedEmp.mobile,
      employeeWhatsappNumber:
        selectedEmp.whatsappCountryCode + selectedEmp.whatsAppNumber,
    }));
    //console.log("Selected Employee:", selectedEmp);
  };

  // useEffect(() => {
  //   if (form.clientId) {
  //     handleClientSelect(form.clientId);
  //   }
  // }, [form.clientId]);

  const handleClientSelect = (clientId) => {
   // console.log("Selected Client ID:", clientId);

    const selectedClient = fullClientData.find(
      (client) => client.id === clientId
    );

    if (!selectedClient) {
      console.error("Selected Client Data is undefined for ID:", clientId);
      return;
    }

   // console.log("Selected Client Data:", selectedClient);

    setForm((prevForm) => ({
      ...prevForm,
      client: selectedClient,
      clientId: clientId,
      clientName: selectedClient.clientName,
      endClientName: selectedClient.endClientName,
    }));
  };

  const handleSubmit = async () => {
    try {
       
        const startTimestamp = form.startDate ? Math.floor(new Date(form.startDate).getTime() / 1000) : null;
        const endTimestamp = form.endDate ? Math.floor(new Date(form.endDate).getTime() / 1000) : null;

   //     console.log("Before Update:", form);

      
        const updatedForm = {
            ...form,
            startDate: startTimestamp,
            endDate: endTimestamp,
            projectName: `${form.projectName}_${form.client?.clientName}_${form.client?.endClientName}`,
            employeeName: '',
            clientName: '',
            endClientName: '',
            employeeWhatsappNumber: '',
            employeePhoneNumber: ''
        };

        // Call API to add project
        const projectAdded = await addProject(updatedForm);

        if (projectAdded) {
            Alert.alert("Success", "Project added successfully!");
        } else {
            console.error("Project creation failed:", projectAdded);
            Alert.alert("Error", "Failed to create project.");
        }
    } catch (error) {
        console.error("Error in handleSubmit:", error);
        Alert.alert("Error", "Something went wrong.");
    }
};

  const validateForm = () => {
    let newErrors = {};

    if (!form.orgId) newErrors.orgId = "Organization ID is required";
    if (!form.employeeId) newErrors.employeeId = "Employee is required";
    
    if (!form.projectType) newErrors.projectType = "Project Type is required";
    if (!form.payTerms) newErrors.payTerms = "Pay Terms are required";
    if (!form.clientId) newErrors.clientId = "Client is required";
    if (!form.payRate || isNaN(form.payRate))
      newErrors.payRate = "Valid Pay Rate is required";
    if (!form.currencyType)
      newErrors.currencyType = "Currency Type is required";
    if (!form.payRateType) newErrors.payRateType = "Pay Rate Type is required";
    if (!form.startDate) newErrors.startDate = "Start Date is required";
    if (!form.endDate) newErrors.endDate = "End Date is required";
    if (!form.approvalManagerIds.length)
      newErrors.approvalManagerIds =
        "At least one Approval Manager is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprovalManager = (key, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));

    console.log(`key is ${key} and value is`, value);  // Ensures array is logged correctly
};


  return (
    <>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
      
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Add Project</Text>

        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openProjectTypeDropdown),
          ]}
        >
          <Text style={styles.label}>Project Type *</Text>
          <DropDownPicker
            open={openProjectTypeDropdown}
            value={form.projectType}
            items={[
              { label: "Week", value: "Week" },
              { label: "Monthly", value: "Monthly" },
            ]}
            setOpen={setOpenProjectTypeDropdown}
            setValue={(callback) =>
              handleInputChange("projectType", callback(form.projectType))
            }
            placeholder="Select Project Type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openPayTermsDropdown),
          ]}
        >
          <Text style={styles.label}>Pay Terms *</Text>
          <DropDownPicker
            open={openPayTermsDropdown}
            value={form.payTerms}
            items={[
              { label: "Net 15", value: "Net 15" },
              { label: "Net 25", value: "Net 25" },
              { label: "Net 30", value: "Net 30" },
              { label: "Net 45", value: "Net 45" },
              { label: "Net 60", value: "Net 60" },
            ]}
            setOpen={setOpenPayTermsDropdown}
            setValue={(callback) =>
              handleInputChange("payTerms", callback(form.payTerms))
            }
            placeholder="Select Pay Terms"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
              backgroundColor: "#fff",
            }}
            dropDownContainerStyle={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
            }}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              zIndex: openEmployeeDropdown ? 1000 : 1,
              elevation: openEmployeeDropdown ? 1000 : 1,
            },
          ]}
        >
          <View style={styles.labelRow}>
            <Text style={styles.label}>Employee Name *</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={20} color="black" />
              <Text style={styles.addText}> Add</Text>
            </TouchableOpacity>
          </View>

          <DropDownPicker
            style={styles.input}
            open={openEmployeeDropdown}
            value={form.employeeName}
            items={employeesData}
            setOpen={setOpenEmployeeDropdown}
            setValue={(callback) => {
              const selectedValue = callback(form.employeeName);
              handleEmployeeSelect(selectedValue);
              handleInputChange("employeeName", selectedValue);
            }}
            setItems={setEmployeesData}
            searchable={true}
            listMode="MODAL"
            placeholder="Select Employee"
            searchPlaceholder="Search employee..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Employee Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Employee Email"
            value={form.employeeEmail}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            value={form.employeePhoneNumber}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Whatsapp Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Whatsapp Number"
            value={form.employeeWhatsappNumber}
            editable={false}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openClientDropdown),
          ]}
        >
          <View style={styles.labelRow}>
            <Text style={styles.label}>Client *</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={20} color="black" />
              <Text style={styles.addText}> Add</Text>
            </TouchableOpacity>
          </View>

          <DropDownPicker
            style={styles.input}
            open={openClientDropdown}
            value={form.clientId}
            items={clientData}
            setOpen={setOpenClientDropdown}
            setValue={(callback) => {
              const selectedValue = callback(form.clientId);
              handleClientSelect(selectedValue);
            // handleInputChange("clientName", selectedValue);
            }}
            setItems={setClientData}
            searchable={true}
            listMode="MODAL"
            placeholder="Select Client"
            searchPlaceholder="Search client..."
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Client</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter End Client Name"
            value={form.endClientName}
            editable={false}
          />
        </View>


        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openApprovalDropdown),
          ]}
        >
          <View style={styles.labelRow}>
            <Text style={styles.label}>Approval Manager *</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={20} color="black" />
              <Text style={styles.addText}> Add</Text>
            </TouchableOpacity>
          </View>
          <DropDownPicker
            multiple={true}
            min={1} 
            max={approvalManagerData.length}
            open={openApprovalDropdown}
            value={form.approvalManagerIds}
            items={approvalManagerData.map(manager => ({
              label: `${manager.firstName} ${manager.lastName} - (${manager.email})`,
              value: manager.id,
            }))}
            setOpen={setOpenApprovalDropdown}
            setValue={(callback) => {
              setForm((prevForm) => {
                const selectedValues = callback(prevForm.approvalManagerIds || []);
                console.log("Before updating state:", selectedValues);  // Debugging log
                return {
                  ...prevForm,
                  approvalManagerIds: selectedValues
                };
              });
            }}
                       
            setItems={setApprovalManagerData}
            searchable={true}
            placeholder="Select Approval Manager(s)"
            searchPlaceholder="Search manager..."
            listMode="MODAL"
            mode="BADGE"
            style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 5, backgroundColor: '#fff', minHeight: 50 }}
          />

        </View>



        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pay Rate *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={form.payRate}
            onChangeText={(text) => handleInputChange("payRate", text)}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openCurrencyDropdown),
          ]}
        >
          <Text style={styles.label}>Currency</Text>
          <DropDownPicker
            open={openCurrencyDropdown}
            value={form.currency}
            items={[
              { label: "USD", value: "USD" },
              { label: "Rupee", value: "Rupee" },
              { label: "EUR", value: "EUR" },
              { label: "GBP", value: "GBP" },
            ]}
            setOpen={setOpenCurrencyDropdown}
            setValue={(callback) =>
              handleInputChange("currency", callback(form.currency))
            }
            placeholder="Select Currency"
            listMode="SCROLLVIEW"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
              backgroundColor: "#fff",
            }}
            dropDownContainerStyle={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 5,
            }}
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openDurationDropdown),
          ]}
        >
          <Text style={styles.label}>Duration</Text>
          <DropDownPicker
            open={openDurationDropdown}
            value={form.duration}
            items={[
              { label: "Hourly", value: "Hourly" },
              { label: "Monthly", value: "Monthly" },
              { label: "Yearly", value: "Yearly" },
            ]}
            setOpen={setOpenDurationDropdown}
            setValue={(callback) =>
              handleInputChange("payRateType", callback(form.duration))
            }
            placeholder="Select Duration"
            listMode="SCROLLVIEW"
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 0,
              backgroundColor: "#fff",
            }}
            dropDownContainerStyle={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 0,
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Start Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.startDate}
            onChangeText={(text) => handleInputChange("startDate", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.endDate}
            onChangeText={(text) => handleInputChange("endDate", text)}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Project")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f9fa" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer: { marginBottom: 15, zIndex: 1 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  addButton: { flexDirection: "row", alignItems: "center" },
  addText: { fontSize: 14, fontWeight: "bold", marginLeft: 5 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // Ensure loader appears on top
  },

  dropdownContainer: (isOpen) => ({
    zIndex: isOpen ? 1000 : 1,
    elevation: isOpen ? 1000 : 1,
  }),
});

export default AddProject1;
