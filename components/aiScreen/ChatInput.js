import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../config/styles/ZaoAIStyles';

export const ChatInput = ({ value, onChangeText, onSend, onAttach, onVoice, placeholder }) => {
  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity onPress={onAttach}>
        <Icon name="attach-file" size={24} color="#6B7280" />
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline
        />
      </View>
      <TouchableOpacity onPress={onVoice}>
        <Icon name="mic" size={24} color="#6B7280" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sendButton} onPress={onSend}>
        <Icon name="send" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};
