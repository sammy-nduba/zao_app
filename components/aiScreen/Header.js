import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../config/styles/ZaoAIStyles';

export const Header = ({ title, onBackPress, onNotificationPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Icon name="arrow-back" size={24} color="#1F2937" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
        <Icon name="notifications-none" size={24} color="#1F2937" />
      </TouchableOpacity>
    </View>
  );
};