import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Button } from '@ui-kitten/components';

// Import the GroupItem component
import GroupItem from './GroupItem';

const GroupPage = ({ navigation }) => {

  // Array of groups
  const groups = [
    { id: '1', name: 'Family' },
    { id: '2', name: 'IC Computing' },
    { id: '3', name: 'Flat' },
  ];

  return (
    <View>
      {groups.map((group) => (
        <GroupItem name={group.name} />
      ))}
    </View>
  );
};

export default GroupPage;
