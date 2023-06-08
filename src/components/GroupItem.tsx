import React from 'react';
import { ListItem, Button } from '@ui-kitten/components';

const GroupItem = ({ name }) => (
  <ListItem title={name} accessoryRight={() => <Button>+</Button>} />
);

export default GroupItem;
