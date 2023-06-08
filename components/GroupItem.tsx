import React from 'react';
import { ListItem, Button } from '@ui-kitten/components';

const GroupItem = props => {

  const [visible, setVisible] = React.useState(false);

  return (
    <ListItem
      title={props.name}
      accessoryRight={() => <Button onPress={() => setVisible(true)}>+</Button>}
    />
  );
};

export default GroupItem;