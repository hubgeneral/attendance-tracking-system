import { Stack } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
  // Keep the tabs layout minimal. The visual header is now part of the dashboard screen.
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
