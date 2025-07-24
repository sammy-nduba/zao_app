// // utils/AuthProvider.js
// import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
// import { AuthViewModel } from '../viewModel/AuthViewModel';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children, storageService }) => {
//   const [viewModel, setViewModel] = useState(null);
//   const [authState, setAuthState] = useState({
//     isZaoAppOnboarded: null,
//     isLoggedIn: false,
//     isRegistered: false,
//     user: null,
//     isLoading: false,
//     authError: null,
//     isVerified: false,
//     isRegistrationComplete: false,
//   });

//   // Initialize AuthViewModel
//   useEffect(() => {
//     const init = async () => {
//       try {
//         const vm = new AuthViewModel(storageService);
//         await vm.initialize();
//         setViewModel(vm);
//         setAuthState(vm.getState());
//       } catch (error) {
//         console.error('AuthProvider initialization failed:', error);
//         setAuthState(prev => ({
//           ...prev,
//           authError: error.message,
//           isLoading: false
//         }));
//       }
//     };

//     init();
//   }, [storageService]);

//   // Update state when viewModel changes
//   useEffect(() => {
//     if (!viewModel) return;

//     const updateState = () => setAuthState(viewModel.getState());
//     // Here you would normally subscribe to viewModel changes
//     // For example: viewModel.on('change', updateState);
//     // return () => viewModel.off('change', updateState);
    
//     // For now, we'll just return a cleanup function
//     return () => {};
//   }, [viewModel]);

//   const contextValue = useMemo(() => ({
//     authState,
//     setIsZaoAppOnboarded: async (value) => {
//       await viewModel?.setIsZaoAppOnboarded(value);
//       setAuthState(viewModel?.getState() || authState);
//     },
//     setIsRegistered: async (value) => {
//       await viewModel?.setIsRegistered(value);
//       setAuthState(viewModel?.getState() || authState);
//     },
//     setIsLoggedIn: async (value) => {
//       await viewModel?.setIsLoggedIn(value);
//       setAuthState(viewModel?.getState() || authState);
//     },
//     setUser: async (value) => {
//       await viewModel?.setUser(value);
//       setAuthState(viewModel?.getState() || authState);
//     },
//     setIsLoading: async (value) => {
//       await viewModel?.setIsLoading(value);
//       setAuthState(viewModel?.getState() || authState);
//     },
//     setAuthError: async (error) => {
//       await viewModel?.setAuthError(error);
//       setAuthState(viewModel?.getState() || authState);
//     },
//     setIsVerified: async (value) => {
//       await viewModel?.setIsVerified(value);
//       setAuthState(viewModel?.getState() || authState);
//     },
//     setIsRegistrationComplete: async (value) => {
//       await viewModel?.setIsRegistrationComplete(value);
//       setAuthState(viewModel?.getState() || authState);
//     },
//   }), [authState, viewModel]);

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };