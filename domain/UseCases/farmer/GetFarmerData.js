import NetInfo from '@react-native-community/netinfo';

export class GetFarmerData {
  constructor(apiFarmerRepository, asyncStorageFarmerRepository) {
    this.apiFarmerRepository = apiFarmerRepository;
    this.asyncStorageFarmerRepository = asyncStorageFarmerRepository;
  }

  async execute(farmerType, userId) {
    try {
      // Check network status
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected;

      if (!isOnline) {
        console.log('GetFarmerData.execute: Offline, using AsyncStorage');
        const cachedFarmer = await this.asyncStorageFarmerRepository.getFarmer(farmerType, userId);
        if (cachedFarmer) {
          console.log('GetFarmerData.execute: Retrieved from AsyncStorage', cachedFarmer);
          return cachedFarmer;
        }
        throw new Error('No cached data available offline');
      }

      // Online: Try API and cache result
      console.log('GetFarmerData.execute: Online, trying API with', { farmerType, userId });
      const farmer = await this.apiFarmerRepository.getFarmer(farmerType);
      if (farmer) {
        await this.asyncStorageFarmerRepository.saveFarmer(farmer, userId);
        return farmer;
      }
      // Fallback to AsyncStorage if API returns no data
      const cachedFarmer = await this.asyncStorageFarmerRepository.getFarmer(farmerType, userId);
      if (cachedFarmer) {
        console.log('GetFarmerData.execute: API returned no data, using AsyncStorage', cachedFarmer);
        return cachedFarmer;
      }
      return null;
    } catch (error) {
      console.warn('GetFarmerData.execute: Error, trying AsyncStorage', error.message);
      try {
        const cachedFarmer = await this.asyncStorageFarmerRepository.getFarmer(farmerType, userId);
        if (cachedFarmer) {
          console.log('GetFarmerData.execute: Retrieved from AsyncStorage', cachedFarmer);
          return cachedFarmer;
        }
      } catch (storageError) {
        console.error('GetFarmerData.execute: AsyncStorage failed', storageError.message);
      }
      throw new Error(error.message.includes('502') || error.message.includes('timed out')
        ? 'You are offline. No cached data available.'
        : error.message);
    }
  }
}