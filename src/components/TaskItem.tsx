import React from 'react';
import { CheckBox, Text, ListItem } from '@ui-kitten/components';
import { BACK_END_URL } from '../api/Constants';
import { distance } from '../utils/Utils';

// type TaskItemProps = {
//   name: string;
//   location: string;
//   checked: boolean;
//   uuid: string;
// };

const TaskItem = ({
  checked,
  uuid,
  id,
  updateList,
  latitude,
  longitude,
  current_lat,
  current_long,
  location,
  name,
}): React.ReactElement => {
  const [checkedLive, setChecked] = React.useState(checked);

  const onCheckedChange = async () => {
    setChecked(true);

    await fetch(`${BACK_END_URL}/api/delete_task`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: uuid,
        task_id: id,
      }),
    });
    updateList();
    setChecked(false);
  };

  const renderCheckBox = (): React.ReactElement => (
    <CheckBox checked={checkedLive} onChange={onCheckedChange} />
  );

  const renderLocation = (): React.ReactElement => {
    const dist = distance(latitude, longitude, current_lat, current_long);
    if (dist < 100) {
      return <Text>{`${location} (${Math.round(dist)}m)`}</Text>;
    }
    return <Text>{location}</Text>;
  };

  return (
    <ListItem
      title={`${name}`}
      accessoryLeft={renderCheckBox}
      accessoryRight={renderLocation}
    />
  );
};

export default TaskItem;
