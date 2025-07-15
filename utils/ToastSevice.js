import Toast from 'react-native-toast-message';
import { ToastConfig } from '../config/ToastConfig';

export const showSuccessToast = (message, subtitle = '') => {
  Toast.show({
    type: 'success',
    text1: message,
    text2: subtitle,
  });
};

export const showErrorToast = (message, subtitle = '') => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: subtitle,
  });
};

export const showInfoToast = (message, subtitle = '') => {
  Toast.show({
    type: 'info',
    text1: message,
    text2: subtitle,
  });
};

export const hideToast = () => {
  Toast.hide();
};