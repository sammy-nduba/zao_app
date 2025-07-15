import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, colors, fonts } from '../../config/theme';

const TaskCalendar = ({ cropName, phase, calendarData }) => {
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarRow}>
        <Text style={styles.calendarLabel}>{cropName}</Text>
        <View style={styles.daysRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={styles.dayHeader}>{day}</Text>
          ))}
        </View>
      </View>
      <View style={styles.calendarRow}>
        <Text style={styles.calendarLabel}>{phase}</Text>
        <View style={styles.daysRow}>
          {calendarData.map((day, index) => (
            <Text key={index} style={styles.dayNumber}>{day}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};


 const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.large,
    marginVertical: spacing.medium,
  },
  sectionTitle: {
    ...fonts.subtitleBold,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },
  calendarRow: {
    flexDirection: 'row',
    marginBottom: spacing.small,
  },
  calendarLabel: {
    ...fonts.bodyBold,
    width: 120,
    color: colors.text,
  },
  daysRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayHeader: {
    ...fonts.body,
    color: colors.textSecondary,
    textAlign: 'center',
    width: 24,
  },
  dayNumber: {
    ...fonts.body,
    color: colors.text,
    textAlign: 'center',
    width: 24,
  },
  taskItem: {
    marginBottom: spacing.small,
  },
  taskText: {
    ...fonts.body,
    color: colors.text,
  },
});
export default TaskCalendar;