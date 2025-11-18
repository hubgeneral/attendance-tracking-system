
import { client } from "@/src/lib/apolloClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as GeoLib from "geolib";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { GeofenceClockInDocument, GeofenceClockOutDocument } from "../src/generated/graphql";

export interface PolygonPoint {
  latitude: number;
  longitude: number;
}

export interface PolygonGeofence {
  identifier: string;
  coordinates: PolygonPoint[];
  notifyOnEnter: boolean;
  notifyOnExit: boolean;
}

export interface PolygonEvent {
  identifier: string;
  type: "enter" | "exit";
  timestamp: string;
}

export interface GeolibFenceProps {
  polygon: PolygonGeofence;
  onEvent?: (event: PolygonEvent) => void;
}

export const POLYGON_TASK_NAME = "EXPO_POLYGON_GEOFENCE_TASK";
const ASYNC_KEY_PREFIX = "polygon-geofence-state-";

// Local callback handler
let polygonEventCallback: ((event: PolygonEvent) => void) | undefined;

export const onPolygonEvent = (callback: (event: PolygonEvent) => void) => {
  polygonEventCallback = callback;
};

// Clock In Mutation
const sendClockInMutation = async (userId: string, timestamp: string): Promise<boolean> => {
  try {
    console.log(`[ClockIn]  SENDING - User ID string: "${userId}", Time: ${timestamp}`);
    
    // this convert string of the userid to number for the graphql mutation
    const userIdNumber = parseInt(userId, 10);

    // check if the conversion passed
    if (isNaN(userIdNumber)) {
      console.error(`[ClockIn]  Invalid user id: Cannot convert "${userId}" to number`);
      return false;
    }

    console.log(`[ClockIn]  Converted "${userId}" to number: ${userIdNumber}`);

    const result = await client.mutate({
      mutation: GeofenceClockInDocument,
      variables: {
        id: userIdNumber,
        clockinUtc: timestamp,
      },
    });

    console.log(`[ClockIn]  SUCCESS - Clocked in user ID: ${userIdNumber}`);
    console.log(`[ClockIn]  GraphQL Response:`, result.data);
    return true;
  } catch (err: any) {
    console.error("[ClockIn] MUTATION ERROR:", err);
    console.error("[ClockIn] Error details:", err.message);
    return false;
  }
};

// Clock Out Mutation
const sendClockOutMutation = async (userId: string, timestamp: string): Promise<boolean> => {
  try {
    console.log(`[ClockOut]  SENDING - User ID string: "${userId}", Time: ${timestamp}`);
    
   // this convert string of the userid to number for the graphql mutation
    const userIdNumber = parseInt(userId, 10);
    
    if (isNaN(userIdNumber)) {
      console.error(`[ClockOut]  INVALID USER ID: Cannot convert "${userId}" to number`);
      return false;
    }

    console.log(`[ClockOut]  Converted "${userId}" to number: ${userIdNumber}`);

    const result = await client.mutate({
      mutation: GeofenceClockOutDocument,
      variables: { 
        id: userIdNumber,
        clockoutUtc: timestamp 
      },
    });

    console.log(`[ClockOut]  SUCCESS - Clocked out user ID: ${userIdNumber}`);
    console.log(`[ClockOut]  GraphQL Response:`, result.data);
    return true;
  } catch (err: any) {
    console.error("[ClockOut]  MUTATION ERROR:", err);
    console.error("[ClockOut] Error details:", err.message);
    return false;
  }
};



