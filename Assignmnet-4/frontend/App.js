// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SenderScreen from './screens/SenderScreen';
// import ReceiverScreen from './screens/ReceiverScreen';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Sender">
//         <Stack.Screen
//           name="Sender"
//           component={SenderScreen}
//           options={{ title: 'Messenger App' }}
//           initialParams={{ recipients: [] }}
//         />
//         <Stack.Screen
//           name="Receiver"
//           component={ReceiverScreen}
//           options={{ title: 'View Messages' }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import SenderScreen from './SenderScreen';
// import ReceiverScreen from './ReceiverScreen';
import SenderScreen from './screens/SenderScreen';
import ReceiverScreen from './screens/ReceiverScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Messenger App', headerShown: false }}
        />
        <Stack.Screen
          name="Sender"
          component={SenderScreen}
          options={{ title: 'Send Message' }}
        />
        <Stack.Screen
          name="Receiver"
          component={ReceiverScreen}
          options={{ title: 'View Messages' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}