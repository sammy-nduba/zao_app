import NetInfo from '@react-native-community/netinfo';

export class GetWeatherUseCase {
  constructor(weatherRepository, asyncStorageWeatherRepository) {
    this.weatherRepository = weatherRepository;
    this.asyncStorageWeatherRepository = asyncStorageWeatherRepository;
  }

  async execute(userId) {
    try {
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected;

      if (!isOnline) {
        console.log('GetWeatherUseCase.execute: Offline, using AsyncStorage');
        const cachedWeather = await this.asyncStorageWeatherRepository.getWeather(userId);
        if (cachedWeather) {
          console.log('GetWeatherUseCase.execute: Retrieved from AsyncStorage', cachedWeather);
          return cachedWeather;
        }
        throw new Error('No cached weather data available offline');
      }

      console.log('GetWeatherUseCase.execute called');
      const results = await Promise.allSettled([
        this.weatherRepository.getCurrentWeather(),
        this.weatherRepository.getWeatherForecast(),
      ]);
      console.log('GetWeatherUseCase results:', results);

      const [currentResult, forecastResult] = results;
      const current = currentResult.status === 'fulfilled' ? currentResult.value : null;
      const forecast = forecastResult.status === 'fulfilled' ? forecastResult.value : [];
      const weatherData = { current, forecast };

      if (current || forecast.length) {
        await this.asyncStorageWeatherRepository.saveWeather(weatherData, userId);
        console.log('GetWeatherUseCase.execute: Saved to AsyncStorage', weatherData);
      }

      console.log('GetWeatherUseCase result:', weatherData);
      return weatherData;
    } catch (error) {
      console.warn('GetWeatherUseCase.execute: Error, trying AsyncStorage', error.message);
      try {
        const cachedWeather = await this.asyncStorageWeatherRepository.getWeather(userId);
        if (cachedWeather) {
          console.log('GetWeatherUseCase.execute: Retrieved from AsyncStorage', cachedWeather);
          return cachedWeather;
        }
      } catch (storageError) {
        console.error('GetWeatherUseCase.execute: AsyncStorage failed', storageError.message);
      }
      throw new Error(error.message.includes('502') || error.message.includes('timed out')
        ? 'You are offline. No cached weather data available.'
        : error.message);
    }
  }
}