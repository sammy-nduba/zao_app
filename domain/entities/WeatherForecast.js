

export class WeatherForecast {
    constructor(day, temperature, condition, isToday = false) {
      this.day = day;
      this.temperature = temperature;
      this.condition = condition;
      this.isToday = isToday;
    }
  }