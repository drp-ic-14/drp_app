import Geolocation from '@react-native-community/geolocation';
import {Platform, PermissionsAndroid} from 'react-native';
import {Location} from '../utils/Interfaces';

class Geolocater {
  currentLocation: Location;
  setCurrentLocation;
  watchID: any;

  constructor(currentLocation: Location, setCurrentLocation: any) {
    this.currentLocation = currentLocation;
    this.setCurrentLocation = setCurrentLocation;
  }

  clearWatch() {
    Geolocation.clearWatch(this.watchID);
  }

  async searchLocation(keyword: String): Promise<Array<any>> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${keyword}&location=${this.currentLocation.latitude}%2C${this.currentLocation.longitude}&radius=1000&key=AIzaSyCe4_m0Axs6LanGk8u8ZQzX19yiM9ITyDM`,
      );
      const json = await response.json();
      return json.results;
    } catch (error) {
      console.warn(error);
      return Promise.resolve([]);
    }
  }

  getOneTimeLocation() {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => this.setCurrentLocation(position.coords),
      error => {
        console.warn(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  }

  subscribeLocationLocation() {
    this.watchID = Geolocation.watchPosition(
      position => this.setCurrentLocation(position.coords),
      error => {
        console.warn(error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  }

  async requestLocationPermission() {
    if (Platform.OS === 'ios') {
      this.getOneTimeLocation();
      this.subscribeLocationLocation();
    } else {
      try {
        // Request foreground location permissions
        const foregroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        // Request background location permissions
        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Access Required',
            message: 'This App needs to Access your background location',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (
          foregroundGranted === PermissionsAndroid.RESULTS.GRANTED &&
          backgroundGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          //To Check, If Permission is granted
          this.getOneTimeLocation();
          this.subscribeLocationLocation();
        } else {
          console.warn('Location permission(s) Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }
}

export default Geolocater;
