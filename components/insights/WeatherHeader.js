import React from 'react';
import { Text, StyleSheet, Image, ImageBackground  } from 'react-native';
import { spacing, fonts, colors } from '../../config/theme';

const clouds = require('../../assets/insights/partly_cloudy.png')
const castBackground = require('../../assets/insights/header-background.png')

const WeatherHeader = ({ dateTime, forecast }) => {
    return (
      <ImageBackground style={styles.container} source={castBackground} >

        <Text style={styles.greeting}>Good Afternoon </Text>
        <Text style={styles.dateTime}>{dateTime}</Text>
        <Image source = {clouds}></Image>
        

        </ImageBackground>
    

        
        // <View style={styles.forecastContainer}>
        //   <Text style={styles.sectionTitle}>Seven Day Forecast</Text>
        //   <View style={styles.forecastDays}>
        //     {forecast.map((day, index) => (
        //       <View key={index} style={styles.dayContainer}>
        //         <Text style={styles.dayAbbreviation}>{day.abbreviation}</Text>
        //         <Text style={styles.temperature}>{day.temperature}°</Text>
        //       </View>
        //     ))}
        //   </View>
        // </View>
      
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: spacing.large,
    //   backgroundColor: colors.primaryLight,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      
    },
    greeting: {
      ...fonts.largeTitle,
      color: colors.white,
      marginBottom: spacing.small,
    },
    dateTime: {
      ...fonts.body,
      color: colors.white,
      opacity: 0.8,
      marginBottom: spacing.large,
    },
    sectionTitle: {
      ...fonts.subtitle,
      color: colors.white,
      marginBottom: spacing.medium,
    },
    forecastContainer: {
      marginTop: spacing.medium,
    },
    forecastDays: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    dayContainer: {
      alignItems: 'center',
    },
    dayAbbreviation: {
      ...fonts.bodyBold,
      color: colors.white,
      marginBottom: spacing.small,
    },
    temperature: {
      ...fonts.body,
      color: colors.white,
    },
  });
  
  export default WeatherHeader;
