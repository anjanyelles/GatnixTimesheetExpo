import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomToolbar = ({ navigation }) => {
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Icon name="home-outline" size={24} color="#333" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Timesheet')}>
        <Icon name="time-outline" size={24} color="#333" />
        <Text style={styles.label}>Timesheet</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert('Profile Clicked')}>
        <Icon name="person-outline" size={24} color="#333" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  label: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
});

export default BottomToolbar;
