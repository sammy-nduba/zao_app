import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertCard = ({ alert }) => (
  <View style={styles.alertContainer}>
    <View style={styles.alertIcon}>
      <Text style={styles.alertIconText}>🔔</Text>
    </View>
    <View style={styles.alertContent}>
      <Text style={styles.alertTitle}>Alert: {alert.title}</Text>
      <Text style={styles.alertMessage}>{alert.message}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  alertIcon: {
    marginRight: 15,
  },
  alertIconText: {
    fontSize: 24,
    color: '#F44336',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: '#B71C1C',
  },
});

export default AlertCard;