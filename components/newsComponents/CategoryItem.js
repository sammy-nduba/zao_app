import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CategoryItem = ({ category, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.categoryItem,
      isSelected && { ...styles.selectedCategory, backgroundColor: category.color },
    ]}
    onPress={() => onPress(category)}
  >
    <Text style={styles.categoryIcon}>{category.icon}</Text>
    <Text
      style={[styles.categoryText, isSelected && styles.selectedCategoryText]}
    >
      {category.name}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 80,
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CategoryItem;