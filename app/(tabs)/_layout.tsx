import { Stack } from "expo-router";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/hm-clockr.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.profileIcon}>
          <Image
            source={require("../../assets/images/profile.png")}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  logo: {
    width: 120,
    height: 40,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 13.33,
    height: 13.33,
  },
});
