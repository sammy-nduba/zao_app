import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import CategoryItem from './CategoryItem';

const CategoriesSection = ({ categories, selectedCategory, onCategorySelect, onSeeAll }) => (
  <View style={styles.categoriesSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesScrollView}
    >
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isSelected={selectedCategory?.id === category.id}
          onPress={onCategorySelect}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  categoriesSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  categoriesScrollView: {
    paddingLeft: 16,
  },
});

export default CategoriesSection;