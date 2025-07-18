import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Linking, Image } from 'react-native';
import { ScrollableMainContainer } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import container from '../../infrastructure/di/Container';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setLocalIsVerified] = useState(false);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const { user, setUser, setIsVerified, setIsLoggedIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();

  const viewModel = useMemo(() => {
    try {
      if (!container.isInitialized) {
        throw new Error('Container not initialized');
      }
      return new EmailVerificationViewModel(container.get('registerUserUseCase'));
    } catch (error) {
      console.error('Failed to initialize ViewModel:', error);
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: 'Please restart the app',
      });
      return null;
    }
  }, []);

  useEffect(() => {
    const loadPersistedState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('zao_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.isVerified) {
            setUser(parsedUser);
            setIsVerified(true);
            setIsLoggedIn(true);
            setLocalIsVerified(true);
            console.log('Restored verified user from AsyncStorage:', parsedUser);
            navigation.replace('FarmDetails');
          }
        }
      } catch (error) {
        console.error('Failed to load persisted user state:', error);
      }
    };
    loadPersistedState();
  }, [navigation, setUser, setIsVerified, setIsLoggedIn]);

  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      console.log('Deep link received:', url);
      if (!url || url.includes('exp+zao://')) return; // Ignore Expo links

      try {
        const urlObj = new URL(url);
        const tokenFromUrl = urlObj.searchParams.get('token');
        const emailFromUrl = urlObj.searchParams.get('email');
        console.log('Extracted from deep link:', { token: tokenFromUrl, email: emailFromUrl });

        if (tokenFromUrl && emailFromUrl) {
          setEmail(emailFromUrl);
          setToken(tokenFromUrl);
          await handleVerify(tokenFromUrl, emailFromUrl);
        } else {
          console.error('Missing token or email in deep link:', url);
          Toast.show({
            type: 'error',
            text1: 'Invalid Link',
            text2: 'The verification link is missing required parameters',
          });
        }
      } catch (error) {
        console.error('Deep link handling error:', error);
        Toast.show({
          type: 'error',
          text1: 'Invalid Link',
          text2: 'The verification link appears to be invalid',
        });
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => url && handleDeepLink({ url }));

    if (route.params?.token && route.params?.email) {
      console.log('Route params received:', route.params);
      setToken(route.params.token);
      setEmail(route.params.email);
    }

    return () => Linking.removeAllListeners('url');
  }, [route.params]);

  const handleVerify = async (verificationToken, verificationEmail) => {
    if (!viewModel || !verificationToken || !verificationEmail) {
      console.error('Missing viewModel, token, or email');
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
      console.log('Verify email response:', result);

      if (!result.success && !result.token) {
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
      console.log('Decoded token:', decoded);

      const updatedUser = {
        id: userData.id || decoded._id || '',
        firstName: userData.firstName || decoded.name?.split(' ')[0] || decoded.firstName || '',
        lastName: userData.lastName || decoded.name?.split(' ')[1] || decoded.lastName || '',
        email: userData.email || verificationEmail || '',
        phoneNumber: userData.phoneNumber || decoded.phone || '',
        token: userData.token,
        isVerified: true,
      };

      console.log('Final user object:', updatedUser);

      await AsyncStorage.multiSet([
        ['zao_jwtToken', userData.token],
        ['zao_user', JSON.stringify(updatedUser)],
      ]);
      setUser(updatedUser);
      setIsVerified(true);
      setIsLoggedIn(true);
      setLocalIsVerified(true);

      console.log('Verification successful, navigating to FarmDetails');
      navigation.replace('FarmDetails');

      Toast.show({
        type: 'success',
        text1: 'Email Verified!',
        text2: message,
      });
    } catch (error) {
      console.error('Verification failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!viewModel || !email) {
      console.error('Missing viewModel or email');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email address is required',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await viewModel.resendVerification(email);
      console.log('Resend verification result:', result);
      if (result.success) {
        setToken(result.token);
        Toast.show({
          type: 'success',
          text1: 'Email Resent',
          text2: result.message || 'A new verification link has been sent to your email',
        });
      } else {
        throw new Error(result.error || 'Failed to resend email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
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
    if (!viewModel || !email) {
      console.error('Missing viewModel or email');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Email address is required',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await viewModel.checkVerificationStatus(email);
      console.log('Check verification status result:', response);
      if (response.isVerified) {
        await handleVerify(response.token || token, email);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Not Verified',
          text2: 'Please click the verification link in your email',
        });
      }
    } catch (error) {
      console.error('Check verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Check Failed',
        text2: error.message || 'Could not check verification status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToFarmDetails = () => {
    if (isVerified) {
      console.log('Continue button pressed, navigating to FarmDetails');
      navigation.replace('FarmDetails');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Not Verified',
        text2: 'Please verify your email first',
      });
    }
  };

  if (!viewModel) {
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
          name={isVerified ? 'check-circle' : 'email'}
          size={72}
          color={isVerified ? colors.primary[600] : colors.grey[500]}
        />
        <StyledText style={styles.title}>
          {isVerified ? 'Email Verified!' : 'Verify Your Email'}
        </StyledText>
        <StyledText style={styles.subtitle}>
          {isVerified
            ? 'Your email has been successfully verified'
            : `We've sent a verification link to ${email || 'your email'}`}
        </StyledText>
        {isLoading && <ActivityIndicator size="large" color={colors.primary[600]} />}
      </View>

      <View style={styles.buttonContainer}>
        {!isVerified ? (
          <>
            <StyledButton
              title="Resend Verification Email"
              onPress={handleResendVerification}
              disabled={isLoading}
              style={styles.primaryButton}
            />
            <StyledButton
              title="Check Verification Status"
              onPress={handleCheckVerification}
              disabled={isLoading || !email}
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
            title="Continue to Farm Details"
            onPress={handleContinueToFarmDetails}
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