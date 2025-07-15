// src/screens/OTPScreen.js
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScrollableMainContainer, StyledButton } from '../../components';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import StyledText from '../../components/Texts/StyledText';
import { colors } from '../../config/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ForgotPasswordViewModel } from '../../viewModel/ForgotPasswordViewModel';
import container from '../../infrastructure/di/Container';

const OTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [otpError, setOtpError] = useState('');
  const [containerError, setContainerError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { email, token } = route.params; // Token from requestResetPassword
  const inputRefs = useRef([]);

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
      console.error('OTPScreen: Failed to initialize ViewModel:', error);
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

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

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

  const handleOtpChange = (value, index) => {
    if (isNaN(value) && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');
    viewModel.updateFormData('otp', value, index);

    if (value && index < 4) {
      inputRefs.current[index + 1].focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setOtpError('');
    try {
      const enteredOTP = otp.join('');
      const result = await viewModel.verifyOtp(email, enteredOTP);
      console.log('OTPScreen result:', result);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: result.message,
        });
        navigation.navigate('NewPasswordScreen', { email, resetToken: result.resetToken });
      } else {
        setOtpError(result.error);
        Toast.show({
          type: 'error',
          text1: 'OTP Verification Failed',
          text2: result.error.includes('401')
            ? 'Invalid or expired OTP.'
            : result.error.includes('network') || result.error.includes('timeout')
            ? 'Network error. Please check your connection.'
            : result.error,
        });
      }
    } catch (error) {
      console.error('OTPScreen error:', error);
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

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setResendCooldown(30);
    try {
      const result = await viewModel.requestResetPassword(email);
      console.log('Resend OTP result:', result);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'OTP Resent',
          text2: result.message,
        });
        navigation.setParams({ token: result.token });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Resend OTP',
          text2: result.error.includes('404')
            ? 'Email not found.'
            : result.error.includes('network') || result.error.includes('timeout')
            ? 'Network error. Please check your connection.'
            : result.error,
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
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
        <StyledText style={styles.title}>Enter OTP</StyledText>
        <StyledText style={styles.subtitle}>
          Enter the 5-digit code sent to {email}
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <StyledTextInput
              key={index}
              placeholder="0"
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="numeric"
              maxLength={1}
              style={[styles.otpInput, otpError ? styles.inputError : null]}
              ref={(ref) => (inputRefs.current[index] = ref)}
              autoFocus={index === 0}
            />
          ))}
        </View>
        {otpError ? (
          <StyledText style={styles.errorText}>{otpError}</StyledText>
        ) : null}
        <View style={styles.resendContainer}>
          <StyledText style={styles.resendText}>Didn't receive the code? </StyledText>
          <TouchableOpacity onPress={handleResend} disabled={resendCooldown > 0 || isLoading}>
            <StyledText
              style={[
                styles.resendLink,
                resendCooldown > 0 || isLoading ? styles.resendLinkDisabled : null,
              ]}
            >
              Resend {resendCooldown > 0 ? `(${resendCooldown}s)` : ''}
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Verify OTP"
          onPress={handleSubmit}
          disabled={isLoading || otp.some((digit) => !digit)}
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  resendText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.grey[600],
  },
  resendLink: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.primary[600],
    fontWeight: 'bold',
  },
  resendLinkDisabled: {
    color: colors.grey[300],
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

export default OTPScreen;