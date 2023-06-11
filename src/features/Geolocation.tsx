import Geolocation from '@react-native-community/geolocation';
import { Location } from '../utils/Interfaces';

export const getOneTimeLocation = (): Promise<Location> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      // Will give you the current location
      position =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      error => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  });

export const searchLocation = async (keyword: String): Promise<Array<any>> => {
  const loc = await getOneTimeLocation();
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${keyword}&location=${loc.latitude}%2C${loc.longitude}&radius=1000&key=AIzaSyCe4_m0Axs6LanGk8u8ZQzX19yiM9ITyDM`,
    );
    const json = await response.json();
    return json.results;
  } catch (error) {
    console.warn(error);
    return Promise.resolve([]);
  }
};
