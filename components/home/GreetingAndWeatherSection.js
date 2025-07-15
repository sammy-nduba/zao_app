import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { colors } from '../../config/theme';

const insightBackground = require('../../assets/insights/header-background.png');

const GreetingAndWeatherSection = ({ weatherData }) => {
  console.log('GreetingAndWeatherSection weatherData:', weatherData); // Debug

  if (!weatherData || !weatherData.current) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.noDataText}>Weather data unavailable</Text>
      </View>
    );
  }

  const { current } = weatherData;

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

  const formatDate = () => {
    const now = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${now.toLocaleDateString('en-US', options)} - ${time}`;
  };

  return (
    <ImageBackground source={insightBackground} style={styles.greetingWeatherContainer} resizeMode="cover">
      <View style={styles.greetingWeatherOverlay}>
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Good Afternoon Annie!</Text>
          <Text style={styles.dateTime}>{formatDate()}</Text>
        </View>
        <View style={styles.weatherMain}>
          <View style={styles.weatherLeft}>
            <Text style={styles.weatherIcon}>{getWeatherIcon(current.condition)}</Text>
            <Text style={styles.temperature}>{current.temperature}°C</Text>
            <Text style={styles.location}>{current.location}</Text>
          </View>
          <View style={styles.weatherStats}>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>💧</Text>
              <Text style={styles.weatherStatLabel}>Precipitation: {current.precipitation}%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>💨</Text>
              <Text style={styles.weatherStatLabel}>Wind: {current.wind} km/h</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>💦</Text>
              <Text style={styles.weatherStatLabel}>Humidity: {current.humidity}%</Text>
            </View>
            <View style={styles.weatherStat}>
              <Text style={styles.weatherStatIcon}>🌅</Text>
              <Text style={styles.weatherStatLabel}>Sunset: {current.sunset}</Text>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  greetingWeatherContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  greetingWeatherOverlay: {},
  greetingSection: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 5,
  },
  dateTime: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLeft: {
    alignItems: 'center',
    flex: 1,
  },
  weatherIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 5,
  },
  location: {
    fontSize: 18,
    color: '#E3F2FD',
    fontWeight: '500',
  },
  weatherStats: {
    flex: 1,
    paddingLeft: 20,
  },
  weatherStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherStatIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  weatherStatLabel: {
    fontSize: 14,
    color: '#E3F2FD',
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

export default GreetingAndWeatherSection;