import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../config/styles/ZaoAIStyles';

export const CapabilityCard = ({ title, description }) => {
  return (
    <View style={styles.capabilityCard}>
      <Text style={styles.capabilityTitle}>{title}</Text>
      <Text style={styles.capabilityDescription}>{description}</Text>
    </View>
  );
};