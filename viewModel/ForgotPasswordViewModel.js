// src/viewModel/ForgotPasswordViewModel.js
export class ForgotPasswordViewModel {
  constructor(resetPasswordUseCase, validationService) {
    this.resetPasswordUseCase = resetPasswordUseCase;
    this.validationService = validationService;
    this.state = {
      email: '',
      otp: ['', '', '', '', ''],
      newPassword: '',
      fieldErrors: {},
    };
  }

  updateFormData(fieldName, value, index = null) {
    if (fieldName === 'otp' && index !== null) {
      const newOtp = [...this.state.otp];
      newOtp[index] = value;
      this.state.otp = newOtp;
      this.validateField('otp', newOtp.join(''));
    } else {
      this.state[fieldName] = value;
      this.validateField(fieldName, value);
    }
  }

  validateField(fieldName, value) {
    let error = '';
    if (fieldName === 'email') {
      error = this.validationService.validateEmail(value) ? '' : 'Invalid email address';
    } else if (fieldName === 'otp') {
      error = value.length === 5 && !isNaN(value) ? '' : 'Please enter a 5-digit OTP';
    } else if (fieldName === 'newPassword') {
      error = this.validationService.validatePassword(value)
        ? ''
        : 'Password must be at least 8 characters';
    }
    this.state.fieldErrors[fieldName] = error;
  }

  getState() {
    return this.state;
  }

  async requestResetPassword(email) {
    try {
      console.log('ForgotPasswordViewModel.requestResetPassword called with:', email);
      this.validateField('email', email);
      if (this.state.fieldErrors.email) {
        return { success: false, error: this.state.fieldErrors.email, fieldErrors: this.state.fieldErrors };
      }
      const result = await this.resetPasswordUseCase.requestResetPassword(email);
      console.log('ForgotPasswordViewModel.requestResetPassword result:', result);
      return result;
    } catch (error) {
      console.error('ForgotPasswordViewModel.requestResetPassword error:', error);
      return { success: false, error: error.message, fieldErrors: this.state.fieldErrors };
    }
  }

  async verifyOtp(email, otp) {
    try {
      console.log('ForgotPasswordViewModel.verifyOtp called with:', { email, otp });
      this.validateField('otp', otp);
      if (this.state.fieldErrors.otp) {
        return { success: false, error: this.state.fieldErrors.otp, fieldErrors: this.state.fieldErrors };
      }
      const result = await this.resetPasswordUseCase.verifyOtp(email, otp);
      console.log('ForgotPasswordViewModel.verifyOtp result:', result);
      return result;
    } catch (error) {
      console.error('ForgotPasswordViewModel.verifyOtp error:', error);
      return { success: false, error: error.message, fieldErrors: this.state.fieldErrors };
    }
  }

  async resetPassword(email, otp, newPassword) {
    try {
      console.log('ForgotPasswordViewModel.resetPassword called with:', { email, otp });
      this.validateField('newPassword', newPassword);
      if (this.state.fieldErrors.newPassword) {
        return { success: false, error: this.state.fieldErrors.newPassword, fieldErrors: this.state.fieldErrors };
      }
      const result = await this.resetPasswordUseCase.resetPassword(email, otp, newPassword);
      console.log('ForgotPasswordViewModel.resetPassword result:', result);
      return result;
    } catch (error) {
      console.error('ForgotPasswordViewModel.resetPassword error:', error);
      return { success: false, error: error.message, fieldErrors: this.state.fieldErrors };
    }
  }
}