export class EmailVerificationViewModel {
  constructor(registerUserUseCase) {
    if (!registerUserUseCase?.verifyEmail) {
      throw new Error('Invalid registerUserUseCase provided');
    }
    this.registerUserUseCase = registerUserUseCase;
  }

  async verifyEmail(token) {
    try {
      console.log('Starting email verification with token:', token);
      const result = await this.registerUserUseCase.verifyEmail(token);
      
      if (!result.success) {
        console.warn('Verification failed:', result.error);
        return {
          success: false,
          error: result.error || 'Verification failed',
          shouldRetry: !result.error?.includes('expired')
        };
      }

      console.log('Verification successful:', result.user);
      return {
        success: true,
        user: {
          id: result.user._id || result.user.userId,
          email: result.user.email,
          token: result.user.token,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          phoneNumber: result.user.phone || result.user.phoneNumber
        },
        message: result.message
      };
    } catch (error) {
      console.error('Verification error:', error);
      return {
        success: false,
        error: this._normalizeError(error),
        shouldRetry: true
      };
    }
  }

  _normalizeError(error) {
    const message = error.message || 'Verification failed';
    
    if (message.includes('storage')) {
      return 'Temporary storage issue. Your account was created but we couldn\'t save session data. Please login.';
    }
    if (message.includes('400')) return 'Invalid verification token';
    if (message.includes('401')) return 'Expired verification link';
    if (message.includes('409')) return 'Email already registered';
    return message;
  }

  async resendVerification(email) {
    try {
      const result = await this.registerUserUseCase.resendVerification(email);
      return {
        success: result.success,
        message: result.message,
        token: result.token,
        error: result.error
      };
    } catch (error) {
      return {
        success: false,
        error: this._normalizeError(error)
      };
    }
  }
}