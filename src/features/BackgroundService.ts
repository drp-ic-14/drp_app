import BackgroundService from 'react-native-background-actions';
import { getRecoil, setRecoil } from 'recoil-nexus';

import { distance, sleep } from '../utils/Utils';
import { Location, Task } from '../utils/Interfaces';
import { notify } from './Notifier';
import { lastNotifiedAtom, locationAtom, userAtom } from '../store/Atoms';
import { getCurrentPosition } from './Geolocation';

const searchForNearbyTasks = async () => {
  const loc = getRecoil(locationAtom);
  const user = getRecoil(userAtom);

  getCurrentPosition().then((loc: Location) => {
    console.log("set loc");
    setRecoil(locationAtom, loc);
  }); 

  let data: Task[] = user.groups.map(({ groupTask }) => groupTask).flat();
  data = data.concat(user.tasks);

  const lastNotified = getRecoil(lastNotifiedAtom);

  data.forEach((task: Task) => {
    const time = Date.now();
    const dist = distance(
      task.latitude,
      task.longitude,
      loc.latitude,
      loc.longitude,
    );
    // console.log(task, dist)
    console.log("-----")
    console.log(task.name)
    console.log(`taskloc - ${task.location}`);
    console.log(`task - ${task.longitude}, ${task.latitude}`);
    console.log(`dist - `, dist);
    if (dist < 100) {
      const taskLastNotified =
        (lastNotified.has(task.id) ? lastNotified.get(task.id) : 0) || 0;
      const timeSinceNotified = time - taskLastNotified;
      // default time is 300000ms aka 5mins
      if (timeSinceNotified > 300000) {
        notify(task, Math.round(dist));
        // TODO: do without reassignment
        lastNotified.set(task.id, time);
      }
    }
  });
  setRecoil(lastNotifiedAtom, lastNotified);
};

const backgroundService = async (): Promise<void> => {
  await new Promise(async () => {
    while (BackgroundService.isRunning()) {
      console.log('[BG] Ping - ', getRecoil(locationAtom));
      searchForNearbyTasks();
      await sleep(10000);
    }
  });
};

const backgroundServiceOptions = {
  taskName: 'DRP_APP',
  taskTitle: 'Searching for nearby tasks...',
  taskDesc: '',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  actions: ['Stop'],
};

export const startBackgroundService = async () => {
  if (!BackgroundService.isRunning()) {
    try {
      console.log('Starting background service.');
      await BackgroundService.start(
        backgroundService,
        backgroundServiceOptions,
      );
      console.log('Successfully started background service.');
    } catch (e) {
      console.log('Unable to start background service', e);
    }
  }
};

export const stopBackgroundService = async () => {
  if (BackgroundService.isRunning()) {
    console.log('Stopping background service.');
    await BackgroundService.stop();
    console.log('Stopped background service');
  }
};
