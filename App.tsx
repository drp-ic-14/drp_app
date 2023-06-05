import React, {useEffect, useMemo} from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Image,
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
import {debounce} from 'debounce';

import TaskItem from './components/TaskItem';
import Geolocation from '@react-native-community/geolocation';

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
  const [location, setLocation] = React.useState({
    latitude: 10,
    longitude: 10,
  });
  const [locationName, setLocationName] = React.useState('');
  const [data, setData] = React.useState([]);
  const [map, setMap] = React.useState(false);

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
          if (foregroundGranted === PermissionsAndroid.RESULTS.GRANTED && backgroundGranted === PermissionsAndroid.RESULTS.GRANTED) {
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
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => setLocation(position.coords),
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
      position => setLocation(position.coords),
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
    notify(name, locationName);
    setName('');
    setLocationName('');
    setVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      minHeight: 192,
    },
    backdrop: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    boldText: {
      fontSize: 25,
      color: 'red',
      marginVertical: 16,
      textAlign: 'center',
    },
    map: {
      height: 400,
      width: 400,
      justifyContent: "flex-end",
      alignItems: "center",
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
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
          }}>
          Longitude: {location.longitude}
        </Text>
        <Text
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 16,
          }}>
          Latitude: {location.latitude}
        </Text>
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      }}
      showsUserLocation={true}
      showsMyLocationButton={false}
      followsUserLocation={true}
      showsCompass={true}
      scrollEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}>
       </MapView>
        <View style={{marginTop: 20}}>
          <Button onPress={getOneTimeLocation}>Get location</Button>
        </View>

        <StyledList data={data} renderItem={renderItem} className="grow" />

        {/* <Button onPress={update_list}>
          Refresh
        </Button> */}
        <Button onPress={() => setVisible(true)}>+</Button>
        {/* <Text className=''>UUID: {uuid}</Text> */}
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
              value={locationName}
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
