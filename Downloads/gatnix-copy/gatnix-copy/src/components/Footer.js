import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text>© 2025 Timesheet App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: { padding: 10, backgroundColor: '#eee', alignItems: 'center' },
});

export default Footer;
