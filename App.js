import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import OnboardingStack from './components/navigators/OnboardingStacks';
import AuthStack from './components/navigators/AuthStack';
import { BottomNavStack } from './components/navigators/BottomNavStack';
import ErrorScreen from './screens/user/ErrorScreen';
import { AuthContext } from './utils/AuthContext';
import Toast from 'react-native-toast-message';
import ToastConfig from './utils/ToastConfig';
import container from './infrastructure/di/Container';
import { AuthViewModel } from './viewModel/AuthViewModel';
import { I18nextProvider } from 'react-i18next';
import i18n from './infrastructure/i18n/i18n';
import { SyncService } from './utils/SyncService';
import ErrorBoundary from './utils/ErrorBoundary';
import { ContainerProvider } from './utils/ContainerProvider';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function App() {
  const navigationRef = useNavigationContainerRef();
  const [appReady, setAppReady] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const [viewModel, setViewModel] = useState(null);
  const [authState, setAuthState] = useState({
    isZaoAppOnboarded: null,
    isLoggedIn: false,
    isRegistered: false,
    user: null,
    isLoading: false,
    authError: null,
    isVerified: false,
    isRegistrationComplete: false,
  });

  const prepareApp = useCallback(async () => {
    try {
      console.log('App: Starting container initialization');
      await container.initialize();
      console.log('App: Container initialized');
      setContainerReady(true);

      console.log('App: Initializing AuthViewModel');
      const authViewModel = new AuthViewModel(container.get('storageService'));
      await authViewModel.initialize();
      setViewModel(authViewModel);
      setAuthState(authViewModel.getState());
      console.log('App: AuthViewModel initialized', authViewModel.getState());

      console.log('App: Initializing i18n');
      await i18n.init();
      setI18nReady(true);
      console.log('App: i18n initialized');

      if (authViewModel.getState().authError) {
        Toast.show({
          type: 'error',
          text1: 'Initialization Error',
          text2: authViewModel.getState().authError,
        });
      }
    } catch (error) {
      console.error('App: Initialization failed:', error);
      setAuthState((prev) => ({ ...prev, authError: error.message }));
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: error.message.includes('Container not initialized')
          ? 'Failed to initialize dependencies. Please restart the app.'
          : `Initialization failed: ${error.message}`,
      });
    } finally {
      setAppReady(true);
      await SplashScreen.hideAsync();
      console.log('App: Initialization complete, appReady:', true);
    }
  }, []);

  useEffect(() => {
    console.log('App: Running prepareApp');
    prepareApp();
    const unsubscribe = authState.user?.id ? SyncService.startSync(authState.user.id) : () => {};
    return () => unsubscribe();
  }, [prepareApp, authState.user?.id]);

  if (!viewModel || !appReady || !i18nReady || !containerReady || authState.isZaoAppOnboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        {authState.authError && (
          <Text style={{ marginTop: 10, color: 'red', textAlign: 'center' }}>
            {authState.authError}
          </Text>
        )}
      </View>
    );
  }

  const contextValue = {
    ...authState,
    setIsZaoAppOnboarded: (value) => {
      viewModel.setIsZaoAppOnboarded(value);
      setAuthState(viewModel.getState());
    },
    setIsRegistered: (value) => {
      viewModel.setIsRegistered(value);
      setAuthState(viewModel.getState());
    },
    setIsLoggedIn: (value) => {
      viewModel.setIsLoggedIn(value);
      setAuthState(viewModel.getState());
    },
    setUser: (userData) => {
      viewModel.setUser(userData);
      setAuthState(viewModel.getState());
    },
    setIsLoading: (value) => {
      viewModel.setIsLoading(value);
      setAuthState(viewModel.getState());
    },
    setAuthError: (error) => {
      viewModel.setAuthError(error);
      setAuthState(viewModel.getState());
    },
    setIsVerified: (value) => {
      viewModel.setIsVerified(value);
      setAuthState(viewModel.getState());
    },
    setIsRegistrationComplete: (value) => {
      viewModel.setIsRegistrationComplete(value);
      setAuthState(viewModel.getState());
    },
  };

  const linking = {
    prefixes: [
      'zao://',
      'https://zao-app.com',
      'exp://192.168.0.104:8081', // Add Expo dev prefix
      'exp://', // Fallback for dynamic Expo hosts
    ],
    config: {
      screens: {
        Auth: {
          path: 'auth',
          screens: {
            EmailVerification: {
              path: 'verify-email',
              parse: {
                token: (token) => `${token}`,
                email: (email) => `${email}`,
              },
            },
          },
        },
      },
    },
  };

  return (
      <I18nextProvider i18n={i18n}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ContainerProvider>
            <AuthContext.Provider value={contextValue}>
              <ErrorBoundary>
                <NavigationContainer ref={navigationRef} linking={linking}>
              <Stack.Navigator
                initialRouteName={
                  authState.authError
                    ? 'Error'
                    : authState.isZaoAppOnboarded === false
                    ? 'Onboarding'
                    : authState.isLoggedIn
                    ? 'MainTabs'
                    : 'Auth'
                }
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Error" component={ErrorScreen} />
                <Stack.Screen name="Onboarding" component={OnboardingStack} />
                <Stack.Screen name="Auth" component={AuthStack} />
                <Stack.Screen name="MainTabs" component={BottomNavStack} />
              </Stack.Navigator>
              </NavigationContainer>
            </ErrorBoundary>
            {/* <Toast config={ToastConfig} /> */}
            <Toast 
        config={ToastConfig} 
        position="bottom"
        bottomOffset={20}
        visibilityTime={4000}
        autoHide={true}
      />
          </AuthContext.Provider>
        </ContainerProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}

export default App;