TaskManager.defineTask(POLYGON_TASK_NAME, async ({ data, error }) => {
  console.log(`[Geofence] Background task triggered at ${new Date().toLocaleTimeString()}`);
  
  if (error) {
    console.error("[Geofence] Task error:", error);
    return;
  }

  // Extract locations from the data
  const { locations } = (data as { locations?: Location.LocationObject[] }) || {};
  console.log(`[Geofence]  Received ${locations?.length || 0} locations`);
  
  if (!locations?.length) {
    console.log("[Geofence]  No locations received");
    return;
  }

  // Check if locations exist 
  try {
    const rawConfig = await AsyncStorage.getItem(`${ASYNC_KEY_PREFIX}config`);
    if (!rawConfig) {
      console.log("[Geofence]  No config found");
      return;
    }
    const config: PolygonGeofence = JSON.parse(rawConfig);
    const latest = locations[0];
    const currentPoint: PolygonPoint = {
      latitude: latest.coords.latitude,
      longitude: latest.coords.longitude,
    };

    console.log(`[Geofence]  Location: ${currentPoint.latitude.toFixed(6)}, ${currentPoint.longitude.toFixed(6)}`);
    console.log(`[Geofence]  Accuracy: ${latest.coords.accuracy}m`);

    // check  if you are currently inside the polygon using the geolib library
    const isInsideNow = GeoLib.isPointInPolygon(currentPoint, config.coordinates);
    const stateKey = `${ASYNC_KEY_PREFIX}${config.identifier}-lastInside`;
    const lastRaw = await AsyncStorage.getItem(stateKey);
    const lastInside = lastRaw === "true";

    console.log(`[Geofence]  Inside now: ${isInsideNow}, Was inside: ${lastInside}`);

    //   This is what triggers clock in/out
    let eventType: "enter" | "exit" | null = null;
    
    if (!lastInside && isInsideNow) {
      eventType = "enter";
      console.log(`[Geofence]  ENTER DETECTED! Was outside, now inside`);
    } else if (lastInside && !isInsideNow) {
      eventType = "exit"; 
      console.log(`[Geofence]  EXIT DETECTED! Was inside, now outside`);
    }

    //  PROCESS ENTER/EXIT EVENTS
    if (eventType) {
      const timestamp = new Date().toISOString();
      console.log(`[Geofence]  ${eventType.toUpperCase()} EVENT CONFIRMED at ${timestamp}`);

      // Get user ID and send mutation IMMEDIATELY
      const rawUserId = await AsyncStorage.getItem("USER_ID");
      console.log(`[Geofence] 👤 User ID for mutation: "${rawUserId}"`);
      
      if (rawUserId && rawUserId !== "null" && rawUserId !== "undefined") {
        console.log(`[Geofence] SENDING ${eventType.toUpperCase()} MUTATION...`);
        
        let mutationSuccess = false;
        
        
        if (eventType === "enter") {
          mutationSuccess = await sendClockInMutation(rawUserId, timestamp);
          console.log(`[Geofence]  Clock-in mutation ${mutationSuccess ? 'SUCCESS' : 'FAILED'}`);
        } else {
          mutationSuccess = await sendClockOutMutation(rawUserId, timestamp);
          console.log(`[Geofence] Clock-out mutation ${mutationSuccess ? 'SUCCESS' : 'FAILED'}`);
        }
        
      } else {
        console.error(`[Geofence] Cannot send ${eventType} - Invalid user ID:`, rawUserId);
      }

      // Send notification
  if ((eventType === "enter" && config.notifyOnEnter) || 
      (eventType === "exit" && config.notifyOnExit)) {
    
    try {
      console.log(`[Geofence] Preparing ${eventType} notification...`);
      
      // await Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: `${eventType === 'enter' ? 'Entered' : 'Exited'} ${config.identifier}`,
      //     body: `You ${eventType}ed at ${new Date(timestamp).toLocaleTimeString()}`,
      //     sound: true, 
      //     priority: 'high',
      //   },
      //   trigger: null, 
      // });
          
       const formattedTime = new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      await Notifications.scheduleNotificationAsync({
      content: {
        title: `${eventType === 'enter' ? 'Clocked In' : 'Clocked Out'}`,
        body: `${eventType === 'enter' ? 'Clocked in' : 'Clocked out'} at ${formattedTime}`,
        sound: true, 
        priority: 'high',
      },
      trigger: null, 
    });
      console.log(`[Geofence]  ${eventType} notification scheduled`);
      
  } catch (notifError) {
    console.error(`[Geofence] notification error:`, notifError);
  }
}

      // Call callback
      if (polygonEventCallback) {
        polygonEventCallback({ identifier: config.identifier, type: eventType, timestamp });
        console.log(`[Geofence]  ${eventType} callback executed`);
      }

      console.log(`[Geofence]  ${eventType.toUpperCase()} event completed`);
    } else {
      console.log(`[Geofence] No state change - no action needed`);
    }

    // UPDATE STATE FOR NEXT CHECK
    await AsyncStorage.setItem(stateKey, isInsideNow ? "true" : "false");
    console.log(`[Geofence] State updated to: ${isInsideNow}`);

  } catch (err) {
    console.error("[Geofence] Processing error:", err);
  }
  
  console.log(`[Geofence] Background task completed`);
});

