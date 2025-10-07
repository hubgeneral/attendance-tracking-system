import ProfileCard from "@/components/Profile";
import { Stack } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useBreakpoint } from "../../hooks/useBreakpoint";

export default function TabsLayout() {
  const [showProfile, setShowProfile] = useState(false);
  const bp = useBreakpoint();
  // Make the differences more visually distinct for each breakpoint
  const headerPadding =
    bp === "xs" ? 4 : bp === "s" ? 8 : bp === "m" ? 16 : bp === "l" ? 24 : 32;
  const logoWidth =
    bp === "xs"
      ? 60
      : bp === "s"
      ? 80
      : bp === "m"
      ? 110
      : bp === "l"
      ? 130
      : 160;
  const logoHeight =
    bp === "xs" ? 20 : bp === "s" ? 28 : bp === "m" ? 36 : bp === "l" ? 44 : 56;
  const profileSize =
    bp === "xs" ? 20 : bp === "s" ? 28 : bp === "m" ? 36 : bp === "l" ? 44 : 56;
  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.header,
          { paddingHorizontal: headerPadding, paddingVertical: headerPadding },
        ]}
      >
        <Image
          source={require("../../assets/images/hm-clockr.png")}
          style={{ width: logoWidth, height: logoHeight }}
          resizeMode="contain"
        />
        {/* TEMP: Show current breakpoint for debugging */}
        <Text style={{ marginHorizontal: 8, color: "#888", fontSize: 12 }}>
          bp: {bp}
        </Text>
        <TouchableOpacity
          style={[
            styles.profileIcon,
            {
              width: profileSize,
              height: profileSize,
              borderRadius: profileSize / 2,
            },
          ]}
          onPress={() => setShowProfile((prev) => !prev)}
        >
          <Image
            source={require("../../assets/images/profile.png")}
            style={{
              width: profileSize * 0.5,
              height: profileSize * 0.5,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        {/* Show ProfileCard when clicked */}
      {showProfile && (
        <ProfileCard
          onChangePassword={() => alert("Change Password tapped")}
          onLogout={() => setShowProfile(false)}
        />
      )}
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileIcon: {
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
