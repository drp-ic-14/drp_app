import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Button } from '@ui-kitten/components/ui/button/button.component';
import Config from 'react-native-config';
import * as Icons from 'react-native-heroicons/outline';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import GroupItem from '../components/GroupItem';
import { BACK_END_URL } from '../api/Constants';
import { useUuid } from '../hooks/login';
import { useUser } from '../hooks/user';
import AddGroupSheet from '../components/AddGroupSheet';

const Groups = () => {
  const uuid = useUuid();
  const [{ groups }, update] = useUser();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    update();
  }, []);

  const createGroup = async () => {
    try {
      const response = await fetch(`${BACK_END_URL}/api/create_group`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          group_name: groupName,
          user_id: uuid,
        }),
      });
      // const newGroup = await response.json();
      await update();
      setGroupName(''); // Clear the group name
      setModalVisible(false); // Close the modal after creating the group
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  // const joinGroup = async () => {
  //   try {
  //     const response = await fetch(`${BACK_END_URL}/api/join_group`, {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         id: uuid,
  //         group_id: group_id,
  //       }),
  //     });
  //     const newGroup = await response.json();
  //     setGroups(prevGroups => [...prevGroups, newGroup]);
  //   } catch (error) {
  //     console.error('Error adding group:', error);
  //   }
  // };

  return (
    <View className="bg-white flex-1 justify-between p-3">
      <View className="flex-1">
        <Text className="text-4xl text-slate-900">Groups</Text>
        {groups.length > 0 ? (
          <FlatList
            data={groups}
            renderItem={({ item: { name, groupTask: tasks } }) => (
              <GroupItem name={name} tasks={tasks} />
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
          onPress={handlePresentModalPress}
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
        bottomSheetModalRef={bottomSheetModalRef}
        updateList={update}
      />
    </View>
  );
};

export default Groups;
