import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Platform,
  StatusBar,
  Text,
  TextInput,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  AutocompleteDropdown,
  AutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';
import * as Icons from 'react-native-heroicons/outline';
import MapView, { Marker } from 'react-native-maps';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { ScrollView } from 'react-native-gesture-handler';
import { useAsyncFn } from 'react-use';

import { searchLocation } from '../features/Geolocation';
import { deleteTask, updateTask } from '../api/BackEnd';
import { useUser } from '../hooks/user';

const TaskDetails = ({ route, navigation }) => {
  const {
    id,
    location: locationC,
    vicinity,
    longitude,
    latitude,
  } = route.params;

  const [, updateUser] = useUser();

  const [name, setName] = useState(route.params.name);
  const [location, setLocation] = useState({
    id: '1',
    title: `${locationC}, ${vicinity}`,
    name: locationC,
    vicinity,
    location: {
      latitude,
      longitude,
    },
  });
  const [description, setDescription] = useState(
    route.params.description || '',
  );

  // Autocomplete
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState([
    {
      id: '1',
      title: `${locationC}, ${vicinity}`,
      name: locationC,
      vicinity,
      location: {
        latitude,
        longitude,
      },
    },
  ]);
  const dropdownController = useRef<AutocompleteDropdownRef>(null);
  const searchRef = useRef(null);

  const getSuggestions = useCallback(async (q: string) => {
    if (typeof q !== 'string' || q.length < 3) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);

    const query = q.toLowerCase();
    console.log('Fetching suggestions for ', query);
    const places = await searchLocation(query);

    const suggestions = places.map(
      ({ place_id, name, vicinity, geometry }) => ({
        id: place_id,
        title: `${name}, ${vicinity}`,
        name,
        vicinity,
        location: {
          latitude: geometry.location.lat,
          longitude: geometry.location.lng,
        },
      }),
    );

    console.log('Got suggestions', suggestions);
    setSuggestionsList(suggestions);

    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  useEffect(() => {
    changeNavigationBarColor('#E0E7FF');

    return () => {
      changeNavigationBarColor('#ffffff');
    };
  });

  const [{ loading: loadingSave }, update] = useAsyncFn(updateTask);

  const handleSave = async () => {
    await update(
      id,
      name,
      description,
      location.name,
      location.vicinity,
      location.location.latitude,
      location.location.longitude,
    );
    updateUser();
  };

  const onComplete = async () => {
    await deleteTask(id);
    await updateUser();
    navigation.goBack();
  };

  const [{ loading: loadingComplete }, handleComplete] = useAsyncFn(onComplete);

  return (
    <View className="bg-indigo-100 flex-1">
      <ScrollView className="flex-grow">
        <StatusBar barStyle="dark-content" backgroundColor="#E0E7FF" />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View className="w-10 h-10 rounded-full bg-[#111c2f] justify-center items-center p-4 pl-3.5 mx-5 mt-5">
            <Icons.ChevronLeftIcon stroke="#fff" size="20" />
          </View>
        </TouchableOpacity>

        <TextInput
          autoCorrect={false}
          value={name}
          onChangeText={setName}
          className="text-5xl text-[#111c2f] mt-4 p-0 font-bold mx-5"
          multiline
        />

        <View className="bg-white rounded-xl shadow-xl shadow-black/60 mt-5 p-3 mx-5">
          <Text className="text-sm text-gray-600 font-bold mb-1">
            Description
          </Text>
          <TextInput
            autoCorrect={false}
            value={description}
            onChangeText={setDescription}
            className="text-base text-[#111c2f] p-0"
            multiline
            placeholder="Type here..."
            placeholderTextColor="#58606d"
          />
        </View>

        {/* <Text className="text-base text-[#111c2f] font-bold mt-6">GROUP</Text>
            <Text className="text-base text-[#111c2f]">Family</Text> */}

        <View className="bg-white rounded-xl shadow-xl shadow-black/60 mt-5 mx-5">
          <Text className="text-sm text-gray-600 font-bold p-3 pb-0 -mb-1">
            Location
          </Text>
          <AutocompleteDropdown
            ref={searchRef}
            controller={controller => {
              dropdownController.current = controller;
            }}
            initialValue={location}
            direction={Platform.select({ ios: 'down' })}
            dataSet={suggestionsList}
            onChangeText={getSuggestions}
            onSelectItem={item => {
              item && setLocation(item);
            }}
            debounce={600}
            suggestionsListMaxHeight={Dimensions.get('window').height * 0.2}
            onClear={onClearPress}
            loading={loading}
            useFilter={false}
            textInputProps={{
              placeholderTextColor: '#0f172aaa',
              autoCorrect: false,
              autoCapitalize: 'none',
              style: {
                color: '#0F172A',
                fontSize: 15,
              },
            }}
            inputContainerStyle={{
              backgroundColor: '#ffffffff',
              borderRadius: 10,
              paddingLeft: 0,
              paddingRight: 0,
            }}
            suggestionsListContainerStyle={{
              backgroundColor: '#f7f9fc',
              borderRadius: 10,
            }}
            containerStyle={{ flexGrow: 1, flexShrink: 1 }}
            renderItem={item => (
              <Text
                style={{
                  color: '#0F172A',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                }}
              >
                {item.title}
              </Text>
            )}
            ClearIconComponent={<Icons.XCircleIcon stroke="#0F172A" />}
            inputHeight={40}
            showChevron={false}
            closeOnBlur={false}
          />
        </View>
        <View className="mx-5">
          <View className="w-full aspect-square mt-4 bg-white rounded-xl overflow-hidden shadow-xl shadow-black/60">
            <MapView
              region={{
                latitude: location.location.latitude,
                longitude: location.location.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }}
              style={{ flex: 1 }}
              showsUserLocation
              showsMyLocationButton
              followsUserLocation
              showsCompass
              scrollEnabled
              zoomEnabled
              pitchEnabled
              rotateEnabled
            >
              <Marker coordinate={location.location} title={location.title} />
            </MapView>
          </View>
        </View>
        <View className="mt-20" />
      </ScrollView>

      <View className="absolute bottom-0 right-0 left-0 self-center">
        <View className="flex-row justify-center bg-black/30 self-center rounded-full p-1 space-x-1">
          <TouchableOpacity onPress={handleComplete} disabled={loadingComplete}>
            <View className="bg-[#111c2f] h-full justify-center items-center rounded-full flex-row p-4 space-x-2">
              <Text className="text-white text-sm font-bold">Complete</Text>
              {loadingComplete ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Icons.CheckIcon stroke="#fff" />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} disabled={loadingSave}>
            <View className="bg-[#111c2f] h-full justify-center items-center rounded-full flex-row p-4 space-x-2">
              {loadingSave ? (
                <>
                  <Text className="text-white text-sm font-bold">Saving</Text>
                  <ActivityIndicator color="#fff" />
                </>
              ) : (
                <>
                  <Text className="text-white text-sm font-bold">Save</Text>
                  <Icons.PencilSquareIcon stroke="#fff" />
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TaskDetails;
