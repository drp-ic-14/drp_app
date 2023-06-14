import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { gql, useSubscription } from '@apollo/client';
import * as Icons from 'react-native-heroicons/outline';

import { useRecoilState } from 'recoil';
import Home from './Home';
import Groups from './Groups';
import Map from './Map';
import { useUuid } from '../hooks/login';
import { userAtom } from '../store/Atoms';

const USER_SUBSCRIPTION = gql`
  subscription OnUserUpdate($userId: ID!) {
    user(id: $userId) {
      groups {
        groupTask {
          name
          longitude
          location
          latitude
          id
        }
        id
        users {
          id
        }
        name
      }
      id
      tasks {
        name
        longitude
        location
        latitude
        id
      }
    }
  }
`;

const Navigation = () => {
  const Tab = createBottomTabNavigator();
  const uuid = useUuid();

  const { data } = useSubscription(USER_SUBSCRIPTION, {
    variables: { userId: uuid },
  });

  const [, setUser] = useRecoilState(userAtom);

  useEffect(() => {
    console.log('Subscription update:', data);
    if (data) {
      const { user } = data;
      setUser(user);
    }
  }, [data]);

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
              icon = <Icons.HomeIcon stroke={focused ? '#818cf8' : '#333'} />;
            } else if (route.name === 'Groups') {
              icon = (
                <Icons.UserGroupIcon stroke={focused ? '#818cf8' : '#333'} />
              );
            } else if (route.name === 'Map') {
              icon = <Icons.MapIcon stroke={focused ? '#818cf8' : '#333'} />;
            }

            return icon;
          },
          tabBarActiveTintColor: '#818cf8',
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
