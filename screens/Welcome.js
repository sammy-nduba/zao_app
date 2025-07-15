import React, { useContext, useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { onBoardingData } from '../config/onBoardingData';
import StyledText from '../components/Texts/StyledText';
import { colors } from '../config/theme';
import { ScreenWidth } from '../config/constants';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../utils/AuthContext';
import { useTranslation } from 'react-i18next';

const Welcome = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activeScreen, setActiveScreen] = useState(route.params?.activeScreen || 1);
  const [completingOnboarding, setCompletingOnboarding] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { setIsZaoAppOnboarded } = useContext(AuthContext);
  const onLastScreen = activeScreen === onBoardingData.length;

  const completeOnboarding = async () => {
    try {
      setCompletingOnboarding(true);
      await setIsZaoAppOnboarded(true);
      navigation.replace('Auth'); 
    } catch (error) {
      console.warn('Error completing onboarding:', error);
    } finally {
      setCompletingOnboarding(false);
    }
  };

  const handleNext = () => {
    if (onLastScreen) {
      completeOnboarding();
    } else {
      setActiveScreen(activeScreen + 1);
    }
  };

  const currentItem = onBoardingData[activeScreen - 1];
  if (!currentItem) {
    console.error(`Data undefined for activeScreen: ${activeScreen}`);
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        {imageLoading && <ActivityIndicator size="large" color={colors.primary[600]} />}
        <Image
        source={imageLoading ? currentItem.placeholder : currentItem.image}
          // source={ currentItem.image}
          style={styles.image}
          resizeMode="contain"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            console.error(`Failed to load image for screen ${activeScreen}`);
            setImageLoading(false);
          }}
        />
        <TouchableOpacity style={styles.skipButton} onPress={completeOnboarding}>
          <StyledText style={styles.skipText}>{t('common.skip')}</StyledText>
        </TouchableOpacity>
      </View>
      <View style={styles.contentCard}>
        <StyledText style={styles.title}>{t(currentItem.title)}</StyledText>
        <StyledText style={styles.summary}>{t(currentItem.summary)}</StyledText>
      </View>
      <View style={styles.bottomContent}>
        <View style={styles.pageIndicators}>
          {onBoardingData.map((item) => (
            <MaterialCommunityIcons
              name={
                item.id === activeScreen
                  ? 'checkbox-blank-circle'
                  : 'checkbox-blank-circle-outline'
              }
              size={15}
              color={colors.primary[600]}
              key={item.id}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.floatingButton, onLastScreen && styles.getStartedButton]}
          disabled={completingOnboarding}
          onPress={handleNext}
        >
          {onLastScreen ? (
            <StyledText style={styles.getStartedText}>{t('welcome.get_started')}</StyledText>
          ) : (
            <Feather name="arrow-right" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  imageView: {
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    // width: ScreenWidth,
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 100,
    height: 48,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  skipText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    color: colors.grey[800],
  },
  contentCard: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 24,
    paddingTop: 30,
    flex: 1,
    marginTop: -50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 28,
    color: colors.primary[600],
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'left',
  },
  summary: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    color: colors.grey[600],
    textAlign: 'left',
    lineHeight: 20,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 70,
  },
  pageIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  getStartedButton: {
    width: 140,
    height: 56,
    borderRadius: 32,
  },
  getStartedText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default Welcome;