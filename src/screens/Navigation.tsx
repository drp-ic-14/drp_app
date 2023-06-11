import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as Icons from 'react-native-heroicons/outline';

import HomeScreen from '../components/HomeScreen';
import GroupPage from '../components/GroupPage';

const Navigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ focused, color, size }) => {
            let icon;

            if (route.name === 'Home') {
              icon = <Icons.HomeIcon stroke={focused ? '#ff0000' : '#333'} />;
            } else if (route.name === 'Groups') {
              icon = (
                <Icons.UserGroupIcon stroke={focused ? '#ff0000' : '#333'} />
              );
            }

            return icon;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Groups" component={GroupPage} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
