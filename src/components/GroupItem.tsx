import React from 'react';
import {ListItem, Button} from '@ui-kitten/components';

const GroupItem = props => {
  return (
    <ListItem title={props.name} accessoryRight={() => <Button>+</Button>} />
  );
};

export default GroupItem;
