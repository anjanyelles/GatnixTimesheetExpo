import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OTPTime = ({navigation, color = 'black', selectedInterviewId, chatcode  }) => {
    const [remainingTime, setRemainingTime] = useState(180); // 3 minutes (180 seconds)

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
   
        return `${mins}m ${secs}s`;
    };
    useEffect(()=>{
        if(remainingTime === 0){

      
        navigation.navigate("SignInScreen", { screen: "SignInScreen" });
    }
    },[remainingTime])

    return (
        <View style={styles.container}>
            <Text style={[styles.timerText, { color }]}> 
                {remainingTime > 0 ? formatTime(remainingTime) : 'Time Expired'}
            </Text>
            {chatcode !== "GeneralChat" && selectedInterviewId && (
                <Text style={[styles.timerTextchatcode, { color }]}> 
                    Chat Code: {selectedInterviewId}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    timerText: {
        fontSize: 14,
        fontWeight: '300',
        textAlign: 'center',
    },
    timerTextchatcode: {
        fontSize: 13,
        fontWeight: '300',
        textAlign: 'center',
    },
});

export default OTPTime;
