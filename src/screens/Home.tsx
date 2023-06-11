import React, { useEffect } from 'react';
import { AppState, Text, TouchableOpacity, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';

import { BACK_END_URL } from '../api/Constants';
import TaskItem from '../components/TaskItem';
import Geolocater from '../features/Geolocater';
import { Task } from '../utils/Interfaces';
import BgService from '../features/BackgroundService';
import { useUuid } from '../hooks/useUuid';
import AddTaskSheet from '../components/AddTaskSheet';
import Test from '../components/Test';
import { FlatList } from 'react-native-gesture-handler';

const Home = ({ navigation }) => {
  const uuid = useUuid();

  const [currentLocation] = React.useState({
    latitude: 10,
    longitude: 10,
  });
  const [data, setData] = React.useState(new Array<Task>());

  const geolocater: any = new Geolocater();
  const bgService = new BgService(data, geolocater);

  const appState = React.useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = React.useState(
  //   appState.current,
  // );

  useEffect(() => {
    console.log(uuid);
    updateList();

    geolocater.requestLocationPermission();

    return () => {
      geolocater.clearWatch();
    };
  }, []);

  useEffect(() => {
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
      subscription.remove();
    };
  }, [data, currentLocation]);

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
    <View className="flex-1 bg-white p-3 space-y-3">
      <Text className="text-4xl text-slate-900 tracking-wider">Home</Text>
      <View className="flex-1 justify-between">
        <FlatList
          data={data}
          renderItem={({ item }) => <TaskItem task={item} />}
          keyExtractor={item => item.id}
          className="mb-3"
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
        <AddTaskSheet />
      </View>
    </View>
  );
};

export default Home;
