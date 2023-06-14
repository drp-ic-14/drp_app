import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { styled } from 'nativewind';

import { useUuid } from '../hooks/login';
import { Group } from '../utils/Interfaces';

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

  // Util states
  const uuid = useUuid();

  // Bottom sheet
  const handleClosePress = () => {
    console.log('close');
    bottomSheetModalRef.current?.close();
  };

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
              <Text className="text-2xl text-slate-900">{`Edit Group: ${
                group ? group.name : ''
              }`}</Text>
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

export default GroupSettingsSheet;
