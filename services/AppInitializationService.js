// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getData } from '../utils/storage';

// export class AppInitializationService {
//   static STORAGE_KEYS = {
//     ONBOARDING: '@ZaoAPP:Onboarding',
//     REGISTRATION: '@ZaoAPP:Registration',
//     LOGIN: '@ZaoAPP:Login',
//     NEW_FARMER: '@ZaoAPP:NewFarmerForm',
//     EXPERIENCED_FARMER: '@ZaoAPP:ExperiencedFarmerForm',
//   };

//   static async loadAppState() {
//     try {
//       const [
//         onboardingStatus,
//         registrationStatus,
//         loginStatus,
//         newFarmerData,
//         experiencedFarmerData
//       ] = await Promise.all([
//         getData(this.STORAGE_KEYS.ONBOARDING),
//         getData(this.STORAGE_KEYS.REGISTRATION),
//         getData(this.STORAGE_KEYS.LOGIN),
//         AsyncStorage.getItem(this.STORAGE_KEYS.NEW_FARMER),
//         AsyncStorage.getItem(this.STORAGE_KEYS.EXPERIENCED_FARMER),
//       ]);

//       // Parse farmer data if available
//       const farmerData = this.parseFarmerData(newFarmerData, experiencedFarmerData);

//       return {
//         success: true,
//         data: {
//           isZaoAppOnboarded: onboardingStatus === true,
//           isRegistered: registrationStatus === true,
//           isLoggedIn: loginStatus === true,
//           farmerData,
//         }
//       };
//     } catch (error) {
//       console.warn('App initialization error:', error);
//       return {
//         success: false,
//         error: error.message
//       };
//     }
//   }

//   static parseFarmerData(newFarmerData, experiencedFarmerData) {
//     try {
//       if (newFarmerData) {
//         return {
//           type: 'new',
//           data: JSON.parse(newFarmerData)
//         };
//       }
//       if (experiencedFarmerData) {
//         return {
//           type: 'experienced',
//           data: JSON.parse(experiencedFarmerData)
//         };
//       }
//       return null;
//     } catch (error) {
//       console.warn('Error parsing farmer data:', error);
//       return null;
//     }
//   }

//   static determineInitialRoute(authState) {
//     if (authState.authError) return 'Error';
//     if (authState.isZaoAppOnboarded === false) return 'Onboarding';
//     if (authState.isLoggedIn) return 'MainTabs';
//     return 'Auth';
//   }
// }