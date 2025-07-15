// src/data/repositories/ApiWeatherRepository.js
import { WeatherRepository } from '../../domain/repository/WeatherRepository';
import { WeatherData } from '../../domain/entities/WeatherData';
import { WeatherForecast } from '../../domain/entities/WeatherForecast';

export class ApiWeatherRepository extends WeatherRepository {
  constructor(apiClient) {
    super();
    this.apiClient = apiClient;
  }

  async getCurrentWeather() {
    try {
      console.log('ApiWeatherRepository.getCurrentWeather called'); // Debug
      const response = await this.apiClient.get('/current.json', {
        params: {
          key: '755fb3d168444a3892a80927250906',
          q: 'Nairobi',
          aqi: 'no',
        },
      });
      console.log('ApiWeatherRepository.getCurrentWeather response:', response.data); // Debug
      const data = response.data.current;
      return new WeatherData(
        data.temp_c,
        response.data.location.name, // Use API location
        data.precip_mm * 10, // Convert to percentage
        data.humidity,
        data.wind_kph,
        '6:30 PM', // Hardcode fallback as /current.json lacks astro
        data.condition.text.toLowerCase().replace(/\s/g, '_')
      );
    } catch (error) {
      console.error('ApiWeatherRepository.getCurrentWeather error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }); // Debug
      return null;
    }
  }

  async getWeatherForecast() {
    try {
      console.log('ApiWeatherRepository.getWeatherForecast called'); // Debug
      const response = await this.apiClient.get('/forecast.json', {
        params: {
          key: '755fb3d168444a3892a80927250906',
          q: 'Nairobi',
          days: 7,
        },
      });
      console.log('ApiWeatherRepository.getWeatherForecast response:', response.data); // Debug
      const forecast = response.data.forecast.forecastday;
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      return forecast.map((day) => {
        const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        return new WeatherForecast(
          dayName,
          day.day.avgtemp_c,
          day.day.condition.text.toLowerCase().replace(/\s/g, '_'),
          dayName === today
        );
      });
    } catch (error) {
      console.error('ApiWeatherRepository.getWeatherForecast error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      }); // Debug
      return [];
    }
  }
}