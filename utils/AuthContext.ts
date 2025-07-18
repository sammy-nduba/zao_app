import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  isZaoAppOnboarded: null,
  setIsZaoAppOnboarded: () => {
    throw new Error('setIsZaoAppOnboarded not implemented');
  },
  isRegistered: false,
  setIsRegistered: () => {
    throw new Error('setIsRegistered not implemented');
  },
  isLoggedIn: false,
  setIsLoggedIn: () => {
    throw new Error('setIsLoggedIn not implemented');
  },
  user: null,
  setUser: () => {
    throw new Error('setUser not implemented');
  },
  isLoading: false,
  setIsLoading: () => {
    throw new Error('setIsLoading not implemented');
  },
  authError: null,
  setAuthError: () => {
    throw new Error('setAuthError not implemented');
  },
  isVerified: false,
  setIsVerified: () => {
    throw new Error('setIsVerified not implemented');
  },
  isRegistrationComplete: false,
  setIsRegistrationComplete: () => {
    throw new Error('setIsRegistrationComplete not implemented');
  },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }
  return context;
};