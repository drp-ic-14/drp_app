import React, { useEffect } from 'react';

import { AppState, Text, View } from 'react-native';

import { Layout, List, Button } from '@ui-kitten/components';

import { styled } from 'nativewind';
import { BACK_END_URL } from '../api/Constants';
import TaskItem from './TaskItem';
import Geolocater from '../features/Geolocater';
import { Task } from '../utils/Interfaces';
import BgService from '../features/BackgroundService';
import AddTaskWindow from './AddTaskWindow';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledList = styled(List);

const HomeScreen = ({ route, navigation }) => {
  const { uuid } = route.params;
  const [visible, setVisible] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState({
    latitude: 10,
    longitude: 10,
  });
  const [data, setData] = React.useState(new Array<Task>());

  const bgService = new BgService(data, currentLocation);
  const geolocater: any = new Geolocater(currentLocation, setCurrentLocation);

  const appState = React.useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = React.useState(
  //   appState.current,
  // );

  useEffect(() => {
    console.log(uuid);
    updateList();

    geolocater.requestLocationPermission();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log("App in foreground");
        bgService.stopBackgroundService();
      } else {
        // console.log("App in background");
        bgService.startBackgroundService();
      }

      appState.current = nextAppState;
      // setAppStateVisible(appState.current);
      // console.log('AppState', appState.current);
    });

    return () => {
      geolocater.clearWatch();
      subscription.remove();
    };
  }, []);

  const updateList = async () => {
    const response = await fetch(`${BACK_END_URL}/api/get_tasks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: uuid,
      }),
    });
    const list = await response.json();
    console.log(list);
    setData(list);
  };

  const renderItem = ({ item }): React.ReactElement => (
    <TaskItem
      id={item.id}
      name={item.name}
      location={item.location}
      longitude={item.longitude}
      latitude={item.latitude}
      checked={item.completed}
      uuid={uuid}
      updateList={updateList}
      current_lat={currentLocation.latitude}
      current_long={currentLocation.longitude}
    />
  );

  return (
    <Layout>
      <View className='p-3 flex flex-col h-full justify-between'>
        <View>
          <Text className="text-3xl text-slate-900">Today</Text>
          <StyledList data={data} renderItem={renderItem} className="grow" />
        </View>
        <SafeAreaView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button onPress={() => navigation.navigate('Groups')}>Groups</Button>
          <Button onPress={() => setVisible(true)}>+</Button>
        </SafeAreaView>
        {/* <Button onPress={bgService.toggleBackgroundService}>
          Toggle Background Service
        </Button>
        <Button onPress={bgService.searchForNearbyTasks}>Check nearby</Button>
        <Text className="">UUID: {uuid}</Text> */}
      </View>

      <AddTaskWindow
        uuid={uuid}
        visible={visible}
        setVisible={setVisible}
        data={data}
        setData={setData}
        geolocater={geolocater}
        currentLocation={currentLocation}
      />
    </Layout>
  );
};

export default HomeScreen;
