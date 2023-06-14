import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { styled } from 'nativewind';

import { Group } from '../utils/Interfaces';
import { addUserToGroup } from '../api/BackEnd';
import { useAsyncFn } from 'react-use';

const StyledInput = styled(TextInput);

type GroupSettingsSheetProps = {
  // updateList: () => void;
  bottomSheetModalRef: BottomSheetModal;
  group: Group;
};

const GroupSettingsSheet = ({
  // updateList,
  bottomSheetModalRef,
  group,
}: GroupSettingsSheetProps) => {
  // Form states
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Util states
  // const uuid = useUuid();

  // Bottom sheet
  const handleClosePress = () => {
    bottomSheetModalRef.current?.close();
  };

  const addUser = async () => {
    if (await addUserToGroup(username, group.id)) {
      console.log(`'${username}' added to group '${group.name}'`)
      handleClosePress();
    }
    else {
      console.log(`unable to add '${username}' to group '${group.name}'`)
    }
  };

  const [{ loading: submitLoading }, submit] = useAsyncFn(addUser);

  return !!group ? (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['50%']}
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
            <View className="flex-row mx-4 mb-4 ">
              <Text className="text-2xl text-slate-900">{`Edit Group: ${group.name}`}</Text>
            </View>
            <View className="flex-1">
              <StyledInput
                value={username}
                onChange={v => setUsername(v.nativeEvent.text)}
                placeholder="Username..."
                className="p-3 pl-5 mr-4 text-lg text-slate-900 bg-neutral-200 self-stretch rounded-xl shadow-xl shadow-black/40"
              />
              <TouchableOpacity
                onPress={addUser}
                disabled={submitLoading}
                className={`p-1 justify-center items-center ${
                  submitLoading ? 'bg-gray-300' : 'bg-indigo-200'
                } aspect-square rounded-xl`}
              >
                {submitLoading ? (
                  <ActivityIndicator size="small" color="#0f172ates" />
                ) : (
                  <Text
                    className="text-slate-900 text-xl text-center"
                    style={{ textAlignVertical: 'center' }}
                  >
                    Add group member
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </NativeViewGestureHandler>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  ) : null;
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

export default GroupSettingsSheet;
