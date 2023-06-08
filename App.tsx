import React, {useEffect} from 'react';
import {backEndUrl} from './src/api/Constants';
import {Text} from 'react-native';
import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/components/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
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
  }
};

export default () => {
  const [splash, setSplash] = React.useState(true);
  const [request, setRequest] = React.useState(false);
  const [uuid, setUuid] = React.useState('');

  useEffect(() => {
    const check = async () => {
      const curr_id = await getData();
      if (curr_id === null || curr_id === undefined) {
        setRequest(true);
        setSplash(false);

        const response = await fetch(`${backEndUrl}/api/generate_id`);
        const data = await response.json();
        console.log(data);

        await storeData(data.id);

        setUuid(data.id);
        setRequest(false);
      } else {
        setUuid(curr_id);
        setSplash(false);
      }
    };
    check();
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <ApplicationProvider {...eva} theme={eva.light}>
        {splash ? (
          <></>
        ) : request ? (
          <Text>Creating user...</Text>
        ) : (
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              initialParams={{uuid: uuid}}
            />
            <Stack.Screen name="Groups" component={GroupPage} />
          </Stack.Navigator>
        )}
      </ApplicationProvider>
    </NavigationContainer>
  );
};
