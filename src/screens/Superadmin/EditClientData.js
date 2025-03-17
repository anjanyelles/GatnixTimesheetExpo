import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert ,ActivityIndicator} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { getClientdataById } from '../aftherlogin';

const EditClientData = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { clientId } = route.params;
    const phoneInput = useRef(null);
    const whatsappInput = useRef(null);

    const [formData, setFormData] = useState(null);

    useEffect(() => {
        getClientById(clientId);
    }, [clientId]);

    const getClientById = async (clientId) => {
        try {
            const response = await getClientdataById(clientId);
            if (response) {
                setFormData(response);
                console.log("Fetched Client Data:", response);
            }
        } catch (error) {
            console.error("Error fetching client details:", error);
        }
    };

    const handleUpdate = async () => {
        if (!formData.clientName || !formData.clientBillingEmail || !formData.clientPhoneNumber) {
            Alert.alert('Error', 'All required fields must be filled!');
            return;
        }

        const isMobileValid = phoneInput.current?.isValidNumber(formData.clientPhoneNumber);
        if (!isMobileValid) {
            Alert.alert('Error', 'Please enter a valid Mobile Number!');
            return;
        }

        try {
            const response = await fetch(`https://www.gatnix.com/api/v1/timesheet/172/clients/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const responseData = await response.json();

            if (response.status === 200) {
                Alert.alert('Success', 'Client updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', responseData.message || 'Something went wrong!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
        }
    };

    if (!formData) {
        return <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />;
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
                        onChangeText={(text) => setFormData({ ...formData, clientName: text })}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-Mail *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.clientBillingEmail}
                        onChangeText={(text) => setFormData({ ...formData, clientBillingEmail: text })}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number *</Text>
                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={formData.clientPhoneNumber} // Only phone number
                        defaultCode={formData.phoneNumberIsoCode?.toUpperCase() || "US"}
                        layout="first"
                        onChangeFormattedText={(text) => setFormData({ ...formData, clientPhoneNumber: text })}
                        onChangeCountry={(country) => {
                            setFormData({ ...formData, phoneNumberCountryCode: country.callingCode, phoneNumberIsoCode: country.cca2 });
                        }}
                        containerStyle={styles.phoneContainer}
                        textContainerStyle={styles.phoneTextContainer}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>WhatsApp Number</Text>
                    <PhoneInput
                        ref={whatsappInput}
                        defaultValue={formData.clientWhatsappNumber || ""} // Only phone number
                        defaultCode={formData.whatsappIsoCode?.toUpperCase() || "IN"}
                        layout="first"
                        onChangeFormattedText={(text) => setFormData({ ...formData, clientWhatsappNumber: text })}
                        onChangeCountry={(country) => {
                            setFormData({ ...formData, whatsappNumberCountryCode: country.callingCode, whatsappNumberIsoCode: country.cca2 });
                        }}
                        containerStyle={styles.phoneContainer}
                        textContainerStyle={styles.phoneTextContainer}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Additional Email</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.additionalEmail}
                        onChangeText={(text) => setFormData({ ...formData, additionalEmail: text })}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Client Account Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.clientAccountName}
                        onChangeText={(text) => setFormData({ ...formData, clientAccountName: text })}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>End Client Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.endClientName}
                        onChangeText={(text) => setFormData({ ...formData, endClientName: text })}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>End Client Email</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.endClientEmail}
                        onChangeText={(text) => setFormData({ ...formData, endClientEmail: text })}
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Client Address</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.clientAddress}
                        onChangeText={(text) => setFormData({ ...formData, clientAddress: text })}
                        multiline
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Update Client</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.submitButton, styles.cancelButton]} onPress={() => navigation.navigate('ClientSuperadmin')}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
    
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    formContainer: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 3 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 16, height: 48 },
    phoneContainer: { height: 48, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
    phoneTextContainer: { backgroundColor: 'transparent', height: 46, borderRadius: 8 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 30 },
    submitButton: { flex: 1, backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginRight: 10 },
    cancelButton: { backgroundColor: '#dc3545' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default EditClientData;
