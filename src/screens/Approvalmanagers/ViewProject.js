import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const ViewProject = ({ route }) => {
    const { projectId } = route.params;
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            getProjectDetailsById()
        }, [])
    )

    const getProjectDetailsById = async () => {
        setLoading(true)
      try{
        const response = await fetch(`https://www.gatnix.com/api/v1/timesheet/172/project/id/23`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        const data = await response.json(); 

        console.log("project data is :",data)
      }catch(err){
        console.log(err)
      }
      finally{
        setLoading(false)
      }
    }

    return (
        <>

{loading && (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    )}
            <View style={styles.container}>
                <Text style={styles.title}>Project ID: {projectId}</Text>

            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    loaderContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.3)", 
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999, 
      },
});

export default ViewProject;