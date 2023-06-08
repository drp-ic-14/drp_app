import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Button, Modal, Card, Input } from '@ui-kitten/components';
import { View, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { BACK_END_URL } from '../api/Constants';

const StyledInput = styled(Input);

const AddTaskWindow = ({
  uuid,
  currentLocation,
  geolocater,
  setData,
  setVisible,
  data,
  visible,
}) => {
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [locationCoords, setLocationCoords] = React.useState({
    lat: 10,
    lng: 10,
  });
  const [locationName, setLocationName] = React.useState('');

  const mapUpdate = async (keyword: string) => {
    const query = (await geolocater.searchLocation(keyword))[0];
    try {
      setLocationCoords(query.geometry.location);
      setLocationName(query.name);
    } catch (err) {
      console.warn(`Query for '${keyword}' rejected.`);
    }
  };

  const locationChange = (v: string) => {
    setLocation(v);
    mapUpdate(v);
  };

  const addTask = async () => {
    const task = {
      name,
      location: locationName,
      latitude: locationCoords.lat,
      longitude: locationCoords.lng,
    };

    console.log(task);
    const response = await fetch(`${BACK_END_URL}/api/add_task`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: uuid,
        task,
      }),
    });
    console.log(response);
    const newTask = await response.json();
    console.log(`task: ${newTask}`);
    setData([...data, newTask]);
    setName('');
    setLocation('');
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setVisible(false)}
    >
      <Card disabled>
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
            onChangeText={locationChange}
          />
          <StyledInput
            className="my-2"
            placeholder="Group"
            value={location}
            onChangeText={locationChange}
          />
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
            showsUserLocation
            showsMyLocationButton
            followsUserLocation
            showsCompass
            scrollEnabled
            zoomEnabled
            pitchEnabled
            rotateEnabled
          >
            <Marker
              coordinate={{
                latitude: locationCoords.lat,
                longitude: locationCoords.lng,
              }}
              title={locationName}
            />
          </MapView>
          <Button onPress={addTask}>Add</Button>
        </View>
      </Card>
    </Modal>
  );
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

export default AddTaskWindow;
