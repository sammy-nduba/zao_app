// utils/ContainerProvider.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import container from '../infrastructure/di/Container';

const ContainerContext = createContext(null);

export const ContainerProvider = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ContainerProvider: Starting initialization');
    const initialize = async () => {
      try {
        await container.initialize();
        console.log('ContainerProvider: Initialization successful');
        setIsReady(true);
      } catch (err) {
        console.error('ContainerProvider: Initialization failed:', err);
        setError(err);
      }
    };

    initialize();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Failed to initialize application dependencies: {error.message}
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Initializing application...</Text>
      </View>
    );
  }

  return (
    <ContainerContext.Provider value={{ container, isReady }}>
      {children}
    </ContainerContext.Provider>
  );
};

export const useContainer = () => {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error('useContainer must be used within a ContainerProvider');
  }
  console.log('useContainer: Providing container, isReady:', context.isReady);
  return context;
};