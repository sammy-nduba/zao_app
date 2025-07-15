export class RegistrationViewModel {
  constructor(registerUserUseCase, socialRegisterUseCase, validationService) {
    this.registerUserUseCase = registerUserUseCase;
    this.socialRegisterUseCase = socialRegisterUseCase;
    this.validationService = validationService;
    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      },
      fieldErrors: {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      },
    };
  }

  updateFormData(fieldName, value) {
    this.state.formData[fieldName] = value;
    this.validateField(fieldName, value);
  }

  validateField(fieldName, value) {
    let error = '';
    if (fieldName === 'firstName') {
      error = value.trim().length >= 2 ? '' : 'First name must be at least 2 characters';
    } else if (fieldName === 'lastName') {
      error = value.trim().length >= 2 ? '' : 'Last name must be at least 2 characters';
    } else if (fieldName === 'email') {
      error = this.validationService.validateEmail(value) ? '' : 'Invalid email address';
    } else if (fieldName === 'phoneNumber') {
      error = this.validationService.validatePhoneNumber(value)
        ? ''
        : 'Invalid phone number (e.g., +254700000000)';
    } else if (fieldName === 'password') {
      error = this.validationService.validatePassword(value)
        ? ''
        : 'Password must be at least 8 characters';
    }
    this.state.fieldErrors[fieldName] = error;
  }

  getPasswordRequirements(password) {
    return this.validationService.getPasswordRequirements(password);
  }

  getState() {
    return this.state;
  }

  async initiateSignup(formData) {
    try {
      console.log('Initiating signup with:', formData);
      const { firstName, lastName, email, phoneNumber, password } = formData;
      this.state.formData = { firstName, lastName, email, phoneNumber, password };
      Object.keys(this.state.formData).forEach((field) =>
        this.validateField(field, this.state.formData[field])
      );
      if (Object.values(this.state.fieldErrors).some((error) => error)) {
        return {
          success: false,
          error: 'Please fix form errors',
          fieldErrors: this.state.fieldErrors,
        };
      }
      const result = await this.registerUserUseCase.initiateSignup({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
      console.log('Initiate signup result:', result);
      return {
        success: result.success, // Propagate success
        message: result.message,
        token: result.token,
        fieldErrors: this.state.fieldErrors,
      };
    } catch (error) {
      console.error('Initiate signup error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      return {
        success: false,
        error: error.message.includes('409')
          ? 'Email already registered'
          : error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : error.message || 'Failed to initiate registration.',
        fieldErrors: this.state.fieldErrors,
      };
    }
  }

  async verifyEmail(token) {
    try {
      console.log('Completing registration with token:', token);
      const result = await this.registerUserUseCase.verifyEmail(token);
      console.log('Verify email result:', result);
      return {
        success: result.success,
        user: {
          id: result.userId,
          email: result.email,
          token: result.token,
        },
        message: result.message,
      };
    } catch (error) {
      console.error('Verify email error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      return {
        success: false,
        error: error.message.includes('400')
          ? 'Invalid verification token.'
          : error.message.includes('401')
          ? 'Invalid or expired token.'
          : error.message.includes('502')
          ? 'Server error. Please try again later.'
          : error.message || 'Verification failed.',
      };
    }
  }

  async socialRegister(provider) {
    try {
      console.log('Social register with provider:', provider);
      const result = await this.socialRegisterUseCase.execute(provider);
      console.log('Social register result:', result);
      return {
        success: result.success,
        user: result.user,
        message: result.message,
      };
    } catch (error) {
      console.error('Social register error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      return {
        success: false,
        error: error.message || 'Social registration failed.',
      };
    }
  }

  async resendVerification(email) {
    try {
      console.log('Resending verification for:', email);
      const result = await this.registerUserUseCase.resendVerification(email);
      console.log('Resend verification result:', result);
      return {
        success: result.success,
        message: response.message,
        token: response.token,
      };
    } catch (error) {
      console.error('Resend verification error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      return {
        success: false,
        error: error.message.includes('404')
          ? 'No pending registration found.'
          : error.message.includes('429')
          ? 'Too many requests. Please try again after 30 minutes.'
          : error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : error.message || 'Failed to resend verification email.',
      };
    }
  }
}