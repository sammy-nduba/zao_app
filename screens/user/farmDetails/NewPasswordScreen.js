// src/screens/NewPasswordScreen.js
import React, { useState, useMemo, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollableMainContainer, StyledButton } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import { colors } from '../../config/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ForgotPasswordViewModel } from '../../viewModel/ForgotPasswordViewModel';
import container from '../../infrastructure/di/Container';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NewPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [containerError, setContainerError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { email, resetToken } = route.params;

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
      console.error('NewPasswordScreen: Failed to initialize ViewModel:', error);
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
    setPasswordError('');
    setConfirmPasswordError('');
    try {
      if (newPassword !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        Toast.show({
          type: 'error',
          text1: 'Password Mismatch',
          text2: 'Passwords do not match',
        });
        return;
      }
      const result = await viewModel.resetPassword(email, resetToken, newPassword);
      console.log('NewPasswordScreen result:', result);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset',
          text2: result.message,
        });
        navigation.replace('Login');
      } else {
        setPasswordError(result.error);
        Toast.show({
          type: 'error',
          text1: 'Password Reset Failed',
          text2: result.error.includes('401')
            ? 'Invalid or expired OTP.'
            : result.error.includes('network') || result.error.includes('timeout')
            ? 'Network error. Please check your connection.'
            : result.error,
        });
      }
    } catch (error) {
      console.error('NewPasswordScreen error:', error);
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
        <StyledText style={styles.title}>Set New Password</StyledText>
        <StyledText style={styles.subtitle}>
          Enter your new password for {email}
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>New Password</StyledText>
          <View style={styles.passwordInputContainer}>
            <StyledTextInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                setPasswordError('');
                viewModel.updateFormData('newPassword', text);
              }}
              secureTextEntry={!showPassword}
              style={[styles.input, passwordError ? styles.inputError : null]}
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.placeholder}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <StyledText style={styles.errorText}>{passwordError}</StyledText>
          ) : null}
        </View>

        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Confirm Password</StyledText>
          <StyledTextInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError('');
            }}
            secureTextEntry={!showPassword}
            style={[styles.input, confirmPasswordError ? styles.inputError : null]}
          />
          {confirmPasswordError ? (
            <StyledText style={styles.errorText}>{confirmPasswordError}</StyledText>
          ) : null}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Reset Password"
          onPress={handleSubmit}
          disabled={isLoading || !newPassword || !confirmPassword || !!passwordError || !!confirmPasswordError}
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
  passwordInputContainer: {
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 2,
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

export default NewPasswordScreen;