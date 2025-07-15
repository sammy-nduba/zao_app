export class SelectLanguageUseCase {
    constructor(languageRepository) {
      this.languageRepository = languageRepository;
    }
  
    async execute(languageId) {
      await this.languageRepository.saveSelectedLanguage(languageId);
    }
  }