import React, { createContext, useContext } from 'react';
import { useContainer } from './ContainerProvider';

const PresenterContext = createContext(null);

export const PresenterProvider = ({ children }) => {
  const container = useContainer();
  const presenter = container.get('languageSelectionPresenter');
  
  return (
    <PresenterContext.Provider value={presenter}>
      {children}
    </PresenterContext.Provider>
  );
};

export const usePresenter = () => {
  const presenter = useContext(PresenterContext);
  if (!presenter) {
    throw new Error('usePresenter must be used within a PresenterProvider');
  }
  return presenter;
};