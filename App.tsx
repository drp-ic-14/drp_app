import React, {useEffect, useMemo} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  Layout,
  List,
  Button,
  Modal,
  Card,
  Input,
} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styled} from 'nativewind';
import notifee from '@notifee/react-native';
import {debounce} from 'debounce';

import TaskItem from './components/TaskItem';
import GroupPage from './components/GroupPage';

const StyledList = styled(List);
const StyledInput = styled(Input);
// const StyledButton = styled(Button);

const storeData = async value => {
  try {
    await AsyncStorage.setItem('@uuid', value);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    return await AsyncStorage.getItem('@uuid');
  } catch (e) {
    // error reading value
  }
};

const HomeScreen = props => {
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [data, setData] = React.useState([]);
  const [map, setMap] = React.useState(false);
  const [groupPage, setGroupPage] = React.useState(false);

  useEffect(() => {
    console.log(props.uuid);
    update_list();
  }, []);

  const renderItem = ({item}): React.ReactElement => (
    <TaskItem
      id={item.id}
      name={item.name}
      location={item.location}
      checked={item.completed}
      uuid={props.uuid}
      update_list={update_list}
    />
  );

  async function notify(name: string, location: string) {
    setTimeout(async () => {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title: `${name} - ${location} (10m)`,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    }, 8000);
  }

  const update_list = async () => {
    const response = await fetch(
      'https://drp-14-server.herokuapp.com/api/get_tasks',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: props.uuid,
        }),
      },
    );
    const list = await response.json();
    console.log(list);
    setData(list);
  };

  const add_task = async () => {
    const response = await fetch(
      'https://drp-14-server.herokuapp.com/api/add_task',
      {
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
          },
        }),
      },
    );
    const new_task = await response.json();
    setData([...data, new_task]);
    notify(name, location);
    setName('');
    setLocation('');
    setVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      minHeight: 192,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });

  const map_update = useMemo(() => {
    return debounce(() => {
      setMap(true);
    }, 1000);
  }, []);

  const location_change = v => {
    setLocation(v);
    setMap(false);
    map_update();
  };

  return (
    <Layout>
      <View className="p-3 flex flex-col h-full">
        <Text className="text-3xl text-slate-900">Today</Text>
        <StyledList data={data} renderItem={renderItem} className="grow" />

        {/* <Button onPress={update_list}>
          Refresh
        </Button> */}
        <Button onPress={() => setVisible(true)}>+</Button>
        <Button onPress={() => setGroupPage(true)}>Groups</Button>
        {groupPage && <GroupPage navigation={props.navigation} />}
        {/* <Text className=''>UUID: {uuid}</Text> */}
      </View>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true}>
          <View className="p-1 w-56">
            <Text className="text-lg text-slate-900">New Reminder</Text>
            <StyledInput
              className="my-2"
              placeholder="Name"
              value={name}
              onChangeText={v => setName(v)}
            />
            <StyledInput
              className="my-2"
              placeholder="Location"
              value={location}
              onChangeText={location_change}
            />
            {map ? (
              <Image
                style={{
                  resizeMode: 'cover',
                  height: 100,
                  width: 210,
                }}
                source={require('./assets/map.png')}
              />
            ) : (
              <></>
            )}
            <Button onPress={add_task}>SUBMIT</Button>
          </View>
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
      await notifee.requestPermission();
      const curr_id = await getData();
      if (curr_id === null || curr_id === undefined) {
        setRequest(true);
        setSplash(false);

        const response = await fetch(
          'https://drp-14-server.herokuapp.com/api/generate_id',
        );
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
      {splash ? (
        <></>
      ) : request ? (
        <Text>Creating user...</Text>
      ) : (
        <HomeScreen uuid={uuid} />
      )}
    </ApplicationProvider>
  );
};
