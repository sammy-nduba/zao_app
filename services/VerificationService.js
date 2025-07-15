export class VerificationService {
  constructor(apiRepository, navigation) {
    this.api = apiRepository;
    this.navigation = navigation;
  }

  async handleVerificationToken(token) {
    try {
      console.log('VerificationService.handleVerificationToken called with:', token);
      const result = await this.api.verifyEmail(token);
      console.log('VerificationService result:', result);
      this.navigation.navigate('FarmDetails');
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
      console.error('VerificationService.handleVerificationToken error:', {
        message: error.message,
        stack: error.stack,
      });
      this.navigation.navigate('ErrorScreen', {
        error: error.message.includes('expired')
          ? 'Verification link expired. Please resend.'
          : error.message.includes('401')
          ? 'Invalid or expired token.'
          : `Verification failed: ${error.message}`,
      });
      return {
        success: false,
        error: error.message,
      };
    }
  }
}