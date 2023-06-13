import { Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../hooks/location';
import { useData } from '../hooks/data';
import { Task } from '../utils/Interfaces';

const Map = () => {
  const [currentLoc] = useLocation();
  const [data] = useData();

  const task1: Task = data[0];

  return (
    <View style={{ flex: 1 }}>
      <MapView
        region={{
          latitude: currentLoc.latitude,
          longitude: currentLoc.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
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
        {data.map((task: Task) => {
          console.log('render task marker: ', task);
          return (
            <Marker
              key={task.id}
              title={task.name}
              coordinate={{
                latitude: task.latitude,
                longitude: task.longitude,
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

export default Map;
