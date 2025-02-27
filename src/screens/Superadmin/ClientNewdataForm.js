import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

const ClientNewdataForm = ({ id, onClose }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientBillingEmail: '',
    clientPhoneNumber: '',
    phoneNumberCountryCode: '',
    phoneNumberIsoCode: '',
    clientWhatsappNumber: '',
    whatsappNumberCountryCode: '',
    whatsappNumberIsoCode: '',
    additionalEmail: '',
    clientAccountName: '',
    endClientName: '',
    endClientEmail: '',
    clientAddress: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showMobileCountryPicker, setShowMobileCountryPicker] = useState(false);
  const [showWhatsappCountryPicker, setShowWhatsappCountryPicker] = useState(false);

  const handleCancel = () => {
    onClose?.();
  };

  const handleSave = async () => {
    // Validation
    if (!formData.clientName || !formData.clientBillingEmail || !formData.clientPhoneNumber || !formData.clientAddress) {
      alert('Please fill in all required fields: Client Name, Email, Phone Number, and Address.');
      return;
    }
  
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.clientBillingEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
  
    if (formData.endClientEmail && !emailRegex.test(formData.endClientEmail)) {
      alert('Please enter a valid end client email.');
      return;
    }
  
    try {
      setIsLoading(true);
  
      const response = await fetch('https://www.gatnix.com/api/v1/timesheet/226/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          orgId: '226', // Add orgId directly
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Client data saved successfully!');
        console.log('Success:', result);
        // Clear the form after successful save
        setFormData({
          clientName: '',
          clientBillingEmail: '',
          clientPhoneNumber: '',
          phoneNumberCountryCode: '',
          phoneNumberIsoCode: '',
          clientWhatsappNumber: '',
          whatsappNumberCountryCode: '',
          whatsappNumberIsoCode: '',
          additionalEmail: '',
          clientAccountName: '',
          endClientName: '',
          endClientEmail: '',
          clientAddress: '',
        });
      } else {
        alert(`Failed to save client data: ${result.message || 'Unknown error'}`);
        console.error('Failed:', result);
      }
    } catch (error) {
      alert('An error occurred while saving client data.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
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
        <TextInput
          style={[styles.input, styles.inputGroup]}
          placeholder="Client Name"
          value={formData.clientName}
          onChangeText={(text) => setFormData({ ...formData, clientName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Billing Email*</Text>
        <TextInput
          style={styles.input}
          placeholder="Billing Email"
          keyboardType="email-address"
          value={formData.clientBillingEmail}
          onChangeText={(text) => setFormData({ ...formData, clientBillingEmail: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.phoneContainer}>
          <TouchableOpacity
            style={styles.countryPicker}
            onPress={() => setShowMobileCountryPicker(true)}
          >
            <Text>{formData.phoneNumberCountryCode || '+Code'}</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={formData.clientPhoneNumber}
            onChangeText={(text) => setFormData({ ...formData, clientPhoneNumber: text })}
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
          setFormData({
            ...formData,
            phoneNumberCountryCode: `+${country.callingCode[0]}`,
            phoneNumberIsoCode: country.cca2.toLowerCase(),
          });
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
            <Text>{formData.whatsappNumberCountryCode || '+Code'}</Text>
          </TouchableOpacity>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="WhatsApp Number"
            keyboardType="phone-pad"
            value={formData.clientWhatsappNumber}
            onChangeText={(text) => setFormData({ ...formData, clientWhatsappNumber: text })}
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
          setFormData({
            ...formData,
            whatsappNumberCountryCode: `+${country.callingCode[0]}`,
            whatsappNumberIsoCode: country.cca2.toLowerCase(),
          });
          setShowWhatsappCountryPicker(false);
        }}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Additional Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Additional Email"
          keyboardType="email-address"
          value={formData.additionalEmail}
          onChangeText={(text) => setFormData({ ...formData, additionalEmail: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Client Account Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Client Account Name"
          value={formData.clientAccountName}
          onChangeText={(text) => setFormData({ ...formData, clientAccountName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Client Name</Text>
        <TextInput
          style={styles.input}
          placeholder="End Client Name"
          value={formData.endClientName}
          onChangeText={(text) => setFormData({ ...formData, endClientName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>End Client Email</Text>
        <TextInput
          style={styles.input}
          placeholder="End Client Email"
          keyboardType="email-address"
          value={formData.endClientEmail}
          onChangeText={(text) => setFormData({ ...formData, endClientEmail: text })}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Client Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Client Address"
          keyboardType="email-address"
          value={formData.clientAddress}
          onChangeText={(text) => setFormData({ ...formData, clientAddress: text })}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={isLoading}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
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
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width: 80,
    alignItems: 'center',
  },
  phoneInput: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ClientNewdataForm;