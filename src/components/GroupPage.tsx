import React, { useEffect } from 'react';
import { View } from 'react-native';

// Import the GroupItem component
import { Button } from '@ui-kitten/components/ui/button/button.component';
import GroupItem from './GroupItem';

import { BACK_END_URL } from '../api/Constants';

const GroupPage = ({ uuid }) => {
  // const groups = [
  //   {id: '1', name: 'Family'},
  //   {id: '2', name: 'IC Computing'},
  //   {id: '3', name: 'Flat'},
  // ];

  const [groups, setGroups] = React.useState([]);

  useEffect(() => {
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
      setGroups(groupList);
    } catch (error) {
      console.error('Error updating groups:', error);
    }
  };

  const handleAddGroup = async () => {
    try {
      const response = await fetch(`${BACK_END_URL}/api/create_group`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: props.uuid,
          group_name: 'New Group',
        }),
      });
      const newGroup = await response.json();
      setGroups(prevGroups => [...prevGroups, newGroup]);
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  return (
    <View>
      {groups.map(group => (
        <GroupItem key={group.id} name={group.name} />
      ))}
      <Button onPress={handleAddGroup}>New Group</Button>
    </View>
  );
};

export default GroupPage;
