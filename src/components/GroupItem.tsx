import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const GroupItem = ({ name, groupTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = option => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={handleDropdownToggle}>
        <Text>{name}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View>
          {groupTask.map(task => (
            <TouchableOpacity
              key={task.id}
              onPress={() => handleOptionSelect(task)}
            >
              <Text>{task.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {selectedOption && <Text>Selected option: {selectedOption.label}</Text>}
    </View>
  );
};

export default GroupItem;
