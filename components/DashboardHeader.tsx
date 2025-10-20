import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBreakpoint } from "../hooks/useBreakpoint";

export default function DashboardHeader() {
  const bp = useBreakpoint();
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
    <SafeAreaView
      edges={[]}
      style={[
        styles.header,
        { paddingHorizontal: headerPadding, paddingVertical: headerPadding },
      ]}
    >
      <Image
        source={require("../assets/images/hm-clockr.png")}
        style={{ width: logoWidth, height: logoHeight }}
        resizeMode="contain"
      />
      <TouchableOpacity
        style={[
          styles.profileIcon,
          {
            width: profileSize,
            height: profileSize,
            borderRadius: profileSize / 0.5,
          },
        ]}
      >
        <Image
          source={require("../assets/images/profile.png")}
          style={{ width: 12, height: 12 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </SafeAreaView>
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
