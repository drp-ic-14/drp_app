import React, {useEffect} from 'react';

import {Text, View} from 'react-native';

import {Layout, List, Button} from '@ui-kitten/components';

import {styled} from 'nativewind';
import {backEndUrl} from '../api/Constants';
import TaskItem from './TaskItem';
import Geolocater from '../features/Geolocater';
import {Task} from '../utils/Interfaces';
import BgService from '../features/BackgroundService';
import AddTaskWindow from './AddTaskWindow';

const StyledList = styled(List);

const HomeScreen = props => {
  const [visible, setVisible] = React.useState(false);
  const [currentLocation, setCurrentLocation] = React.useState({
    latitude: 10,
    longitude: 10,
  });
  const [data, setData] = React.useState(new Array<Task>());

  const bgService = new BgService(data, currentLocation);
  const geolocater: any = new Geolocater(currentLocation, setCurrentLocation);

  useEffect(() => {
    console.log(props.uuid);
    update_list();

    geolocater.requestLocationPermission();
    // toggleBackgroundService(); // TODO: add conditions to toggle
    return () => {
      geolocater.clearWatch();
    };
  }, []);

  const renderItem = ({item}): React.ReactElement => (
    <TaskItem
      id={item.id}
      name={item.name}
      location={item.location}
      longitude={item.longitude}
      latitude={item.latitude}
      checked={item.completed}
      uuid={props.uuid}
      update_list={update_list}
      current_lat={currentLocation.latitude}
      current_long={currentLocation.longitude}
    />
  );

  const update_list = async () => {
    const response = await fetch(`${backEndUrl}/api/get_tasks`, {
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
    console.log(list);
    setData(list);
  };

  return (
    <Layout>
      <View className="p-3 flex flex-col h-full">
        <Text className="text-3xl text-slate-900">Today</Text>

        <StyledList data={data} renderItem={renderItem} className="grow" />

        <Button onPress={() => setVisible(true)}>+</Button>
        <Button onPress={bgService.toggleBackgroundService}>
          Toggle Background Service
        </Button>
        <Button onPress={bgService.searchForNearbyTasks}>Check nearby</Button>
        <Text className="">UUID: {props.uuid}</Text>
      </View>

      <AddTaskWindow
        uuid={props.uuid}
        visible={visible}
        setVisible={setVisible}
        data={data}
        setData={setData}
        geolocater={geolocater}
        currentLocation={currentLocation}
      />
    </Layout>
  );
};

export default HomeScreen;
