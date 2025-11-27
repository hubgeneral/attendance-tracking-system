import { PolygonGeofence } from "../components/GeolibFence";

export const OfficeRegion: PolygonGeofence = {
  identifier: "office-area",
  coordinates: [
    // Expanded polygon to ensure it covers the office area
    // Top-left corner
    { latitude: 5.6207, longitude: -0.1855 },
    // Top-right corner
    { latitude: 5.6207, longitude: -0.185 },
    // Middle-right
    { latitude: 5.62145, longitude: -0.185 },
    // Bottom-right
    { latitude: 5.6215, longitude: -0.1857 },
    // Bottom-left
    { latitude: 5.6213, longitude: -0.1857 },
    // Left side
    { latitude: 5.621, longitude: -0.1855 },
  ],
  notifyOnEnter: true,
  notifyOnExit: true,
};
