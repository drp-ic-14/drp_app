import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, List, Button, Modal, Card, Input } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from "nativewind";

import TaskItem from './components/TaskItem';

const StyledList = styled(List);

const data = [
  {
    name: 'smt1',
    checked: false,
    location: 'wow',
  },
  {
    name: 'smt2',
    checked: true,
    location: 'wow2',
  },
]

const renderItem = ({ item, index }): React.ReactElement => (
  <TaskItem name={item.name} location={item.location} checked={item.checked} />
);

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@uuid', value)
  } catch (e) {
    // saving error
  }
}

const getData = async () => {
  try {
    return await AsyncStorage.getItem('@uuid')
  } catch(e) {
    // error reading value
  }
}

const HomeScreen = () => {
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [uuid, setUuid] = React.useState('');

  useEffect(() => {
    const get = async () => {
      setUuid(await getData() || 'failed');
    }
    get();
  }, []);

  const styles = StyleSheet.create({
    container: {
      minHeight: 192,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });

  return (
    <Layout>
      <View className='p-3 flex flex-col h-full'>
        <Text className='text-3xl text-slate-900'>Today</Text>

        <StyledList 
          data={data}
          renderItem={renderItem}
          className='grow'
        />

        <Button onPress={() => setVisible(true)}>
          +
        </Button>
        <Text className=''>UUID: {uuid}</Text>
      </View>

      <Modal
          visible={visible}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => setVisible(false)}
        >
          <Card disabled={true}>
            <Text>
              New Reminder
            </Text>
            <Input
              placeholder='Name'
              value={name}
              onChangeText={v => setName(v)}
            />
            <Input
              placeholder='Location'
              value={location}
              onChangeText={v => setLocation(v)}
            />
            <Button onPress={() => setVisible(false)}>
              SUBMIT
            </Button>
          </Card>
        </Modal>

    </Layout>
  );
};

export default () => {
  useEffect(() => {
    const check = async () => {
      if (await getData() === null) {
        storeData('123');
      }
    };
    check();
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <HomeScreen />
    </ApplicationProvider>
  )
};