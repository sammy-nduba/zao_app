import { WeatherRepository } from "../WeatherRepository";
import { WeatherData}  from '../../../models/crop-instights/WeatherData'
import { WeatherForecast } from '../../../models/crop-instights/WeatherForecast'



export class LocalWeatherRepository extends WeatherRepository {
    async getCurrentWeather() {
      return new WeatherData(
        18, 
        'Ngenyilel', 
        21, 
        59, 
        10, 
        29, 
        'partly_cloudy_rain'
      );
    }
    
    async getWeatherForecast() {
      return [
        new WeatherForecast('S', 18, 'rain'),
        new WeatherForecast('M', 20, 'cloudy'),
        new WeatherForecast('T', 22, 'sunny', true),
        new WeatherForecast('W', 19, 'partly_cloudy'),
        new WeatherForecast('T', 21, 'cloudy'),
        new WeatherForecast('F', 23, 'sunny'),
        new WeatherForecast('S', 20, 'rain')
      ];
    }
  }