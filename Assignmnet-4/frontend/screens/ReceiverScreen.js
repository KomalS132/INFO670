import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, Alert, StyleSheet, Platform, ActivityIndicator, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BACKEND_URL } from '@env';
export default function ReceiverScreen({ navigation, route }) {
  const username = route.params?.username || '';
  const prefilledRecipient = route.params?.prefilledRecipient || '';
  const [recipients, setRecipients] = useState([]);
  const [manualRecipient, setManualRecipient] = useState(prefilledRecipient);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(prefilledRecipient || '');

  useEffect(() => {
    if (username) {
      fetchRecipients(username);
    }
    if (prefilledRecipient) {
      fetchMessages(prefilledRecipient);
    }
  }, [username, prefilledRecipient]);

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
      } else {
        console.log('fetchRecipients Error Result:', result);
        Alert.alert('Error', result.error || 'Failed to fetch recipients');
      }
    } catch (error) {
      console.log('fetchRecipients Error:', error.message);
      Alert.alert('Error', 'Failed to fetch recipients: ' + error.message);
    }
  };

  const fetchMessages = async (recipientUsername) => {
    if (!recipientUsername) {
      Alert.alert('Error', 'Please select or enter a recipient');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/retrieveMessages?recipient=${recipientUsername}`);
      console.log('fetchMessages Response Status:', response.status);
      console.log('fetchMessages Content-Type:', response.headers.get('Content-Type'));

      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('fetchMessages Non-JSON Response:', text);
        throw new Error('Server did not return JSON');
      }

      const result = await response.json();
      if (response.ok) {
        setMessages(result.messages || []);
      } else {
        console.log('fetchMessages Error Result:', result);
        Alert.alert('Error', result.error || 'Failed to retrieve messages');
      }
    } catch (error) {
      console.log('fetchMessages Error:', error.message);
      Alert.alert('Error', 'Failed to retrieve messages: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientSelect = (recipient) => {
    if (recipient === '') return; // Ignore the placeholder
    setSelectedRecipient(recipient);
    setManualRecipient(recipient);
    fetchMessages(recipient);
  };

  const handleManualFetch = () => {
    if (manualRecipient.trim()) {
      setSelectedRecipient(manualRecipient.trim());
      fetchMessages(manualRecipient.trim());
    }
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageCard}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageSender}>{item.sender}</Text>
        {/* <Text style={styles.messageTimestamp}>
          {new Date(item.created_at).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
        </Text> */}
      </View>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>📬 Messages</Text>
      </View>
      <View style={styles.form}>
        {recipients.length > 0 ? (
          <>
            <Text style={styles.label}>Select a Previous Chat</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedRecipient}
                onValueChange={(itemValue) => handleRecipientSelect(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select a recipient..." value="" />
                {recipients.map((recipient) => (
                  <Picker.Item key={recipient} label={`👤 ${recipient}`} value={recipient} />
                ))}
              </Picker>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>No previous chats</Text>
        )}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Or Enter Recipient Username</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={manualRecipient}
              onChangeText={setManualRecipient}
              placeholder="Recipient's username"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
            />
            <Pressable style={styles.fetchButton} onPress={handleManualFetch}>
              <Text style={styles.buttonText}>Fetch 📩</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={styles.navButton}
          onPress={() => navigation.navigate('Sender', { username })}
        >
          <Text style={styles.buttonText}>Send Message ✉️</Text>
        </Pressable>
        {loading ? (
          <ActivityIndicator size="large" color="#00cccc" style={styles.loader} />
        ) : (
          <>
            {messages.length > 0 && (
              <Text style={styles.messageCount}>Showing {messages.length} messages</Text>
            )}
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => index.toString()}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {selectedRecipient ? 'No messages found' : 'Select a recipient to view messages'}
                </Text>
              }
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#e9ecef',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 0, // SafeAreaView handles top padding
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#343a40',
  },
  form: {
    margin: 25,
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
    marginTop: 20,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  inputSection: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    padding: 12,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    marginRight: 10,
  },
  fetchButton: {
    backgroundColor: '#00cccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messageList: {
    flexGrow: 1, // Ensure the list takes up remaining space
    marginBottom: 30
  },
  messageListContent: {
    paddingBottom: 20, // Add padding to the bottom of the list for better scrolling
    
  },
  messageCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00cccc',
  },
  messageText: {
    fontSize: 16,
    color: '#343a40',
    lineHeight: 22,
  },
  messageTimestamp: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6c757d',
  },
  messageCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#495057',
    marginTop: 10,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
});