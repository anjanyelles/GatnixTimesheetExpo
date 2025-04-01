import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import PhoneInput from "react-native-phone-input";
import { getClientdataById } from '../aftherlogin';

const EditClientData = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { clientId } = route.params;

  const phoneInputRef = useRef(null);
  const whatsappInputRef = useRef(null);

  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  

  useFocusEffect(useCallback(()=>{
    fetchClientData();

  },[clientId]))

  const fetchClientData = async () => {
    try {
      setIsLoading(true);
      const response = await getClientdataById(clientId);
      if (response) {
        setFormData({
          ...response,
          clientPhoneNumber: response.clientPhoneNumber || '',
          clientWhatsappNumber: response.clientWhatsappNumber || '',
          phoneNumberCountryCode: response.phoneNumberCountryCode || '+91',
          whatsappNumberCountryCode: response.whatsappNumberCountryCode || '+91',
          phoneNumberIsoCode: response.phoneNumberIsoCode || 'in',
          whatsappNumberIsoCode: response.whatsappNumberIsoCode || 'in'
        });
        console.log("Fetched Client Data:", response);
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
      Alert.alert('Error', 'Failed to load client data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberChange = (number, type) => {
    const ref = type === "phone" ? phoneInputRef : whatsappInputRef;
    setFormData(prev => ({
      ...prev,
      ...(type === "phone" ? {
        clientPhoneNumber: number,
        phoneNumberCountryCode: ref.current?.getCountryCode() || '+91',
        phoneNumberIsoCode: ref.current?.getISOCode() || 'in'
      } : {
        clientWhatsappNumber: number,
        whatsappNumberCountryCode: ref.current?.getCountryCode() || '+91',
        whatsappNumberIsoCode: ref.current?.getISOCode() || 'in'
      })
    }));
  };

  const handleUpdate = async () => {
    if (!formData?.clientName || !formData?.clientBillingEmail || !formData?.clientPhoneNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // const isMobileValid = phoneInputRef.current?.isValidNumber(formData.clientPhoneNumber);
    // if (!isMobileValid) {
    //   Alert.alert('Error', 'Please enter a valid mobile number');
    //   return;
    // }

    try {
      setIsLoading(true);
      const response = await fetch(`https://www.gatnix.com/api/v1/timesheet/172/clients/${clientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Client updated successfully');
        navigation.navigate('ClientSuperadmin');
       
      } else {
        Alert.alert('Error', responseData.message || 'Failed to update client');
      }
    } catch (error) {
      console.error('Update error:', error);
      Alert.alert('Error', 'Network error occurred. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !formData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Client</Text>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Name *</Text>
          <TextInput
            style={styles.input}
            value={formData.clientName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, clientName: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>E-Mail *</Text>
          <TextInput
            style={styles.input}
            value={formData.clientBillingEmail}
            onChangeText={(text) => setFormData(prev => ({ ...prev, clientBillingEmail: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number *</Text>
          <View style={styles.phoneContainer}>
            <PhoneInput
              ref={phoneInputRef}
              initialValue={formData.phoneNumberCountryCode}
              initialCountry={formData.phoneNumberIsoCode}
              onChangePhoneNumber={(number) => handleNumberChange(number, "phone")}
              style={styles.phonePicker}
            />
            <TextInput
              style={styles.input}
              value={formData.clientPhoneNumber}
              onChangeText={(text) => handleNumberChange(text, "phone")}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>WhatsApp Number</Text>
          <View style={styles.phoneContainer}>
            <PhoneInput
              ref={whatsappInputRef}
              initialValue={formData.whatsappNumberCountryCode}
              initialCountry={formData.whatsappNumberIsoCode}
              onChangePhoneNumber={(number) => handleNumberChange(number, "whatsapp")}
              style={styles.phonePicker}
            />
            <TextInput
              style={styles.input}
              value={formData.clientWhatsappNumber}
              onChangeText={(text) => handleNumberChange(text, "whatsapp")}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Email</Text>
          <TextInput
            style={styles.input}
            value={formData.additionalEmail}
            onChangeText={(text) => setFormData(prev => ({ ...prev, additionalEmail: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Account Name</Text>
          <TextInput
            style={styles.input}
            value={formData.clientAccountName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, clientAccountName: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Client Name</Text>
          <TextInput
            style={styles.input}
            value={formData.endClientName}
            onChangeText={(text) => setFormData(prev => ({ ...prev, endClientName: text }))}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>End Client Email</Text>
          <TextInput
            style={styles.input}
            value={formData.endClientEmail}
            onChangeText={(text) => setFormData(prev => ({ ...prev, endClientEmail: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Client Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.clientAddress}
            onChangeText={(text) => setFormData(prev => ({ ...prev, clientAddress: text }))}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleUpdate}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating...' : 'Update Client'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.submitButton, styles.cancelButton]} 
            onPress={() => navigation.navigate('ClientSuperadmin')}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f8f9fa' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  formContainer: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 10, 
    elevation: 3 
  },
  inputGroup: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 8, 
    fontWeight: '500',
    color: '#333'
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phonePicker: {
    width: 80,
    marginRight: 10,
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20, 
    marginBottom: 30 
  },
  submitButton: { 
    flex: 1, 
    backgroundColor: '#28a745', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginRight: 10 
  },
  cancelButton: { 
    backgroundColor: '#dc3545' 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});

export default EditClientData;