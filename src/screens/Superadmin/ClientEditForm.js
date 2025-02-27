import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

const ClientEditForm = ({ id, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    mobileCountryCode: '+1',
    mobileIsoCode: 'US',
    whatsAppNumber: '',
    whatsappCountryCode: '+1',
    whatsappIsoCode: 'US',
    endClientName: '',
    endClientEmail: 'uotyopupoyu',
    additionalEmail: '',
    clientAccountName: '',
    clientAddress: '',
    // Additional fields for API
    password: '',
    organizationId: '226',
    role: 'approvalManagers',
    username: '',
    loginStatus: true,
    schedulerStatus: true
  });

  const [showMobileCountryPicker, setShowMobileCountryPicker] = useState(false);
  const [showWhatsappCountryPicker, setShowWhatsappCountryPicker] = useState(false);

  useEffect(() => {
    if (id) {
      fetchClientData();
    }
  }, [id]);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.gatnix.com/api/v1/timesheet/226/clients/57`);
      
      if (response) {
        const data = await response.json();
        console.log("Parsed Data:", data);
        
        if (data && Object.keys(data).length > 0) {
          // Split the clientName properly
          const nameParts = data.clientName ? data.clientName.split(' ') : [];
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData((prevFormData) => ({
            ...prevFormData,
            firstName,
            lastName,
            email: data.clientBillingEmail || '',
            mobile: data.clientPhoneNumber || '',
            mobileCountryCode: data.phoneNumberCountryCode || '+1',
            mobileIsoCode: data.phoneNumberIsoCode || 'US',
            whatsAppNumber: data.clientWhatsappNumber || '',
            whatsappCountryCode: data.whatsappNumberCountryCode || '+1',
            whatsappIsoCode: data.whatsappNumberIsoCode || 'US',
            endClientName: data.endClientName || '',
            endClientEmail: data.endClientEmail || '',
            additionalEmail: data.additionalEmail || '',
            clientAccountName: data.clientAccountName || '',
            clientAddress: data.clientAddress || '',
            username: data.username || '',
          }));
          
          
          console.log("Form data after update:", formData);
        } else {
          console.error('Client data is empty or not in expected format');
        }
      } else {
        console.error(`Failed to fetch client data. Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
  
    setIsLoading(true);
    try {
      const apiBody = {
        clientName: `${formData.firstName} ${formData.lastName}`,
        clientBillingEmail: formData.email,
        clientPhoneNumber: formData.mobile,
        phoneNumberCountryCode: formData.mobileCountryCode,
        phoneNumberIsoCode: formData.mobileIsoCode.toLowerCase(),
        clientWhatsappNumber: formData.whatsAppNumber,
        whatsappNumberCountryCode: formData.whatsappCountryCode,
        whatsappNumberIsoCode: formData.whatsappIsoCode.toLowerCase(),
        endClientName: formData.endClientName,
        endClientEmail: formData.endClientEmail,
        additionalEmail: formData.additionalEmail,
        clientAccountName: formData.clientAccountName,
        clientAddress: formData.clientAddress,
        orgId: '226'
      };
  
      // If we have an ID, it's an update operation
      const url = id 
        ? `https://www.gatnix.com/api/v1/timesheet/226/clients/${id}` 
        : 'https://www.gatnix.com/api/v1/timesheet/226/clients';
      
      const method = id ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiBody)
      });
  
      if (response.ok) {
        alert('Client saved successfully!');
        onClose?.();
      } else {
        const errorData = await response.json();
        alert(`Failed to save client: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    onClose?.();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Client</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Client Name*</Text>
        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>E-Mail*</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={styles.countryPicker}
            onPress={() => setShowMobileCountryPicker(true)}
          >
            <Text>{formData.mobileCountryCode}</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={formData.mobile}
            onChangeText={(text) => setFormData(prev => ({ ...prev, mobile: text }))}
          />
        </View>
      </View>

      <CountryPicker
        visible={showMobileCountryPicker}
        onClose={() => setShowMobileCountryPicker(false)}
        withFilter
        withFlag
        withCallingCode
        withEmoji
        onSelect={(country) => {
          setFormData(prev => ({
            ...prev,
            mobileCountryCode: `+${country.callingCode[0]}`,
            mobileIsoCode: country.cca2
          }));
          setShowMobileCountryPicker(false);
        }}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>WhatsApp Number</Text>
        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={styles.countryPicker}
            onPress={() => setShowWhatsappCountryPicker(true)}
          >
            <Text>{formData.whatsappCountryCode}</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="WhatsApp Number"
            keyboardType="phone-pad"
            value={formData.whatsAppNumber}
            onChangeText={(text) => setFormData(prev => ({ ...prev, whatsAppNumber: text }))}
          />
        </View>
      </View>

      <CountryPicker
        visible={showWhatsappCountryPicker}
        onClose={() => setShowWhatsappCountryPicker(false)}
        withFilter
        withFlag
        withCallingCode
        withEmoji
        onSelect={(country) => {
          setFormData(prev => ({
            ...prev,
            whatsappCountryCode: `+${country.callingCode[0]}`,
            whatsappIsoCode: country.cca2
          }));
          setShowWhatsappCountryPicker(false);
        }}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Client Name</Text>
        <TextInput
          style={styles.input}
          placeholder="End Client Name"
          value={formData.endClientName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, endClientName: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Client E-Mail</Text>
        <TextInput
          style={styles.input}
          placeholder="End Client Email"
          keyboardType="email-address"
          value={formData.endClientEmail}
          onChangeText={(text) => setFormData(prev => ({ ...prev, endClientEmail: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Additional Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Additional Email"
          keyboardType="email-address"
          value={formData.additionalEmail}
          onChangeText={(text) => setFormData(prev => ({ ...prev, additionalEmail: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Client Account Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Client Account Name"
          value={formData.clientAccountName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, clientAccountName: text }))}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Client Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Client Address"
          multiline
          numberOfLines={4}
          value={formData.clientAddress}
          onChangeText={(text) => setFormData(prev => ({ ...prev, clientAddress: text }))}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryPicker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginRight: 8,
    minWidth: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 4,
    padding: 16,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 4,
    padding: 16,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClientEditForm;