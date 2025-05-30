import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert, FlatList, StyleSheet, Platform } from 'react-native';
import { BACKEND_URL } from '@env';
export default function SenderScreen({ navigation, route }) {
  const username = route.params?.username || '';
  const [sender] = useState(username);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    if (username) {
      fetchRecipients(username);
    }
  }, [username]);

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

  const sendMessage = async () => {
    if (!sender.trim() || !recipient.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: sender.trim(), recipient: recipient.trim(), message: message.trim() }),
      });
      console.log('sendMessage Response Status:', response.status);
      console.log('sendMessage Content-Type:', response.headers.get('Content-Type'));
      
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('sendMessage Non-JSON Response:', text);
        throw new Error('Server did not return JSON');
      }

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Message sent successfully');
        if (!recipients.includes(recipient.trim())) {
          const updatedRecipients = [...recipients, recipient.trim()];
          setRecipients(updatedRecipients);
        }
        setRecipient('');
        setMessage('');
      } else {
        console.log('sendMessage Error Result:', result);
        Alert.alert('Error', result.error || 'Failed to send message');
      }
    } catch (error) {
      console.log('sendMessage Error:', error.message);
      Alert.alert('Error', 'Failed to send message: ' + error.message);
    }
  };

  const clearForm = () => {
    setRecipient('');
    setMessage('');
  };

  const goToHome = () => {
    navigation.navigate('Home', { username });
  };

  const renderRecipient = ({ item }) => (
    <Pressable
      style={styles.recipientButton}
      onPress={() => setRecipient(item)}
    >
      <Text style={styles.recipientText}>👤 {item}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>✉️ Send Message</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.label}>Sender</Text>
        <TextInput
          style={styles.input}
          value={sender}
          editable={false}
          placeholder="Your username"
          placeholderTextColor="#aaa"
        />
        {recipients.length > 0 && (
          <>
            <Text style={styles.label}>Previously Chatted With</Text>
            <FlatList
              data={recipients}
              renderItem={renderRecipient}
              keyExtractor={(item) => item}
              horizontal
              style={styles.recipientList}
              showsHorizontalScrollIndicator={false}
            />
          </>
        )}
        <Text style={styles.label}>Recipient</Text>
        <TextInput
          style={styles.input}
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Recipient's username"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#aaa"
          multiline
          numberOfLines={4}
        />
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={sendMessage}>
            <Text style={styles.buttonText}>Send ✉️</Text>
          </Pressable>
          <Pressable style={styles.clearButton} onPress={clearForm}>
            <Text style={styles.buttonText}>Clear 🗑️</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.navButton}
          onPress={() => navigation.navigate('Receiver', { username, prefilledRecipient: '' })}
        >
          <Text style={styles.buttonText}>View Messages 📬</Text>
        </Pressable>
        <Pressable
          style={styles.homeButton}
          onPress={goToHome}
        >
          <Text style={styles.buttonText}>Back to Chats 💬</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fafafa',
    padding: 10,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  recipientList: {
    marginBottom: 10,
  },
  recipientButton: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recipientText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#00cccc',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  clearButton: {
    backgroundColor: '#ff6f61',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
  },
  navButton: {
    backgroundColor: '#4da8ff',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
  homeButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});