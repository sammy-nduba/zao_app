// In FarmDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ScrollableMainContainer, FarmerTypeInput } from '../../../components';
import StyledText from '../../../components/Texts/StyledText';
import { colors } from '../../../config/theme';
import NewFarmerForm from './NewFarmerForm';
import ExperiencedFarmerForm from './ExperiencedFarmerForm';
import { FarmDetailsViewModel } from '../../../viewModel/FarmDetailsViewModel';
import { AuthContext } from '../../../utils/AuthContext';
import Toast from 'react-native-toast-message';

const FarmDetails = ({ navigation }) => {
  const { user, isVerified, setIsRegistrationComplete } = useContext(AuthContext);
  const [viewModel] = useState(() => new FarmDetailsViewModel());
  const [state, setState] = useState(viewModel.getState());

  useEffect(() => {
    if (!user?.id || !isVerified) {
      navigation.replace('Registration');
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: 'Please complete registration and verify your email.',
      });
      return;
    }
    const loadData = async () => {
      await viewModel.loadFarmerData(state.farmerType, user.id);
      setState(viewModel.getState());
      if (state.isOffline || viewModel.getState().error?.includes('offline')) {
        Toast.show({
          type: 'info',
          text1: 'Offline Mode',
          text2: 'Displaying cached data. Changes will sync when online.',
        });
      } else if (viewModel.getState().error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: viewModel.getState().error,
        });
      }
    };
    loadData();
  }, [state.farmerType, user?.id, isVerified, navigation]);

  const handleFarmerTypeChange = (type) => {
    viewModel.setFarmerType(type);
    setState(viewModel.getState());
  };

  const handleFormChange = (field, value) => {
    viewModel.updateFormData(field, value);
    setState(viewModel.getState());
  };

  const handleFormSubmit = async () => {
    try {
      const success = await viewModel.submitForm(user.id);
      if (success) {
        setIsRegistrationComplete(true);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: viewModel.getState().isOffline
            ? 'Data saved locally. Will sync when online.'
            : `Registered as ${state.farmerType} farmer!`,
        });
        navigation.replace('MainTabs');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: viewModel.getState().error,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message,
      });
    }
  };

  return (
    <ScrollableMainContainer contentContainerStyle={styles.container}>
      <View style={styles.vectorContainer}>
        <Image
          source={require('../../../assets/Vector.png')}
          style={styles.vector2}
        />
      </View>
      <StyledText style={styles.title} bold>
        Farm Details
      </StyledText>
      <StyledText style={styles.subtitle}>
        Fill in details about your farm to have a personalized insight page.
      </StyledText>
      <FarmerTypeInput
        value={state.farmerType}
        onChange={handleFarmerTypeChange}
      />
      {state.farmerType === 'new' ? (
        <NewFarmerForm
          viewModel={viewModel}
          formData={state.formData}
          onFormChange={handleFormChange}
          onSubmit={handleFormSubmit}
          userId={user?.id}
        />
      ) : (
        <ExperiencedFarmerForm
          viewModel={viewModel}
          formData={state.formData}
          onFormChange={handleFormChange}
          onSubmit={handleFormSubmit}
          userId={user?.id}
        />
      )}
    </ScrollableMainContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: colors.background,
  },
  vectorContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  vector2: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: 217,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginTop: 75,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: colors.grey[500],
    fontWeight: '400',
    marginBottom: 32,
  },
});

export default FarmDetails;