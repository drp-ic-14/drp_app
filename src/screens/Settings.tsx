import { Text, View } from 'react-native';
import { useUser } from '../hooks/user';
import Slider from '@react-native-community/slider';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRecoilState } from 'recoil';
import { notificationRadiusAtom } from '../store/Atoms';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = () => {
  const [user] = useUser();
  const [proximity, setProximity] = useRecoilState(notificationRadiusAtom);
  const [notifRadiusHelp, setNotifRadiusHelp] = useState(false);

  useEffect(() => {
    const saveData = setTimeout(async () => {
      console.log(`saving prox ${proximity}m to async`);
      await AsyncStorage.setItem('@prox', proximity.toString())
    }, 2000);

    return () => clearTimeout(saveData);
  }, [proximity]);

  return (
    <View className="flex-1 bg-white p-3 space-y-3">
      <Text className="text-4xl text-slate-900 tracking-wider">Settings</Text>
      <View className="bg-indigo-100 p-4 pt-3 rounded-2xl flex-row justify-between shadow-2xl shadow-black/30">
        <Text className="text-lg text-slate-900">Username:</Text>
        <Text className="text-lg text-slate-900">{user.id}</Text>
      </View>
      <View className="flex-1 p-3 space-y-3">
        <View className="flex-row justify-between">
          <Text className="text-lg text-slate-900">Notification Radius:</Text>
          <TouchableOpacity
            className="bg-indigo-100 p-3 pt-0.5 pb-0.5 rounded-lg"
            onPress={() => setNotifRadiusHelp(!notifRadiusHelp)}
          >
            <Text className="text-lg text-slate-900">?</Text>
          </TouchableOpacity>
        </View>
        {notifRadiusHelp && (
          <Text className="text-slate-500">
            How close should you be before you are notified? (Default Value: 100m)
          </Text>
        )}
        <View className="flex-row justify-between">
          <Slider
            style={{ width: '90%', height: 25 }}
            step={10}
            minimumValue={10}
            maximumValue={1000}
            onValueChange={setProximity}
            value={proximity}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
          />
          <Text className="text-slate-900">{proximity}m</Text>
        </View>
      </View>
    </View>
  );
};

export default Settings;
