import NetInfo from '@react-native-community/netinfo';

export class SaveFarmerData {
  constructor(apiFarmerRepository, asyncStorageFarmerRepository) {
    this.apiFarmerRepository = apiFarmerRepository;
    this.asyncStorageFarmerRepository = asyncStorageFarmerRepository;
  }

  async execute(farmerData, userId) {
    try {
      console.log('SaveFarmerData.execute called with:', { farmerData, userId });
      // Always save to AsyncStorage
      await this.asyncStorageFarmerRepository.saveFarmer(farmerData, userId);
      console.log('SaveFarmerData.execute: Saved to AsyncStorage');

      // Try API if online
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        const farmer = await this.apiFarmerRepository.saveFarmer(farmerData, userId);
        console.log('SaveFarmerData.execute success:', farmer);
        return farmer;
      }
      console.log('SaveFarmerData.execute: Offline, data saved locally');
      return farmerData; // Return local data when offline
    } catch (error) {
      console.warn('SaveFarmerData.execute: API failed', error.message);
      // Ensure AsyncStorage save even on API failure
      await this.asyncStorageFarmerRepository.saveFarmer(farmerData, userId);
      console.log('SaveFarmerData.execute: Saved to AsyncStorage');
      if (error.message.includes('502') || error.message.includes('timed out')) {
        return farmerData; // Return local data for offline
      }
      throw new Error(error.message);
    }
  }
}