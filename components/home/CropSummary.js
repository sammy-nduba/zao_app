import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../config/theme';

const CropSummary = ({ cropData, onSeeMore }) => (
  <View style={styles.cropContainer}>
    <View style={styles.cropHeader}>
      <Text style={styles.cropTitle}>My Crop</Text>
      <TouchableOpacity onPress={onSeeMore}>
        <Text style={styles.seeMoreText}>See More</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.cropContent}>
      <View style={styles.cropCard}>
        <Text style={styles.cropName}>{cropData.name}</Text>
        <Text style={styles.cropPhase}>{cropData.phase}</Text>
        <Text style={styles.cropHealth}>Farm Health - {cropData.healthPercentage}%</Text>
      </View>

      <View style={styles.taskCalendar}>
        <Text style={styles.taskCalendarTitle}>Task Calendar</Text>
        <View style={styles.taskCalendarDays}>
          <Text style={styles.taskCalendarDay}>S</Text>
          <Text style={styles.taskCalendarDay}>M</Text>
          <Text style={styles.taskCalendarDay}>T</Text>
          <Text style={styles.taskCalendarDay}>W</Text>
          <Text style={styles.taskCalendarDay}>T</Text>
          <Text style={styles.taskCalendarDay}>F</Text>
          <Text style={styles.taskCalendarDay}>S</Text>
        </View>
        <View style={styles.taskCalendarNumbers}>
          <View style={[styles.taskCalendarNumber, styles.taskCalendarNumberActive]}>
            <Text style={styles.taskCalendarNumberText}>9</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>10</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>11</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>12</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>13</Text>
          </View>
          <View style={[styles.taskCalendarNumber, styles.taskCalendarNumberHighlight]}>
            <Text style={styles.taskCalendarNumberText}>14</Text>
          </View>
          <View style={styles.taskCalendarNumber}>
            <Text style={styles.taskCalendarNumberText}>15</Text>
          </View>
        </View>

        <View style={styles.taskLegend}>
          <View style={styles.taskLegendItem}>
            <View style={[styles.taskLegendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.taskLegendText}>Conduct Soil Test</Text>
          </View>
          <View style={styles.taskLegendItem}>
            <View style={[styles.taskLegendDot, { backgroundColor: '#e0e0e0' }]} />
            <Text style={styles.taskLegendText}>Book Agronomist</Text>
          </View>
          <View style={styles.taskLegendItem}>
            <View style={[styles.taskLegendDot, { backgroundColor: '#e0e0e0' }]} />
            <Text style={styles.taskLegendText}>Visit Nearby Farmer</Text>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  cropContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cropTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  seeMoreText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '500',
  },
  cropContent: {
    flexDirection: 'row',
    gap: 15,
  },
  cropCard: {
    backgroundColor: colors.primary[400],
    borderRadius: 15,
    padding: 20,
    height: 184,
    flex: 1,
    justifyContent: 'center',
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  cropPhase: {
    fontSize: 14,
    color: '#E8F5E8',
    marginBottom: 15,
  },
  cropHealth: {
    fontSize: 14,
    color: '#E8F5E8',
  },
  taskCalendar: {
    backgroundColor: '#FFF8E1',
    borderRadius: 15,
    padding: 15,
    flex: 1,
  },
  taskCalendarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  taskCalendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  taskCalendarDay: {
    fontSize: 12,
    color: '#666',
    width: 20,
    textAlign: 'center',
  },
  taskCalendarNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  taskCalendarNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCalendarNumberActive: {
    backgroundColor: '#4CAF50',
  },
  taskCalendarNumberHighlight: {
    backgroundColor: '#FF9800',
  },
  taskCalendarNumberText: {
    fontSize: 12,
    color: '#333',
  },
  taskLegend: {
    gap: 5,
  },
  taskLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  taskLegendText: {
    fontSize: 10,
    color: '#666',
  },
});

export default CropSummary;