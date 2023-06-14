import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {
  AutocompleteDropdown,
  AutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import * as Icons from 'react-native-heroicons/outline';
import * as IconsMini from 'react-native-heroicons/mini';
import { styled } from 'nativewind';
import MapView, { Marker } from 'react-native-maps';
import { useAsyncFn } from 'react-use';

import DropDownPicker from 'react-native-dropdown-picker';
import { IndexPath, Select, SelectItem } from '@ui-kitten/components';
import { useLocation } from '../hooks/location';
import { useUuid } from '../hooks/login';
import { BACK_END_URL } from '../api/Constants';
import { searchLocation } from '../features/Geolocation';
import { useUser } from '../hooks/user';

const StyledInput = styled(TextInput);

type AddTaskSheetProps = {
  updateList: () => void;
  bottomSheetModalRef: BottomSheetModal;
};

const UserIcon = ({ style }) => <IconsMini.UserIcon fill={style.tintColor} />;

const GroupIcon = ({ style }) => (
  <IconsMini.UserGroupIcon fill={style.tintColor} />
);

const AddTaskSheet = ({
  updateList,
  bottomSheetModalRef,
}: AddTaskSheetProps) => {
  // Form states
  const [name, setName] = useState('');
  const [inputLoc, setInputLoc] = useState(null);

  // Util states
  const uuid = useUuid();
  const [user] = useUser();
  const [currentLoc] = useLocation();

  // Bottom sheet
  const handleClosePress = () => bottomSheetModalRef.current?.close();

  // Dropdown
  const [groupIx, setGroupIx] = useState(new IndexPath(0));

  const groupName = useMemo(() => {
    if (groupIx.row === 0) {
      return 'Personal';
    }
    return user.groups[groupIx.row - 1].name;
  }, [groupIx]);

  const groupId = useMemo(() => {
    if (groupIx.row === 0) {
      return null;
    }
    return user.groups[groupIx.row - 1].id;
  }, [groupIx]);

  // Autocomplete
  const [loading, setLoading] = useState(false);
  const [suggestionsList, setSuggestionsList] = useState(null);
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

  // HTTP Add task
  const addTask = async (
    name: string,
    groupId: string,
    inputLoc: {
      name: any;
      vicinity: any;
      location: { latitude: any; longitude: any };
    },
  ) => {
    const task = {
      name,
      location: inputLoc.name,
      vicinity: inputLoc.vicinity,
      latitude: inputLoc.location.latitude,
      longitude: inputLoc.location.longitude,
    };
    console.log('Got input', task);

    let body;
    if (groupId) {
      body = JSON.stringify({
        group_id: groupId,
        task,
      });
    } else {
      body = JSON.stringify({
        user_id: uuid,
        task,
      });
    }
    console.log('Body:', body);

    const response = await fetch(`${BACK_END_URL}/api/add_task`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    console.log(response);

    const newTask = await response.json();
    console.log('Server: ', newTask);

    // setData([...data, newTask]);
    updateList();

    setName('');
    // setGroupIx(new IndexPath(0));
    setInputLoc(null);
    onClearPress();
    dropdownController.current?.clear();
    handleClosePress();
  };

  const [{ loading: submitLoading }, submit] = useAsyncFn(addTask);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['80%']}
        backdropComponent={backDropProps => (
          <BottomSheetBackdrop
            {...backDropProps}
            opacity={0.5}
            pressBehavior="close"
            disappearsOnIndex={-1}
          />
        )}
        style={styles.sheetContainer}
        enablePanDownToClose
        enableContentPanningGesture={false}
      >
        <NativeViewGestureHandler disallowInterruption>
          <View className="flex-1">
            <View className="flex-row mx-4 mb-4">
              <StyledInput
                value={name}
                onChange={v => setName(v.nativeEvent.text)}
                className="p-2 pl-5 mr-4 text-base flex-grow text-slate-900 bg-[#f7f9fc] border border-[#e4e9f2] self-stretch rounded-xl shadow-xl shadow-black/40"
                placeholder="Task Name..."
                placeholderTextColor="#0f172aaa"
              />
              <TouchableOpacity
                onPress={() => submit(name, groupId, inputLoc)}
                disabled={submitLoading}
                className={`p-1 justify-center items-center shadow-lg shadow-black/40 ${
                  submitLoading ? 'bg-gray-300' : 'bg-indigo-100'
                } aspect-square rounded-xl`}
              >
                {submitLoading ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <Icons.PaperAirplaneIcon stroke="#0f172a" />
                )}
              </TouchableOpacity>
            </View>

            <View className="mx-4 mb-4 rounded-xl overflow-hidden shadow-lg shadow-black/40 border-[#e4e9f2]">
              <Select
                value={groupName}
                selectedIndex={groupIx}
                onSelect={i => setGroupIx(i)}
                size="large"
              >
                <SelectItem title="Personal" accessoryLeft={UserIcon} />
                {user.groups.map(({ name }) => (
                  <SelectItem title={name} accessoryLeft={GroupIcon} />
                ))}
              </Select>
            </View>

            <View className="mx-4">
              <AutocompleteDropdown
                ref={searchRef}
                controller={controller => {
                  dropdownController.current = controller;
                }}
                direction={Platform.select({ ios: 'down' })}
                dataSet={suggestionsList}
                onChangeText={getSuggestions}
                onSelectItem={item => {
                  item && setInputLoc(item);
                }}
                debounce={600}
                suggestionsListMaxHeight={Dimensions.get('window').height * 0.2}
                onClear={onClearPress}
                loading={loading}
                useFilter={false}
                textInputProps={{
                  placeholder: 'Location...',
                  placeholderTextColor: '#0f172aaa',
                  autoCorrect: false,
                  autoCapitalize: 'none',
                  style: {
                    color: '#0F172A',
                    fontSize: 15,
                  },
                }}
                inputContainerStyle={{
                  backgroundColor: '#f7f9fc',
                  borderRadius: 10,
                  paddingLeft: 8,
                  paddingRight: 4,
                  shadowColor: '#999',
                  elevation: 5,
                  borderColor: '#e4e9f2',
                  borderWidth: 1,
                }}
                suggestionsListContainerStyle={{
                  backgroundColor: '#f7f9fc',
                  borderRadius: 10,
                }}
                containerStyle={{ flexGrow: 1, flexShrink: 1 }}
                renderItem={item => (
                  <Text style={{ color: '#0F172A', padding: 15 }}>
                    {item.title}
                  </Text>
                )}
                ClearIconComponent={<Icons.XCircleIcon stroke="#0F172A" />}
                inputHeight={45}
                showChevron={false}
                closeOnBlur={false}
              />
            </View>
            <View className="flex-1 mt-4 rounded-t-xl overflow-hidden">
              <MapView
                region={{
                  latitude: inputLoc
                    ? inputLoc.location.latitude
                    : currentLoc.latitude,
                  longitude: inputLoc
                    ? inputLoc.location.longitude
                    : currentLoc.longitude,
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
                {inputLoc ? (
                  <Marker
                    coordinate={inputLoc.location}
                    title={inputLoc.title}
                  />
                ) : null}
              </MapView>
            </View>
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: 'white',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,

    elevation: 24,
  },
  map: {
    height: 200,
    width: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default AddTaskSheet;
