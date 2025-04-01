import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  getApprovalManagerdataForProjects,
  getClientDataForProjects,
  getProjectDetailsById,
} from '../aftherlogin';

const EditProjectDetails = ({ route }) => {
  const { projectId } = route.params;
  const navigation = useNavigation();

  const [clientData, setClientData] = useState([]);
  const [fullClientData, setFullClientData] = useState([]);
  const [approvalManagerData, setApprovalManagerData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openProjectTypeDropdown, setOpenProjectTypeDropdown] = useState(false);
  const [openPayTermsDropdown, setOpenPayTermsDropdown] = useState(false);
  const [openClientDropdown, setOpenClientDropdown] = useState(false);
  const [openApprovalDropdown, setOpenApprovalDropdown] = useState(false);

  const [form, setForm] = useState({
    orgId: '',
    projectName: '',
    projectType: '',
    payTerms: '',
    employeeName: '',
    employeeEmail: '',
    employeePhoneNumber: '',
    employeeWhatsappNumber: '',
    clientId: '',
    clientName: '',
    endClientName: '',
    approvalManagerIds: [],
    payRate: '',
    startDate: '',
    endDate: '',
  });

  useFocusEffect(
    useCallback(() => {
      fetchAllDetails();
    }, [projectId])
  );

  const fetchAllDetails = async () => {
    setLoading(true);
    try {
      const orgId = await AsyncStorage.getItem('orgId');
      console.log('OrgId:', orgId);
      setForm((prevForm) => ({
        ...prevForm,
        orgId: orgId,
      }));

      // Fetch project details
      const projectResponse = await getProjectDetailsById(projectId);
      console.log('Project Details:', projectResponse);
      if (projectResponse) {
        const project = projectResponse;
        const parsedEndDate = Number(project.endDate); 
        setForm((prevForm) => ({
          ...prevForm,
          projectName: project.projectName || '',
          projectType: project.projectType || '',
          payTerms: project.payTerms || '',
          employeeName: project.employeeName || '',
          employeeEmail: project.employeeEmail || '',
          employeePhoneNumber: project.employeePhoneNumber || '',
          employeeWhatsappNumber: project.employeeWhatsappNumber || '',
          clientId: project.clientId || '',
          clientName: project.clientName || '',
          endClientName: project.endClientName || '',
          approvalManagerIds: project.approvalManagerIds || [],
          payRate: project.payRate ? project.payRate.toString() : '',
         
          startDate: new Date(project.startDate * 1000).toLocaleDateString("en-GB"), 

          endDate: project.endDate || '',
          endDate: !isNaN(parsedEndDate) ? new Date(parsedEndDate * 1000).toLocaleDateString("en-GB")
                    : project.endDate ,
        }));
      }

      // Fetch clients and approval managers
      const [clients, approvalManagers] = await Promise.all([
        getClientDataForProjects(),
        getApprovalManagerdataForProjects(),
      ]);

      if (clients?.data) {
        console.log('Clients Data:', clients.data);
        const formattedClients = clients.data.map((client) => ({
          label: `${client.clientName}`,
          value: client.id,
        }));
        setClientData(formattedClients);
        setFullClientData(clients.data);
      }

      if (approvalManagers?.data) {
        console.log('Approval Manager Data:', approvalManagers.data);
        setApprovalManagerData(approvalManagers.data);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setForm({ ...form, [name]: value });
    console.log(`key is ${name} and value is ${value}`);
  };

  const handleClientSelect = (clientId) => {
    const selectedClient = fullClientData.find((client) => client.id === clientId);
    if (selectedClient) {
      setForm((prevForm) => ({
        ...prevForm,
        clientId: clientId,
        clientName: selectedClient.clientName,
        endClientName: selectedClient.endClientName,
      }));
    }
  };

  const handleSave = () => {

    console.log("=============================")
    console.log('Updated Form:', form);
    console.log("=============================")
    
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Edit Project</Text>

        {/* Project Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Project Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Project Name"
            value={form.projectName}
            onChangeText={(text) => handleInputChange('projectName', text)}
            editable={false} 
          />
        </View>

        {/* Project Type */}
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
              { label: 'Week', value: 'Week' },
              { label: 'Monthly', value: 'Monthly' },
            ]}
            setOpen={setOpenProjectTypeDropdown}
            setValue={(callback) =>
              handleInputChange('projectType', callback(form.projectType))
            }
            placeholder="Select Project Type"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={openProjectTypeDropdown ? 5000 : 1}
            zIndexInverse={openProjectTypeDropdown ? 1 : 5000}
          />
        </View>

        {/* Pay Terms */}
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
              { label: 'Net 15', value: 'Net 15' },
              { label: 'Net 25', value: 'Net 25' },
              { label: 'Net 30', value: 'Net 30' },
              { label: 'Net 45', value: 'Net 45' },
              { label: 'Net 60', value: 'Net 60' },
            ]}
            setOpen={setOpenPayTermsDropdown}
            setValue={(callback) =>
              handleInputChange('payTerms', callback(form.payTerms))
            }
            placeholder="Select Pay Terms"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={openPayTermsDropdown ? 4000 : 1}
            zIndexInverse={openPayTermsDropdown ? 1 : 4000}
          />
        </View>

        {/* Employee Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Employee Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Employee Name"
            value={form.employeeName}
            onChangeText={(text) => handleInputChange('employeeName', text)}
            editable={false} 
          />
        </View>

        {/* Employee Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Employee Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Employee Email"
            value={form.employeeEmail}
            onChangeText={(text) => handleInputChange('employeeEmail', text)}
            editable={false}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            value={form.employeePhoneNumber}
            onChangeText={(text) => handleInputChange('employeePhoneNumber', text)}
            editable={false}
          />
        </View>

        {/* WhatsApp Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>WhatsApp Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter WhatsApp Number"
            value={form.employeeWhatsappNumber}
            onChangeText={(text) => handleInputChange('employeeWhatsappNumber', text)}
            editable={false}
          />
        </View>

        {/* Client */}
        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openClientDropdown),
          ]}
        >
          <Text style={styles.label}>Client *</Text>
          <DropDownPicker
            open={openClientDropdown}
            value={form.clientId}
            items={clientData}
            setOpen={setOpenClientDropdown}
            setValue={(callback) => {
              const selectedValue = callback(form.clientId);
              handleClientSelect(selectedValue);
            }}
            setItems={setClientData}
            searchable={true}
            listMode="MODAL"
            placeholder="Select Client"
            searchPlaceholder="Search client..."
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={openClientDropdown ? 3000 : 1}
            zIndexInverse={openClientDropdown ? 1 : 3000}
          />
        </View>

        {/* End Client */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Client</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter End Client Name"
            value={form.endClientName}
            onChangeText={(text) => handleInputChange('endClientName', text)}
            editable={false}
          />
        </View>

        {/* Approval Manager */}
        <View
          style={[
            styles.inputContainer,
            styles.dropdownContainer(openApprovalDropdown),
          ]}
        >
          <Text style={styles.label}>Approval Manager *</Text>
          <DropDownPicker
            multiple={true}
            min={1}
            max={approvalManagerData.length}
            open={openApprovalDropdown}
            value={form.approvalManagerIds}
            items={approvalManagerData.map((manager) => ({
              label: `${manager.firstName} ${manager.lastName} - (${manager.email})`,
              value: manager.id,
            }))}
            setOpen={setOpenApprovalDropdown}
            setValue={(callback) => {
              const selectedValues = callback(form.approvalManagerIds || []);
              handleInputChange('approvalManagerIds', selectedValues);
            }}
            setItems={setApprovalManagerData}
            searchable={true}
            placeholder="Select Approval Manager(s)"
            searchPlaceholder="Search manager..."
            listMode="MODAL"
            mode="BADGE"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainerStyle}
            zIndex={openApprovalDropdown ? 2000 : 1}
            zIndexInverse={openApprovalDropdown ? 1 : 2000}
          />
        </View>

        {/* Pay Rate */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pay Rate *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Pay Rate"
            keyboardType="numeric"
            value={form.payRate}
            onChangeText={(text) => handleInputChange('payRate', text)}
          />
        </View>

        {/* Start Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Start Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.startDate}
            onChangeText={(text) => handleInputChange('startDate', text)}
          />
        </View>

        {/* End Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Date *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.endDate}
            onChangeText={(text) => handleInputChange('endDate', text)}
          />
        </View>

        {/* Save and Cancel Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate('Project')}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Indicator Overlay */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  dropdownContainerStyle: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  dropdownContainer: (isOpen) => ({
    zIndex: isOpen ? 1000 : 1,
    elevation: isOpen ? 1000 : 1,
  }),
});

export default EditProjectDetails;