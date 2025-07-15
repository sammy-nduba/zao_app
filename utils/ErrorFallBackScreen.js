import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorFallbackScreen = ({ error }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Something went wrong</Text>
    <Text style={styles.message}>{error}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  message: { fontSize: 16, color: 'gray', textAlign: 'center' },
});

export default ErrorFallbackScreen;
