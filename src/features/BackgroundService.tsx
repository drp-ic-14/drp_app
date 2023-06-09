import BackgroundService from 'react-native-background-actions';
import { distance } from '../utils/Utils';
import { Task } from '../utils/Interfaces';
import { notify } from './Notifier';
import Geolocater from './Geolocater';

class BgService {
  data: Array<Task>;

  geolocater: Geolocater;

  constructor(data: Array<Task>, geolocater: Geolocater) {
    this.data = data;
    this.geolocater = geolocater;
  }

  startBackgroundService = async () => {
    if (!BackgroundService.isRunning()) {
      try {
        console.log('Starting background service.');
        await BackgroundService.start(
          this.backgroundService,
          this.backgroundServiceOptions,
        );
        console.log('Successfully started background service.');
      } catch (e) {
        console.log('Unable to start background service', e);
      }
    }
  };

  stopBackgroundService = async () => {
    if (BackgroundService.isRunning()) {
      console.log('Stopping background service.');
      await BackgroundService.stop();
      console.log('Stopped background service');
    }
  };

  searchForNearbyTasks = async () => {
    const loc = await this.geolocater.getOneTimeLocation();
    this.data.forEach((task: Task) => {
      const time = Date.now();
      const dist = distance(
        task.latitude,
        task.longitude,
        loc.latitude,
        loc.longitude,
      );
      if (dist < 100) {
        const timeSinceNotified = time - (task.lastNotified || 0);
        // default time is 300000ms aka 5mins
        if (timeSinceNotified > 300000) {
          notify(task, Math.round(dist));
          /* eslint-disable no-param-reassign */ // TODO: do without reassignment
          task.lastNotified = time;
        }
      }
    });
  };

  backgroundService = async () => {
    const sleep = (time: any) =>
      new Promise<void>(resolve => {
        setTimeout(() => resolve(), time);
      });

    await new Promise(async () => {
      while (true) {
        this.searchForNearbyTasks();
        await sleep(10000);
      }
    });
  };

  backgroundServiceOptions = {
    taskName: 'DRP_APP',
    taskTitle: 'Searching for nearby tasks...',
    taskDesc: '',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
  };
}

export default BgService;
