import React, { useState, useEffect, useRef } from 'react';
import { AppState, Text, View, FlatList } from 'react-native';

import { BACK_END_URL } from '../api/Constants';
import TaskItem from '../components/TaskItem';
import { Task } from '../utils/Interfaces';
import { useUuid } from '../hooks/uuid';
import AddTaskSheet from '../components/AddTaskSheet';
import {
  startBackgroundService,
  stopBackgroundService,
} from '../features/BackgroundService';

const Home = () => {
  const uuid = useUuid();
  const [data, setData] = useState(new Array<Task>());

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log(uuid);
    updateList();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
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
    console.log("updating list...");
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
        <AddTaskSheet updateList={updateList} />
      </View>
    </View>
  );
};

export default Home;
