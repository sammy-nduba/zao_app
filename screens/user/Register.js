import React, { useState, useContext, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { ScrollableMainContainer } from '../../components';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import StyledText from '../../components/Texts/StyledText';
import StyledButton from '../../components/Buttons/StyledButton';
import { colors } from '../../config/theme';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { RegistrationViewModel } from '../../viewModel/RegistrationViewModel';
import container from '../../infrastructure/di/Container';
import { LoadingDialog } from '../../components/LoadingDialog';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const [step, setStep] = useState('form');
  const [viewModel, setViewModel] = useState(null);
  const { setIsRegistered, setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      setLoadingMessage('Initializing application...');
      if (!container.isInitialized) {
        try {
          await container.initialize();
          console.log('Container initialized');
        } catch (error) {
          console.error('Container initialization failed:', error);
          Toast.show({
            type: 'error',
            text1: 'Initialization Error',
            text2: 'Application failed to load. Please restart the app.',
          });
          return;
        }
      }
      try {
        const vm = new RegistrationViewModel(
          container.get('registerUserUseCase'),
          container.get('socialRegisterUseCase'),
          container.get('validationService')
        );
        setViewModel(vm);
      } catch (error) {
        console.error('Failed to initialize RegistrationViewModel:', error);
        Toast.show({
          type: 'error',
          text1: 'Initialization Error',
          text2: 'Failed to load registration. Please try again.',
        });
      } finally {
        setLoadingMessage('');
      
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
      console.log('Deep link received:', url);
      if (url) {
        try {
          const urlObj = new URL(url);
          const token = urlObj.searchParams.get('token');
          const email = urlObj.searchParams.get('email');
          console.log('Extracted from deep link:', { token, email });
          if (token && email) {
            setFormData((prev) => ({ ...prev, email }));
            setStep('verify');
            navigation.navigate('EmailVerification', { token, email });
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
            text2: 'Failed to process verification link. Please try again.',
          });
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });
    return () => Linking.removeAllListeners('url');
  }, [viewModel, navigation]);

  if (!viewModel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006400" />
        <StyledText style={styles.loadingText}>Preparing registration...</StyledText>
      </View>
    );
  }

  const passwordRequirements = viewModel 
    ? viewModel.getPasswordRequirements(formData.password)
    : [];
  
  const metRequirementsCount = passwordRequirements.filter(req => req.met).length;

  const isFormValid = () => {
    if (!viewModel) return false;
    
    return ['firstName', 'lastName', 'email', 'phoneNumber', 'password'].every(
      key => formData[key].trim() !== '' && !fieldErrors[key]
    ) && metRequirementsCount === passwordRequirements.length;
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    viewModel.updateFormData(fieldName, value);
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: viewModel.getState().fieldErrors[fieldName] || '',
    }));
  };

  const handleInitiateSignup = async () => {
    setIsLoading(true);
    setFieldErrors({});
    try {
      const result = await viewModel.initiateSignup(formData);
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Verification Email Sent',
          text2: 'Please check your email to verify your account!',
        });
        navigation.navigate('EmailVerification', {
          token: result.token,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          autoVerify: true 
        });
      } else {
        setFieldErrors(result.fieldErrors || {});
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: result.error?.includes('409')
            ? 'Email already registered. Please log in.'
            : result.error?.includes('network') || result.error?.includes('timeout')
            ? 'Network error. Please check your connection.'
            : result.error || 'Please check your details and try again.',
        });
        if (result.error?.includes('409')) {
          navigation.navigate('Login');
        }
      }
    } catch (error) {
      console.error('Initiate signup error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : error.message.includes('409')
          ? 'Email already registered. Please log in.'
          : error.message || 'Failed to initiate registration.',
      });
      if (error.message.includes('409')) {
        navigation.navigate('Login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setFieldErrors({});
    try {
      console.log('Completing registration with token:', formData.token);
      const result = await viewModel.verifyEmail(formData.token);
      console.log('Register result:', result);
      if (result.success) {
        setIsRegistered(true);
        setUser({
          id: result.user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          token: result.user.token,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Registration successful! Please set up your farm details.',
        });
        navigation.navigate('FarmDetails');
      } else {
        setFieldErrors(result.fieldErrors || {});
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.error?.includes('400')
            ? 'Invalid verification token. Please resend the verification email.'
            : result.error?.includes('401')
            ? 'Invalid or expired token.'
            : result.error?.includes('502')
            ? 'Server error. Please try again later.'
            : result.error || 'Please check your information and try again.',
        });
      }
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('400')
          ? 'Invalid verification token. Please resend the verification email.'
          : error.message.includes('401')
          ? 'Invalid or expired token.'
          : error.message.includes('502')
          ? 'Server error. Please try again later.'
          : error.message.includes('timed out')
          ? 'Request timed out. Please check your connection.'
          : error.message.includes('AsyncStorage')
          ? 'Storage error. Please try again.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setFieldErrors({});
    try {
      console.log('Resending verification for:', formData.email);
      const result = await viewModel.resendVerification(formData.email);
      console.log('Resend verification result:', result);
      if (result.success) {
        setFormData((prev) => ({ ...prev, token: result.token }));
        Toast.show({
          type: 'success',
          text1: 'Verification Email Resent',
          text2: result.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Resend Failed',
          text2: result.error?.includes('404')
            ? 'No pending registration found.'
            : result.error?.includes('429')
            ? 'Too many requests. Please try again after 30 minutes.'
            : result.error || 'Failed to resend verification email.',
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
        text2: error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : error.message.includes('429')
          ? 'Too many requests. Please try again after 30 minutes.'
          : error.message.includes('502')
          ? 'Server error. Please try again later.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider) => {
    setIsLoading(true);
    try {
      console.log('Social register:', provider);
      const result = await viewModel.socialRegister(provider);
      if (result.success) {
        setIsRegistered(true);
        setUser({
          id: result.user.id,
          firstName: result.user.firstName || 'User',
          lastName: result.user.lastName || '',
          email: result.user.email,
          phoneNumber: result.user.phoneNumber || '',
          token: result.user.token,
        });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Registered with ${provider}! Please set up your farm details.`,
        });
        navigation.navigate('FarmDetails');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: result.error || 'Social registration failed.',
        });
      }
    } catch (error) {
      console.error('Social registration error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('502')
          ? 'Server is currently unavailable. Please try again later.'
          : 'Social registration failed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => navigation.navigate('Login');
  const goToUserAgreement = () => navigation.navigate('UserAgreement');
  const goToPrivacyPolicy = () => navigation.navigate('PrivacyPolicy');

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>

<LoadingDialog visible={isLoading} message={loadingMessage} />


      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector 1.png')} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Create Account</StyledText>
        <StyledText style={styles.subtitle}>
          Welcome to Zao App. Set up your account to continue.
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        {step === 'form' && (
          <>
            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>First Name</StyledText>
              <StyledTextInput
                placeholder="Enter first name"
                value={formData.firstName}
                onChangeText={(value) => handleFieldChange('firstName', value)}
                style={[styles.input, fieldErrors.firstName ? styles.inputError : null]}
              />
              {fieldErrors.firstName && (
                <StyledText style={styles.errorText}>{fieldErrors.firstName}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Last Name</StyledText>
              <StyledTextInput
                placeholder="Enter last name"
                value={formData.lastName}
                onChangeText={(value) => handleFieldChange('lastName', value)}
                style={[styles.input, fieldErrors.lastName ? styles.inputError : null]}
              />
              {fieldErrors.lastName && (
                <StyledText style={styles.errorText}>{fieldErrors.lastName}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Email Address</StyledText>
              <StyledTextInput
                placeholder="Enter email address"
                value={formData.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, fieldErrors.email ? styles.inputError : null]}
              />
              {fieldErrors.email && (
                <StyledText style={styles.errorText}>{fieldErrors.email}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Phone Number</StyledText>
              <StyledTextInput
                placeholder="Enter phone number (e.g., +254700000000)"
                value={formData.phoneNumber}
                onChangeText={(value) => handleFieldChange('phoneNumber', value)}
                keyboardType="phone-pad"
                maxLength={15}
                style={[styles.input, fieldErrors.phoneNumber ? styles.inputError : null]}
              />
              {fieldErrors.phoneNumber && (
                <StyledText style={styles.errorText}>{fieldErrors.phoneNumber}</StyledText>
              )}
            </View>

            <View style={styles.inputWrapper}>
              <StyledText style={styles.inputLabel}>Password</StyledText>
              <View style={styles.passwordInputContainer}>
                <StyledTextInput
                  placeholder="***********"
                  value={formData.password}
                  onChangeText={(value) => handleFieldChange('password', value)}
                  secureTextEntry={!showPassword}
                  style={[styles.input, fieldErrors.password ? styles.inputError : null]}
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
              {fieldErrors.password && (
                <StyledText style={styles.errorText}>{fieldErrors.password}</StyledText>
              )}
            </View>

            <View style={styles.passwordRequirements}>
              <View style={styles.requirementsHeader}>
                <StyledText style={styles.requirementText}>Password Strength</StyledText>
                <StyledText style={styles.requirementCount}>{`${metRequirementsCount}/5`}</StyledText>
              </View>
              <View style={styles.requirementsGrid}>
                {passwordRequirements.map(({ label, met }, index) => (
                  <StyledText
                    key={index}
                    style={[styles.requirementItem, met && styles.requirementMet]}
                  >
                    {label}
                  </StyledText>
                ))}
              </View>
            </View>

            <View style={styles.termsContainer}>
              <StyledText style={styles.termsText}>
                By clicking "Send Verification Email", you agree to our{' '}
                <StyledText style={styles.linkText} onPress={goToUserAgreement}>
                  User Agreement
                </StyledText>{' '}
                and{' '}
                <StyledText style={styles.linkText} onPress={goToPrivacyPolicy}>
                  Privacy Policy
                </StyledText>{' '}
                of Zao App.
              </StyledText>
            </View>

            <StyledButton
              title="Send Verification Email"
              onPress={handleInitiateSignup}
              disabled={isLoading || !isFormValid()}
              style={styles.registerButton}
            />
          </>
        )}

        {step === 'verify' && (
          <View style={styles.verifyContainer}>
            <StyledText style={styles.verifyText}>
              Please check your email for a verification link. Once verified, complete your registration.
            </StyledText>
            <StyledButton
              title="Complete Registration"
              onPress={handleRegister}
              disabled={isLoading || !formData.token}
              style={styles.registerButton}
            />
            <StyledButton
              title="Resend Verification Email"
              onPress={handleResendVerification}
              disabled={isLoading}
              style={styles.registerButton}
            />
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <StyledText style={styles.dividerText}>Or</StyledText>
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.socialButtonsContainer}>
        <StyledButton
          title="Continue with Google"
          icon="google"
          iconColor="#DB4437"
          onPress={() => handleSocialRegister('Google')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Facebook"
          icon="facebook-box"
          iconColor="#1877F2"
          onPress={() => handleSocialRegister('Facebook')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Apple"
          icon="apple"
          iconColor="#000000"
          onPress={() => handleSocialRegister('Apple')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
      </View>

      <View style={styles.loginContainer}>
        <StyledText style={styles.loginText}>Already have an account? </StyledText>
        <TouchableOpacity onPress={goToLogin}>
          <StyledText style={styles.loginLink}>Log In</StyledText>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollableMainContainer>
  );
};


const styles = StyleSheet.create({
  loadingDialogContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loadingDialog: {
    backgroundColor: colors.background,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingDialogText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.grey[600],
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  verifyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  verifyText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[600],
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.grey[600],
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
  passwordRequirements: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    width: '100%',
    marginBottom: 20,
  },
  requirementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.grey[600],
    fontWeight: '600',
  },
  requirementCount: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  requirementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  requirementItem: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.grey[600],
    fontWeight: '400',
    letterSpacing: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: colors.grey[300],
    borderWidth: 1,
    borderRadius: 16,
    textAlign: 'center',
    width: '48%',
    marginBottom: 8,
  },
  requirementMet: {
    color: colors.primary[600],
    borderColor: colors.primary[600],
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: colors.grey[300],
    lineHeight: 18,
    textAlign: 'center',
  },
  linkText: {
    color: colors.primary[600],
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  registerButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grey[300],
  },
  dividerText: {
    marginHorizontal: 10,
    color: colors.grey[600],
    fontSize: 16,
  },
  socialButtonsContainer: {
    marginBottom: 24,
  },
  socialButton: {
    width: '100%',
    height: 50,
    marginBottom: 12,
    backgroundColor: colors.grey[100],
    borderWidth: 1,
    borderColor: colors.grey[300],
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  loginText: {
    fontFamily: 'Roboto',
    color: colors.grey[600],
    fontSize: 14,
  },
  loginLink: {
    fontFamily: 'Roboto',
    color: colors.primary[600],
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Register;