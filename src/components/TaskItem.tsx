import React, { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useAsyncFn } from 'react-use';
import * as Icons from 'react-native-heroicons/outline';

import { distance } from '../utils/Utils';
import { Task } from '../utils/Interfaces';
import { useUuid } from '../hooks/login';
import { useLocation } from '../hooks/location';
import { deleteTask } from '../api/BackEnd';

type TaskItemProps = {
  task: Task;
  updateList: () => void;
};

const TaskItem = ({
  task: { id, name, location, longitude, latitude },
  updateList,
}: TaskItemProps) => {
  const uuid = useUuid();
  const [currentLocation] = useLocation();

  const onComplete = async () => {
    await deleteTask(uuid, id);
    updateList();
  };

  const [{ loading }, handleComplete] = useAsyncFn(onComplete);

  const dist = useMemo(
    () =>
      distance(
        latitude,
        longitude,
        currentLocation.latitude,
        currentLocation.longitude,
      ),
    [currentLocation],
  );

  return (
    <View className="bg-indigo-100 p-4 pt-3 rounded-2xl flex-row justify-between shadow-2xl shadow-black/30">
      <View className="space-y-2 flex-1">
        <Text className="text-slate-900 text-lg">{name}</Text>
        <View className="flex-row space-x-1 -ml-1">
          <Icons.MapPinIcon stroke="#0f172a99" size={20} />
          <Text
            className="text-slate-900/60"
            style={{ textAlignVertical: 'center' }}
          >
            {location} ({Math.round(dist)}m)
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleComplete()}
        disabled={loading}
        className="rounded-full bg-indigo-950/5 h-10 w-10 justify-center items-center"
      >
        {loading ? <ActivityIndicator /> : <Icons.CheckIcon stroke="#0f172a" />}
      </TouchableOpacity>
    </View>
  );
};

export default TaskItem;