// Manual test function
export const triggerManualGeofenceCheck = async () => {
  console.log("[Geofence]  Manual trigger started");
  
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    console.log(`[Geofence]  Manual location: ${location.coords.latitude}, ${location.coords.longitude}`);
    
    
    const taskData = {
      locations: [location],
    };
    
    //  a fake task execution 
    const taskContext = {
      data: taskData,
      error: null
    };
    
    // Get the task function and execute it
    const taskFn = TaskManager.getTaskOptions(POLYGON_TASK_NAME)?.task;
    if (taskFn) {
      await taskFn(taskContext);
    } else {
      console.error("[Geofence]  Task function not found");
    }
    
  } catch (error) {
    console.error("[Geofence] Manual trigger error:", error);
  }
};



// Start Geofence
// export const startGeofence = async (
//   polygonConfig: PolygonGeofence
// ): Promise<{ ok: boolean; message?: string }> => {
//   try {
//     console.log("[Geofence]  Starting geofence...");

//     //  permissions
//     let { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
//     if (foregroundStatus !== "granted") {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       foregroundStatus = status;
//     }

//     if (foregroundStatus !== "granted") {
//       Alert.alert("Permission Required", "Please enable location access in settings.");
//       return { ok: false, message: "Foreground location permission denied" };
//     }

//     let { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
//     if (backgroundStatus !== "granted") {
//       const { status } = await Location.requestBackgroundPermissionsAsync();
//       backgroundStatus = status;
//     }

//     if (backgroundStatus !== "granted") {
//       Alert.alert("Background Permission Required", "Please enable background location access for geofence monitoring.");
//       return { ok: false, message: "Background location permission denied" };
//     }

//     // Request notification permissions
//     const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
//     console.log(`[Geofence]  Notification permission: ${notificationStatus}`);

//     //  Store configuration
//     await AsyncStorage.setItem(`${ASYNC_KEY_PREFIX}config`, JSON.stringify(polygonConfig));
//     console.log(`[Geofence] Config stored: ${polygonConfig.identifier}`);

//     //  Get current location and initialize state
//     const location = await Location.getCurrentPositionAsync({
//       accuracy: Location.Accuracy.Balanced,
//     });
    
//     const currentPoint = {
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//     };
    
//     const isInside = GeoLib.isPointInPolygon(currentPoint, polygonConfig.coordinates);
//     const stateKey = `${ASYNC_KEY_PREFIX}${polygonConfig.identifier}-lastInside`;
//     const lastRaw = await AsyncStorage.getItem(stateKey);
    
//     console.log(`[Geofence]  Initial location: ${currentPoint.latitude.toFixed(6)}, ${currentPoint.longitude.toFixed(6)}`);
//     console.log(`[Geofence]  Initial inside: ${isInside}`);
//     console.log(`[Geofence]  Previous state: ${lastRaw}`);

//     //   Handle first run or state mismatch
//     if (lastRaw === null) {

//       // initialize state and trigger event if inside
//       await AsyncStorage.setItem(stateKey, isInside ? "true" : "false");
      
//       if (isInside) {
//         console.log(`[Geofence]  First run INSIDE geofence - triggering initial clock-in`);
//         const rawUserId = await AsyncStorage.getItem("USER_ID");
//         if (rawUserId) {
//           const timestamp = new Date().toISOString();
//           const success = await sendClockInMutation(rawUserId, timestamp);
//           console.log(`[Geofence]  Initial clock-in ${success ? 'SUCCESS' : 'FAILED'}`);
//         } else {
//           console.warn(`[Geofence]  No user ID found for initial clock-in`);
//         }
//       }
//       console.log(`[Geofence]  First run - initialized: ${isInside}`);
//     } else {
      
//       await AsyncStorage.setItem(stateKey, isInside ? "true" : "false");
//       console.log(`[Geofence]  State updated: ${isInside}`);
//     }

