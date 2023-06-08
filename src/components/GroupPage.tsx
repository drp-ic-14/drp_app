import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Button } from '@ui-kitten/components/ui/button/button.component';
import GroupItem from './GroupItem';

import { BACK_END_URL } from '../api/Constants';
import Config from "react-native-config";


const GroupPage = ({ route }) => {

  const { uuid, group_id } = route.params;
  const [groups, setGroups] = React.useState([]);

  useEffect(() => {
    console.log(BACK_END_URL + " backend url", Config);
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
    } catch (error) {
      console.error('Error updating groups:', error);
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
          group_name: "group",
          user_id: uuid,
        }),
      });
      const newGroup = await response.json();
      setGroups(prevGroups => [...prevGroups, newGroup]);
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
    <View>
      {groups.map(group => (
        <GroupItem key={group.id} name={group.name} />
      ))}
      <Button onPress={createGroup}>New Group</Button>
    </View>
  );
};

export default GroupPage;
