import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { AuthViewModel } from '../viewModel/AuthViewModel';

interface AuthState {
  isZaoAppOnboarded: boolean | null;
  isLoggedIn: boolean;
  isRegistered: boolean;
  user: any | null;
  isLoading: boolean;
  authError: string | null;
  isVerified: boolean;
  isRegistrationComplete: boolean;
}

interface AuthContextType {
  authState: AuthState;
  setIsZaoAppOnboarded: (value: boolean) => Promise<void>;
  setIsRegistered: (value: boolean) => Promise<void>;
  setIsLoggedIn: (value: boolean) => Promise<void>;
  setUser: (value: any) => Promise<void>;
  setIsLoading: (value: boolean) => Promise<void>;
  setAuthError: (error: string) => Promise<void>;
  setIsVerified: (value: boolean) => Promise<void>;
  setIsRegistrationComplete: (value: boolean) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  storageService: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, storageService }) => {
  const [viewModel, setViewModel] = useState<AuthViewModel | null>(null);
  const [authState, setAuthState] = useState<AuthState>({
    isZaoAppOnboarded: null,
    isLoggedIn: false,
    isRegistered: false,
    user: null,
    isLoading: false,
    authError: null,
    isVerified: false,
    isRegistrationComplete: false,
  });

  // Initialize AuthViewModel
  useEffect(() => {
  const init = async () => {
    try {
      const vm = new AuthViewModel(storageService);
      await vm.initialize();
      setViewModel(vm);
      setAuthState(vm.getState());
    } catch (error: any) {
      console.error('AuthProvider initialization failed:', error);
      setAuthState(prev => ({
        ...prev,
        authError: error.message,
        isLoading: false
      }));
    }
  };
  init();
}, [storageService]);


  const contextValue = useMemo<AuthContextType>(() => ({
    authState,
    setIsZaoAppOnboarded: async (value: boolean) => {
      if (!viewModel) return;
      await viewModel.setIsZaoAppOnboarded(value);
      setAuthState(viewModel.getState());
    },
    setIsRegistered: async (value: boolean) => {
      if (!viewModel) return;
      await viewModel.setIsRegistered(value);
      setAuthState(viewModel.getState());
    },
    setIsLoggedIn: async (value: boolean) => {
      if (!viewModel) return;
      await viewModel.setIsLoggedIn(value);
      setAuthState(viewModel.getState());
    },
    setUser: async (value: any) => {
      if (!viewModel) return;
      await viewModel.setUser(value);
      setAuthState(viewModel.getState());
    },
    setIsLoading: async (value: boolean) => {
      if (!viewModel) return;
      await viewModel.setIsLoading(value);
      setAuthState(viewModel.getState());
    },
    setAuthError: async (error: string) => {
      if (!viewModel) return;
      await viewModel.setAuthError(error);
      setAuthState(viewModel.getState());
    },
    setIsVerified: async (value: boolean) => {
      if (!viewModel) return;
      await viewModel.setIsVerified(value);
      setAuthState(viewModel.getState());
    },
    setIsRegistrationComplete: async (value: boolean) => {
      if (!viewModel) return;
      await viewModel.setIsRegistrationComplete(value);
      setAuthState(viewModel.getState());
    },
  }), [authState, viewModel]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};   

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};