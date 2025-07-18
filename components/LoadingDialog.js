import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";
import { colors } from "../config/theme";
import StyledText from "./Texts/StyledText";

export const LoadingDialog = ({ visible, message }) => (
    <Modal transparent visible={visible}>
      <View style={styles.loadingDialogContainer}>
        <View style={styles.loadingDialog}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <StyledText style={styles.loadingDialogText}>
            {message || 'Processing...'}
          </StyledText>
        </View>
      </View>
    </Modal>
  );


  const styles = StyleSheet.create({
    // Add these new styles for the loading dialog
    loadingDialogContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    loadingDialog: {
      backgroundColor: colors.background,
      padding: 24,
      borderRadius: 12,
      alignItems: 'center',
      minWidth: 200,
    },
    loadingDialogText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.grey[600],
      textAlign: 'center',
    },
  });
