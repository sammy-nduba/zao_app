export class ResetPasswordUseCase {
    constructor(userRepository, storageService) {
      this.userRepository = userRepository;
      this.storageService = storageService;
    }
  
    async requestResetPassword(email) {
      try {
        console.log('ResetPasswordUseCase.requestResetPassword called with:', email);
        const response = await this.userRepository.requestResetPassword(email);
        console.log('ResetPasswordUseCase.requestResetPassword response:', response);
        return {
          success: true,
          message: response.message,
          token: response.token, 
        };
      } catch (error) {
        console.error('ResetPasswordUseCase.requestResetPassword error:', error);
        return {
          success: false,
          error: error.message.includes('404')
            ? 'Email not found'
            : error.message.includes('network') || error.message.includes('timeout')
            ? 'Network error. Please check your connection.'
            : error.message,
        };
      }
    }
  
    async verifyOtp(email, otp) {
      try {
        console.log('ResetPasswordUseCase.verifyOtp called with:', { email, otp });
        const response = await this.userRepository.verifyOtp(email, otp);
        console.log('ResetPasswordUseCase.verifyOtp response:', response);
        return {
          success: true,
          message: response.message,
          resetToken: response.resetToken, 
        };
      } catch (error) {
        console.error('ResetPasswordUseCase.verifyOtp error:', error);
        return {
          success: false,
          error: error.message.includes('401')
            ? 'Invalid or expired OTP'
            : error.message.includes('network') || error.message.includes('timeout')
            ? 'Network error. Please check your connection.'
            : error.message,
        };
      }
    }
  
    async resetPassword(email, otp, newPassword) {
      try {
        console.log('ResetPasswordUseCase.resetPassword called with:', { email, otp });
        const response = await this.userRepository.resetPassword(email, otp, newPassword);
        console.log('ResetPasswordUseCase.resetPassword response:', response);
        return {
          success: true,
          message: response.message,
        };
      } catch (error) {
        console.error('ResetPasswordUseCase.resetPassword error:', error);
        return {
          success: false,
          error: error.message.includes('401')
            ? 'Invalid or expired OTP'
            : error.message.includes('network') || error.message.includes('timeout')
            ? 'Network error. Please check your connection.'
            : error.message,
        };
      }
    }
  }