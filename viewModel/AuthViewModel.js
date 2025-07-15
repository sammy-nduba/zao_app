export class AuthViewModel {
  constructor(storageService) {
    this.storageService = storageService;
    this.state = {
      user: null,
      isZaoAppOnboarded: null,
      isRegistered: false,
      isLoggedIn: false,
      isVerified: false,
      isRegistrationComplete: false,
      isLoading: false,
      authError: null,
    };
  }

  async initialize() {
    this.state.isLoading = true;
    try {
      // Ensure StorageService is initialized
      await this.storageService.initialize();
      
      const [
        onboardingStatus,
        registrationStatus,
        loginStatus,
        user,
        isVerified,
        isRegistrationComplete,
      ] = await Promise.all([
        this.storageService.getItem('Onboarding'),
        this.storageService.getItem('Registration'),
        this.storageService.getItem('Login'),
        this.storageService.getItem('User'),
        this.storageService.getItem('isVerified'),
        this.storageService.getItem('isRegistrationComplete'),
      ]);

      this.state.isZaoAppOnboarded = onboardingStatus === 'true' || onboardingStatus === true || false;
      this.state.isRegistered = registrationStatus === 'true' || registrationStatus === true || false;
      this.state.isLoggedIn = loginStatus === 'true' || loginStatus === true || false;
      this.state.user = user || null;
      this.state.isVerified = isVerified === 'true' || isVerified === true || false;
      this.state.isRegistrationComplete = isRegistrationComplete === 'true' || isRegistrationComplete === true || false;

      console.log('AuthViewModel: Initialized state:', this.state);
    } catch (error) {
      console.error('AuthViewModel: Initialize error:', error);
      this.state.authError = `Failed to initialize auth state: ${error.message}`;
    } finally {
      this.state.isLoading = false;
    }
  }

  setIsZaoAppOnboarded(value) {
    this.state.isZaoAppOnboarded = value;
    this.storageService.storeItem('Onboarding', value).catch((error) => {
      console.error('AuthViewModel: Failed to store Onboarding:', error);
      this.state.authError = `Failed to store onboarding status: ${error.message}`;
    });
  }

  setIsRegistered(value) {
    this.state.isRegistered = value;
    this.storageService.storeItem('Registration', value).catch((error) => {
      console.error('AuthViewModel: Failed to store Registration:', error);
      this.state.authError = `Failed to store registration status: ${error.message}`;
    });
  }

  setIsLoggedIn(value) {
    this.state.isLoggedIn = value;
    this.storageService.storeItem('Login', value).catch((error) => {
      console.error('AuthViewModel: Failed to store Login:', error);
      this.state.authError = `Failed to store login status: ${error.message}`;
    });
  }

  setUser(user) {
    this.state.user = user;
    this.storageService.storeItem('User', user).catch((error) => {
      console.error('AuthViewModel: Failed to store User:', error);
      this.state.authError = `Failed to store user data: ${error.message}`;
    });
  }

  setIsVerified(value) {
    this.state.isVerified = value;
    this.storageService.storeItem('isVerified', value).catch((error) => {
      console.error('AuthViewModel: Failed to store isVerified:', error);
      this.state.authError = `Failed to store verification status: ${error.message}`;
    });
  }

  setIsRegistrationComplete(value) {
    this.state.isRegistrationComplete = value;
    this.storageService.storeItem('isRegistrationComplete', value).catch((error) => {
      console.error('AuthViewModel: Failed to store isRegistrationComplete:', error);
      this.state.authError = `Failed to store registration complete status: ${error.message}`;
    });
  }

  setAuthError(error) {
    this.state.authError = error;
  }

  getState() {
    return { ...this.state };
  }
}