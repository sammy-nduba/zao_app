import { Dimensions, Platform } from 'react-native';



// for OS
export const onIOS = Platform.OS === "ios";



// screen Dimensions 
export const ScreenWidth = Dimensions.get("screen").width;
export const ScreenHeight = Dimensions.get("screen").height;