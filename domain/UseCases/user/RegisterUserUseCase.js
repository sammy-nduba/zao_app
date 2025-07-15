export class RegisterUserUseCase {
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
   * Handles user registration initiation
   * @param {object} user - User data {firstName, lastName, email, phoneNumber, password}
   * @returns {Promise<object>} - {success: boolean, message?: string, token?: string, error?: string}
   */
  async initiateSignup(user) {
    try {
      if (!user || typeof user !== 'object') {
        throw new Error('Invalid user data');
      }

      console.log('RegisterUserUseCase.initiateSignup called with:', user);
      const result = await this.userRepository.register(user);
      console.log('RegisterUserUseCase result:', result);

      return {
        success: true,
        message: result.message,
        token: result.token,
      };
    } catch (error) {
      console.error('RegisterUserUseCase.initiateSignup error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Verifies user email with the provided token
   * @param {string} token - Verification token
   * @returns {Promise<object>} - {success: boolean, userId?: string, email?: string, token?: string, message?: string, error?: string}
   */
  async verifyEmail(token) {
  try {
    console.log('RegisterUserUseCase.verifyEmail called with:', token);
    const response = await this.userRepository.verifyEmail(token);
    console.log('RegisterUserUseCase.verifyEmail result:', response);

    if (!response?.token) {
      throw new Error('No token received in verification response');
    }

    // Changed from setItem to storeItem to match StorageService
    await this.storageService.storeItem('jwtToken', response.token);
    
    return {
      success: true,
      userId: response.userId,
      email: response.email,
      token: response.token,
      message: response.message,
    };
    } catch (error) {
      console.error('RegisterUserUseCase.verifyEmail error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Resends verification email
   * @param {string} email - User email address
   * @returns {Promise<object>} - {success: boolean, message?: string, token?: string, error?: string}
   */
  async resendVerification(email) {
    try {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error('Invalid email address');
      }

      console.log('RegisterUserUseCase.resendVerification called with:', email);
      const response = await this.userRepository.resendVerification(email);
      console.log('RegisterUserUseCase.resendVerification result:', response);

      return {
        success: true,
        message: response.message,
        token: response.token,
      };
    } catch (error) {
      console.error('RegisterUserUseCase.resendVerification error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });

      return {
        success: false,
        error: this._handleError(error),
      };
    }
  }

  /**
   * Handles common error cases
   * @private
   * @param {Error} error - The caught error
   * @returns {string} - User-friendly error message
   */
  _handleError(error) {
    const errorMessage = error.message || 'An unexpected error occurred';

    if (errorMessage.includes('409')) return 'Email already registered';
    if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
      return 'Network error. Please check your connection.';
    }
    if (errorMessage.includes('400')) return 'Invalid request data';
    if (errorMessage.includes('401')) return 'Unauthorized access';
    if (errorMessage.includes('404')) return 'Resource not found';
    if (errorMessage.includes('429')) return 'Too many requests. Please try again later.';
    if (errorMessage.includes('502')) return 'Server error. Please try again later.';

    return errorMessage;
  }
}