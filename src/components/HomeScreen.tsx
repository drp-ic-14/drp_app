import React, { useEffect } from 'react';
import { AppState, Text, TouchableOpacity, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';

import { BACK_END_URL } from '../api/Constants';
import TaskItem from './TaskItem';
import Geolocater from '../features/Geolocater';
import { Task } from '../utils/Interfaces';
import BgService from '../features/BackgroundService';
import { useUuid } from '../hooks/useUuid';
import AddTaskSheet from './AddTaskSheet';
import Test from './Test';

const HomeScreen = ({ navigation }) => {
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
    <View className="bg-white flex-1">
      <View className="px-3 flex-1 justify-between pb-3">
        <View>
          <Text className="text-4xl text-slate-900 py-3 tracking-wider">
            Home
          </Text>
          <View className="gap-3">
            <View className="bg-indigo-100 p-4 pt-3 rounded-2xl flex-row justify-between shadow-2xl shadow-black/30">
              <View className="space-y-2 flex-1">
                <Text className="text-slate-900 text-lg">
                  Learn how to do something a bit insane
                </Text>
                <View className="flex-row space-x-1 -ml-1">
                  <Icons.MapPinIcon stroke="#0f172a99" size={20} />
                  <Text
                    className="text-slate-900/60"
                    style={{ textAlignVertical: 'center' }}
                  >
                    Tesco Express, North End Road
                  </Text>
                </View>
              </View>
              <TouchableOpacity className="rounded-full bg-indigo-950/5 h-10 w-10 justify-center items-center">
                <Icons.CheckIcon stroke="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <AddTaskSheet />
      </View>
    </View>
  );
};

export default HomeScreen;
