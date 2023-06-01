import React, { useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, List, Button, Modal, Card, Input } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styled } from "nativewind";
import notifee from '@notifee/react-native';

import TaskItem from './components/TaskItem';

const StyledList = styled(List);

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

const HomeScreen = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [data, setData] = React.useState([]);

  useEffect(() => {
    console.log(props.uuid);
    update_list();
  }, []);

  const renderItem = ({ item, index }): React.ReactElement => (
    <TaskItem id={item.id} name={item.name} location={item.location} checked={item.checked} uuid={props.uuid} update_list={update_list} />
  );

  const update_list = async () => {
    const response = await fetch('https://drp-14-server.herokuapp.com/api/get_tasks', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: props.uuid,
      }),
    });
    const list = await response.json();
    setData(list);
  };

  const add_task = async () => {
    const response = await fetch('https://drp-14-server.herokuapp.com/api/add_task', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: props.uuid,
        task: {
          name,
          location,
        }
      }),
    });
    const new_task = await response.json();
    setData([...data, new_task]);
    setName('');
    setLocation('');
    setVisible(false);
    onNotify();
  };

  const styles = StyleSheet.create({
    container: {
      minHeight: 192,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });

  async function onNotify() {
    await notifee.requestPermission()
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    })

    await notifee.displayNotification({
      title: 'Get pencils - Rymans (10m)',
      android: {
        channelId,
        pressAction: {
          id: 'default'
        }
      }
    })
  }

  return (
    <Layout>
      <View className='p-3 flex flex-col h-full'>
        <Text className='text-3xl text-slate-900'>Today</Text>

        <StyledList 
          data={data}
          renderItem={renderItem}
          className='grow'
        />

        <Button onPress={update_list}>
          Refresh
        </Button>
        <Button onPress={() => setVisible(true)}>
          +
        </Button>
        {/* <Text className=''>UUID: {uuid}</Text> */}
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
            <Button onPress={add_task}>
              SUBMIT
            </Button>
          </Card>
        </Modal>

    </Layout>
  );
};

export default () => {
  const [splash, setSplash] = React.useState(true);
  const [request, setRequest] = React.useState(false);
  const [uuid, setUuid] = React.useState('');

  useEffect(() => {
    const check = async () => {
      const curr_id = await getData();
      if (curr_id === null || curr_id === undefined) {
        setRequest(true);
        setSplash(false);

        const response = await fetch('https://drp-14-server.herokuapp.com/api/generate_id');
        const data = await response.json();
        console.log(data);
        
        await storeData(data.id);
        
        setUuid(data.id);
        setRequest(false);
      } else {
        setUuid(curr_id);
        setSplash(false);
      }
    };
    check();
  }, []);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      { splash ? <></> : (request ? <Text>Creating user...</Text> : <HomeScreen uuid={uuid} />) }
    </ApplicationProvider>
  )
};