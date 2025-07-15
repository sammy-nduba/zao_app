// components/AlertBanner/AlertBanner.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { spacing, fonts, colors } from '../../config/theme';

const AlertBanner = ({ alert }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="warning" size={24} color={colors.warning} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.alertTitle}>Alert: {alert.title}</Text>
        <Text style={styles.alertMessage}>{alert.message}</Text>
      </View>
      <TouchableOpacity style={styles.closeButton}>
        <MaterialIcons name="close" size={20} color={colors.gray} />
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // backgroundColor: colors.alertBackground,
    padding: spacing.medium,
    borderRadius: 10,
    marginHorizontal: spacing.large,
    marginVertical: spacing.medium,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: spacing.medium,
  },
  textContainer: {
    flex: 1,
  },
  alertTitle: {
    ...fonts.subtitleBold,
    color: colors.text,
    marginBottom: spacing.small,
  },
  alertMessage: {
    ...fonts.body,
    color: colors.textSecondary,
  },
  closeButton: {
    marginLeft: spacing.medium,
  },
});

export default AlertBanner;