export class SocialRegisterUseCase {
    constructor(socialAuthService, storageService) {
      this.socialAuthService = socialAuthService;
      this.storageService = storageService;
    }
  
    async execute(provider) {
      try {
        console.log('SocialRegisterUseCase.execute called with:', provider); // Debug
        const user = await this.socialAuthService.register(provider);
        await this.storageService.storeItem('Registration', true);
        console.log('Stored Social Registration status'); // Debug
        return user;
      } catch (error) {
        console.error('SocialRegisterUseCase error:', error); // Debug
        throw new Error(error.message);
      }
    }
  }
  