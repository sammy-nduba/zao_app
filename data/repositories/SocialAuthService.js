// src/data/repositories/SocialAuthService.js
export class SocialAuthService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async register(provider) {
    try {
      console.log('SocialAuthService.register called with:', provider); // Debug
      const response = await this.apiClient.post(`/auth/${provider.toLowerCase()}/register`);
      return response.data;
    } catch (error) {
      console.error('SocialAuthService.register error:', error); // Debug
      throw new Error(error.response?.data?.message || 'Social registration failed');
    }
  }

  async login(provider) {
    try {
      console.log('SocialAuthService.login called with:', provider); // Debug
      const response = await this.apiClient.post(`/auth/${provider.toLowerCase()}/login`);
      console.log('SocialAuthService.login response:', response.data); // Debug
      return response.data;
    } catch (error) {
      console.error('SocialAuthService.login error:', error); // Debug
      throw new Error(error.response?.data?.message || `Social login failed: ${error.message}`);
    }
  }
}