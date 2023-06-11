import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import * as Icons from 'react-native-heroicons/outline';
import { styled } from 'nativewind';
import MapView, { Marker } from 'react-native-maps';
import LocationAutocomplete from './LocationAutocomplete';

const StyledInput = styled(BottomSheetTextInput);

const AddTaskSheet = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState({});

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <TouchableOpacity
        onPress={handlePresentModalPress}
        className="bg-slate-200 rounded-xl shadow-2xl shadow-black/30 p-3 flex-row items-center space-x-2"
      >
        <Icons.PlusIcon stroke="#0f172a" size={20} />
        <Text
          className="text-slate-900 text-xl"
          style={{ textAlignVertical: 'center' }}
        >
          New
        </Text>
      </TouchableOpacity>
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
      >
        <View className="flex-1">
          <StyledInput
            value={name}
            onChange={v => setName(v.nativeEvent.text)}
            className="p-3 pl-5 mx-4 mb-4 text-lg text-slate-900 bg-neutral-200 self-stretch rounded-xl shadow-xl shadow-black/40"
            placeholder="Name..."
          />
          <View className="px-4">
            <LocationAutocomplete setLocation={setLocation} />
          </View>
          <View className="flex-1 mt-4 rounded-t-xl overflow-hidden">
            <MapView
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
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
            />
          </View>

          {/* <MapViewsS
            style={styles.map}
            initialRegion={{
              latitude: 10,
              longitude: 10,
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
            {true ? (
              <Marker
                coordinate={{
                  latitude: 10,
                  longitude: 10,
                }}
                title={"locationName"}
              />
            ) : null}
          </MapView> */}
        </View>
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