//     // Start location updates
//     const hasStarted = await Location.hasStartedLocationUpdatesAsync(POLYGON_TASK_NAME);
//     if (hasStarted) {
//       console.log("[Geofence]  Restarting location updates...");
//       await Location.stopLocationUpdatesAsync(POLYGON_TASK_NAME);
     
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     }
//     // Get current time for foreground service notification
//       const currentTime = new Date().toLocaleTimeString([], { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       });
//       const notificationBody = isInside 
//         ? `Clocked in at ${currentTime} - Monitoring ${polygonConfig.identifier}`
//        : `Clocked out at ${currentTime} - Monitoring ${polygonConfig.identifier}`;

//     await Location.startLocationUpdatesAsync(POLYGON_TASK_NAME, {
//       accuracy: Location.Accuracy.Balanced,
//       distanceInterval: 25, 
//       timeInterval: 10000, 
//       foregroundService: {
//         notificationTitle: "Geofence Active",
//         notificationBody:  notificationBody,
//         notificationColor: "#1c1cecff",
//       },
//       pausesUpdatesAutomatically: false,
//       showsBackgroundLocationIndicator: true,
//       deferredUpdatesInterval: 0, 
//       deferredUpdatesDistance: 0, 
//     });

//     console.log("[Geofence] Geofence monitoring started");
    
  
    
//     return { ok: true };

//   } catch (err) {
//     console.error("[Geofence]  Start error:", err);
//     return { ok: false, message: String(err) };
//   }
// };

const setupNotifications = async (): Promise<boolean> => {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    //  Check current status 
    const { status } = await Notifications.getPermissionsAsync();
    console.log(`[Notifications]  Current permission status: ${status}`);
    
   
    if (status !== 'granted') {
      console.log("[Notifications]  Requesting notification permissions...");
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      console.log(`[Notifications]  New permission status: ${newStatus}`);
      return newStatus === 'granted';
    }
    
    //  return true, if already granted
    console.log("[Notifications]  Notification permissions already granted");
    return true;
    
  } catch (error) {
    console.error("[Notifications] Setup error:", error);
    return false;
  }
};


export const startGeofence = async (
  polygonConfig: PolygonGeofence
): Promise<{ ok: boolean; message?: string }> => {
  try {
    console.log("[Geofence]  Starting geofence...");

    // Setup notifications
    await setupNotifications();

    // Permissions
    const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
    console.log(`[Geofence]  Foreground permission status: ${foregroundStatus}`);

    if (foregroundStatus !== "granted") {
      Alert.alert("Permission Required", "Please enable location access in settings.");
      return { ok: false, message: "Foreground location permission denied" };
    }

    let { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
    console.log(`[Geofence]  Background permission status: ${backgroundStatus}`); 

    if (backgroundStatus !== "granted") {
      console.log("[Geofence]  Requesting background permissions...");
      const { status } = await Location.requestBackgroundPermissionsAsync();
      backgroundStatus = status;
      console.log(`[Geofence]  New background status: ${backgroundStatus}`); 
    }

    if (backgroundStatus !== "granted") {
      Alert.alert("Background Permission Required", "Please enable background location access for geofence monitoring.");
      return { ok: false, message: "Background location permission denied" };
    }

    //  Store configuration
    await AsyncStorage.setItem(`${ASYNC_KEY_PREFIX}config`, JSON.stringify(polygonConfig));
    console.log(`[Geofence]  Config stored: ${polygonConfig.identifier}`);

    // Get location and initialize state
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    const currentPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    
    const isInside = GeoLib.isPointInPolygon(currentPoint, polygonConfig.coordinates);
    const stateKey = `${ASYNC_KEY_PREFIX}${polygonConfig.identifier}-lastInside`;
    const lastRaw = await AsyncStorage.getItem(stateKey);
    
    console.log(`[Geofence]  Initial location: ${currentPoint.latitude.toFixed(6)}, ${currentPoint.longitude.toFixed(6)}`);
    console.log(`[Geofence]  Initial inside: ${isInside}`);
    console.log(`[Geofence]  Previous state: ${lastRaw}`);

    if (lastRaw === null) {
      await AsyncStorage.setItem(stateKey, isInside ? "true" : "false");
      
      if (isInside) {
        console.log(`[Geofence]  First run INSIDE - triggering clock-in`);
        const rawUserId = await AsyncStorage.getItem("USER_ID");
        if (rawUserId) {
          const timestamp = new Date().toISOString();
          const success = await sendClockInMutation(rawUserId, timestamp);
          console.log(`[Geofence]  Initial clock-in ${success ? 'SUCCESS' : 'FAILED'}`);
        }
      }
    } else {
      await AsyncStorage.setItem(stateKey, isInside ? "true" : "false");
    }

    // Start location updates WITH error handling
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(POLYGON_TASK_NAME);
      if (hasStarted) {
        console.log("[Geofence] Restarting location updates...");
        await Location.stopLocationUpdatesAsync(POLYGON_TASK_NAME);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      }

      const currentTime = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      const notificationBody = isInside 
        ? `Clocked in at ${currentTime} - Monitoring ${polygonConfig.identifier}`
        : `Clocked out at ${currentTime} - Monitoring ${polygonConfig.identifier}`;

      await Location.startLocationUpdatesAsync(POLYGON_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 25, 
        timeInterval: 10000, 
        foregroundService: {
          notificationTitle: "Geofence Active",
          notificationBody: notificationBody,
          notificationColor: "#1c1cecff",
        },
        pausesUpdatesAutomatically: false,
        showsBackgroundLocationIndicator: true,
      });

      console.log("[Geofence] Geofence monitoring started");
      
    } catch (locationError) {
      console.error("[Geofence] Location updates error:", locationError);
      return { ok: false, message: "Failed to start location updates" };
    }

    return { ok: true };

  } catch (err) {
    console.error("[Geofence]  Start error:", err);
    return { ok: false, message: String(err) };
  }
};




