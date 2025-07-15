export class EmailVerificationViewModel {
  constructor(registerUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
  }

  async verifyEmail(token) {
    try {
      console.log('EmailVerificationViewModel.verifyEmail called with:', token);
      const result = await this.registerUserUseCase.verifyEmail(token);
      console.log('EmailVerificationViewModel.verifyEmail result:', result);
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Verification failed.',
        };
      }
      return {
        success: true,
        user: {
          id: result.userId,
          email: result.email,
          token: result.token,
        },
        message: result.message,
      };
    } catch (error) {
      console.error('EmailVerificationViewModel.verifyEmail error:', {
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

  async resendVerification(email) {
    try {
      console.log('EmailVerificationViewModel.resendVerification called with:', email);
      const result = await this.registerUserUseCase.resendVerification(email);
      console.log('EmailVerificationViewModel.resendVerification result:', result);
      if (!result.success) {
        return {
          success: false,
          error: result.error || 'Failed to resend verification email.',
        };
      }
      return {
        success: true,
        message: result.message,
        token: result.token,
      };
    } catch (error) {
      console.error('EmailVerificationViewModel.resendVerification error:', {
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
          : error.message.includes('502')
          ? 'Server error. Please try again later.'
          : error.message.includes('network') || error.message.includes('timeout')
          ? 'Network error. Please check your connection.'
          : error.message || 'Failed to resend verification email.',
      };
    }
  }
}