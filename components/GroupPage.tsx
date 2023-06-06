import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

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
      <TouchableOpacity onPress={toggleExpand}>
        <Text>Groups</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View>
          {groups.map((group) => (
            <GroupItem key={group.id} name={group.name} navigation={navigation}/>
          ))}
        </View>
      )}
    </View>
  );
};

export default GroupPage;
