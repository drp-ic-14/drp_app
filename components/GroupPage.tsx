import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Button } from '@ui-kitten/components';

// Import the GroupItem component
import GroupItem from './GroupItem';

const GroupPage = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Array of groups
  const groups = [
    { id: '1', name: 'Group 1' },
    { id: '2', name: 'Group 2' },
    { id: '3', name: 'Group 3' },
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      {groups.map((group) => (
        <GroupItem name={group.name} />
      ))}
    </View>
  );
};

export default GroupPage;
