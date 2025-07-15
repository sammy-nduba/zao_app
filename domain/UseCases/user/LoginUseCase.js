export class LoginUserUseCase {
    constructor(userRepository, validationService, storageService) {
      this.userRepository = userRepository;
      this.validationService = validationService;
      this.storageService = storageService;
    }
  
    async execute(loginData) {
      try {
        console.log('LoginUserUseCase.execute called with:', loginData); // Debug
        const validationResult = this.validationService.validateLoginData(loginData);
        if (!validationResult.isValid) {
          throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
        }
  
        const user = await this.userRepository.login(loginData);
        console.log('User logged in:', user); // Debug
  
        await this.storageService.storeItem('Login', true);
        console.log('Stored Login status'); // Debug
  
        return user;
      } catch (error) {
        console.error('LoginUserUseCase error:', error); // Debug
        throw new Error(error.message);
      }
    }
  }
  
  export class SocialLoginUseCase {
    constructor(socialAuthService, storageService) {
      this.socialAuthService = socialAuthService;
      this.storageService = storageService;
    }
  
    async execute(provider) {
      try {
        console.log('SocialLoginUseCase.execute called with:', provider); // Debug
        const user = await this.socialAuthService.login(provider);
        console.log('Social user logged in:', user); // Debug
        await this.storageService.storeItem('Login', true);
        console.log('Stored Social Login status'); // Debug
        return user;
      } catch (error) {
        console.error('SocialLoginUseCase error:', error); // Debug
        throw new Error(error.message);
      }
    }
  }