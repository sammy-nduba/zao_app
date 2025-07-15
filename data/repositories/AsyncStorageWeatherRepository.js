import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageWeatherRepository {
  async saveWeather(weatherData, userId) {
    if (!userId) throw new Error('User ID is required for saving weather data');
    const key = `@ZaoAPP:WeatherData:${userId}`;
    try {
      console.log('AsyncStorageWeatherRepository.saveWeather:', { key, weatherData });
      await AsyncStorage.setItem(key, JSON.stringify(weatherData));
      return weatherData;
    } catch (error) {
      console.error('AsyncStorageWeatherRepository.saveWeather error:', error.message);
      throw new Error('Failed to save weather data');
    }
  }

  async getWeather(userId) {
    if (!userId) throw new Error('User ID is required for retrieving weather data');
    const key = `@ZaoAPP:WeatherData:${userId}`;
    try {
      console.log('AsyncStorageWeatherRepository.getWeather:', { key });
      const data = await AsyncStorage.getItem(key);
      const weather = data ? JSON.parse(data) : null;
      console.log('AsyncStorageWeatherRepository.getWeather result:', weather);
      return weather;
    } catch (error) {
      console.error('AsyncStorageWeatherRepository.getWeather error:', error.message);
      throw new Error('Failed to retrieve weather data');
    }
  }
}