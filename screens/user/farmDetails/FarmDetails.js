import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useContainer } from '../../../utils/ContainerProvider';
import ErrorBoundary from '../../../utils/ErrorBoundary';
import { useAuth } from '../../../utils/AuthContext';
import NewFarmerForm from './NewFarmerForm';
import ExperiencedFarmerForm from './ExperiencedFarmerForm';

function FarmDetails() {
  const container = useContainer();
  const authContext = useAuth();
  
  // Safe destructuring with defaults
  const { 
    authState = {}, 
    setIsRegistrationComplete = () => console.warn('Auth context not ready') 
  } = authContext || {};

  const [state, setState] = useState({
    farmerType: 'new',
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
    console.log('FarmDetails: Component mounted');
    
    if (!authState.user?.id) {
      console.error('FarmDetails: No user ID available');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'User not authenticated',
      }));
      return;
    }

    const fetchFarmerData = async () => {
      try {
        console.log('FarmDetails: Loading farmer data for user:', authState.user.id);
        const getFarmerData = container.get('getFarmerData');
        const farmer = await getFarmerData.execute({
          farmerType: 'new',
          userId: authState.user.id,
        });

        setState(prev => ({
          ...prev,
          formData: farmer || prev.formData,
          farmerType: farmer ? 'experienced' : 'new',
          isLoading: false,
          isOffline: !farmer,
        }));
      } catch (error) {
        console.error('FarmDetails: Error loading farmer data:', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error.message,
        }));
      }
    };

    fetchFarmerData();
    return () => console.log('FarmDetails: Component unmounted');
  }, [container, authState.user?.id]);

  const handleFormSubmit = async (formData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      console.log('FarmDetails: Submitting form for user:', authState.user.id);
      const saveFarmerData = container.get('saveFarmerData');
      await saveFarmerData.execute({
        userId: authState.user.id,
        farmerData: { 
          ...formData, 
          id: authState.user.id,
          farmerType: state.farmerType 
        },
      });

      setIsRegistrationComplete(true);
    } catch (error) {
      console.error('FarmDetails: Error saving farmer data:', error);
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
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

  return (
    <View style={{ flex: 1 }}>
      {state.farmerType === 'new' ? (
        <NewFarmerForm
          formData={state.formData}
          onFormChange={(field, value) => 
            setState(prev => ({
              ...prev,
              formData: { ...prev.formData, [field]: value }
            }))
          }
          onSubmit={handleFormSubmit}
          isLoading={state.isLoading}
        />
      ) : (
        <ExperiencedFarmerForm
          formData={state.formData}
          onFormChange={(field, value) => 
            setState(prev => ({
              ...prev,
              formData: { ...prev.formData, [field]: value }
            }))
          }
          onSubmit={handleFormSubmit}
          isLoading={state.isLoading}
        />
      )}
    </View>
  );
}

export default function FarmDetailsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <FarmDetails />
    </ErrorBoundary>
  );
}