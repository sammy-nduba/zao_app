export class ForgotPasswordUseCase {
    constructor(userRepository) {
      this.userRepository = userRepository;
    }
  
    async execute(email) {
      try {
        const response = await this.userRepository.forgotPassword(email);
        return {
          success: true,
          otp: response.otp, // OTP returned from backend
          message: response.message || 'OTP sent to your email',
        };
      } catch (error) {
        console.error('ForgotPasswordUseCase error:', error);
        throw new Error(
          error.response?.status === 404
            ? 'Email not found'
            : error.response?.status === 429
            ? 'Too many requests. Please try again after 30 minutes.'
            : error.response?.status === 502
            ? 'Server error. Please try again later.'
            : error.response?.data?.message || error.message || 'Failed to initiate password reset'
        );
      }
    }
  }