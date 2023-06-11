import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Icons from 'react-native-heroicons/outline';

import { BACK_END_URL } from '../api/Constants';
import { distance } from '../utils/Utils';
import { Task } from '../utils/Interfaces';

type TaskItemProps = {
  task: Task;
};

const TaskItem = ({
  task: { name, location, longitude, latitude },
}: TaskItemProps) => {
  const [checkedLive, setChecked] = React.useState(false);

  // const onCheckedChange = async () => {
  //   setChecked(true);

  //   await fetch(`${BACK_END_URL}/api/delete_task`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       user_id: uuid,
  //       task_id: id,
  //     }),
  //   });
  //   updateList();
  //   setChecked(false);
  // };

  // const renderLocation = (): React.ReactElement => {
  //   const dist = distance(latitude, longitude, current_lat, current_long);
  //   if (dist < 100) {
  //     return <Text>{`${location} (${Math.round(dist)}m)`}</Text>;
  //   }
  //   return <Text>{location}</Text>;
  // };

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
            {location}
          </Text>
        </View>
      </View>
      <TouchableOpacity className="rounded-full bg-indigo-950/5 h-10 w-10 justify-center items-center">
        <Icons.CheckIcon stroke="#0f172a" />
      </TouchableOpacity>
    </View>
  );
};

export default TaskItem;
