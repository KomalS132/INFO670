import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert, StyleSheet, Platform, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BACKEND_URL } from '@env';
export default function HomeScreen({ navigation, route }) {
  const [username, setUsername] = useState(route.params?.username || '');
  const [showUsernameModal, setShowUsernameModal] = useState(!route.params?.username);
  const [recipients, setRecipients] = useState(route.params?.recipients || []);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchRecipients = async (senderUsername) => {
    try {
      const response = await fetch(`${BACKEND_URL}/getRecipients?sender=${senderUsername}`);
      console.log('fetchRecipients Response Status:', response.status);
      console.log('fetchRecipients Content-Type:', response.headers.get('Content-Type'));

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('fetchRecipients Non-JSON Response:', text);
        throw new Error('Server did not return JSON');
      }

      const result = await response.json();
      if (response.ok) {
        setRecipients(result.recipients || []);
        setHasFetched(true);
      } else {
        console.log('fetchRecipients Error Result:', result);
        Alert.alert('Error', result.error || 'Failed to fetch recipients');
        setHasFetched(true);
      }
    } catch (error) {
      console.log('fetchRecipients Error:', error.message);
      Alert.alert('Error', 'Failed to fetch recipients: ' + error.message);
      setHasFetched(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (username) {
        fetchRecipients(username);
      }
    }, [username])
  );

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }
    setShowUsernameModal(false);
    navigation.setParams({ username: username.trim() });
  };

  const handleRecipientSelect = (recipient) => {
    navigation.navigate('Receiver', { username: username.trim(), prefilledRecipient: recipient });
  };

  const startNewChat = () => {
    navigation.navigate('Sender', { username: username.trim(), recipients });
  };

  const renderRecipient = ({ item }) => (
    <Pressable
      style={styles.recipientButton}
      onPress={() => handleRecipientSelect(item)}
    >
      <Text style={styles.recipientText}>👤 {item}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={showUsernameModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Your Username</Text>
            <TextInput
              style={styles.modalInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Your username"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
              autoFocus={true}
              returnKeyType="done"
              onSubmitEditing={handleUsernameSubmit}
            />
            <Pressable
              style={styles.modalButton}
              onPress={handleUsernameSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {!showUsernameModal && hasFetched && (
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>💬 Your Chats</Text>
          </View>
          <View style={styles.form}>
            {recipients.length > 0 ? (
              <>
                <Text style={styles.label}>Previous Chats</Text>
                <FlatList
                  data={recipients}
                  renderItem={renderRecipient}
                  keyExtractor={(item) => item}
                  style={styles.recipientList}
                />
              </>
            ) : (
              <Text style={styles.emptyText}>No previous chats yet</Text>
            )}
          </View>
          <Pressable
            style={styles.newChatButton}
            onPress={startNewChat}
          >
            <Text style={styles.buttonText}>New Chat ✉️</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#fafafa',
    padding: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    width: '100%',
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#00cccc',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    width: '100%',
  },
  header: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  form: {
    margin: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 10,
  },
  recipientList: {
    marginBottom: 20,
  },
  recipientButton: {
    backgroundColor: '#fafafa',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recipientText: {
    fontSize: 16,
    color: '#333',
  },
  newChatButton: {
    backgroundColor: '#4da8ff',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    margin: 20,
    marginBottom: 50
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 20,
  },
});