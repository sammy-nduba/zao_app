import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import { colors } from '../../config/theme';

const ErrorScreen = ({ navigation, route }) => {
  // Get error from route params or use default
  const error = route?.params?.error || 'An unexpected error occurred';
  
  // Proper reload function for React Native
  const handleReload = () => {
    // Option 1: Reset navigation to initial route
    navigation.reset({
      index: 0,
      routes: [{ name: 'InitialRoute' }], // Replace with your initial route name
    });

    // Option 2: If using context/state to track errors, reset the error state
    // resetErrorState(); // You would need to implement this

    // Option 3: If the error is recoverable, navigate back
    // navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>Something Went Wrong</StyledText>
      <StyledText style={styles.message}>{error}</StyledText>
      <StyledButton
        title="Try Again"
        onPress={handleReload}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 16,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
});

export default ErrorScreen;