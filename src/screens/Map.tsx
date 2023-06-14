import React, { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../hooks/location';
import { useUser } from '../hooks/user';
import { Task } from '../utils/Interfaces';
import { distance } from '../utils/Utils';

const Map = () => {
  const [currentLoc] = useLocation();
  const [{ tasks: data }] = useUser();

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
        {data.map((task: Task) => (
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
