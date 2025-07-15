import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../config/theme';

const WeatherForecast = ({ weatherData }) => {
  console.log('WeatherForecast weatherData:', weatherData); // Debug

  if (!weatherData || !weatherData.forecast?.length) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.noDataText}>Forecast unavailable</Text>
      </View>
    );
  }

  const { forecast } = weatherData;

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'partly_cloudy': return '⛅';
      case 'rain': return '🌧️';
      case 'partly_cloudy_rain': return '🌦️';
      case 'patchy_rain_nearby': return '🌦️'; // Handle API condition
      default: return '🌤️';
    }
  };

  return (
    <View style={styles.forecastContainer}>
      <Text style={styles.forecastTitle}>Seven Day Forecast</Text>
      <View style={styles.forecastDays}>
        {forecast.map((day, index) => (
          <View key={`${day.day}-${index}`} style={[styles.forecastDay, day.isToday && styles.forecastDayToday]}>
            <Text style={[styles.forecastDayText, day.isToday && styles.forecastDayTextToday]}>
              {day.day}
            </Text>
            <Text style={styles.forecastIcon}>{getWeatherIcon(day.condition)}</Text>
            <Text style={[styles.forecastTemp, day.isToday && styles.forecastTempToday]}>
              {day.temperature}°
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  forecastDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    minWidth: 40,
  },
  forecastDayToday: {
    backgroundColor: '#FF9800',
  },
  forecastDayText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  forecastDayTextToday: {
    color: '#fff',
    fontWeight: '600',
  },
  forecastIcon: {
    fontSize: 16,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 12,
    color: '#666666',
  },
  forecastTempToday: {
    color: '#fff',
    fontWeight: '600',
  },
  fallbackContainer: {
    padding: 20,
    backgroundColor: colors.background,
  },
  noDataText: {
    fontSize: 16,
    color: colors.grey[600],
    textAlign: 'center',
  },
});

export default WeatherForecast;