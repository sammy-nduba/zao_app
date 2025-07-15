import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from '../Texts/StyledText';
import { colors } from '../../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';




const CropSelection = ({ selectedCrops, toggleCropSelection }) => {
    return (
      <View style={styles.optionsContainer}>
        {['Avocado', 'Tomato', 'Maize', 'Cabbage', 'Rice'].map((crop) => (
          <TouchableOpacity
            key={crop}
            style={[
              styles.option,
              selectedCrops.includes(crop) && styles.selectedOption
            ]}
            onPress={() => toggleCropSelection(crop)}
          >
            <StyledText 
              style={[
                styles.optionText,
                selectedCrops.includes(crop) && styles.selectedOptionText
              ]}
            >
              {crop}
            </StyledText>
            {selectedCrops.includes(crop) ? (
              <MaterialCommunityIcons 
                name="cancel" 
                size={18} 
                color={colors.primary} 
                style={styles.closeIcon}
              />
            ) : null}
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        borderRadius: 25,
        top: 12,
        bottom: 12,
        borderColor: colors.border,
      backgroundColor: colors.background,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: colors.grey[300],
      backgroundColor: colors.background,
    },
    selectedOption: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryLight,
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
      marginLeft: 8,
    },
  });
  
  export default CropSelection;