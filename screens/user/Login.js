// src/screens/Login.js
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ScrollableMainContainer, StyledButton } from '../../components';
import StyledText from '../../components/Texts/StyledText';
import StyledTextInput from '../../components/inputs/StyledTextInput';
import { colors } from '../../config/theme';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { LoginViewModel } from '../../viewModel/LoginViewModel';
import container from '../../infrastructure/di/Container';

const Login = () => {
  const { setIsLoggedIn, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [containerError, setContainerError] = useState(null);
  const navigation = useNavigation();

  const viewModel = useMemo(() => {
    try {
      if (!container.isInitialized) {
        throw new Error('Container not initialized. Please wait.');
      }
      return new LoginViewModel(
        container.get('loginUserUseCase'),
        container.get('socialLoginUseCase'),
        container.get('validationService')
      );
    } catch (error) {
      console.error('Login: Failed to initialize ViewModel:', error);
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
          : `Failed to load login: ${containerError}`,
      });
    }
  }, [containerError]);

  if (!viewModel) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
        <StyledText style={styles.errorText}>
          {containerError || 'Initializing login... Please wait.'}
        </StyledText>
      </View>
    );
  }

  const isFormValid = formData.email && formData.password && !fieldErrors.email && !fieldErrors.password;

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    viewModel.updateFormData(fieldName, value);
    setFieldErrors(prev => ({ ...prev, [fieldName]: viewModel.getState().fieldErrors[fieldName] || '' }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setFieldErrors({});
    try {
      console.log('Submitting login:', formData);
      const result = await viewModel.login(formData);
      if (result.success) {
        console.log('Login success, setting user:', result.user);
        setUser(result.user);
        setIsLoggedIn(true);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Login successful!',
        });
        navigation.replace('MainTabs');
      } else {
        console.log('Login failed:', result.error);
        setFieldErrors(viewModel.getState().fieldErrors);
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: result.error.includes('401')
            ? 'Invalid email or password.'
            : result.error.includes('network') || result.error.includes('timeout')
            ? 'Network error. Please check your connection.'
            : result.error || 'Please check your credentials and try again',
        });
      }
    } catch (error) {
      console.error('Unexpected login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('AsyncStorage')
          ? 'Storage error. Please try again.'
          : error.message.includes('401')
          ? 'Invalid email or password.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    try {
      console.log('Social login:', provider);
      const result = await viewModel.socialLogin(provider);
      if (result.success) {
        console.log('Social login success, setting user:', result.user);
        setUser(result.user);
        setIsLoggedIn(true);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Logged in with ${provider}!`,
        });
        navigation.replace('MainTabs');
      } else {
        console.log('Social login failed:', result.error);
        Toast.show({
          type: 'error',
          text1: 'Social Login Failed',
          text2: result.error.includes('network') || result.error.includes('timeout')
            ? 'Network error. Please check your connection.'
            : result.error || 'Social login failed.',
        });
      }
    } catch (error) {
      console.error('Unexpected social login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message.includes('AsyncStorage')
          ? 'Storage error. Please try again.'
          : error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : 'Social login failed.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToRegister = () => navigation.navigate('Register');
  const goToForgotPassword = () => navigation.navigate('ForgotPassword');

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image source={require('../../assets/Vector 1.png')} style={styles.vector1} />
        <Image source={require('../../assets/Vector.png')} style={styles.vector2} />
      </View>

      <View style={styles.header}>
        <StyledText style={styles.title}>Login</StyledText>
        <StyledText style={styles.subtitle}>
          Welcome to Zao App login to your account to continue
        </StyledText>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Email</StyledText>
          <StyledTextInput
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(text) => handleFieldChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, fieldErrors.email ? styles.inputError : null]}
          />
          {fieldErrors.email && (
            <StyledText style={styles.fieldErrorText}>{fieldErrors.email}</StyledText>
          )}
        </View>

        <View style={styles.inputWrapper}>
          <StyledText style={styles.inputLabel}>Password</StyledText>
          <View style={styles.passwordInputContainer}>
            <StyledTextInput
              placeholder="***********"
              value={formData.password}
              onChangeText={(text) => handleFieldChange('password', text)}
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
          <View style={styles.passwordFooter}>
            {fieldErrors.password ? (
              <StyledText style={styles.fieldErrorText}>{fieldErrors.password}</StyledText>
            ) : (
              <StyledText style={styles.fieldErrorText} />
            )}
            <TouchableOpacity onPress={goToForgotPassword} style={styles.forgotPasswordButton}>
              <StyledText style={styles.forgotPassword}>Forgot Password?</StyledText>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <StyledButton
          title="Log In"
          onPress={handleLogin}
          disabled={!isFormValid || isLoading}
          style={styles.loginButton}
        />
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <StyledText style={styles.dividerText}>or</StyledText>
          <View style={styles.dividerLine} />
        </View>
      </View>

      <View style={styles.socialButtonsContainer}>
        <StyledButton
          title="Continue with Google"
          icon="google"
          onPress={() => handleSocialLogin('Google')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Facebook"
          icon="facebook"
          onPress={() => handleSocialLogin('Facebook')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
        <StyledButton
          title="Continue with Apple"
          icon="apple"
          onPress={() => handleSocialLogin('Apple')}
          isSocial
          style={styles.socialButton}
          disabled={isLoading}
        />
      </View>

      <View style={styles.footer}>
        <StyledText style={styles.registerText}>Don't have an account? </StyledText>
        <TouchableOpacity onPress={goToRegister}>
          <StyledText style={styles.registerLink}>Sign Up</StyledText>
        </TouchableOpacity>
      </View>
      <Toast />
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    flex: 1
  },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  vector1: {
    position: 'absolute',
    width: 130.41,
    height: 128.5,
    top: 2065.92,
    left: 272.59,
    transform: [{ rotate: '-161.18deg' }],
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
  },
  inputLabel: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginBottom: 8,
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
  fieldErrorText: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
    marginLeft: 5,
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
  passwordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPassword: {
    fontFamily: 'Roboto',
    color: colors.grey[600],
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    marginBottom: 24,
  },
  loginButton: {
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
    fontFamily: 'Roboto',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
    backgroundColor: colors.background,
    marginBottom: 80
    
  },
  registerText: {
    fontFamily: 'Roboto',
    color: colors.grey[600],
    fontSize: 14,
  },
  registerLink: {
    fontFamily: 'Roboto',
    color: colors.primary[600],
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Login;