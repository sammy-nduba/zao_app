// src/hooks/useToast.js
import { useCallback } from 'react';
import { showSuccessToast, showErrorToast, showInfoToast } from '../services/ToastService';

export const useToast = () => {
  const showSuccess = useCallback((message, subtitle) => {
    showSuccessToast(message, subtitle);
  }, []);

  const showError = useCallback((message, subtitle) => {
    showErrorToast(message, subtitle);
  }, []);

  const showInfo = useCallback((message, subtitle) => {
    showInfoToast(message, subtitle);
  }, []);

  return {
    showSuccess,
    showError,
    showInfo,
  };
};