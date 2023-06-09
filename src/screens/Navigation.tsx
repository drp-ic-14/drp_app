import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../components/HomeScreen';
import GroupPage from '../components/GroupPage';

const Navigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Groups" component={GroupPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
