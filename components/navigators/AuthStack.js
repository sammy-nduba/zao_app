import React from 'react';
import {
  FarmDetails,
  Login,
  Register,
  ForgotPassword,
  OTPScreen,
  NewFarmerForm,
  ExperiencedFarmerForm
} from '../../screens';
import EmailVerification  from '../../screens/user/EmailVerification';
import { createStackNavigator } from '@react-navigation/stack';




const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="FarmDetails" component={FarmDetails} />
      <Stack.Screen name="NewFarmerForm" component={NewFarmerForm} />
      <Stack.Screen name="ExperiencedFarmerForm" component={ExperiencedFarmerForm} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />

    </Stack.Navigator>
  );
};

export default AuthStack;