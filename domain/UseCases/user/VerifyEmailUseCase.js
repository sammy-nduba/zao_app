// domain/UseCases/user/VerifyEmailUseCase.js
export class VerifyEmailUseCase {
  constructor(userRepository, storageService) {
    if (!userRepository) {
      throw new Error('userRepository is required');
    }
    if (!storageService) {
      throw new Error('storageService is required');
    }

    this.userRepository = userRepository;
    this.storageService = storageService;
  }

  async execute(token) {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid verification token');
      }

      console.log('VerifyEmailUseCase.execute called with:', token);

      // Step 1: Verify email with repository
      const result = await this.userRepository.verifyEmail(token);
      console.log('VerifyEmailUseCase result:', result);

      if (!result?.token || !result?.userId) {
        throw new Error('Invalid verification response: token or userId missing');
      }

      // Step 2: Store the JWT token
      try {
        await this.storageService.storeItem('jwtToken', result.token);
        console.log('VerifyEmailUseCase: JWT token stored successfully');
      } catch (storageError) {
        console.error('VerifyEmailUseCase: Token storage failed:', storageError);
        throw new Error('Failed to store authentication token');
      }

      // Step 3: Store user data with verification status
      const userData = {
        id: result.userId,
        email: result.email,
        isVerified: true,
        isRegistrationComplete: false,
      };
      try {
        await this.storageService.storeItem('user', JSON.stringify(userData));
        console.log('VerifyEmailUseCase: User data stored:', userData);
      } catch (userDataError) {
        console.warn('VerifyEmailUseCase: User data storage failed (non-critical):', userDataError);
      }

      return {
        success: true,
        userId: result.userId,
        email: result.email,
        token: result.token,
        message: result.message || 'Email verified successfully',
      };
    } catch (error) {
      console.error('VerifyEmailUseCase.execute error:', {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: this._normalizeErrorMessage(error.message),
        _debug: process.env.NODE_ENV === 'development' ? {
          code: error.code,
          stack: error.stack,
        } : undefined,
      };
    }
  }

  _normalizeErrorMessage(errorMessage) {
    const message = errorMessage || 'Verification failed';

    if (message.includes('network')) return 'Network error. Please check your connection.';
    if (message.includes('timeout')) return 'Request timed out. Please try again.';
    if (message.includes('400')) return 'Invalid verification token.';
    if (message.includes('401')) return 'Expired or invalid verification link.';
    if (message.includes('404')) return 'Verification token not found.';
    if (message.includes('409')) return 'Email already verified.';
    if (message.includes('500') || message.includes('502')) return 'Server error. Please try again later.';

    return message;
  }
}