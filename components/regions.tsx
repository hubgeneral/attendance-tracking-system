// import { GeofenceRegion } from "./geoFencing";
// import React from "react";
// import { StyleSheet, Text, View } from "react-native";  
// import MapView, { Marker } from "react-native-maps";

// const GerFencingRegion: React.FC = () => {
//     const region: GeofenceRegion = {
//         latitude: 37.78825,
//         longitude: -122.4324,
//         radius: 100, // in meters
//     };
//     return (
//         <View style={styles.container}>
//             <MapView        
//                 style={styles.map}
//                 initialRegion={{
//                     latitude: region.latitude,
//                     longitude: region.longitude,
//                     latitudeDelta: 0.01,
//                     longitudeDelta: 0.01,
//                 }}
//             >
//                 <Marker     
//                     coordinate={{
//                         latitude: region.latitude,
//                         longitude: region.longitude,        
//                     }}
//                     title="Geofence Region"
//                     description={`Radius: ${region.radius} meters`}
//                 />
//             </MapView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     map: {
//         flex: 1,
//     },
// });

// export default GerFencingRegion;


import { GeofenceRegion } from './geoFencing';

export const regions: GeofenceRegion[] = [
  {
    identifier: 'Office',
    latitude: 5.620748,
    longitude: -0.185381,
    radius: 100,
    notifyOnEnter: true,
    notifyOnExit: true,
  },
];
export default regions;



