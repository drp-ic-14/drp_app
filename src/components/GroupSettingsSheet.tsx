import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { NativeViewGestureHandler } from 'react-native-gesture-handler';
import { styled } from 'nativewind';

import { Group, User } from '../utils/Interfaces';
import { addUserToGroup, removeUserFromGroup } from '../api/BackEnd';
import { useAsyncFn } from 'react-use';
import * as Icons from 'react-native-heroicons/outline';
import { useUser } from '../hooks/user';

const StyledInput = styled(TextInput);

type GroupSettingsSheetProps = {
  // updateList: () => void;
  bottomSheetModalRef: BottomSheetModal;
  groupId: string;
};

const GroupSettingsSheet = ({
  // updateList,
  bottomSheetModalRef,
  groupId,
}: GroupSettingsSheetProps) => {
  // Form states
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [group, setGroup] = useState<Group | null>(null);

  const [user] = useUser();
  // Util states
  // const uuid = useUuid();

  useEffect(() => {
    update();
  }, [groupId, user]);

  // Bottom sheet
  const handleClosePress = () => {
    bottomSheetModalRef.current?.close();
  };

  const update = async () => {
    const g = user.groups.filter(g => g.id === groupId);
    if (g.length) {
      setGroup(g[0]);
    } else {
      console.log(`Unable to find group with id: `, groupId);
      handleClosePress();
    }
  };

  const addUser = async (username: string) => {
    console.log(`add user`, username, ' to ', groupId);
    if (await addUserToGroup(username, groupId)) {
      console.log(`'${username}' added to group '${group.name}'`);
      setUsername('');
      setError('');
    } else {
      console.log(`unable to add '${username}' to group '${group.name}'`);
      setError('Error: cannot add user to group.');
    }
  };

  const removeUser = async (username: string) => {
    console.log('trying to remove user', username);
    if (await removeUserFromGroup(username, groupId)) {
      console.log('removed user', username);
    } else {
      console.log('unable to remove user ', username);
    }
  };

  const [{ loading: submitLoading }, submit] = useAsyncFn(addUser);
  const [{ loading: removeLoading }, remove] = useAsyncFn(removeUser);

  const truncateUser = (username: string) =>
    username.length > 27 ? username.substring(0, 27) + '...' : username;

  if (group) {
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={['70%']}
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
              <View className="flex-1 mx-4 mb-4">
                <Text className="text-xl text-slate-900">Group members:</Text>
                <FlatList
                  data={group.users}
                  renderItem={({ item }) => (
                    <View className="bg-indigo-100 p-4 pt-3 rounded-2xl flex-row justify-between shadow-2xl shadow-black/30">
                      <View className="space-y-2 flex-1">
                        <Text className="text-slate-900 text-lg">
                          {truncateUser(item.id)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => remove(item.id)}
                        className="p-1 justify-center items-center bg-white shadow-xl shadow-black/30 aspect-square rounded-xl"
                      >
                        {removeLoading ? (
                          <ActivityIndicator color="#0f172a" />
                        ) : (
                          <Icons.TrashIcon stroke="#0f172a" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                  keyExtractor={item => item.id}
                  className="mb-3"
                  ItemSeparatorComponent={() => <View className="h-2" />}
                />
              </View>
              <View className="flex-1 mx-4 mb-4">
                <View className="pt-4 flex-row mx-4 mb-4">
                  <StyledInput
                    value={username}
                    onChangeText={setUsername}
                    className="p-3 pl-5 mr-4 text-lg text-slate-900 bg-[#f7f9fc] border border-[#e4e9f2] flex-1 rounded-xl shadow-xl shadow-black/30"
                    placeholder="Add user..."
                    placeholderTextColor="#0f172aaa"
                  />
                  <TouchableOpacity
                    onPress={() => submit(username)}
                    className="p-1 justify-center items-center bg-indigo-100 shadow-xl shadow-black/30 aspect-square rounded-xl"
                  >
                    {submitLoading ? (
                      <ActivityIndicator color="#0f172a" />
                    ) : (
                      <Icons.PlusIcon stroke="#0f172a" />
                    )}
                  </TouchableOpacity>
                </View>
                {error != '' && (
                  <View className="mx-4 mb-4">
                    <Text className="text-base text-center text-rose-900">
                      {error}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </NativeViewGestureHandler>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  } else {
    console.log('group settings sheet: group is null');
    return null;
  }
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
