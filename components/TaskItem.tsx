import React from 'react';
import { CheckBox } from '@ui-kitten/components';
import { Text, ListItem } from '@ui-kitten/components';

type TaskItemProps = {
    name: string,
    location: string,
    checked: boolean,
}

const TaskItem = (props: TaskItemProps): React.ReactElement => {

  const [checked, setChecked] = React.useState(false);

  const renderCheckBox = (): React.ReactElement => (
    <CheckBox
      checked={props.checked}
      onChange={nextChecked => setChecked(nextChecked)}
    />
  );

  const renderLocation = (): React.ReactElement => (
    <Text>
        {props.location}
    </Text>
  );

  return (
    <ListItem
      title={`${props.name}`}
      accessoryLeft={renderCheckBox}
      accessoryRight={renderLocation}
    />
  );
};

export default TaskItem;