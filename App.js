import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { I18nextProvider } from 'react-i18next';
import Toast from 'react-native-toast-message';
import OnboardingStack from './components/navigators/OnboardingStacks';
import AuthStack from './components/navigators/AuthStack';
import { BottomNavStack } from './components/navigators/BottomNavStack';
import ErrorScreen from './screens/user/ErrorScreen';
import FarmDetailsWithErrorBoundary from './screens/user/farmDetails/FarmDetails';
import { AuthProvider, useAuth } from './utils/AuthContext';
import { ContainerProvider, useContainer } from './utils/ContainerProvider';
import ErrorBoundary from './utils/ErrorBoundary';
import ToastConfig from './utils/ToastConfig';
import i18n from './infrastructure/i18n/i18n';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();

function NavigationContent() {
  const { authState } = useAuth(); // Now safe to use inside AuthProvider
  const navigationRef = useNavigationContainerRef();

  const renderErrorScreen = useCallback(
    ({ error, resetError }) => {
      console.error('ErrorBoundary caught error:', error);
      return (
        <ErrorScreen
          navigation={navigationRef.current}
          route={{
            params: {
              error: error.message,
              authState,
            },
          }}
        />
      );
    },
    [navigationRef, authState]
  );

  // Wait for authState to be initialized
  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Determine initial route based on authState
  let initialRouteName = 'Onboarding';
  if (authState.isZaoAppOnboarded) {
    initialRouteName = authState.isLoggedIn ? 'MainTabs' : 'Auth';
  }

  return (
    <ErrorBoundary FallbackComponent={renderErrorScreen}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => console.log('NavigationContainer ready')}
      >
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingStack} />
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="FarmDetails" component={FarmDetailsWithErrorBoundary} />
          <Stack.Screen name="MainTabs" component={BottomNavStack} />
          <Stack.Screen name="Error" component={ErrorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={ToastConfig} />
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}

function AppInner() {
  const { container, isReady: containerReady } = useContainer();
  const [appReady, setAppReady] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);

  const prepareApp = useCallback(async () => {
    try {
      if (!containerReady) return;
      console.log('App: Initializing i18n');
      await i18n.init();
      setI18nReady(true);
    } catch (error) {
      console.error('App: Initialization failed:', error);
    } finally {
      setAppReady(true);
      await SplashScreen.hideAsync();
    }
  }, [containerReady]);

  useEffect(() => {
    if (containerReady) {
      prepareApp();
    }
  }, [containerReady, prepareApp]);

  if (!containerReady || !appReady || !i18nReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider storageService={container.get('storageService')}>
      <NavigationContent />
    </AuthProvider>
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