// components/CropTaskSection/CropTaskSection.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TaskCalendar from './TaskCalendar';
import { spacing, fonts, colors } from '../../config/theme';

const CropTaskSection = ({ cropData, tasks }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>My Crop</Text>
      
      <TaskCalendar 
        cropName={cropData.name}
        phase={cropData.phase}
        calendarData={cropData.calendar}
      />
      
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>• {item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
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

export default CropTaskSection;