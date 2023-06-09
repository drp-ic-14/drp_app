import React, { useEffect, useState, useRef, useCallback } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Button, Modal, Card, Input } from '@ui-kitten/components';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { BACK_END_URL } from '../api/Constants';
import { Location } from '../utils/Interfaces';

const StyledInput = styled(Input);

const AddTaskWindow = ({
  uuid,
  geolocater,
  setData,
  setVisible,
  data,
  visible,
}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState<Location | null>(
    null,
  );
  const [locationName, setLocationName] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(
    null,
  );

  const [groupName, setGroupName] = useState('');


  const [loading, setLoading] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState([])
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    const getCurrentLocation = async () => {
      setCurrentLocation(await geolocater.getOneTimeLocation());
    };

    getCurrentLocation();
  }, []);

  const getSuggestions = useCallback(async (q: string) => {
    console.log("Getting suggestions: ", q);
    setLoading(true);
    const suggestions = await geolocater.searchLocation(q);
    console.log("Got suggestions: ", suggestions);
    setSuggestionsList(suggestions.slice(0, 4));
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback(isOpened => {}, []);

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
    getSuggestions(v);
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
          <TextInput
            className="my-2"
            placeholder="Location"
            value={location}
            onChangeText={locationChange}
            onFocus={() => {setShowList(true)}}
            onBlur={() => {setShowList(false)}}
          />
          
          <FlatList
            data={suggestionsList}
            renderItem={({item}) => <Item {...item} locationChange={locationChange} />}
            keyExtractor={item => item.place_id}
          />
          {/* <StyledInput
            autoCorrect={false}
            data={suggestionsList}
            value={location}
            onChangeText={(text) => { locationChange(text) }}
            flatListProps={{
              keyExtractor: (_, idx) => idx,
              renderItem: ({ item }) => (
                <TouchableOpacity onPress={() => locationChange(`${item.name}, ${item.vicinity}`)}>
                  <Text>{item.name}</Text>
                  <Text>{item.vicinity}</Text>
                </TouchableOpacity>
              ),
            }}
          /> */}
          <StyledInput
            className="my-2"
            placeholder="Group"
            value={groupName}
            onChangeText={setGroupName}
          />
          {currentLocation ? (
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
              {locationCoords ? (
                <Marker
                  coordinate={{
                    latitude: locationCoords.lat,
                    longitude: locationCoords.lng,
                  }}
                  title={locationName}
                />
              ) : null}
            </MapView>
          ) : null}
          <Button onPress={addTask}>Add</Button>
        </View>
      </Card>
    </Modal>
  );
};

const Item = ({ name, vicinity, locationChange }) => (
  <View>
    <TouchableOpacity onPress={() => locationChange(`${name}, ${vicinity}`)}>
      <Text>{ name }</Text>
      <Text>{ vicinity }</Text>
    </TouchableOpacity>
  </View>
);

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
