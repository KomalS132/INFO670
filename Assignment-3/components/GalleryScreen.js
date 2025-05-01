import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const images = [
  { id: '1', uri: 'https://picsum.photos/200/300?random=1', caption: 'Sunset Beach' },
  { id: '2', uri: 'https://picsum.photos/200/300?random=2', caption: 'Mountain Peak' },
  { id: '3', uri: 'https://picsum.photos/200/300?random=3', caption: 'City Lights' },
  { id: '4', uri: 'https://picsum.photos/200/300?random=4', caption: 'Forest Path' },
];

const GalleryScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('PictureViewer', { image: item })}
      style={styles.card}
    >
      <Card>
        <Card.Cover source={{ uri: item.uri }} />
        <Card.Content>
          <Text style={styles.caption}>{item.caption}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo Gallery</Text>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
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
  card: {
    flex: 1,
    margin: 8,
  },
  caption: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 16,
  },
});

export default GalleryScreen;