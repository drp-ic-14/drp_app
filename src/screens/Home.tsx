import { useCallback, useEffect, useRef, useState } from 'react';
import { useUuid } from '../hooks/login';
import { useUser } from '../hooks/user';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AppState, FlatList, Text, TouchableOpacity, View } from 'react-native';
import {
  startBackgroundService,
  stopBackgroundService,
} from '../features/BackgroundService';
import AddTaskSheet from '../components/AddTaskSheet';
import { Group } from '../utils/Interfaces';
import GroupItem from '../components/GroupItem';
import * as Icons from 'react-native-heroicons/outline';
import AddGroupSheet from '../components/AddGroupSheet';
import GroupSettingsSheet from '../components/GroupSettingsSheet';

const Home = ({ navigation }) => {
  const [user, update] = useUser();
  const uuid = user.id;
  const { tasks: data } = user;
  const [groupId, setGroupId] = useState<string>('');

  const addTaskModalRef = useRef<BottomSheetModal>(null);
  const addTaskModalPress = useCallback(() => {
    addTaskModalRef.current?.present();
  }, []);

  const newGroupSheetModalRef = useRef<BottomSheetModal>(null);
  const newGroupModalPress = useCallback(() => {
    newGroupSheetModalRef.current?.present();
  }, []);

  const groupSettingsModalRef = useRef<BottomSheetModal>(null);
  const groupSettingsModalPress = (groupId: string) => {
    setGroupId(groupId);
    groupSettingsModalRef.current?.present();
  };

  const appState = useRef(AppState.currentState);

  const personalGroup: Group = {
    id: `_${uuid}`,
    name: 'Personal',
    tasks: data,
    users: [user],
  };

  const dataToGroup = g => {
    return {
      id: g.id,
      name: g.name,
      tasks: g.groupTask,
      users: g.users,
    };
  };

  const groups: Group[] = user.groups.map(dataToGroup);

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
        <GroupItem
          group={personalGroup}
          groupSettingsModalPress={null}
          navigation={navigation}
        />
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <GroupItem
              group={item}
              groupSettingsModalPress={groupSettingsModalPress}
              navigation={navigation}
            />
          )}
          keyExtractor={item => item.id}
        />

        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={addTaskModalPress}
            className="bg-slate-200 rounded-xl shadow-2xl shadow-black/30 p-3 flex-row items-center space-x-2"
          >
            <Icons.PlusIcon stroke="#0f172a" size={20} />
            <Text
              className="text-slate-900 text-xl"
              style={{ textAlignVertical: 'center' }}
            >
              New Task
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={newGroupModalPress}
            className="bg-slate-200 rounded-xl shadow-2xl shadow-black/30 p-3 flex-row items-center space-x-2"
          >
            <Text
              className="text-slate-900 text-xl"
              style={{ textAlignVertical: 'center' }}
            >
              New Group
            </Text>
            <Icons.PlusIcon stroke="#0f172a" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <AddTaskSheet bottomSheetModalRef={addTaskModalRef} updateList={update} />
      <AddGroupSheet
        bottomSheetModalRef={newGroupSheetModalRef}
        updateList={update}
      />
      <GroupSettingsSheet
        bottomSheetModalRef={groupSettingsModalRef}
        groupId={groupId}
      />
    </View>
  );
};

export default Home;
