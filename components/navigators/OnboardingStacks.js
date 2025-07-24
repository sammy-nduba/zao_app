import React, { useCallback, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../utils/AuthContext';
import { useContainer } from '../../utils/ContainerProvider';

// Components
import Welcome from '../../screens/Welcome';
import LanguageSelectionScreen from '../../screens/LanguageSelectionScreen';
import SkipButton from '../Buttons/StyledButton';

const Stack = createStackNavigator();

const LanguageSelectionScreenWrapper = React.memo((props) => {
  const { container } = useContainer();
  const presenter = container.get('languageSelectionPresenter');
  
  return (
    <LanguageSelectionScreen
      presenter={presenter}
      navigation={props.navigation}
    />
  );
});

const OnboardingStack = () => {
  const { setIsZaoAppOnboarded } = useAuth();
  const [completingOnboarding, setCompletingOnboarding] = useState(false);

  const completeOnboarding = useCallback(async () => {
    try {
      setCompletingOnboarding(true);
      await setIsZaoAppOnboarded(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setCompletingOnboarding(false);
    }
  }, [setIsZaoAppOnboarded]);

  return (
    <Stack.Navigator
      initialRouteName="LanguageSelection"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="LanguageSelection"
        component={LanguageSelectionScreenWrapper}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerRight: () => (
            <SkipButton 
              onPress={completeOnboarding}
              isLoading={completingOnboarding}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;