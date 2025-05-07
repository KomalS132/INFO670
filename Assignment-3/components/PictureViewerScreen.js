import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

const PictureViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { image } = route.params;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: image.uri }} style={styles.image} />
        <Card.Content>
          <Text style={styles.caption}>{image.caption}</Text>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        Back to Gallery
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: {
    marginBottom: 16,
  },
  image: {
    height: 400,
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#6200ee',
  },
});

export default PictureViewerScreen;