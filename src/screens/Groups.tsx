import React, { useEffect, useState } from 'react';
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

import GroupItem from '../components/GroupItem';
import { BACK_END_URL } from '../api/Constants';
import { useUuid } from '../hooks/uuid';

const Groups = () => {
  const uuid = useUuid();
  const [groups, setGroups] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    console.log(`${BACK_END_URL} backend url`, Config);
    updateGroups();
  }, []);

  const updateGroups = async () => {
    try {
      const response = await fetch(`${BACK_END_URL}/api/get_groups`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uuid,
        }),
      });
      const groupList = await response.json();
      setGroups(groupList.groups);
      console.log('groups:', groupList);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

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
      const newGroup = await response.json();
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setModalVisible(false); // Close the modal after creating the group
      setGroupName(''); // Clear the group name
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
      </View>
      <View className="items-center">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-slate-200 rounded-xl shadow-2xl shadow-black/30 p-3 flex-row items-center space-x-2"
        >
          <Icons.PlusIcon stroke="#0f172a" size={20} />
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <TextInput
            value={groupName}
            onChangeText={text => setGroupName(text)}
            placeholder="Enter group name"
            style={{
              borderBottomWidth: 1,
              borderBottomColor: 'black',
              marginBottom: 16,
            }}
          />
          <Button onPress={createGroup}>Create</Button>
          <Button onPress={() => setModalVisible(false)}>Cancel</Button>
        </View>
      </Modal>
    </View>
  );
};

export default Groups;
