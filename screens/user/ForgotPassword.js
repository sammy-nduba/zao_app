import React, { useState, useMemo, useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { ScrollableMainContainer, StyledButton } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import { colors } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ForgotPasswordViewModel } from '../../viewModel/ForgotPasswordViewModel';
import container from '../../infrastructure/di/Container';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [containerError, setContainerError] = useState(null);
  const navigation = useNavigation();

  const viewModel = useMemo(() => {
    try {
      if (!container.isInitialized) {
        throw new Error('Container not initialized. Please wait.');
      }
      return new ForgotPasswordViewModel(
        container.get('resetPasswordUseCase'),
        container.get('validationService')
      );
    } catch (error) {
      console.error('ForgotPassword: Failed to initialize ViewModel:', error);
      setContainerError(error.message);
      return null;
    }
  }, []);

  useEffect(() => {
    if (containerError) {
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: containerError.includes('Container not initialized')
          ? 'App is still loading. Please wait or restart.'
          : `Failed to load: ${containerError}`,
      });
    }
  }, [containerError]);

  if (!viewModel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <StyledText style={styles.errorText}>
          {containerError || 'Initializing... Please wait.'}
        </StyledText>
      </View>
    );
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    setEmailError('');
    try {
      const result = await viewModel.requestResetPassword(email);
      console.log('ForgotPassword result:', result);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: result.message,
        });
        navigation.navigate('OTPScreen', { email, token: result.token });
      } else {
        setEmailError(result.error);
        Toast.show({
          type: 'error',
          text1: 'Failed to Send OTP',
          text2: result.error.includes('404')
            ? 'Email not found.'
            : result.error.includes('network') || result.error.includes('timeout')
            ? 'Network error. Please check your connection.'
            : result.error,
        });
      }
    } catch (error) {
      console.error('ForgotPassword error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector 1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Forgot Password</StyledText>
        <StyledText style={styles.subtitle}>
          Enter your email address to receive a 5-digit OTP
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Email address</StyledText>
          <StyledTextInput
            placeholder="Enter email address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
              viewModel.updateFormData('email', text);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, emailError ? styles.inputError : null]}
          />
          {emailError ? (
            <StyledText style={styles.errorText}>{emailError}</StyledText>
          ) : null}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Send OTP"
          onPress={handleSubmit}
          disabled={isLoading || !email || !!emailError}
          style={styles.submitButton}
        />
      </View>
      <Toast />
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
    
  },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  vector1: {
    position: 'absolute',
    width: 130,
    height: 128,
    top: 100,
    left: 250,
    opacity: 0.1,
    transform: [{ rotate: '-161.18deg' }],
  },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    top: 300,
    left: 200,
    opacity: 0.05,
  },
  header: {
    marginTop: 75,
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
    width: '100%',
  },
  inputLabel: {
    fontFamily: 'Roboto',
    fontSize: 16,
    marginBottom: 8,
    color: colors.grey[600],
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ForgotPassword;