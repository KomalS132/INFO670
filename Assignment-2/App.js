import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CheckBox } from 'react-native-elements';

const App = () => {
  const [item, setItem] = useState('');
  const [groceryList, setGroceryList] = useState([]);

  // Handle adding a new item
  const addItem = () => {
    if (item.trim() === '') {
      Alert.alert('Error', 'Please enter an item!');
      return;
    }
    setGroceryList([
      ...groceryList,
      { id: Date.now().toString(), name: item, completed: false },
    ]);
    setItem('');
  };

  // Handle marking an item as complete
  const toggleComplete = (id) => {
    setGroceryList(
      groceryList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Handle removing an item
  const removeItem = (id) => {
    setGroceryList(groceryList.filter((item) => item.id !== id));
  };

  // Render each list item
  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <CheckBox
        checked={item.completed}
        onPress={() => toggleComplete(item.id)}
        checkedColor="#28a745"
        uncheckedColor="#6c757d"
      />
      <Text
        style={[styles.itemText, item.completed && styles.completedText]}
      >
        {item.name}
      </Text>
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Grocery List Manager 🛒</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter grocery item (e.g., Milk)"
          value={item}
          onChangeText={setItem}
        />
        <Button title="Add Item" onPress={addItem} color="#28a745" />
      </View>

      {/* List Section */}
      <FlatList
        data={groceryList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // Extra top space
    backgroundColor: '#e9ecef',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#212529',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#343a40',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,
  },
  list: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#212529',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  removeText: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default App;