import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from '../Texts/StyledText';
import { colors } from '../../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CropSelection = ({ 
  options = ['Avocado', 'Tomato', 'Maize', 'Cabbage', 'Rice'], 
  selectedCrops = [], 
  onToggle 
}) => {
  return (
    <View style={styles.optionsContainer}>
      {options.map((crop) => {
        const isSelected = selectedCrops.includes(crop);
        return (
          <TouchableOpacity
            key={crop}
            style={[
              styles.option,
              isSelected && styles.selectedOption
            ]}
            onPress={() => onToggle(crop)}
            activeOpacity={0.7}
          >
            <StyledText 
              style={[
                styles.optionText,
                isSelected && styles.selectedOptionText
              ]}
            >
              {crop}
            </StyledText>
            {isSelected && (
              <MaterialCommunityIcons 
                name="close-circle" 
                size={18} 
                color={colors.primary} 
                style={styles.closeIcon}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '20', 
  },
  optionText: {
    color: colors.grey[600],
    fontSize: 14,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '500',
  },
  closeIcon: {
    marginLeft: 6,
  },
});

export default CropSelection;