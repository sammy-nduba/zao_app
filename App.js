import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { AuthViewModel } from './viewModel/AuthViewModel';
import { I18nextProvider } from 'react-i18next';
import i18n from './infrastructure/i18n/i18n';
import { SyncService } from './utils/SyncService';
import ErrorBoundary from './utils/ErrorBoundary';
import { ContainerProvider, useContainer } from './utils/ContainerProvider';
import FarmDetailsWithErrorBoundary from './screens/user/farmDetails/FarmDetails';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function AppInner() {
  const container = useContainer();
  const navigationRef = useNavigationContainerRef();
  const [appReady, setAppReady] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);
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
      console.log('App: Initializing AuthViewModel');
      const storageService = container.get('storageService');
      console.log('App: StorageService retrieved:', storageService);
      const authViewModel = new AuthViewModel(storageService);
      await authViewModel.initialize();
      setViewModel(authViewModel);
      const newAuthState = authViewModel.getState();
      console.log('App: AuthViewModel initialized', newAuthState);
      setAuthState(newAuthState);

      console.log('App: Initializing i18n');
      await i18n.init();
      setI18nReady(true);
      console.log('App: i18n initialized');

      if (newAuthState.authError) {
        console.warn('App: Auth error detected:', newAuthState.authError);
        Toast.show({
          type: 'error',
          text1: 'Initialization Error',
          text2: newAuthState.authError,
        });
      }
    } catch (error) {
      console.error('App: Initialization failed:', error);
      setAuthState((prev) => ({ ...prev, authError: error.message }));
      Toast.show({
        type: 'error',
        text1: 'Initialization Error',
        text2: 'Failed to initialize app. Please restart.',
      });
    } finally {
      setAppReady(true);
      await SplashScreen.hideAsync();
      console.log('App: Initialization complete, appReady:', true);
    }
  }, [container]);

  useEffect(() => {
    console.log('App: Component mounted');
    console.log('App: Running prepareApp');
    prepareApp();
    return () => console.log('App: Component unmounted');
  }, [prepareApp]);

  useEffect(() => {
    let unsubscribe = () => {};
    console.log('App: SyncService useEffect triggered with:', {
      userId: authState.user?.id,
      isVerified: authState.isVerified,
      isRegistrationComplete: authState.isRegistrationComplete,
    });
    if (authState.user?.id && authState.isVerified && authState.isRegistrationComplete) {
      console.log('App: Starting SyncService for user:', authState.user.id);
      unsubscribe = SyncService.startSync(
        authState.user.id,
        container,
        authState.isVerified,
        authState.isRegistrationComplete
      );
    } else {
      console.warn('App: Skipping SyncService, user not verified or no user ID or registration incomplete');
    }
    return () => {
      console.log('App: Cleaning up SyncService');
      unsubscribe();
    };
  }, [authState.user?.id, authState.isVerified, authState.isRegistrationComplete, container]);

  useEffect(() => {
    const unsubscribe = navigationRef.addListener('state', (state) => {
      try {
        console.log('App: Navigation state changed:', {
          routes: state?.routes || [],
          index: state?.index,
          type: state?.type,
        });
        if (!state?.routes?.length) {
          console.warn('App: Empty navigation state, current route:', navigationRef.getCurrentRoute());
        }
      } catch (error) {
        console.error('App: Navigation listener error:', error);
      }
    });
    return unsubscribe;
  }, [navigationRef]);

  const contextValue = useMemo(
    () => ({
      ...authState,
      setIsZaoAppOnboarded: (value) => {
        if (viewModel) {
          viewModel.setIsZaoAppOnboarded(value);
          setAuthState(viewModel.getState());
        }
      },
      setIsRegistered: (value) => {
        if (viewModel) {
          viewModel.setIsRegistered(value);
          setAuthState(viewModel.getState());
        }
      },
      setIsLoggedIn: (value) => {
        if (viewModel) {
          viewModel.setIsLoggedIn(value);
          setAuthState(viewModel.getState());
        }
      },
      setUser: (value) => {
        if (viewModel) {
          viewModel.setUser(value);
          setAuthState(viewModel.getState());
        }
      },
      setIsLoading: (value) => {
        if (viewModel) {
          viewModel.setIsLoading(value);
          setAuthState(viewModel.getState());
        }
      },
      setAuthError: (error) => {
        if (viewModel) {
          viewModel.setAuthError(error);
          setAuthState(viewModel.getState());
        }
      },
      setIsVerified: (value) => {
        if (viewModel) {
          viewModel.setIsVerified(value);
          setAuthState(viewModel.getState());
        }
      },
      setIsRegistrationComplete: (value) => {
        if (viewModel) {
          viewModel.setIsRegistrationComplete(value);
          setAuthState(viewModel.getState());
        }
      },
    }),
    [authState, viewModel]
  );

  const linking = {
    prefixes: ['zao://', 'https://zao-app.com'],
    config: {
      screens: {
        Error: 'error',
        Onboarding: 'onboarding',
        Auth: {
          path: 'auth',
          screens: {
            EmailVerification: 'verify-email/:token/:email',
            Register: 'register'
          }
        },
        FarmDetails: 'farm-details',
        MainTabs: 'main-tabs'
      }
    },
    filter: (url) => {
      // Skip Expo development client links
      return !url.includes('exp+zao://');
    },
    getStateFromPath: (path, options) => {
      try {
        if (path.includes('exp+zao://')) {
          console.log('Ignoring Expo development client link');
          return null;
        }
        return getStateFromPath(path, options);
      } catch (error) {
        console.error('Error parsing deep link:', error);
        return null;
      }
    }
  };

  if (!appReady || !i18nReady || authState.isZaoAppOnboarded === null) {
    console.log('App: Rendering loading screen, appReady:', appReady, 'i18nReady:', i18nReady, 'isZaoAppOnboarded:', authState.isZaoAppOnboarded);
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

  const initialRouteName = authState.authError && authState.authError.includes('storageService')
    ? 'Error'
    : authState.isZaoAppOnboarded === false
    ? 'Onboarding'
    : authState.isLoggedIn && authState.isVerified && authState.isRegistrationComplete
    ? 'MainTabs'
    : authState.isLoggedIn
    ? 'FarmDetails'
    : 'Auth';

  console.log('App: Determined initialRouteName:', initialRouteName, 'authState:', authState);

  return (
    <AuthContext.Provider value={contextValue}>
      <ErrorBoundary>
        <NavigationContainer ref={navigationRef} linking={linking} fallback={<Text>Loading navigation...</Text>}>
          <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Error" component={ErrorScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingStack} />
            <Stack.Screen name="Auth" component={AuthStack} />
            <Stack.Screen name="FarmDetails" component={FarmDetailsWithErrorBoundary} />
            <Stack.Screen name="MainTabs" component={BottomNavStack} />
          </Stack.Navigator>
        </NavigationContainer>
      </ErrorBoundary>
      <Toast config={ToastConfig} position="bottom" bottomOffset={20} visibilityTime={4000} autoHide={true} />
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ContainerProvider>
          <AppInner />
        </ContainerProvider>
      </GestureHandlerRootView>
    </I18nextProvider>
  );
}

export default App;