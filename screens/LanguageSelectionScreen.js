import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useLanguageSelection } from '../viewModel/LanguageSelectionPresenter';
import { colors } from '../config/theme';

const LanguageItem = React.memo(({ language, isSelected, onSelect }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      style={[styles.languageItem, isSelected && styles.selectedItem]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.languageContent}>
        <Text style={styles.flag}>{language.flag}</Text>
        <Text style={styles.languageName}>{language.name}</Text>
      </View>
      <View style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
        {isSelected && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );
});

export default function LanguageSelectionScreen({ presenter, navigation }) {
  const { t } = useTranslation();
  const { languages, selectedLanguageId, isLoading, error, selectLanguage } =
    useLanguageSelection(presenter);
  

  const handleContinue = () => {
    if (selectedLanguageId) {
      navigation.navigate('Welcome');
    } else {
      Alert.alert(t('language.title'), t('language.select_language_error'));
    }
  };

  if (error) {
    Alert.alert(t('common.error'), error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('language.title')}</Text>
        <Text style={styles.subtitle}>{t('language.subtitle')}</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        ) : (
          <View style={styles.languageList}>
            {languages.map((language) => (
              <LanguageItem
                key={language.id}
                language={language}
                isSelected={selectedLanguageId === language.id}
                onSelect={() => selectLanguage(language.id)}
              />
            ))}
          </View>
        )}

        <TouchableOpacity
          style={[styles.continueButton, (!selectedLanguageId || isLoading) && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!selectedLanguageId || isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>{t('language.continue')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    marginTop: 75,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageList: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF3EA',
    padding: 20,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedItem: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  languageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#4CAF50',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 60
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});