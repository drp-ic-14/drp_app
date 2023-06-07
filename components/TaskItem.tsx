import React from 'react';
import {CheckBox} from '@ui-kitten/components';
import {Text, ListItem} from '@ui-kitten/components';
import {backEndUrl} from '../Constants';
import {distance} from '../Utils';

// type TaskItemProps = {
//   name: string;
//   location: string;
//   checked: boolean;
//   uuid: string;
// };

const TaskItem = (props): React.ReactElement => {
  const [checked, setChecked] = React.useState(props.checked);

  const onCheckedChange = async () => {
    setChecked(true);

    await fetch(`${backEndUrl}/api/delete_task`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: props.uuid,
        task_id: props.id,
      }),
    });
    props.update_list();
    setChecked(false);
  };

  const renderCheckBox = (): React.ReactElement => (
    <CheckBox checked={checked} onChange={onCheckedChange} />
  );

  const renderLocation = (): React.ReactElement => {
    const dist = distance(
      props.latitude,
      props.longitude,
      props.current_lat,
      props.current_long,
    );
    if (dist < 100) {
      return <Text>{`${props.location} (${Math.round(dist)}m)`}</Text>;
    } else {
      return <Text>{props.location}</Text>;
    }
  };

  return (
    <ListItem
      title={`${props.name}`}
      accessoryLeft={renderCheckBox}
      accessoryRight={renderLocation}
    />
  );
};

export default TaskItem;
