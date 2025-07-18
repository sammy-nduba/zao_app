import NetInfo from '@react-native-community/netinfo';

export class GetFarmerData {
  constructor(apiFarmerRepository, asyncStorageFarmerRepository) {
    this.apiFarmerRepository = apiFarmerRepository;
    this.asyncStorageFarmerRepository = asyncStorageFarmerRepository;
  }

  async execute({ farmerType, userId }) {
    try {
      console.log('GetFarmerData: Fetching farmer data for user:', userId);
      const farmer = await this.apiFarmerRepository.getFarmer(userId);
      if (farmer) {
        return farmer;
      }
      console.log('GetFarmerData: No API data, trying AsyncStorage');
      const cachedData = await this.asyncStorageFarmerRepository.getFarmer({
        farmerType,
        key: `@ZaoAPP:${farmerType}FarmerForm:${userId}`,
      });
      return cachedData || null;
    } catch (error) {
      console.error('GetFarmerData: Error fetching farmer data:', error);
      throw new Error(`Failed to retrieve farmer data: ${error.message}`);
    }
  }
}