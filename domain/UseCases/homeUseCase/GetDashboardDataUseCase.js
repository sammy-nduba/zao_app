import NetInfo from '@react-native-community/netinfo';

export class GetDashboardDataUseCase {
  constructor(dashboardRepository, asyncStorageFarmerRepository) {
    this.dashboardRepository = dashboardRepository;
    this.asyncStorageFarmerRepository = asyncStorageFarmerRepository;
  }

  async execute(userId) {
    try {
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected;

      if (!isOnline) {
        console.log('GetDashboardDataUseCase.execute: Offline, using AsyncStorage');
        const cachedFarmer = await this.asyncStorageFarmerRepository.getFarmer('new', userId) ||
                            await this.asyncStorageFarmerRepository.getFarmer('experienced', userId);
        if (cachedFarmer) {
          console.log('GetDashboardDataUseCase.execute: Retrieved from AsyncStorage', cachedFarmer);
          return { cropData: cachedFarmer, alerts: [] };
        }
        throw new Error('No cached crop data available offline');
      }

      console.log('GetDashboardDataUseCase.execute: Online, trying dashboard repository');
      const dashboardData = await this.dashboardRepository.getDashboardData(userId);
      if (dashboardData?.cropData) {
        await this.asyncStorageFarmerRepository.saveFarmer(dashboardData.cropData, userId);
        return dashboardData;
      }
      const cachedFarmer = await this.asyncStorageFarmerRepository.getFarmer('new', userId) ||
                           await this.asyncStorageFarmerRepository.getFarmer('experienced', userId);
      if (cachedFarmer) {
        console.log('GetDashboardDataUseCase.execute: Dashboard returned no data, using AsyncStorage', cachedFarmer);
        return { cropData: cachedFarmer, alerts: [] };
      }
      return null;
    } catch (error) {
      console.warn('GetDashboardDataUseCase.execute: Error, trying AsyncStorage', error.message);
      try {
        const cachedFarmer = await this.asyncStorageFarmerRepository.getFarmer('new', userId) ||
                             await this.asyncStorageFarmerRepository.getFarmer('experienced', userId);
        if (cachedFarmer) {
          return { cropData: cachedFarmer, alerts: [] };
        }
      } catch (storageError) {
        console.error('GetDashboardDataUseCase.execute: AsyncStorage failed', storageError.message);
      }
      throw new Error(error.message.includes('502') || error.message.includes('timed out')
        ? 'You are offline. No cached crop data available.'
        : error.message);
    }
  }
}