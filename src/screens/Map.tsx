import React, { Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useLocation } from '../hooks/location';
import { useUser } from '../hooks/user';
import { Task } from '../utils/Interfaces';
import { distance } from '../utils/Utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import MapHelp from '../components/MapHelp';
import Modal from 'react-native-modal';

const Map = () => {
  const [currentLoc] = useLocation();
  const [user] = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    let tasks: Task[] = user.tasks;
    user.groups.forEach(g => (tasks = tasks.concat(g.groupTask)));
    setTasks(tasks);
  }, [user]);

  const [showHelp, setShowHelp] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View className="flex-row z-10 absolute bottom-2 left-2">
        <TouchableOpacity
          onPress={() => setShowHelp(!showHelp)}
          className="bg-white p-3 pt-1 pb-1 rounded shadow-2xl shadow-black/50"
        >
          <Text className="text-2xl text-slate-900">Help?</Text>
        </TouchableOpacity>
      </View>
      {/* {showHelp && (<MapHelp/>)} */}
      <Modal
        isVisible={showHelp}
        coverScreen={false}
        onBackdropPress={() => setShowHelp(false)}
      >
        <MapHelp />
      </Modal>
      <MapView
        region={{
          latitude: currentLoc.latitude,
          longitude: currentLoc.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        style={{ flex: 1, zIndex: -2 }}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
        showsCompass
        scrollEnabled
        zoomEnabled
        pitchEnabled
        rotateEnabled
      >
        {tasks.map((task: Task) => (
          <Marker
            key={task.id}
            title={task.name}
            coordinate={{
              latitude: task.latitude,
              longitude: task.longitude,
            }}
            description={`${task.location} ~ ${Math.round(
              distance(
                currentLoc.latitude,
                currentLoc.longitude,
                task.latitude,
                task.longitude,
              ),
            )}m`}
          />
        ))}
      </MapView>
    </View>
  );
};

export default Map;
