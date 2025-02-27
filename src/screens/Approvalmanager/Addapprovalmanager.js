import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';

const ClientNewdataForm = ({ onClose, initialState, navigation }) => {
  const initialFormState = initialState || {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    mobileCountryCode: '+1',
    mobileIsoCode: 'us',
    whatsAppNumber: '',
    whatsappCountryCode: '+1',
    whatsappIsoCode: 'us',
    organizationId: '226',
    role: 'approvalManagers',
    username: '',
    loginStatus: true,
    schedulerStatus: true,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileCountryPicker, setShowMobileCountryPicker] = useState(false);
  const [showWhatsappCountryPicker, setShowWhatsappCountryPicker] = useState(false);
  const [sameAsMobile, setSameAsMobile] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      console.log('Saving data:', formData);

      const response = await fetch('https://www.gatnix.com/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        console.log('Success:', result);
        setFormData(initialFormState); // Clear form data on success
        navigation.navigate('Addapprovalmanager');
      } else {
        alert(`Failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error saving data');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Client Registration</Text>
      <TextInput style={styles.input} placeholder="First Name" value={formData.firstName} onChangeText={(text) => setFormData({ ...formData, firstName: text })} />
      <TextInput style={styles.input} placeholder="Last Name" value={formData.lastName} onChangeText={(text) => setFormData({ ...formData, lastName: text })} />
      <TextInput style={styles.input} placeholder="Email" value={formData.email} onChangeText={(text) => setFormData({ ...formData, email: text })} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={formData.password} onChangeText={(text) => setFormData({ ...formData, password: text })} secureTextEntry />
<View  style={styles.countrycodeinline}>
      <Text style={styles.label}>Mobile</Text>
      <TouchableOpacity style={styles.countryPicker} onPress={() => setShowMobileCountryPicker(true)}>
        <Text>{formData.mobileCountryCode}</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Mobile Number" value={formData.mobile} onChangeText={(text) => setFormData({ ...formData, mobile: text })} keyboardType="phone-pad" />
      <CountryPicker
        visible={showMobileCountryPicker}
        withFilter
        withFlag
        withCallingCode
        onSelect={(country) => {
          setFormData({
            ...formData,
            mobileCountryCode: `+${country.callingCode[0]}`,
            mobileIsoCode: country.cca2.toLowerCase(),
          });
          setShowMobileCountryPicker(false);
        }}
      />
</View>
      <Text style={styles.label}>WhatsApp Number</Text>
      <TouchableOpacity style={styles.checkbox} onPress={() => setSameAsMobile(!sameAsMobile)}>
        <Text>{sameAsMobile ? '☑' : '☐'} Same as Mobile</Text>
      </TouchableOpacity>
      {!sameAsMobile && (
        <TouchableOpacity style={styles.countryPicker} onPress={() => setShowWhatsappCountryPicker(true)}>
          <Text>{formData.whatsappCountryCode}</Text>
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.input}
        placeholder="WhatsApp Number"
        value={sameAsMobile ? formData.mobile : formData.whatsAppNumber}
        onChangeText={(text) => setFormData({ ...formData, whatsAppNumber: sameAsMobile ? formData.mobile : text })}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Saving...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  input: { borderWidth: 1, padding: 12, marginBottom: 15, borderRadius: 10, borderColor: '#ccc', backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4 },
  label: { fontSize: 18, fontWeight: '600', marginTop: 20, color: '#555' },
  countryPicker: { padding: 12, borderWidth: 1, marginBottom: 15, borderRadius: 10, borderColor: '#ccc', backgroundColor: '#fff', alignItems: 'center' },
  checkbox: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  saveButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', shadowColor: '#007AFF', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 6 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  countrycodeinline:{display:'flex',
flexDirection:'row',
gap:10}
});

export default ClientNewdataForm;
