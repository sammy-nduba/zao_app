// components/FarmerTypeInput.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyledButton } from '../../components/Buttons/StyledButton';
import StyledText from '../Texts/StyledText';
import { colors } from '../../config/theme';


const FarmerTypeInput = ({ value, onChange }) => {


    return (
        <View style={styles.container}>
          <StyledText style={styles.label} bold>
            Are you a new or experienced farmer?
          </StyledText>
          <View style={styles.optionsContainer}>
            <StyledButton
              title="New Farmer"
              onPress={() => onChange('new')}
              style={[
                styles.optionButton,
                value === 'new' && styles.selectedOption
              ]}
              textStyle={[
                styles.optionText,
                value === 'new' && styles.selectedOptionText
              ]}
            />
            <StyledButton
              title="Experienced Farmer"
              onPress={() => onChange('experienced')}
              style={[
                styles.optionButton,
                value === 'experienced' && styles.selectedOption
              ]}
              textStyle={[
                styles.optionText,
                value === 'experienced' && styles.selectedOptionText
              ]}
            />
          </View>
        </View>
      );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginTop: 100,
    backgroundColor: colors.background
  },
  label: {
    fontSize: 16,
    color: colors.grey[600],
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.background
  },
  optionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: colors.grey[500],
    // backgroundColor: colors.background,
  },
  optionText: {
    color: colors.grey[500],
    fontSize: 14,
  },
  selectedOption: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[600]
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default FarmerTypeInput;