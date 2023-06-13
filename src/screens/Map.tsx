import { Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { useLocation } from '../hooks/location';

const Map = () => {
  const [currentLoc] = useLocation();

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
      ></MapView>
    </View>
  );
};

export default Map;
