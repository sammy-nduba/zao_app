import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const SearchBar = ({ value, onChangeText, placeholder }) => (
  <View style={styles.searchContainer}>
    <Text style={styles.searchIcon}>🔍</Text>
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#999"
    />
    <TouchableOpacity style={styles.filterButton}>
      <Text style={styles.filterIcon}>⚙️</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 4,
  },
  filterIcon: {
    fontSize: 16,
    color: '#666',
  },
});

export default SearchBar;