import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import * as Icons from 'react-native-heroicons/mini';
import TaskItem from './TaskItem';
import { Group } from '../utils/Interfaces';

type GroupItemProps = {
  group: Group;
  groupSettingsModalPress: any | null;
  navigation: any;
};

const GroupItem = ({
  group,
  groupSettingsModalPress,
  navigation,
}: GroupItemProps) => {
  const [open, setOpen] = useState(!groupSettingsModalPress);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <View className="border-b border-slate-900/30 px-1 py-5">
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={toggleDropdown}
          className="flex-row space-x-1 items-center"
        >
          {open ? (
            <Icons.ChevronDownIcon
              stroke="#0F172A"
              fill="#0F172A"
              style={{ textAlignVertical: 'center' }}
            />
          ) : (
            <Icons.ChevronRightIcon
              stroke="#0F172A"
              fill="#0F172A"
              style={{ textAlignVertical: 'center' }}
            />
          )}
          {(group.name === "Personal") && (<Icons.UserIcon
            stroke="#0F172A"
            fill="#0F172A"
            style={{ textAlignVertical: 'center' }}
          />)}
          <Text
            className="text-lg text-slate-900"
            style={{ textAlignVertical: 'center' }}
          >
            {group.name}
          </Text>
        </TouchableOpacity>
        {(groupSettingsModalPress) && (<TouchableOpacity
          onPress={() => {
            groupSettingsModalPress(group.id);
          }}
          className="flex-row space-x-1"
        >
          <Icons.EllipsisHorizontalIcon
            stroke="#0F172A"
            fill="#0F172A"
            style={{ textAlignVertical: 'center' }}
          />
        </TouchableOpacity>)}
      </View>
      {open && (
        <FlatList
          data={[...group.tasks].reverse()}
          renderItem={({ item }) => (
            <TaskItem task={item} navigation={navigation} />
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
          className={group.tasks.length > 0 ? 'mt-5' : ''}
        />
      )}
    </View>
  );
};

export default GroupItem;
