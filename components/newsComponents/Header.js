import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ title, onBack, onNotification }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Text style={styles.backArrow}>←</Text>
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity onPress={onNotification} style={styles.notificationButton}>
      <Text style={styles.notificationIcon}>🔔</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 20,
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 18,
  },
});

export default Header;