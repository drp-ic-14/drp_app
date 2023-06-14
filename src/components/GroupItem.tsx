import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import * as Icons from 'react-native-heroicons/mini';

import TaskItem from './TaskItem';

const GroupItem = ({ name, tasks }) => {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <View className="border-b border-slate-900/30 px-1 py-5 space-y-5">
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

        <Text
          className="text-lg text-slate-900"
          style={{ textAlignVertical: 'center' }}
        >
          {name}
        </Text>
      </TouchableOpacity>
      {open && (
        <FlatList
          data={[...tasks].reverse()}
          renderItem={({ item }) => (
            <TaskItem task={item} updateList={() => {}} />
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View className="h-2" />}
        />
      )}
    </View>
  );
};

export default GroupItem;
