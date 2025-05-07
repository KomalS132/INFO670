import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GalleryScreen from './components/GalleryScreen';
import PictureViewerScreen from './components/PictureViewerScreen';
import ProfileScreen from './components/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Gallery and PictureViewer
const GalleryStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="GalleryHome" component={GalleryScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PictureViewer" component={PictureViewerScreen} options={{ title: 'View Image' }} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Gallery') iconName = 'image-multiple';
              else if (route.name === 'Profile') iconName = 'account';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: '#757575',
          })}
        >
          <Tab.Screen name="Gallery" component={GalleryStack} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}