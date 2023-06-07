import React, {useEffect} from 'react';
import {backEndUrl} from './Constants';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
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

import TaskItem from './components/TaskItem';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';
import {distance} from './Utils';

const StyledList = styled(List);
const StyledInput = styled(Input);
// const StyledButton = styled(Button);

interface Task {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  lastNotified?: number;
}

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
  const [currentLocation, setCurrentLocation] = React.useState({
    latitude: 10,
    longitude: 10,
  });
  const [location, setLocation] = React.useState('');
  const [data, setData] = React.useState(new Array<Task>());
  const [locationCoords, setLocationCoords] = React.useState({
    lat: 10,
    lng: 10,
  });
  const [locationName, setLocationName] = React.useState('');

  const searchForNearbyTasks = () => {
    data.forEach(task => {
      const time = Date.now();
      const dist = distance(
        task.latitude,
        task.longitude,
        currentLocation.latitude,
        currentLocation.longitude,
      );
      if (dist < 100) {
        const timeSinceNotified = time - (task.lastNotified || 0);
        // default time is 300000ms aka 5mins
        if (timeSinceNotified > 300000) {
          notify(task, Math.round(dist));
          task.lastNotified = time;
        }
      }
    });
  };

  const backgroundService = async () => {
    const sleep = (time: any) =>
      new Promise<void>(resolve => setTimeout(() => resolve(), time));

    await new Promise(async () => {
      while (true) {
        searchForNearbyTasks();
        await sleep(10000);
      }
    });
  };

  const backgroundServiceOptions = {
    taskName: 'DRP_APP',
    taskTitle: 'Searching for nearby tasks...',
    taskDesc: '',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
  };

  useEffect(() => {
    console.log(props.uuid);
    update_list();

    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          // Request foreground location permissions
          const foregroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          // Request background location permissions
          const backgroundGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
              title: 'Background Location Access Required',
              message: 'This App needs to Access your background location',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (
            foregroundGranted === PermissionsAndroid.RESULTS.GRANTED &&
            backgroundGranted === PermissionsAndroid.RESULTS.GRANTED
          ) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            console.warn('Location permission(s) Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestLocationPermission();
    // toggleBackgroundService(); // TODO: add conditions to toggle
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => setCurrentLocation(position.coords),
      error => {
        console.warn(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => setCurrentLocation(position.coords),
      error => {
        console.warn(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  };

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

  async function notify(task: Task, distance: number) {
    console.log(`Notifying user about task '${task.name}'`);
    setTimeout(async () => {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      await notifee.displayNotification({
        title: `${task.name} - ${task.location} (${distance}m)`,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    }, 1000);
  }

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

  const add_task = async () => {
    const response = await fetch(`${backEndUrl}/api/add_task`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: props.uuid,
        task: {
          name,
          location: locationName,
          latitude: locationCoords.lat,
          longitude: locationCoords.lng,
        },
      }),
    });
    const new_task = await response.json();
    setData([...data, new_task]);
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
    map: {
      height: 200,
      width: 200,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
  });

  const map_update = async (keyword: String) => {
    const query = (await searchLocation(keyword))[0];
    try {
      setLocationCoords(query.geometry.location);
      setLocationName(query.name);
    } catch (err) {
      console.warn(`Query for '${keyword}' rejected.`);
    }
  };

  const location_change = (v: String) => {
    setLocation(v);
    map_update(v);
  };

  const searchLocation = async (keyword: String): Promise<Array<any>> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${keyword}&location=${currentLocation.latitude}%2C${currentLocation.longitude}&radius=1000&key=AIzaSyCe4_m0Axs6LanGk8u8ZQzX19yiM9ITyDM`,
      );
      const json = await response.json();
      return json.results;
    } catch (error) {
      console.warn(error);
      return Promise.resolve([]);
    }
  };

  const toggleBackgroundService = async () => {
    if (BackgroundService.isRunning()) {
      console.log('Stopping background service.');
      await BackgroundService.stop();
      console.log('Stopped background service');
    } else {
      try {
        console.log('Starting background service.');
        await BackgroundService.start(
          backgroundService,
          backgroundServiceOptions,
        );
        console.log('Successfully started background service.');
      } catch (e) {
        console.log('Unable to start background service', e);
      }
    }
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
        <Button onPress={toggleBackgroundService}>
          Toggle Background Service
        </Button>
        <Button onPress={searchForNearbyTasks}>Check nearby</Button>
        <Text className="">UUID: {props.uuid}</Text>
      </View>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true}>
          <View className="p-1 w-56">
            {/* <Text className="text-lg text-slate-900">New Reminder</Text> */}
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
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }}
              showsUserLocation={true}
              showsMyLocationButton={true}
              followsUserLocation={true}
              showsCompass={true}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}>
              <Marker
                coordinate={{
                  latitude: locationCoords.lat,
                  longitude: locationCoords.lng,
                }}
                title={locationName}
              />
            </MapView>
            <Button onPress={add_task}>Add</Button>
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

        const response = await fetch(`${backEndUrl}/api/generate_id`);
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
