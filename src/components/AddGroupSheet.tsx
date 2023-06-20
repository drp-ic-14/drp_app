import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import * as Icons from 'react-native-heroicons/outline';
import { styled } from 'nativewind';
import { useAsyncFn } from 'react-use';

import { useUuid } from '../hooks/login';
import { BACK_END_URL } from '../api/Constants';

const StyledInput = styled(TextInput);

type AddGroupSheetProps = {
  updateList: () => void;
  bottomSheetModalRef: BottomSheetModal;
};

const AddGroupSheet = ({
  updateList,
  bottomSheetModalRef,
}: AddGroupSheetProps) => {
  // Form states
  const [name, setName] = useState('');

  // Util states
  const uuid = useUuid();

  // Bottom sheet
  const handleClosePress = () => {
    console.log('close');
    bottomSheetModalRef.current?.close();
  };

  // HTTP Add task
  const addGroup = async (name: string) => {
    const response = await fetch(`${BACK_END_URL}/api/create_group`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        group_name: name,
        user_id: uuid,
      }),
    });
    console.log(response);

    const newGroup = await response.json();
    console.log('Server: ', newGroup);

    updateList();

    setName('');
    handleClosePress();
  };

  const [{ loading: submitLoading }, submit] = useAsyncFn(addGroup);

  return (
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
              <StyledInput
                autoCorrect={false}
                value={name}
                onChange={v => setName(v.nativeEvent.text)}
                className="p-3 pl-5 mr-4 text-lg flex-grow text-slate-900 bg-neutral-200 self-stretch rounded-xl shadow-xl shadow-black/40"
                placeholder="Group Name..."
              />
              <TouchableOpacity
                onPress={() => submit(name)}
                disabled={submitLoading}
                className={`p-1 justify-center items-center ${
                  submitLoading ? 'bg-gray-300' : 'bg-indigo-200'
                } aspect-square rounded-xl`}
              >
                {submitLoading ? (
                  <ActivityIndicator size="small" color="#0f172ates" />
                ) : (
                  <Icons.PaperAirplaneIcon stroke="#0f172a" />
                )}
              </TouchableOpacity>
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

export default AddGroupSheet;
