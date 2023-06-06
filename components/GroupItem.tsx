import React from 'react';
import { Text, ListItem } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';

const GroupItem = ({ key, name, navigation }) => {
  const onGroupPress = () => {
    // Handle group item press here
    // You can perform any necessary action or navigation

    // For example, you can navigate to a group details screen
    // by passing the group ID as a parameter
    navigation.navigate('GroupDetails', { groupId: name });
  };

  return (
    <ListItem
      title={name}
      onPress={onGroupPress}
      // You can add more accessory components as needed
    />
  );
};

export default GroupItem;