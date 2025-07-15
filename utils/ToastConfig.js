import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../config/theme';

export const ToastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <MaterialCommunityIcons 
        name="check-circle" 
        size={24} 
        color="white" 
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <MaterialCommunityIcons 
        name="alert-circle" 
        size={24} 
        color="white" 
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }) => (
    <View style={[styles.toastContainer, styles.infoToast]}>
      <MaterialCommunityIcons 
        name="information" 
        size={24} 
        color="white" 
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
    </View>
  ),
  actionToast: ({ text1, text2, props }) => (
    <View style={[styles.toastContainer, styles.actionToast]}>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>{text1}</Text>
        {text2 && <Text style={styles.text2}>{text2}</Text>}
      </View>
      <TouchableOpacity 
        onPress={props.onActionPress}
        style={styles.actionButton}
      >
        <Text style={styles.actionText}>{props.actionText}</Text>
      </TouchableOpacity>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    backgroundColor: colors.primary[600],
  },
  errorToast: {
    backgroundColor: '#D32F2F',
  },
  infoToast: {
    backgroundColor: '#1976D2',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text1: {
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  text2: {
    fontFamily: 'Roboto',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionToast: {
    backgroundColor: '#333',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary[600],
    borderRadius: 4,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});