export class GetSelectedLanguageUseCase {
    constructor(languageRepository) {
      this.languageRepository = languageRepository;
    }
  
    async execute() {
      return await this.languageRepository.getSelectedLanguage();
    }
  }