import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { StyledButton, ScrollableMainContainer, CropSelection } from '../../../components';
import StyledText from '../../../components/Texts/StyledText';
import StyledTextInput from '../../../components/inputs/StyledTextInput';
import { colors } from '../../../config/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';

const ExperiencedFarmerForm = ({ viewModel, formData, onFormChange, navigation }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const cropOptions = ['Avocado', 'Tomato', 'Maize', 'Cabbage', 'Rice'];
  const farmSizeOptions = ['0-5 acres (Small Scale)', '5-20 acres (Medium Scale)', '20+ acres (Large Scale)'];
  const fertilizerOptions = ['CAN', 'DSP', 'NPK', 'Other'];

  const isFormValid = () => {
    return (
      formData.selectedCrops.length > 0 &&
      formData.farmSize &&
      formData.location &&
      formData.cropAge &&
      formData.lastManure &&
      formData.fertilizer &&
      formData.cropPhase
    );
  };

  const handleCropChange = (crop) => {
    const newCrops = formData.selectedCrops.includes(crop)
      ? formData.selectedCrops.filter((item) => item !== crop)
      : [...formData.selectedCrops, crop];
    onFormChange('selectedCrops', newCrops);
  };

  const handleOptionSelect = (field, value) => {
    onFormChange(field, value);
  };

  const handleTextInputChange = (field, text) => {
    onFormChange(field, text);
  };

  const handleMapIconPress = () => {
    Toast.show({
      type: 'info',
      text1: 'Map Feature',
      text2: 'Map allocation feature coming soon!',
    });
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      onFormChange('lastManure', formattedDate);
      Toast.show({
        type: 'success',
        text1: 'Date Selected',
        text2: `Last manure date set to ${formattedDate}`,
      });
    }
  };

const handleGetStarted = async () => {
  if (!userId) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'User not authenticated. Please register first.',
    });
    navigation.navigate('Register');
    return;
  }
  setIsLoading(true);
  try {
    const success = await viewModel.submitForm(userId);
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: viewModel.getState().isOffline
          ? 'Data saved locally. Will sync when online.'
          : 'Form submitted! Welcome to your dashboard.',
      });
      navigation.navigate('Login');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: viewModel.getState().isOffline
          ? 'Data saved locally. Will sync when online.'
          : viewModel.getState().error,
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: error.message.includes('502') || error.message.includes('timed out')
        ? 'Data saved locally. Will sync when online.'
        : error.message,
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>
          What crops are you mostly interested in?
        </StyledText>
        <StyledTextInput
          placeholder="Select crops..."
          value={formData.selectedCrops.join(', ')}
          editable={false}
          style={styles.input}
        />
        <CropSelection
          selectedCrops={formData.selectedCrops}
          toggleCropSelection={handleCropChange}
        />
      </View>

      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>How many acres do you intend to farm on?</StyledText>
        <StyledTextInput
          placeholder={farmSizeOptions[0]}
          value={formData.farmSize}
          editable={false}
          style={styles.input}
        />
        <View style={styles.optionsContainer}>
          {farmSizeOptions.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.option, formData.farmSize === size && styles.selectedOption]}
              onPress={() => handleOptionSelect('farmSize', size)}
            >
              <StyledText style={styles.optionText}>{size}</StyledText>
              {formData.farmSize === size && (
                <MaterialCommunityIcons name="check" size={20} color={colors.grey[600]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>Where is your farm located?</StyledText>
        <View style={styles.inputContainer}>
          <StyledTextInput
            placeholder="Enter location"
            value={formData.location}
            onChangeText={(text) => handleTextInputChange('location', text)}
            style={[styles.input, styles.locationInput]}
          />
          <TouchableOpacity style={styles.iconButton} onPress={handleMapIconPress}>
            <MaterialCommunityIcons name="map-marker" size={24} color={colors.grey[600]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>What is the age of the oldest crop in your farm?</StyledText>
        <StyledTextInput
          placeholder="Enter age (e.g., 12 Months)"
          value={formData.cropAge}
          onChangeText={(text) => handleTextInputChange('cropAge', text)}
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>When was the last time you applied manure?</StyledText>
        <View style={styles.inputContainer}>
          <StyledTextInput
            placeholder="Select date..."
            value={formData.lastManure}
            editable={false}
            style={[styles.input, styles.dateInput]}
            onPressIn={() => setShowDatePicker(true)}
            testID="date-input"
          />
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowDatePicker(true)}
            testID="date-picker-icon"
          >
            <MaterialCommunityIcons name="calendar" size={24} color={colors.grey[600]} />
          </TouchableOpacity>
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            themeVariant="light"
            textColor={colors.grey[600]}
            testID="date-picker"
          />
        )}
      </View>

      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>Last time fertilizer was applied/sprayed?</StyledText>
        <StyledTextInput
          placeholder="Select fertilizer..."
          value={formData.fertilizer}
          editable={false}
          style={styles.input}
        />
        <View style={styles.optionsContainer}>
          {fertilizerOptions.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.option, formData.fertilizer === type && styles.selectedOption]}
              onPress={() => handleOptionSelect('fertilizer', type)}
            >
              <StyledText style={styles.optionText}>{type}</StyledText>
              {formData.fertilizer === type && (
                <MaterialCommunityIcons name="check" size={20} color={colors.grey[600]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <StyledText style={styles.sectionTitle}>What is the current phase of your crop?</StyledText>
        <StyledTextInput
          placeholder="Enter crop phase (e.g., Vegetative)"
          value={formData.cropPhase}
          onChangeText={(text) => handleTextInputChange('cropPhase', text)}
          style={styles.input}
        />
      </View>

      <StyledButton
        title="Get Started"
        onPress={handleGetStarted}
        style={styles.getStartedButton}
        disabled={viewModel.getState().isLoading || !isFormValid()}
      />
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 8,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    elevation: 3,
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: colors.grey[800],
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey[300],
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    fontFamily: 'Roboto',
    color: colors.grey[600],
  },
  locationInput: {
    paddingRight: 48,
  },
  dateInput: {
    paddingRight: 48,
  },
  iconButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
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
    borderColor: colors.primary[600],
    backgroundColor: colors.tint,
  },
  optionText: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: colors.grey[600],
    marginRight: 8,
  },
  getStartedButton: {
    width: '100%',
    height: 56,
    borderRadius: 32,
    backgroundColor: colors.primary[600],
    marginTop: 16,
    marginBottom: 40,
    alignSelf: 'center',
  },
});

export default ExperiencedFarmerForm;