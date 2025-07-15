import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from '../components/Texts/StyledText';
import { colors } from '../config/theme'
import { MaterialIcons } from '@expo/vector-icons';


console.log("Authentication Error:", StyledText)

const AuthError = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <View style={styles.container}>
      <View style={styles.errorContent}>
        <MaterialIcons name="error-outline" size={24} color={colors.error} />
        <StyledText style={styles.errorText}>{error}</StyledText>
      </View>
      
      <View style={styles.buttonContainer}>
        {onRetry && (
          <TouchableOpacity onPress={onRetry} style={[styles.button, styles.retryButton]}>
            <StyledText style={styles.buttonText}>Try Again</StyledText>
          </TouchableOpacity>
        )}
        
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={[styles.button, styles.dismissButton]}>
            <StyledText style={styles.buttonText}>Dismiss</StyledText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: colors.errorBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: colors.errorLight,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: colors.error,
    marginLeft: 10,
    flex: 1,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  retryButton: {
    backgroundColor: colors.primary[600],
  },
  dismissButton: {
    backgroundColor: colors.grey[300],
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthError;