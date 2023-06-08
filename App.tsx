import React, { useEffect } from 'react';
import { Text } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/components/HomeScreen';
import { BACK_END_URL } from './src/api/Constants';
import GroupPage from './src/components/GroupPage';

const storeData = async value => {
  try {
    await AsyncStorage.setItem('@uuid', value);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    return await AsyncStorage.getItem('@uuid');
  } catch (e) {
    // error reading value
    return null;
  }
};

const App = () => {
  const [splash, setSplash] = React.useState(true);
  const [request, setRequest] = React.useState(false);
  const [uuid, setUuid] = React.useState('');

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const check = async () => {
      const currId = await getData();
      if (currId === null || currId === undefined) {
        setRequest(true);
        setSplash(false);

        const response = await fetch(`${BACK_END_URL}/api/generate_id`);
        const data = await response.json();
        console.info('Fetched new UUID: ', data);

        await storeData(data.id);

        setUuid(data.id);
        setRequest(false);
      } else {
        setUuid(currId);
        setSplash(false);
      }
    };
    check();
  }, []);

  const chooseScreen = () => {
    if (splash) {
      return null;
    }
    if (request) {
      return <Text>Creating user...</Text>;
    }
    return (
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          initialParams={{ uuid }}
        />
        <Stack.Screen name="Groups" component={GroupPage} initialParams={{ uuid }} />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.light}>
        {chooseScreen()}
      </ApplicationProvider>
    </NavigationContainer>
  );
};

export default App;
