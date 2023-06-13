import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import * as Icons from 'react-native-heroicons/outline';

import Home from './Home';
import Groups from './Groups';
import Map from './Map';

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
            } else if (route.name === 'Map') {
              icon = <Icons.MapIcon stroke={focused ? '#ff0000' : '#333'} />;
            }

            return icon;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Map" component={Map} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Groups" component={Groups} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
