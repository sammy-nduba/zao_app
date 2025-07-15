import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../../config/styles/ZaoAIStyles';

export const TabNavigation = ({ tabs, activeTab, onTabPress }) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.tab, activeTab === index && styles.activeTab]}
          onPress={() => onTabPress(index)}
        >
          <Text style={[
            styles.tabTitle,
            activeTab === index && styles.activeTabTitle
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};