import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";


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

export const POLYGON_TASK_NAME = "EXPO_POLYGON_GEOFENCE_TASK_v1";
const ASYNC_KEY_PREFIX = "polygon-geofence-lastState-"; 

function pointInPolygon(point: PolygonPoint, polygon: PolygonPoint[]): boolean {
  const x = point.longitude;
  const y = point.latitude;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].longitude,
      yi = polygon[i].latitude;
    const xj = polygon[j].longitude,
      yj = polygon[j].latitude;

    const intersect =
      yi > y !== yj > y &&
      x <
        ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi; 
    if (intersect) inside = !inside;
  }

  return inside;
}

TaskManager.defineTask(POLYGON_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("[PolygonGeofence][Task] task error:", error);
    return;
  }
  if (!data) return;

  try {
    const raw = await AsyncStorage.getItem(`${ASYNC_KEY_PREFIX}config`);
    if (!raw) {
      return;
    }
    const config: PolygonGeofence = JSON.parse(raw);

    const locations = (data as any).locations ?? [];
    if (!Array.isArray(locations) || locations.length === 0) return;

    const latest = locations[locations.length - 1];
    const point: PolygonPoint = {
      latitude: latest.coords.latitude,
      longitude: latest.coords.longitude,
    };

    const isInsideNow = pointInPolygon(point, config.coordinates);

    const stateKey = `${ASYNC_KEY_PREFIX}${config.identifier}-lastInside`;
    const lastRaw = await AsyncStorage.getItem(stateKey);
    const lastInside = lastRaw === "true";

    // Detect transitions
    if (!lastRaw) {
      // first run; just store state (no transition)
      await AsyncStorage.setItem(stateKey, isInsideNow ? "true" : "false");
      return;
    }

    // Enter: lastInside === false && isInsideNow === true
    if (!lastInside && isInsideNow && config.notifyOnEnter) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Entered zone: ${config.identifier}`,
            body: `You have entered ${config.identifier}`,
            data: { polygonEvent: "enter", identifier: config.identifier },
          },
          trigger: null,
        });
      } catch (notifError) {
        console.warn(
          "[PolygonGeofence][Task] schedule notification failed:",
          notifError
        );
      }
    }

    // Exit: lastInside === true && isInsideNow === false
    if (lastInside && !isInsideNow && config.notifyOnExit) {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Left zone: ${config.identifier}`,
            body: `You have exited ${config.identifier}`,
            data: { polygonEvent: "exit", identifier: config.identifier },
          },
          trigger: null,
        });
      } catch (notifError) {
        console.warn(
          "[PolygonGeofence][Task] schedule notification failed:",
          notifError
        );
      }
    }

    // Persist current state for next run
    await AsyncStorage.setItem(stateKey, isInsideNow ? "true" : "false");
  } catch (err) {
    console.error("[PolygonGeofence][Task] error processing location:", err);
  }
});



export const startPolygonGeofencing = async (
  polygonConfig: PolygonGeofence
): Promise<{ ok: boolean; message?: string }> => {
  try {
    // 1) Request permissions
    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      return { ok: false, message: "Foreground location permission not granted" };
    }

    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      return { ok: false, message: "Background location permission not granted" };
    }

    // Notifications permission 
    try {
      const { status: notifStatus } = await Notifications.requestPermissionsAsync();
      if (notifStatus !== "granted") {
        console.warn("Notifications permission not granted; continuing without notify");
      }
    } catch (notifErr) {
      console.warn("Notifications permission request failed:", notifErr);
    }

    // 2) Save polygon config to AsyncStorage so the background task can read it
    await AsyncStorage.setItem(
      `${ASYNC_KEY_PREFIX}config`,
      JSON.stringify(polygonConfig)
    );

    try {
      const curr = await Location.getCurrentPositionAsync({});
      const currentPoint: PolygonPoint = {
        latitude: curr.coords.latitude,
        longitude: curr.coords.longitude,
      };
      const isInside = pointInPolygon(currentPoint, polygonConfig.coordinates);
      const stateKey = `${ASYNC_KEY_PREFIX}${polygonConfig.identifier}-lastInside`;
      await AsyncStorage.setItem(stateKey, isInside ? "true" : "false");
    } catch (posErr) {
      console.warn("[PolygonGeofence] failed to get current position:", posErr);
    }

    
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(POLYGON_TASK_NAME);
    if (!hasStarted) {
      await Location.startLocationUpdatesAsync(POLYGON_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: 10, 
        foregroundService: {
          notificationTitle: "Location tracking",
          notificationBody: `Monitoring ${polygonConfig.identifier}`,
        },
        pausesUpdatesAutomatically: false,
      });
    }

    console.log(
      `[PolygonGeofence] started monitoring: ${polygonConfig.identifier}`
    );
    return { ok: true };
  } catch (err) {
    console.error("[PolygonGeofence] start error:", err);
    return { ok: false, message: String(err) };
  }
};

/**
 * Stop monitoring (cleans up AsyncStorage config + stops location updates)
 */
export const stopPolygonGeofencing = async (): Promise<{ ok: boolean; message?: string }> => {
  try {
    // Stop location updates
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(POLYGON_TASK_NAME);
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(POLYGON_TASK_NAME);
    }

    // Remove stored config & last state
    const raw = await AsyncStorage.getItem(`${ASYNC_KEY_PREFIX}config`);
    if (raw) {
      try {
        const cfg: PolygonGeofence = JSON.parse(raw);
        const stateKey = `${ASYNC_KEY_PREFIX}${cfg.identifier}-lastInside`;
        await AsyncStorage.removeItem(stateKey);
      } catch {
    
      }
    }
    await AsyncStorage.removeItem(`${ASYNC_KEY_PREFIX}config`);

    console.log("[PolygonGeofence] stopped monitoring");
    return { ok: true };
  } catch (err) {
    console.error("[PolygonGeofence] stop error:", err);
    return { ok: false, message: String(err) };
  }
};

/**
 *  check if current device location is inside the configured polygon (immediate)
 */
export const isUserInsidePolygon = async (polygon: PolygonGeofence): Promise<boolean> => {
  try {
    const pos = await Location.getCurrentPositionAsync({});
    const p: PolygonPoint = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    return pointInPolygon(p, polygon.coordinates);
  } catch (err) {
    console.error("[PolygonGeofence] isUserInsidePolygon error:", err);
    return false;
  }
};


export default {
  startPolygonGeofencing,
  stopPolygonGeofencing,
  isUserInsidePolygon,
};
