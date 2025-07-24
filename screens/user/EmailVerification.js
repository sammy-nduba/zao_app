import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Linking, Image } from 'react-native';
import { ScrollableMainContainer } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { useAuth } from '../../utils/AuthContext';
import { useContainer } from '../../utils/ContainerProvider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { EmailVerificationViewModel } from '../../viewModel/EmailVerificationViewModel';

const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch (error) {
    console.log('Basic JWT decoding failed, returning minimal payload');
    return { _id: '', name: '', email: '', phone: '' };
  }
};

const EmailVerification = () => {
  const { authState, setUser, setIsVerified, setIsLoggedIn, setIsRegistrationComplete } = useAuth();
  const { container, isReady } = useContainer();
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);

  const viewModel = useMemo(() => {
    if (!isReady) {
      console.log('EmailVerification: Container not ready yet');
      return null;
    }
    try {
      return new EmailVerificationViewModel(container.get('registerUserUseCase'));
    } catch (error) {
      console.error('EmailVerification: Failed to initialize ViewModel:', error);
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: 'Please restart the app',
      });
      return null;
    }
  }, [container, isReady]);

  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      console.log('EmailVerification: Deep link received:', url);
      if (!url || url.includes('exp+zao://')) return;

      try {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get('token');
        const email = urlObj.searchParams.get('email');
        console.log('EmailVerification: Extracted from deep link:', { token, email });

        if (token && email) {
          await handleVerify(token, email);
        } else {
          console.error('EmailVerification: Missing token or email in deep link:', url);
          Toast.show({
            type: 'error',
            text1: 'Invalid Link',
            text2: 'The verification link is missing required parameters',
          });
        }
      } catch (error) {
        console.error('EmailVerification: Deep link handling error:', error);
        Toast.show({
          type: 'error',
          text1: 'Invalid Link',
          text2: 'The verification link appears to be invalid',
        });
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => url && handleDeepLink({ url }));

    // Handle route params
    if (route.params?.token && route.params?.email) {
      console.log('EmailVerification: Route params received:', route.params);
      handleVerify(route.params.token, route.params.email);
    }

    return () => Linking.removeAllListeners('url');
  }, [route.params]);

  const handleVerify = async (verificationToken, verificationEmail) => {
    if (!viewModel || !verificationToken || !verificationEmail) {
      console.error('EmailVerification: Missing viewModel, token, or email');
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: 'Missing required information',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await viewModel.verifyEmail(verificationToken);
      console.log('EmailVerification: Verify email response:', result);

      if (!result.success || !result.token) {
        throw new Error(result.message || 'Verification failed');
      }

      let userData = {};
      let message = result.message || 'Account created successfully!';
      if (result.user) {
        userData = result.user;
      } else {
        userData = {
          id: result.userId || '',
          email: result.email || verificationEmail,
          token: result.token,
          firstName: result.firstName,
          lastName: result.lastName,
          phoneNumber: result.phone,
        };
      }

      if (!userData.token) {
        throw new Error('No token received');
      }

      const decoded = decodeToken(userData.token);
      console.log('EmailVerification: Decoded token:', decoded);

      const updatedUser = {
        id: userData.id || decoded._id || '',
        firstName: userData.firstName || decoded.name?.split(' ')[0] || decoded.firstName || '',
        lastName: userData.lastName || decoded.name?.split(' ')[1] || decoded.lastName || '',
        email: userData.email || verificationEmail || '',
        phoneNumber: userData.phoneNumber || decoded.phone || '',
        token: userData.token,
        isVerified: true,
      };

      console.log('EmailVerification: Final user object:', updatedUser);

      await setUser(updatedUser);
      await setIsVerified(true);
      await setIsLoggedIn(true);

      // Navigate based on registration status
      const targetScreen = authState.isRegistrationComplete ? 'MainTabs' : 'FarmDetails';
      console.log(`EmailVerification: Verification successful, navigating to ${targetScreen}`);
      navigation.replace(targetScreen);

      Toast.show({
        type: 'success',
        text1: 'Email Verified!',
        text2: message,
      });
    } catch (error) {
      console.error('EmailVerification: Verification failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: error.message,
      });
      navigation.navigate('Error', { error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!viewModel || !authState.user?.email) {
      console.error('EmailVerification: Missing viewModel or email');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email address is required',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await viewModel.resendVerification(authState.user.email);
      console.log('EmailVerification: Resend verification result:', result);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Email Resent',
          text2: result.message || 'A new verification link has been sent to your email',
        });
      } else {
        throw new Error(result.error || 'Failed to resend email');
      }
    } catch (error) {
      console.error('EmailVerification: Resend verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Could not resend verification email',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!viewModel || !authState.user?.email) {
      console.error('EmailVerification: Missing viewModel or email');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email address is required',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await viewModel.checkVerificationStatus(authState.user.email);
      console.log('EmailVerification: Check verification status result:', response);
      if (response.isVerified) {
        await setIsVerified(true);
        await setIsLoggedIn(true);
        const targetScreen = authState.isRegistrationComplete ? 'MainTabs' : 'FarmDetails';
        console.log(`EmailVerification: Check verification successful, navigating to ${targetScreen}`);
        navigation.replace(targetScreen);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Not Verified',
          text2: 'Please click the verification link in your email',
        });
      }
    } catch (error) {
      console.error('EmailVerification: Check verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Check Failed',
        text2: error.message || 'Could not check verification status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!viewModel || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <StyledText style={styles.errorText}>
          App initialization failed. Please restart.
        </StyledText>
      </View>
    );
  }

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector 1.png')} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.content}>
        <MaterialCommunityIcons
          name={authState.isVerified ? 'check-circle' : 'email'}
          size={72}
          color={authState.isVerified ? colors.primary[600] : colors.grey[500]}
        />
        <StyledText style={styles.title}>
          {authState.isVerified ? 'Email Verified!' : 'Verify Your Email'}
        </StyledText>
        <StyledText style={styles.subtitle}>
          {authState.isVerified
            ? 'Your email has been successfully verified'
            : `We've sent a verification link to ${authState.user?.email || 'your email'}`}
        </StyledText>
        {isLoading && <ActivityIndicator size="large" color={colors.primary[600]} />}
      </View>

      <View style={styles.buttonContainer}>
        {!authState.isVerified ? (
          <>
            <StyledButton
              title="Resend Verification Email"
              onPress={handleResendVerification}
              disabled={isLoading || !authState.user?.email}
              style={styles.primaryButton}
            />
            <StyledButton
              title="Check Verification Status"
              onPress={handleCheckVerification}
              disabled={isLoading || !authState.user?.email}
              style={styles.checkButton}
            />
            <StyledButton
              title="Back to Register"
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
              style={styles.secondaryButton}
            />
          </>
        ) : (
          <StyledButton
            title="Continue"
            onPress={() => {
              const targetScreen = authState.isRegistrationComplete ? 'MainTabs' : 'FarmDetails';
              console.log(`EmailVerification: Continue button pressed, navigating to ${targetScreen}`);
              navigation.replace(targetScreen);
            }}
            disabled={isLoading}
            style={styles.primaryButton}
          />
        )}
      </View>
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
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
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: 217,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginVertical: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
    marginBottom: 12,
  },
  checkButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.secondary,
    marginBottom: 12,
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.grey[300],
    marginBottom: 12,
  },
  errorText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EmailVerification;