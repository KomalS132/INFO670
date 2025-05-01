import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, Switch, Portal, Modal } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('userProfile');
        if (savedProfile) {
          const { name, email, notifications } = JSON.parse(savedProfile);
          setName(name || '');
          setEmail(email || '');
          setNotifications(notifications || false);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      setModalMessage('Please fill all fields.');
      setModalVisible(true);
      return;
    }
    try {
      const profile = { name, email, notifications };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setModalMessage('Profile Saved!');
      setModalVisible(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      setModalMessage('Error saving profile.');
      setModalVisible(true);
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem('userProfile');
      setName('');
      setEmail('');
      setNotifications(false);
      setModalMessage('Profile Cleared!');
      setModalVisible(true);
    } catch (error) {
      console.error('Error clearing profile:', error);
      setModalMessage('Error clearing profile.');
      setModalVisible(true);
    }
  };

  const hideModal = () => setModalVisible(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
      />
      <View style={styles.switchContainer}>
        <Text>Enable Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={saveProfile} style={[styles.button, styles.saveButton]}>
          Save Profile
        </Button>
        <Button mode="outlined" onPress={clearProfile} style={[styles.button, styles.clearButton]}>
          Clear Profile
        </Button>
      </View>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Text>{modalMessage}</Text>
          <Button onPress={hideModal}>OK</Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#6200ee',
  },
  clearButton: {
    borderColor: '#6200ee',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});

export default ProfileScreen;