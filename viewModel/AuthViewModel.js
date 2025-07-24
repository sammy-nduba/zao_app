export class AuthViewModel {
  constructor(storageService) {
    if (!storageService || typeof storageService.setItem !== 'function') {
      throw new Error('Invalid storage service provided');
    }

    console.log('AuthViewModel: Constructor called');
    this.storageService = storageService;
    this.state = {
      isZaoAppOnboarded: null,
      isLoggedIn: false,
      isRegistered: false,
      user: null,
      isLoading: true,
      authError: null,
      isVerified: false,
      isRegistrationComplete: false,
    };
  }

  async initialize() {
    console.log('AuthViewModel: Initializing');
    try {
      this.setIsLoading(true);
      
      // Load user data
      const user = await this.storageService.getItem('user');
      console.log('AuthViewModel: Loaded user:', user);
      if (user) {
        try {
          const userData = typeof user === 'string' ? JSON.parse(user) : user;
          if (!userData?.id) throw new Error('Invalid user data: missing id');
          this.setUser(userData);
        } catch (parseError) {
          console.error('AuthViewModel: Failed to parse user data:', parseError);
          await this.storageService.removeItem('user');
        }
      }

      // Load onboarding status
      const onboarded = await this.storageService.getItem('isZaoAppOnboarded');
      console.log('AuthViewModel: Loaded isZaoAppOnboarded:', onboarded);
      this.setIsZaoAppOnboarded(onboarded === 'true');

    } catch (error) {
      console.error('AuthViewModel: Initialization failed:', error);
      this.setAuthError(error.message);
    } finally {
      this.setIsLoading(false);
    }
  }

  async setUser(userData) {
    console.log('AuthViewModel: Setting user:', userData);
    this.state.user = userData;
    this.state.isLoggedIn = !!userData;
    this.state.isVerified = userData?.isVerified || false;
    
    if (userData) {
      try {
        await this.storageService.setItem('user', userData);
      } catch (error) {
        console.error('AuthViewModel: Failed to persist user:', error);
      }
    }
  }

  async setIsVerified(value) {
    console.log('AuthViewModel: Setting isVerified:', value);
    this.state.isVerified = value;
    if (this.state.user) {
      this.state.user.isVerified = value;
      try {
        await this.storageService.setItem('user', this.state.user);
      } catch (error) {
        console.error('AuthViewModel: Failed to update verified status:', error);
      }
    }
  }

  async setIsRegistrationComplete(value) {
    console.log('AuthViewModel: Setting isRegistrationComplete:', value);
    this.state.isRegistrationComplete = value;
    if (this.state.user) {
      this.state.user.isRegistrationComplete = value;
      try {
        await this.storageService.setItem('user', this.state.user);
      } catch (error) {
        console.error('AuthViewModel: Failed to update registration status:', error);
      }
    }
  }

  async setIsZaoAppOnboarded(value) {
    console.log('AuthViewModel: Setting isZaoAppOnboarded:', value);
    this.state.isZaoAppOnboarded = value;
    try {
      await this.storageService.setItem('isZaoAppOnboarded', value.toString());
    } catch (error) {
      console.error('AuthViewModel: Failed to store onboarding status:', error);
    }
  }

  setIsRegistered(value) {
    console.log('AuthViewModel: Setting isRegistered:', value);
    this.state.isRegistered = value;
  }

  setIsLoggedIn(value) {
    console.log('AuthViewModel: Setting isLoggedIn:', value);
    this.state.isLoggedIn = value;
  }

  setIsLoading(value) {
    console.log('AuthViewModel: Setting isLoading:', value);
    this.state.isLoading = value;
  }

  setAuthError(error) {
    console.log('AuthViewModel: Setting authError:', error);
    this.state.authError = error;
  }

  getState() {
    return { ...this.state }; // Return copy to prevent direct mutation
  }
}