// src/screens/EmailVerification.js
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { ScrollableMainContainer } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import container from '../../infrastructure/di/Container';
import { EmailVerificationViewModel } from '../../viewModel/EmailVerificationViewModel';

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [userData, setUserData] = useState(null);
  const { setIsVerified, setIsRegistered, setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();

  const viewModel = useMemo(() => {
    try {
      if (!container.isInitialized) {
        throw new Error('Container not initialized. Please wait.');
      }
      return new EmailVerificationViewModel(container.get('registerUserUseCase'));
    } catch (error) {
      console.error('EmailVerification: Failed to initialize ViewModel:', error);
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: error.message.includes('Container not initialized')
          ? 'App not fully initialized. Please restart.'
          : `Failed to load verification: ${error.message}`,
      });
      return null;
    }
  }, []);

  // Handle route params and deep links
  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      console.log('Deep link received:', url);
      if (url) {
        try {
          const urlObj = new URL(url);
          const tokenFromUrl = urlObj.searchParams.get('token');
          const emailFromUrl = urlObj.searchParams.get('email');
          console.log('Extracted from deep link:', { tokenFromUrl, emailFromUrl });
          if (tokenFromUrl && emailFromUrl) {
            setToken(tokenFromUrl);
            setEmail(emailFromUrl);
            setUserData({}); // No userData from deep link
          } else {
            console.error('Missing token or email in deep link:', url);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Invalid verification link. Please check the email link or resend verification.',
            });
          }
        } catch (error) {
          console.error('Deep link parsing error:', error);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to process verification link.',
          });
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    if (route.params?.token && route.params?.email) {
      console.log('Route params:', route.params);
      setToken(route.params.token);
      setEmail(route.params.email);
      setUserData({
        firstName: route.params.firstName,
        lastName: route.params.lastName,
        phoneNumber: route.params.phoneNumber,
      });
    }

    return () => Linking.removeAllListeners('url');
  }, [route.params]);

  // Trigger verification after token and email are set
  useEffect(() => {
    if (viewModel && token && email && !isLoading) {
      handleVerify(token);
    }
  }, [viewModel, token, email]);

  const handleVerify = async (verifyToken) => {
    if (!viewModel || !verifyToken || !email) {
      console.error('Missing viewModel, token, or email:', { viewModel, verifyToken, email });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Verification token or email missing, or app not ready.',
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log('Verifying email with token:', verifyToken);
      const result = await viewModel.verifyEmail(verifyToken);
      console.log('Verification result:', result);
      if (result.success) {
        await AsyncStorage.setItem('jwtToken', result.user.token);
        setIsVerified(true);
        setIsRegistered(true);
        setUser({
          id: result.user.id,
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: result.user.email,
          phoneNumber: userData?.phoneNumber || '',
          token: result.user.token,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Email verified! Please set up your farm details.',
        });
        navigation.navigate('FarmDetails');
      } else {
        console.error('Verification failed:', result.error);
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: result.error,
        });
      }
    } catch (error) {
      console.error('Verification error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!viewModel || !email) {
      console.error('Missing viewModel or email:', { viewModel, email });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email address missing or app not ready.',
      });
      return;
    }
    setIsLoading(true);
    try {
      console.log('Resending verification for:', email);
      const result = await viewModel.resendVerification(email);
      console.log('Resend verification result:', result);
      if (result.success) {
        setToken(result.token);
        Toast.show({
          type: 'success',
          text1: 'Verification Email Resent',
          text2: result.message,
        });
      } else {
        console.error('Resend verification failed:', result.error);
        Toast.show({
          type: 'error',
          text1: 'Resend Failed',
          text2: result.error,
        });
      }
    } catch (error) {
      console.error('Resend verification error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!viewModel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <StyledText style={styles.errorText}>
          Failed to initialize verification. Please restart the app.
        </StyledText>
      </View>
    );
  }

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <StyledText style={styles.title}>Verify Your Email</StyledText>
        <StyledText style={styles.subtitle}>
          {isLoading
            ? 'Verifying your email...'
            : token
            ? 'Processing email verification...'
            : `A verification link has been sent to ${email || 'your email'}. Please click the link or use the button below to resend.`}
        </StyledText>
      </View>
      <View style={styles.buttonContainer}>
        <StyledButton
          title="Retry Verification"
          onPress={() => handleVerify(token)}
          disabled={isLoading || !token || !email}
          style={styles.verifyButton}
        />
        <StyledButton
          title="Resend Verification Email"
          onPress={handleResendVerification}
          disabled={isLoading || !email}
          style={styles.verifyButton}
        />
        <StyledButton
          title="Back to Register"
          onPress={() => navigation.navigate('Register')}
          disabled={isLoading}
          style={[styles.verifyButton, styles.backButton]}
        />
      </View>
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 200,
    marginBottom: 300,
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
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
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  verifyButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: colors.grey[300],
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EmailVerification;