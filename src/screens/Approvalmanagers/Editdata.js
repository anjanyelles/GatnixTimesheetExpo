import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Alert ,ActivityIndicator } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

const EditData = ({ route }) => {
    const navigation = useNavigation()

    const getId  = route.params.id
    console.log("employee id from the employee",getId)
    const phoneInput = useRef(null);

    const whatsappInput = useRef(null);
    const [mobileError, setMobileError] = useState('');
    const [whatsappError, setWhatsappError] = useState('');
    const [loading,setLoading] = useState(true);

    const [formData, setFormData] = useState({})

    useEffect(() => {
        fetchEmployeeDetailsById(getId);
    }, [getId]); // Add getId as a dependency to prevent stale values
    
    const fetchEmployeeDetailsById = async (getId) => {
        try {
            const response = await fetch(`https://www.gatnix.com/api/v1/org-user-association/172/userId/${getId}/associatedRole/employee`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
    
            const data = await response.json(); 
            console.log("response by id ", data);
            setFormData(data);  
    
        } catch (error) {
            console.error("Error fetching employee details:", error);
        }
        finally{
            setLoading(false);
        }
    };
    




    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };


    // Update the handleMobileChange function
    const handleMobileChange = (text) => {
        if (!phoneInput.current) return;

        try {
            const callingCode = phoneInput.current.getCallingCode() || '91';
            const isoCode = phoneInput.current.getCountryCode()?.toUpperCase() || 'IN';

            // Only clean the number once
            const cleanNumber = text.replace(new RegExp(`^\\+${callingCode}`), '').trim();

            setFormData(prev => ({
                ...prev,
                mobile: cleanNumber,
                mobileCountryCode: `+${callingCode}`,
                mobileIsoCode: isoCode
            }));

            console.log('Mobile updated:', {
                number: cleanNumber,
                countryCode: callingCode,
                isoCode: isoCode
            });
        } catch (error) {
            console.error('Error in handleMobileChange:', error);
        }
    };

    const handleWhatsAppChange = (text) => {
        if (!whatsappInput.current) return;

        try {
            const callingCode = whatsappInput.current.getCallingCode() || '91';
            const isoCode = whatsappInput.current.getCountryCode()?.toUpperCase() || 'IN';

            // Remove the country code from the number if present
            const cleanNumber = text.replace(new RegExp(`^\\+${callingCode}`), '').trim();

            setFormData(prev => ({
                ...prev,
                whatsapp: cleanNumber,
                whatsappCountryCode: `+${callingCode}`,
                whatsappIsoCode: isoCode
            }));

            console.log('WhatsApp updated:', {
                number: cleanNumber,
                countryCode: callingCode,
                isoCode: isoCode
            });
        } catch (error) {
            console.error('Error in handleWhatsAppChange:', error);
        }
    };


    const handleSave = () => {
        const isMobileValid = phoneInput.current?.isValidNumber(formData.mobile);
        const isWhatsappValid = whatsappInput.current?.isValidNumber(formData.whatsapp);

        if (!isMobileValid) {
            setMobileError('Invalid mobile number');
        } 
        else {
            setMobileError(''); }

        if (!isWhatsappValid) {
            setWhatsappError('Invalid WhatsApp number');
        } 
        else {      
            setWhatsappError(''); }

        if (!isMobileValid || !isWhatsappValid) {
            Alert.alert('Validation Error', 'Please enter valid phone numbers.');
            return;
        }

        console.log('Updated Data:', formData);
        Alert.alert('Success', 'Data saved successfully!');
    };

    return (
    
        
        loading ?  (
            <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
          ) 
          :
       
          ( <View style={styles.container}>
        <Text style={styles.label}>Edit Data</Text>



        <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                placeholder="Enter First Name"
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                placeholder="Enter Last Name"
            />
        </View>


        // Update both PhoneInput components
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <PhoneInput
                ref={phoneInput}
                key={`mobile-${formData.mobileIsoCode}`}
                value={formData.mobile}
                defaultValue={formData.mobile}
                defaultCode={formData.mobileIsoCode || 'IN'}
                layout="first"
                onChangeFormattedText={handleMobileChange}
                containerStyle={[styles.phoneContainer, styles.input]}
                textContainerStyle={styles.phoneTextContainer}
                textInputStyle={styles.phoneInputText}
                flagButtonStyle={styles.flagButton}
                countryPickerButtonStyle={styles.countryButton}
                withDarkTheme
                autoFocus={false}
                keyboardType="numeric"
                textInputProps={{
                    returnKeyType: 'done',
                    blurOnSubmit: true,
                    selectTextOnFocus: false
                }}
            />
             {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
        </View>


        <View style={styles.inputGroup}>
            <Text style={styles.label}>WhatsApp Number</Text>
            <PhoneInput
                ref={whatsappInput}
                key={`whatsapp-${formData.whatsappIsoCode}`} // Ensures re-rendering
                value={formData.whatsapp}
                defaultValue={formData.whatsapp}
                defaultCode={formData.whatsappIsoCode || 'IN'}
                layout="first"
                onChangeFormattedText={handleWhatsAppChange}
                containerStyle={[styles.phoneContainer, styles.input]}
                textContainerStyle={styles.phoneTextContainer}
                textInputStyle={styles.phoneInputText}
                flagButtonStyle={styles.flagButton}
                countryPickerButtonStyle={styles.countryButton}
                withDarkTheme
                autoFocus={false}
                keyboardType="numeric"
                textInputProps={{
                    returnKeyType: 'done',
                    blurOnSubmit: true,
                    selectTextOnFocus: false
                }}
            />
             {whatsappError ? <Text style={styles.errorText}>{whatsappError}</Text> : null}
        </View>


        <View style={{ marginBottom: 20 }}>
            <Button title="Save" onPress={handleSave} />
        </View>


        <Button
            title="Back"
            onPress={() => {
                navigation.navigate('Employee', { viewEmployee: null });
            }}
        />

    </View>
    )
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
    },
    inputGroup: {
        marginBottom: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    phoneContainer: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
    },
    phoneTextContainer: {
        backgroundColor: 'transparent',
        paddingVertical: 0,
        borderRadius: 5,
        height: 48 
    },
    phoneInputText: {
        fontSize: 16,
        height: 40,
        padding: 0
    },
    flagButton: {
        borderRightWidth: 1,
        borderRightColor: 'gray',
        height: '100%',
        justifyContent: 'center'
    },
    countryButton: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        textAlign:'center',
        marginTop: 4,
        marginLeft: 5
    }
    
});

export default EditData;
