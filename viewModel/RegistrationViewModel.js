export class RegistrationViewModel {
  constructor(registerUserUseCase, socialRegisterUseCase, validationService) {
    if (!registerUserUseCase || !socialRegisterUseCase || !validationService) {
      throw new Error('All dependencies must be provided');
    }

    this.registerUserUseCase = registerUserUseCase;
    this.socialRegisterUseCase = socialRegisterUseCase;
    this.validationService = validationService;
    
    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: ''
      },
      fieldErrors: {}
    };
  }

  // Add this method to get password requirements
  getPasswordRequirements(password) {
    return this.validationService.getPasswordRequirements(password);
  }

  updateFormData(fieldName, value) {
    this.state.formData[fieldName] = value;
    this.validateField(fieldName, value);
  }

  validateField(fieldName, value) {
    let error = '';
    
    switch (fieldName) {
      case 'firstName':
        error = value.trim().length >= 2 ? '' : 'First name must be at least 2 characters';
        break;
      case 'lastName':
        error = value.trim().length >= 2 ? '' : 'Last name must be at least 2 characters';
        break;
      case 'email':
        error = this.validationService.validateEmail(value) ? '' : 'Invalid email address';
        break;
      case 'phoneNumber':
        error = this.validationService.validatePhoneNumber(value) ? '' : 'Invalid phone number format';
        break;
      case 'password':
        error = this.validationService.validatePassword(value) ? '' : 'Password does not meet requirements';
        break;
      default:
        error = '';
    }

    this.state.fieldErrors[fieldName] = error;
  }

  getState() {
    return this.state;
  }

  async initiateSignup(formData) {
    try {
      // Validate all fields first
      Object.keys(formData).forEach(field => {
        this.validateField(field, formData[field]);
      });

      if (Object.values(this.state.fieldErrors).some(error => error)) {
        return {
          success: false,
          error: 'Please fix form errors',
          fieldErrors: this.state.fieldErrors
        };
      }

      const result = await this.registerUserUseCase.initiateSignup(formData);
      
      return {
        success: result.success,
        token: result.token,
        message: result.message,
        fieldErrors: this.state.fieldErrors
      };
    } catch (error) {
      return {
        success: false,
        error: this._normalizeError(error),
        fieldErrors: this.state.fieldErrors
      };
    }
  }

  async verifyEmail(token) {
    try {
      const result = await this.registerUserUseCase.verifyEmail(token);
      return {
        success: result.success,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        error: this._normalizeError(error)
      };
    }
  }

  async resendVerification(email) {
    try {
      const result = await this.registerUserUseCase.resendVerification(email);
      return {
        success: result.success,
        message: result.message,
        token: result.token
      };
    } catch (error) {
      return {
        success: false,
        error: this._normalizeError(error)
      };
    }
  }

  async socialRegister(provider) {
    try {
      const result = await this.socialRegisterUseCase.execute(provider);
      return {
        success: result.success,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        error: this._normalizeError(error)
      };
    }
  }

  _normalizeError(error) {
    const message = error.message || 'An error occurred';
    
    if (message.includes('409')) return 'Email already registered';
    if (message.includes('network')) return 'Network error. Please check your connection';
    if (message.includes('400')) return 'Invalid request data';
    if (message.includes('401')) return 'Unauthorized access';
    if (message.includes('404')) return 'Resource not found';
    if (message.includes('429')) return 'Too many requests. Please try again later';
    if (message.includes('502')) return 'Server error. Please try again later';
    
    return message;
  }
}