import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import container from '../infrastructure/di/Container';

export class SyncService {
  static async syncOfflineData(userId) {
    if (!userId) return;
    const apiFarmerRepository = container.get('apiFarmerRepository');
    const apiWeatherRepository = container.get('weatherRepository');
    const apiNewsRepository = container.get('newsRepository');
    const keys = await AsyncStorage.getAllKeys();
    const farmerKeys = keys.filter(key => key.startsWith('@ZaoAPP:NewFarmerForm:') || key.startsWith('@ZaoAPP:ExperiencedFarmerForm:'));
    const weatherKey = `@ZaoAPP:WeatherData:${userId}`;
    const newsKey = `@ZaoAPP:NewsData:${userId}`;

    // Sync farmer data
    for (const key of farmerKeys) {
      try {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const farmer = JSON.parse(data);
          console.log('SyncService: Syncing farmer', { key, farmer });
          await apiFarmerRepository.saveFarmer(farmer, userId);
          console.log('SyncService: Synced farmer successfully', { key });
        }
      } catch (error) {
        console.error('SyncService: Failed to sync farmer', { key, error: error.message });
      }
    }

    // Sync weather data
    try {
      const weatherData = await AsyncStorage.getItem(weatherKey);
      if (weatherData) {
        console.log('SyncService: Syncing weather', { weatherKey });
        await apiWeatherRepository.saveWeather(JSON.parse(weatherData));
        console.log('SyncService: Synced weather successfully');
      }
    } catch (error) {
      console.error('SyncService: Failed to sync weather', { error: error.message });
    }

    // Sync news data
    try {
      const newsData = await AsyncStorage.getItem(newsKey);
      if (newsData) {
        console.log('SyncService: Syncing news', { newsKey });
        await apiNewsRepository.saveNews(JSON.parse(newsData));
        console.log('SyncService: Synced news successfully');
      }
    } catch (error) {
      console.error('SyncService: Failed to sync news', { error: error.message });
    }
  }

  static startSync(userId) {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('SyncService: Device online, starting sync');
        this.syncOfflineData(userId);
      }
    });
    return unsubscribe;
  }
}