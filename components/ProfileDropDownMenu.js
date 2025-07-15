import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../config/theme';

const ProfileDropdownMenu = ({ onSelectOption }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const options = [
    { label: 'Profile', value: 'profile' },
    { label: 'Settings', value: 'settings' },
    { label: 'Logout', value: 'logout' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <MaterialIcons name="account-circle" size={32} color={colors.grey[800]} />
      </TouchableOpacity>

      <Modal transparent animationType="fade" visible={modalVisible}>
        <TouchableOpacity style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <View style={styles.dropdown}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setModalVisible(false);
                  onSelectOption(option.value);
                }}
                style={styles.option}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 5,
  },
  option: {
    padding: 12,
  },
  optionText: {
    fontSize: 16,
    color: colors.grey[800],
  },
});

export default ProfileDropdownMenu;
