



export class GetAvailableLanguagesUseCase {
    constructor(languageRepository) {
      this.languageRepository = languageRepository;
    }
  
    async execute() {
      return await this.languageRepository.getAvailableLanguages();
    }
  }