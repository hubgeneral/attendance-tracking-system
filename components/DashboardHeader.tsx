import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileCard from "../components/Profile";
import { useBreakpoint } from "../hooks/useBreakpoint";
import { usePlatform } from "../hooks/usePlatform";
import { ResponsiveModal } from "./ResponsiveModal";

export default function DashboardHeader() {
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const bp = useBreakpoint();
  const { shouldUseWebLayout } = usePlatform();
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

  // const currentUser = useAuth;
  // const initials = currentUser.UserName
  //   ?.split(" ")
  //   .map((n: string) => n[0])
  //   .join("")
  //   .toUpperCase();

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
        onPress={() => setIsProfileVisible(true)}
      >
        <Image
          source={require("../assets/images/profile.png")}
          style={{ width: 12, height: 12 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
      {/* Modal for ProfileCard */}
      <ResponsiveModal
        transparent
        animationType="fade"
        visible={isProfileVisible}
        onRequestClose={() => setIsProfileVisible(false)}
        maxWidth={350}
      >
        {shouldUseWebLayout ? (
          <Pressable
            style={styles.fullScreenOverlay}
            onPress={() => setIsProfileVisible(false)}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={styles.webModalContent}
            >
              <ProfileCard
                onChangePassword={() => {
                  setIsProfileVisible(false);
                  console.log("Change Password pressed");
                }}
              />
            </Pressable>
          </Pressable>
        ) : (
          <>
            {/* Outer Pressable closes modal */}
            <Pressable
              style={styles.modalBackground}
              onPress={() => setIsProfileVisible(false)}
            >
              <Pressable
                onPress={(e) => e.stopPropagation()}
                style={styles.modalContentContainer}
              >
                <ProfileCard
                  onChangePassword={() => {
                    setIsProfileVisible(false);
                    console.log("Change Password pressed");
                  }}
                />
              </Pressable>
            </Pressable>
          </>
        )}
      </ResponsiveModal>
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
  fullScreenOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webModalContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  modalContentContainer: {
    width: "100%",
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
