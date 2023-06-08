import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {Button, Modal, Card, Input} from '@ui-kitten/components';
import {backEndUrl} from '../api/Constants';
import {View, StyleSheet} from 'react-native';
import {styled} from 'nativewind';

const StyledInput = styled(Input);

const AddTaskWindow = props => {
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [locationCoords, setLocationCoords] = React.useState({
    lat: 10,
    lng: 10,
  });
  const [locationName, setLocationName] = React.useState('');

  const map_update = async (keyword: String) => {
    const query = (await props.geolocater.searchLocation(keyword))[0];
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

  const add_task = async () => {
    const task = {
      name,
      location: locationName,
      latitude: locationCoords.lat,
      longitude: locationCoords.lng,
    };

    console.log(task);
    const response = await fetch(`${backEndUrl}/api/add_task`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: props.uuid,
        task: task,
      }),
    });
    console.log(response);
    const new_task = await response.json();
    console.log(`task: ${new_task}`);
    props.setData([...props.data, new_task]);
    setName('');
    setLocation('');
    props.setVisible(false);
  };

  return (
    <Modal
      visible={props.visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => props.setVisible(false)}>
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
              latitude: props.currentLocation.latitude,
              longitude: props.currentLocation.longitude,
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
