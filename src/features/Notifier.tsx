import notifee from '@notifee/react-native';

export async function notify(task: Task, distance: number) {
  console.log(`Notifying user about task '${task.name}'`);
  setTimeout(async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: `${task.name} - ${task.location} (${distance}m)`,
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
  }, 1000);
}

export async function requestPermission() {
  await notifee.requestPermission();
}
