import React, { useEffect, useRef, useCallback } from 'react';
import { AppState, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Icons from 'react-native-heroicons/outline';

import { BACK_END_URL } from '../api/Constants';
import TaskItem from '../components/TaskItem';
import { useUuid } from '../hooks/uuid';
import AddTaskSheet from '../components/AddTaskSheet';
import {
  startBackgroundService,
  stopBackgroundService,
} from '../features/BackgroundService';
import { useData } from '../hooks/data';

const Home = () => {
  const uuid = useUuid();
  const [data, setData] = useData();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log(uuid);
    stopBackgroundService();
    updateList();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        updateList();
        stopBackgroundService();
      } else {
        startBackgroundService(data);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [data]);

  const updateList = async () => {
    console.log('updating list...');
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

  return (
    <View className="flex-1 bg-white p-3 space-y-3">
      <Text className="text-4xl text-slate-900 tracking-wider">Home</Text>
      <View className="flex-1 justify-between">
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TaskItem task={item} updateList={updateList} />
          )}
          keyExtractor={item => item.id}
          className="mb-3"
          ItemSeparatorComponent={() => <View className="h-2" />}
        />

        <TouchableOpacity
          onPress={handlePresentModalPress}
          className="bg-slate-200 rounded-xl shadow-2xl shadow-black/30 p-3 flex-row items-center space-x-2"
        >
          <Icons.PlusIcon stroke="#0f172a" size={20} />
          <Text
            className="text-slate-900 text-xl"
            style={{ textAlignVertical: 'center' }}
          >
            New
          </Text>
        </TouchableOpacity>
      </View>

      <AddTaskSheet
        bottomSheetModalRef={bottomSheetModalRef}
        updateList={updateList}
      />
    </View>
  );
};

export default Home;
