import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';


const AddClients = () => {
    const navigation = useNavigation();
    const phoneInput = useRef(null);
    const whatsappInput = useRef(null);

    const [formData, setFormData] = useState({
        clientName: '',
        email: '',
        mobile: '',
        mobileCountryCode: '',
        mobileIsoCode: '',
        whatsAppNumber: '',
        whatsappCountryCode: '',
        whatsappIsoCode: '',
        additionalEmail: '',
        clientAccountName: '',
        endClientName: '',
        endClientEmail: '',
        clientAddress: '',
    });

    const handleMobileChange = (text) => {
        if (phoneInput.current) {
            const callingCode = phoneInput.current.getCallingCode();
            const countryCode = phoneInput.current.getCountryCode()?.toLowerCase();
            const numberWithoutCode = text.replace(`+${callingCode}`, ''); // Remove country code

            setFormData((prev) => ({
                ...prev,
                mobile: numberWithoutCode,
                mobileCountryCode: `+${callingCode}`,
                mobileIsoCode: countryCode,
            }));
        }
    };

    const handleWhatsAppChange = (text) => {
        if (whatsappInput.current) {
            const callingCode = whatsappInput.current.getCallingCode();
            const countryCode = whatsappInput.current.getCountryCode()?.toLowerCase();
            const numberWithoutCode = text.replace(`+${callingCode}`, ''); // Remove country code

            setFormData((prev) => ({
                ...prev,
                whatsAppNumber: numberWithoutCode,
                whatsappCountryCode: `+${callingCode}`,
                whatsappIsoCode: countryCode,
            }));
        }
    };

    const handleSubmit = async() => {
        if (!formData.clientName || !formData.email || !formData.mobile) {
            Alert.alert('Error', 'All required fields must be filled!');
            return;
        }
    
        const isMobileValid = phoneInput.current?.isValidNumber(formData.mobile);
        if (!isMobileValid) {
            Alert.alert('Error', 'Please enter a valid Mobile Number!');
            return;
        }
    
        let requestBody = {
            clientName: formData.clientName,
            clientBillingEmail: formData.email,
            clientPhoneNumber: formData.mobile,
            phoneNumberCountryCode: formData.mobileCountryCode,
            phoneNumberIsoCode: formData.mobileIsoCode,
            orgId: "172"
        };
    
        
        if (formData.whatsAppNumber) {
            requestBody.clientWhatsappNumber = formData.whatsAppNumber;
            requestBody.whatsappNumberCountryCode = formData.whatsappCountryCode;
            requestBody.whatsappNumberIsoCode = formData.whatsappIsoCode;
        }
    
        const optionalFields = ["additionalEmail", "clientAccountName", "endClientName", "endClientEmail", "clientAddress"];
        const hasOptionalData = optionalFields.some(field => formData[field]);
    
        if (hasOptionalData) {
            optionalFields.forEach(field => {
                requestBody[field] = formData[field] || null;
            });
        }
    
        console.log('Request Body:', JSON.stringify(requestBody));
    
        try {
            const response = await fetch(`https://www.gatnix.com/api/v1/timesheet/172/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const responseData = await response.json(); 
    
            if (response.status === 201) {
                Alert.alert('Success', 'Client added successfully!');
    
                setFormData({
                    clientName: '',
                    email: '',
                    mobile: '',
                    mobileCountryCode: '',
                    mobileIsoCode: '',
                    whatsAppNumber: '',
                    whatsappCountryCode: '',
                    whatsappIsoCode: '',
                    additionalEmail: '',
                    clientAccountName: '',
                    endClientName: '',
                    endClientEmail: '',
                    clientAddress: '',
                });
    
                phoneInput.current?.setState({ number: '' });
                whatsappInput.current?.setState({ number: '' });
    
                navigation.navigate('ClientSuperadmin');
            } else {
                console.error('Error Response:', responseData);
                Alert.alert('Error', responseData.message || 'Something went wrong!');
            }
        } catch (error) {
            console.error('Network Error:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please try again later.');
        }
        
        
    };
    

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add Client</Text>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Client Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.clientName}
                        onChangeText={(text) => setFormData({ ...formData, clientName: text })}
                        placeholder="Enter client name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-Mail *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Enter email"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number *</Text>
                    <PhoneInput
                        ref={phoneInput}
                        defaultValue={formData.mobile}
                        defaultCode="IN"
                        layout="first"
                        onChangeFormattedText={handleMobileChange}
                        containerStyle={[styles.phoneContainer, styles.input]}
                        textContainerStyle={styles.phoneTextContainer}
                        textInputStyle={styles.phoneInputText}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>WhatsApp Number</Text>
                    <PhoneInput
                        ref={whatsappInput}
                        defaultValue={formData.whatsAppNumber}
                        defaultCode="IN"
                        layout="first"
                        onChangeFormattedText={handleWhatsAppChange}
                        containerStyle={[styles.phoneContainer, styles.input]}
                        textContainerStyle={styles.phoneTextContainer}
                        textInputStyle={styles.phoneInputText}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Additional Email</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.additionalEmail}
                        onChangeText={(text) => setFormData({ ...formData, additionalEmail: text })}
                        placeholder="Enter additional email"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Client Account Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.clientAccountName}
                        onChangeText={(text) => setFormData({ ...formData, clientAccountName: text })}
                        placeholder="Enter account name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>End Client Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.endClientName}
                        onChangeText={(text) => setFormData({ ...formData, endClientName: text })}
                        placeholder="Enter end client name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>End Client Email</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.endClientEmail}
                        onChangeText={(text) => setFormData({ ...formData, endClientEmail: text })}
                        placeholder="Enter end client email"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Client Address</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.clientAddress}
                        onChangeText={(text) => setFormData({ ...formData, clientAddress: text })}
                        placeholder="Enter address"
                        multiline
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Add Client</Text>
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
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 10, 
        fontSize: 16, 
        height: 48 // Ensuring uniform height
    },
    phoneContainer: { 
        height: 48, // Match the height of other input fields 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        alignItems: 'center' 
    },
    phoneTextContainer: { 
        backgroundColor: 'transparent', 
        height: 46, // Slightly less than container to fit inside
        borderRadius: 8 
    },
    phoneInputText: { 
        fontSize: 16, 
        paddingVertical: 0 // Remove extra spacing
    },
    textArea: { height: 60, textAlignVertical: 'top' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 30 },
    submitButton: { flex: 1, backgroundColor: '#F39237', padding: 15, borderRadius: 8, alignItems: 'center',marginRight: 10 },
    cancelButton: { backgroundColor: '#6c757d' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});


export default AddClients;
