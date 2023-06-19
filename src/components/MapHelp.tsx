import { Text, View } from 'react-native';

const MapHelp = () => {
  return (
    <View className="flex-0.8 bg-white absolute top-20 p-5 rounded-2xl">
      <View className="flex-row justify-between">
        {/* <Text className="text-slate-900 text-4xl">Help?</Text> */}
        <Text className="text-slate-400">Press <Text className='font-extrabold'>'Help?'</Text> to close this.</Text>
      </View>
      <Text className="text-slate-900 text-lg">
        See all of your and your group(s) tasks on a map.
      </Text>
      <Text className="text-slate-900 text-lg">
        Click on a marker to show the task's name, location and distance from
        you.
      </Text>
      <Text className="text-slate-900 text-lg">
        Click the directions button in the bottom right to find the fastest way to your task using Google Maps.
      </Text>
    </View>
  );
};

export default MapHelp;
