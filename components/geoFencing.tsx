// import * as Location from 'expo-location';
// import * as Notifications from 'expo-notifications';
// import * as TaskManager from 'expo-task-manager';

// // Task name
// const GEOFENCE_TASK = 'geofence-task';

// // Type for geofence region
// export interface GeofenceRegion {
//   identifier: string;
//   latitude: number;
//   longitude: number;
//   radius: number;
//   notifyOnEnter: boolean;
//   notifyOnExit: boolean;
// }

// // Type for geofence task event
// type GeofenceTaskEventData = {
//   eventType: 'Enter' | 'Exit';
//   region: GeofenceRegion;
// };

// // Define the background task
// TaskManager.defineTask(GEOFENCE_TASK, async (taskEvent) => {
//   const { data, error } = taskEvent;

//   if (error) {
//     console.error('Geofence task error:', error);
//     return;
//   }

//   // Type guard to ensure data is the geofence event
//   if (
//     !data ||
//     typeof data !== 'object' ||
//     !('eventType' in data) ||
//     !('region' in data)
//   ) {
//     return;
//   }

//   // Cast to your own type safely
//   const geofenceEvent = data as GeofenceTaskEventData;
//   const { eventType, region } = geofenceEvent;

//   if (eventType === 'Enter') {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Entered zone 🗺️',
//         body: `You have entered ${region.identifier}`,
//       },
//       trigger: null,
//     });
//   } else if (eventType === 'Exit') {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title: 'Left zone 🚶‍♂️',
//         body: `You have exited ${region.identifier}`,
//       },
//       trigger: null,
//     });
//   }
// });



// export const startGeofencing = async (regions: GeofenceRegion[]): Promise<void> => {
//   // Request permissions
//   const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
//   const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
//   const { status: notifStatus } = await Notifications.requestPermissionsAsync();

//   if (
//     foregroundStatus !== 'granted' ||
//     backgroundStatus !== 'granted' ||
//     notifStatus !== 'granted'
//   ) {
//     alert('Permissions not granted!');
//     return;
//   }

//   // Start geofencing
//   await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
//   console.log('✅ Geofencing started for:', regions.map(r => r.identifier).join(', '));
// };



import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const GEOFENCE_TASK = 'geofence-task';

export interface GeofenceRegion {
  identifier: string;
  latitude: number;
  longitude: number;
  radius: number;
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
}

type GeofenceTaskEventData = {
  eventType: 'Enter' | 'Exit';
  region: GeofenceRegion;
};

// ✅ Define background task once, outside any component
TaskManager.defineTask(GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.error('Geofence task error:', error);
    return;
  }

  if (!data || typeof data !== 'object' || !('eventType' in data) || !('region' in data)) {
    return;
  }

  const { eventType, region } = data as GeofenceTaskEventData;

  const message =
    eventType === 'Enter'
      ? `You have entered ${region.identifier}`
      : `You have exited ${region.identifier}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: eventType === 'Enter' ? 'Entered zone 🗺️' : 'Left zone 🚶‍♂️',
      body: message,
    },
    trigger: null,
  });
});

export const startGeofencing = async (regions: GeofenceRegion[]): Promise<void> => {
  try {
    // 1️⃣ Ask foreground first
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== 'granted') {
      alert('Foreground location permission not granted!');
      return;
    }

    // 2️⃣ Ask background *after* foreground is granted
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== 'granted') {
      alert('Background location permission not granted!');
      return;
    }

    // 3️⃣ Ask notification permission
    const { status: notifStatus } = await Notifications.requestPermissionsAsync();
    if (notifStatus !== 'granted') {
      alert('Notification permission not granted!');
      return;
    }

    // 4️⃣ Start geofencing
    await Location.startGeofencingAsync(GEOFENCE_TASK, regions);
    console.log('✅ Geofencing started for:', regions.map(r => r.identifier).join(', '));
  } catch (err) {
    console.error('Error starting geofencing:', err);
  }
};

