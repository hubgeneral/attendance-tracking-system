import { PolygonGeofence } from "../components/GeolibFence";


export const OfficeRegion: PolygonGeofence = {
  identifier: "office-area",
  coordinates: [
   { latitude: 5.620765, longitude: -0.185407},
   { latitude: 5.620765, longitude: -0.185123 },
   { latitude: 5.621334, longitude: -0.185611 },
    { latitude: 5.621445, longitude: -0.185296 },


    // { latitude: 5.620628, longitude: -0.185337 },
    // { latitude: 5.620808, longitude: -0.185369 },
    // { latitude: 5.62169,  longitude: -0.185335 },
    // { latitude: 5.620814, longitude: -0.185368 }
    
  ],
  notifyOnEnter: true,
  notifyOnExit: true,
};