// Stop Geofence
export const stopGeofence = async (): Promise<{ ok: boolean; message?: string }> => {
  try {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(POLYGON_TASK_NAME);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(POLYGON_TASK_NAME);
    }
    
    await AsyncStorage.removeItem(`${ASYNC_KEY_PREFIX}config`);
    console.log("[Geofence]  Geofence stopped");
    return { ok: true };
  } catch (err) {
    console.error("[Geofence]  Stop error:", err);
    return { ok: false, message: String(err) };
  }
};

// Get current geofence status
export const getGeofenceStatus = async (): Promise<{ isInside: boolean; lastKnownLocation?: PolygonPoint }> => {
  try {
    const rawConfig = await AsyncStorage.getItem(`${ASYNC_KEY_PREFIX}config`);
    if (!rawConfig) {
      throw new Error("No geofence config found");
    }

    const config: PolygonGeofence = JSON.parse(rawConfig);
    const location = await Location.getCurrentPositionAsync({});
    const currentPoint: PolygonPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    const isInside = GeoLib.isPointInPolygon(currentPoint, config.coordinates);
    
    return {
      isInside,
      lastKnownLocation: currentPoint
    };
  } catch (error) {
    console.error("[Geofence]  Status check error:", error);
    throw error;
  }
};

// React Component
const GeolibFence: React.FC<GeolibFenceProps> = ({ polygon, onEvent }: GeolibFenceProps) => {
  useEffect(() => {
    console.log("[Geofence] 🏗️ Component mounted");

    if (onEvent) {
      onPolygonEvent(onEvent);
    }

    let mounted = true;

    const initialize = async () => {
      if (!mounted) return;

      try {
        // Wait a bit to ensure app is ready
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (!mounted) return;

        console.log("[Geofence]  Initializing geofence with polygon:", polygon.identifier);
        const result = await startGeofence(polygon);
        if (result.ok) {
          console.log("[Geofence]  Monitoring started successfully");
        } else {
          console.warn("[Geofence]  Failed to start:", result.message);
          Alert.alert("Geofence Error", result.message || "Failed to start geofence monitoring");
        }
      } catch (error) {
        console.error("[Geofence]  Initialization error:", error);
        Alert.alert("Geofence Error", "Failed to initialize geofence monitoring");
      }
    };

    initialize();

    return () => {
      console.log("[Geofence]  Component unmounted");
      mounted = false;
      polygonEventCallback = undefined;
    };
  }, [polygon, onEvent]);

 
};

export default GeolibFence;