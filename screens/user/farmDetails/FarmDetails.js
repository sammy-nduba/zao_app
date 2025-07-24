// screens/FarmDetails.js
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useContainer } from '../../../utils/ContainerProvider';
import ErrorBoundary from '../../../utils/ErrorBoundary';
import { useAuth } from '../../../utils/AuthContext';
import NewFarmerForm from './NewFarmerForm';
import ExperiencedFarmerForm from './ExperiencedFarmerForm';
import { colors } from '../../../config/theme';

function FarmDetails() {
  const { container, isReady } = useContainer(); // Destructure container and isReady
  const navigation = useNavigation();
  const { authState, setIsRegistrationComplete } = useAuth();

  const [state, setState] = useState({
    farmerType: null, // Start with no selection
    formData: {
      cropAge: '',
      cropPhase: 'Vegetative, Fruit/seed development',
      farmSize: '0-5 acres (Small Scale)',
      farmerType: '',
      fertilizer: '',
      lastManure: '',
      location: '',
      selectedCrops: [],
    },
    isLoading: true,
    isOffline: false,
    error: null,
  });

  useEffect(() => {
    console.log('FarmDetails: Component mounted, authState:', authState);

    if (!isReady || !authState || authState.isZaoAppOnboarded === null) {
      console.log('FarmDetails: Waiting for container or authState initialization');
      setState((prev) => ({ ...prev, isLoading: true }));
      return;
    }

    if (!authState.user?.id) {
      console.error('FarmDetails: No user or user ID available', { authState });
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'User not authenticated',
      }));
      navigation.navigate('Error', { error: 'User not authenticated' });
      return;
    }

    const fetchFarmerData = async () => {
      try {
        console.log('FarmDetails: Loading farmer data for user:', authState.user.id);
        const getFarmerData = container.get('getFarmerData');
        const farmer = await getFarmerData.execute({
          farmerType: 'experienced',
          userId: authState.user.id,
        });

        setState((prev) => ({
          ...prev,
          formData: farmer || prev.formData,
          farmerType: farmer ? 'experienced' : 'new',
          isLoading: false,
          isOffline: !farmer,
        }));
      } catch (error) {
        console.error('FarmDetails: Error loading farmer data:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
        navigation.navigate('Error', { error: error.message });
      }
    };

    // Fetch data only for returning users
    if (authState.isRegistrationComplete) {
      fetchFarmerData();
    } else {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        farmerType: null, // Allow user to choose
      }));
    }

    return () => console.log('FarmDetails: Component unmounted');
  }, [container, isReady, authState, navigation]);

  const handleFormSubmit = async (formData) => {
    if (!authState?.user?.id) {
      console.error('FarmDetails: Cannot submit form, no user ID');
      setState((prev) => ({
        ...prev,
        error: 'User not authenticated',
      }));
      navigation.navigate('Error', { error: 'User not authenticated' });
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      console.log('FarmDetails: Submitting form for user:', authState.user.id, 'farmerType:', state.farmerType);
      const saveFarmerData = container.get('saveFarmerData');
      await saveFarmerData.execute({
        userId: authState.user.id,
        farmerData: {
          ...formData,
          id: authState.user.id,
          farmerType: state.farmerType,
        },
      });

      await setIsRegistrationComplete(true);
      console.log('FarmDetails: Farmer data saved, navigating to MainTabs');
      navigation.navigate('MainTabs');
    } catch (error) {
      console.error('FarmDetails: Error saving farmer data:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      navigation.navigate('Error', { error: error.message });
    }
  };

  const handleFarmerTypeSelect = (type) => {
    setState((prev) => ({
      ...prev,
      farmerType: type,
      formData: { ...prev.formData, farmerType: type },
    }));
  };

  if (state.isLoading || !isReady || !authState || authState.isZaoAppOnboarded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>{state.error}</Text>
      </View>
    );
  }

  // Show farmer type selection for first-time users
  if (!authState.isRegistrationComplete && !state.farmerType) {
    return (
      <View style={styles.selectionContainer}>
        <Text style={styles.selectionTitle}>Are you a new or experienced farmer?</Text>
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => handleFarmerTypeSelect('new')}
        >
          <Text style={styles.selectionButtonText}>New Farmer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selectionButton}
          onPress={() => handleFarmerTypeSelect('experienced')}
        >
          <Text style={styles.selectionButtonText}>Experienced Farmer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {state.farmerType === 'new' ? (
        <NewFarmerForm
          formData={state.formData}
          onFormChange={(field, value) =>
            setState((prev) => ({
              ...prev,
              formData: { ...prev.formData, [field]: value },
            }))
          }
          onSubmit={() => handleFormSubmit(state.formData)}
          isLoading={state.isLoading}
        />
      ) : (
        <ExperiencedFarmerForm
          formData={state.formData}
          onFormChange={(field, value) =>
            setState((prev) => ({
              ...prev,
              formData: { ...prev.formData, [field]: value },
            }))
          }
          onSubmit={() => handleFormSubmit(state.formData)}
          isLoading={state.isLoading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
  selectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.grey[800],
    marginBottom: 24,
  },
  selectionButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  selectionButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default function FarmDetailsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <FarmDetails />
    </ErrorBoundary>
  );
}