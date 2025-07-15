import AsyncStorage from '@react-native-async-storage/async-storage';

export class LanguageRepositoryImpl {
  constructor() {
    this.LANGUAGE_KEY = 'selected_language';
    this.languages = [
      { id: '1', name: 'English', flag: '🇬🇧', code: 'en' },
      { id: '2', name: 'Spanish', flag: '🇪🇸', code: 'es' },
      { id: '3', name: 'French', flag: '🇫🇷', code: 'fr' },
      { id: '4', name: 'Portuguese', flag: '🇵🇹', code: 'pt' },
      { id: '5', name: 'Swahili', flag: '🇰🇪', code: 'sw' },
    ];
  }

  async getAvailableLanguages() {
    return this.languages;
  }

  async saveSelectedLanguage(languageId) {
    await AsyncStorage.setItem(this.LANGUAGE_KEY, languageId);
  }

  async getSelectedLanguage() {
    return await AsyncStorage.getItem(this.LANGUAGE_KEY);
  }
}