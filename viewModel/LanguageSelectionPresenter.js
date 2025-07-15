import { useState, useEffect, useCallback } from 'react';
import { changeLanguage } from '../infrastructure/i18n/i18n';

export class LanguageSelectionPresenter {
  constructor(getAvailableLanguagesUseCase, selectLanguageUseCase, getSelectedLanguageUseCase) {
    this.getAvailableLanguagesUseCase = getAvailableLanguagesUseCase;
    this.selectLanguageUseCase = selectLanguageUseCase;
    this.getSelectedLanguageUseCase = getSelectedLanguageUseCase;
    this.state = {
      languages: [],
      selectedLanguageId: '',
      isLoading: false,
      error: null,
    };
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  async loadLanguages() {
    this.setState({ isLoading: true, error: null });
    try {
      const [languages, selectedId] = await Promise.all([
        this.getAvailableLanguagesUseCase.execute(),
        this.getSelectedLanguageUseCase.execute(),
      ]);
      this.setState({
        languages,
        selectedLanguageId: selectedId || '1', // Default to English
        isLoading: false,
      });
    } catch (error) {
      this.setState({
        error: 'Failed to load languages',
        isLoading: false,
      });
    }
  }

  async selectLanguage(languageId) {
    try {
      await this.selectLanguageUseCase.execute(languageId);
      await changeLanguage(languageId); // Trigger dynamic language change
      this.setState({ selectedLanguageId: languageId });
    } catch (error) {
      this.setState({ error: 'Failed to save language selection' });
    }
  }

  getState() {
    return this.state;
  }
}

export const useLanguageSelection = (presenter) => {
  const [state, setState] = useState(presenter.getState());

  useEffect(() => {
    const unsubscribe = presenter.subscribe(setState);
    presenter.loadLanguages();
    return unsubscribe;
  }, [presenter]);

  const selectLanguage = useCallback(
    (languageId) => presenter.selectLanguage(languageId),
    [presenter]
  );

  return {
    ...state,
    selectLanguage,
  };
};