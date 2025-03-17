import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import { registerApprovalManager } from '../aftherlogin';



const AddApprovalManager = () => {
    const phoneInput = useRef(null);
    const whatsappInput = useRef(null);
   
   
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        mobile: '',
        mobileCountryCode: '',
        mobileIsoCode: '',
        whatsAppNumber: '',
        whatsappCountryCode: '',
        whatsappIsoCode: '',
        loginStatus: true
    });

    const navigation = useNavigation();


    
    
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
    
    
    


    const handleSubmit = async () => {
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.mobile ||
            !formData.whatsAppNumber
        ) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }
    
        const isMobileValid = phoneInput.current?.isValidNumber(formData.mobile);
        const isWhatsappValid = whatsappInput.current?.isValidNumber(formData.whatsAppNumber);
    
        console.log('Mobile Number:', formData.mobile);
        console.log('Mobile Valid:', isMobileValid);
        console.log('WhatsApp Number:', formData.whatsAppNumber);
        console.log('WhatsApp Valid:', isWhatsappValid);
    
        if (!isMobileValid) {
            Alert.alert('Error', 'Please enter a valid Mobile Number!');
            return;
        }
    
        if (!isWhatsappValid) {
            Alert.alert('Error', 'Please enter a valid WhatsApp Number!');
            return;
        }
    
        try {
            console.log('Submitting Employee Data:', JSON.stringify(formData));
    
            const response = await registerApprovalManager(formData);
            console.log('API Response:', response);
    
            if (response) {
                Alert.alert('Success', ' Manager Added  successfully!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    mobile: '',
                    mobileCountryCode: '',
                    mobileIsoCode: '',
                    whatsAppNumber: '',
                    whatsappCountryCode: '',
                    whatsappIsoCode: '',
                    loginStatus: true
                });
            
                phoneInput.current?.setState({ number: '' }); 
                whatsappInput.current?.setState({ number: '' }); 
                navigation.navigate('ApprovalManager');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            Alert.alert('Error', 'Failed to register employee. Please try again.');
        }
    };
    
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Add Approval Manager Details</Text>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.firstName}
                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                        placeholder="Enter first name"
                    />
                </View>
                

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.lastName}
                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                        placeholder="Enter last name"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Enter email"
                        keyboardType="email-address"

                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })} // Fixed from email to password
                        placeholder="Enter Password"
                        secureTextEntry={true} // Add this for password masking
                    />
                </View>



                <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number</Text>
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




                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Add Employee</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.submitButton, styles.cancelButton]}
                        onPress={() => {
                        
                            phoneInput.current?.setState({ number: '' }); 
                            whatsappInput.current?.setState({ number: '' }); 
                            setFormData('')
                            navigation.navigate('ApprovalManager')
                        }}
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
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 20,
        marginBottom: 40,
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#F39237',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    phoneContainer: {
        width: '100%',
        height: 50,
    },
    phoneTextContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    phoneInputText: {
        height: 40,
        fontSize: 16,
    }
});

export default AddApprovalManager;