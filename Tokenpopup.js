import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaintokenPage from './maintokenpage.js'; // Adjust the import path based on your project structure
import { useSelectedItems } from './SelectedItemsContext.js';


const TokenPopup = ({ isVisible, onClose }) => {
  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <MaintokenPage onClose={onClose}/>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 40,
    height: '80%',

    width: '100%',
  }
});

export default TokenPopup;
