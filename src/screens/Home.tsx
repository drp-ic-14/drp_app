import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { AppState, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import * as Icons from 'react-native-heroicons/outline';

import TaskItem from '../components/TaskItem';
import { useUuid } from '../hooks/login';
import AddTaskSheet from '../components/AddTaskSheet';
import {
  startBackgroundService,
  stopBackgroundService,
} from '../features/BackgroundService';
import { useUser } from '../hooks/user';

const Home = ({ navigation }) => {
  const uuid = useUuid();
  const [user, update] = useUser();
  const { tasks: data } = user;

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    console.log(uuid);
    stopBackgroundService();
    update();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        update();
        stopBackgroundService();
      } else {
        startBackgroundService();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  return (
    <View className="flex-1 bg-white p-3 space-y-3">
      <Text className="text-4xl text-slate-900 tracking-wider">Tasks</Text>
      <View className="flex-1 justify-between">
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TaskItem task={item} navigation={navigation} />
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
        updateList={update}
      />
    </View>
  );
};

export default Home;
