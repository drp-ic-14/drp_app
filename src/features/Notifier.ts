import notifee, { EventType } from '@notifee/react-native';
import { getRecoil } from 'recoil-nexus';
import { Task } from '../utils/Interfaces';
import { uuidAtom } from '../store/Atoms';
import { deleteTask } from '../api/BackEnd';

notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS) {
    switch (pressAction?.id) {
      case 'mark-as-done': {
        const data = notification?.data;
        console.log(`deleting task '${data.taskId}' from user '${data.uuid}'`);
        await deleteTask(getRecoil(uuidAtom), data.taskId);

        // Remove the notification
        await notifee.cancelNotification(notification.id);
      }
      case 'remind-later': {
        await notifee.cancelNotification(notification.id);
      }
    }
  }
});

async function setCategories() {
  await notifee.setNotificationCategories([
    {
      id: 'reminder',
      actions: [
        {
          id: 'mark-as-done',
          title: 'Mark as done',
        },
        {
          id: 'remind-later',
          title: 'Remind me later',
        },
      ],
    },
  ]);
}

export async function notify(task: Task, distance: number) {
  console.log(`Notifying user about task '${task.name}'`);
  setTimeout(async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: `${task.name} - ${task.location} (${distance}m)`,
      data: {
        taskId: task.id,
      },
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
        actions: [
          {
            title: 'Mark as done',
            pressAction: {
              id: 'mark-as-done',
            },
          },
          {
            title: 'Remind me later',
            pressAction: {
              id: 'remind-later',
            },
          },
        ],
      },
      ios: {
        categoryId: 'reminder',
      },
    });
  }, 1000);
}

export async function notificationPermissions() {
  await notifee.requestPermission();
}
