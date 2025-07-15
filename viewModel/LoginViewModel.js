
export class LoginViewModel {
    constructor(loginUseCase, socialLoginUseCase, validationService) {
      this.loginUseCase = loginUseCase;
      this.socialLoginUseCase = socialLoginUseCase;
      this.validationService = validationService;
      this.state = {
        formData: {
          email: '',
          password: '',
        },
        fieldErrors: {},
        isLoading: false,
        isLoggedIn: false,
        authError: null,
      };
    }
  
    updateFormData(fieldName, value) {
      this.state.formData[fieldName] = value;
      if (this.state.fieldErrors[fieldName]) {
        this.state.fieldErrors[fieldName] = '';
      }
      if (fieldName === 'email') {
        const isValidEmail = this.validationService.validateEmail(value);
        this.state.fieldErrors.email = isValidEmail ? '' : 'Invalid email format';
      }
    }
  
    async login(formData) {
      this.state.isLoading = true;
      this.state.fieldErrors = {};
      this.state.authError = null;
      try {
        console.log('LoginViewModel.login called with:', formData); // Debug
        const user = await this.loginUseCase.execute(formData);
        console.log('Login successful, user:', user); // Debug
        this.state.isLoggedIn = true;
        return { success: true, user };
      } catch (error) {
        console.error('Login error:', error.message); // Debug
        const errors = error.message.split(': ')[1]?.split(', ') || [error.message];
        const newFieldErrors = {};
        errors.forEach(error => {
          if (error.includes('Email')) newFieldErrors.email = error;
          else if (error.includes('Password')) newFieldErrors.password = error;
          else newFieldErrors.general = error;
        });
        this.state.fieldErrors = newFieldErrors;
        this.state.authError = error.message;
        return { success: false, error: error.message };
      } finally {
        this.state.isLoading = false;
      }
    }
  
    async socialLogin(provider) {
      this.state.isLoading = true;
      this.state.authError = null;
      try {
        console.log('LoginViewModel.socialLogin called with:', provider); // Debug
        const user = await this.socialLoginUseCase.execute(provider);
        console.log('Social login successful, user:', user); // Debug
        this.state.isLoggedIn = true;
        return { success: true, user, provider };
      } catch (error) {
        console.error('Social login error:', error.message); // Debug
        this.state.authError = error.message;
        return { success: false, error: error.message };
      } finally {
        this.state.isLoading = false;
      }
    }
  
    getState() {
      return { ...this.state };
    }
  }