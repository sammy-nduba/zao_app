export class VerifyEmailUseCase {
  /**
   * @param {object} userRepository - Repository for user operations
   * @param {object} storageService - Service for persistent storage operations
   */
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

  /**
   * Verifies user email and stores authentication token
   * @param {string} token - Verification token
   * @returns {Promise<object>} - {success: boolean, userId?: string, email?: string, token?: string, message?: string, error?: string}
   */
  async execute(token) {
    try {
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid verification token');
      }

      console.log('VerifyEmailUseCase.execute called with:', token);
      
      // Step 1: Verify email with repository
      const result = await this.userRepository.verifyEmail(token);
      console.log('VerifyEmailUseCase result:', result);

      if (!result?.token) {
        throw new Error('No authentication token received in verification response');
      }

      // Step 2: Store the JWT token securely
      try {
        await this.storageService.storeItem('jwtToken', result.token);
        console.log('JWT token stored successfully');
      } catch (storageError) {
        console.error('Token storage failed:', storageError);
        throw new Error('Failed to store authentication token');
      }

      // Step 3: Store additional user data if needed
      try {
        await this.storageService.storeItem('userData', {
          userId: result.userId,
          email: result.email
        });
      } catch (userDataError) {
        console.warn('User data storage failed (non-critical):', userDataError);
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
        timestamp: new Date().toISOString()
      });

      return {
        success: false,
        error: this._normalizeErrorMessage(error.message),
        // Include these for debugging but don't show to users
        _debug: process.env.NODE_ENV === 'development' ? {
          code: error.code,
          stack: error.stack
        } : undefined
      };
    }
  }

  /**
   * Normalizes error messages for consistent client handling
   * @private
   * @param {string} errorMessage - Original error message
   * @returns {string} - User-friendly error message
   */
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