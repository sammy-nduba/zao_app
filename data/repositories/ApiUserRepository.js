export class ApiUserRepository {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async register(user) {
    try {
      console.log('ApiUserRepository.register called with:', user);
      const signupResponse = await this.apiClient.post('/api/farmer/verify-email', {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        password: user.password,
      });
      console.log('Signup response:', signupResponse);
      const responseData = signupResponse.data ? signupResponse.data : signupResponse;
      if (!responseData || !responseData.message || !responseData.token) {
        console.error('Invalid response from /api/farmer/verify-email:', signupResponse);
        throw new Error(
          !responseData
            ? 'No response from server.'
            : !responseData.message
            ? 'No message in server response.'
            : !responseData.token
            ? 'Verification token missing from server response.'
            : 'Invalid server response.'
        );
      }
      return { message: responseData.message, token: responseData.token };
    } catch (error) {
      console.error('Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.config,
      });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to initiate registration. Please check your network or server status.'
      );
    }
  }

  async verifyEmail(token) {
    try {
      console.log('ApiUserRepository.verifyEmail called with:', token);
      const response = await this.apiClient.post('/api/farmer/register', { token });
      console.log('Verify email response:', response);
      return {
        userId: response._id,
        email: response.email,
        token: response.token,
        message: response.message || 'Registration successful.',
      };
    } catch (error) {
      console.error('Email verification error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Registration failed. Invalid or expired token.'
      );
    }
  }

  async resendVerification(email) {
    try {
      console.log('ApiUserRepository.resendVerification called with:', email);
      const response = await this.apiClient.post('/api/farmer/resend-verification', { email });
      console.log('Resend verification response:', response);
      return {
        success: true,
        message: response.message,
        token: response.token,
      };
    } catch (error) {
      console.error('Resend verification error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || 'Failed to resend verification email.'
      );
    }
  }

  async login({ email, password }) {
    try {
      console.log('ApiUserRepository.login called with:', { email });
      const response = await this.apiClient.post('/api/farmer/login', { email, password });
      console.log('Login response:', response);
      if (!response || !response._id || !response.email || !response.token) {
        console.error('Invalid login response:', response);
        throw new Error('Invalid login response from server.');
      }
      return {
        _id: response._id,
        email: response.email,
        token: response.token,
      };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to login. Please check your credentials or network.'
      );
    }
  }

  async requestResetPassword(email) {
    try {
      console.log('ApiUserRepository.requestResetPassword called with:', email);
      const response = await this.apiClient.post('/api/farmer/reset-password', { email });
      console.log('Request reset password response:', response);
      if (!response || !response.message || !response.token) {
        console.error('Invalid reset password response:', response);
        throw new Error('Invalid reset password response from server.');
      }
      return { message: response.message, token: response.token };
    } catch (error) {
      console.error('Request reset password error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to request password reset.'
      );
    }
  }

  async verifyOtp(email, otp) {
    try {
      console.log('ApiUserRepository.verifyOtp called with:', { email, otp });
      const response = await this.apiClient.post('/api/farmer/verify-otp', { email, otp });
      console.log('Verify OTP response:', response);
      if (!response || !response.message || !response.resetToken) {
        console.error('Invalid verify OTP response:', response);
        throw new Error('Invalid OTP verification response from server.');
      }
      return { message: response.message, resetToken: response.resetToken };
    } catch (error) {
      console.error('Verify OTP error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to verify OTP.'
      );
    }
  }

  async resetPassword(email, otp, newPassword) {
    try {
      console.log('ApiUserRepository.resetPassword called with:', { email, otp });
      const response = await this.apiClient.post('/api/farmer/reset-password-confirm', {
        email,
        otp,
        newPassword,
      });
      console.log('Reset password response:', response);
      if (!response || !response.message) {
        console.error('Invalid reset password response:', response);
        throw new Error('Invalid reset password response from server.');
      }
      return { message: response.message };
    } catch (error) {
      console.error('Reset password error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to reset password.'
      );
    }
  }
}