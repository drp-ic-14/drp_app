import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import GroupItem from '../components/GroupItem';
import { useUser } from '../hooks/user';
import AddGroupSheet from '../components/AddGroupSheet';
import GroupSettingsSheet from '../components/GroupSettingsSheet';
import { Group } from '../utils/Interfaces';

const Groups = ({ navigation }) => {
  // const uuid = useUuid();
  const [{ groups }, update] = useUser();
  const [groupId, setGroupId] = useState<string>('');

  const newGroupSheetModalRef = useRef<BottomSheetModal>(null);
  const newGroupModalPress = useCallback(() => {
    newGroupSheetModalRef.current?.present();
  }, []);

  const groupSettingsModalRef = useRef<BottomSheetModal>(null);
  const groupSettingsModalPress = (groupId: string) => {
    setGroupId(groupId);
    // console.log(`-`, groupId);
    groupSettingsModalRef.current?.present();
  };

  useEffect(() => {
    update();
  }, []);

  return (
    <View className="bg-white flex-1 justify-between p-3">
      <View className="flex-1">
        <Text className="text-4xl text-slate-900">Groups</Text>
        {groups.length > 0 ? (
          <FlatList
            data={groups}
            renderItem={({ item }) => (
              <GroupItem
                group={{
                  id: item.id,
                  name: item.name,
                  tasks: item.groupTask,
                  users: item.users,
                }}
                groupSettingsModalPress={groupSettingsModalPress}
                navigation={navigation}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <View className="flex-1 justify-center items-center flex-row space-x-1">
            <Text
              className="text-slate-600 text-lg"
              style={{ textAlignVertical: 'center' }}
            >
              No groups
            </Text>
            <Icons.FaceFrownIcon stroke="#475569" />
          </View>
        )}
        <TouchableOpacity
          onPress={newGroupModalPress}
          className="bg-slate-200 rounded-xl shadow-2xl shadow-black/30 p-3 flex-row items-center space-x-2"
        >
          <Icons.PlusIcon stroke="#0f172a" size={20} />
          <Text
            className="text-slate-900 text-xl"
            style={{ textAlignVertical: 'center' }}
          >
            New Group
          </Text>
        </TouchableOpacity>
      </View>
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

export default Groups;
