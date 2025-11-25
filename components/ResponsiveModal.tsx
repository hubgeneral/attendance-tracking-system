import React from "react";
import { View, StyleSheet, Modal, ModalProps } from "react-native";
import { usePlatform } from "../hooks/usePlatform";

interface ResponsiveModalProps extends ModalProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export function ResponsiveModal({
  children,
  maxWidth = 490,
  animationType,
  ...modalProps
}: ResponsiveModalProps) {
  const { shouldUseWebLayout } = usePlatform();

  // On web, change slide animation to fade for a pop-up effect
  const webAnimationType =
    shouldUseWebLayout && animationType === "slide" ? "fade" : animationType;

  return (
    <Modal {...modalProps} animationType={webAnimationType}>
      {shouldUseWebLayout ? (
        <View style={styles.webWrapper}>
          <View style={[styles.webContent, { maxWidth }, styles.webContainer]}>
            {children}
          </View>
        </View>
      ) : (
        <>{children}</>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  webContent: {
    width: "100%",
    alignSelf: "center",
  },
  webContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 48,
  },
});
