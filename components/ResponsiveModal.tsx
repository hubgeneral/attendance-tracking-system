import React from "react";
import { StyleSheet, Modal, ModalProps, Pressable } from "react-native";
import { usePlatform } from "../hooks/usePlatform";

interface ResponsiveModalProps extends ModalProps {
  children: React.ReactNode;
  maxWidth?: number;
  useWebContainer?: boolean;
}

export function ResponsiveModal({
  children,
  maxWidth = 490,
  animationType,
  useWebContainer = false,
  onRequestClose,
  ...modalProps
}: ResponsiveModalProps) {
  const { shouldUseWebLayout } = usePlatform();

  // On web, change slide animation to fade for a pop-up effect
  const webAnimationType =
    shouldUseWebLayout && animationType === "slide" ? "fade" : animationType;

  return (
    <Modal
      {...modalProps}
      animationType={webAnimationType}
      onRequestClose={onRequestClose}
    >
      {shouldUseWebLayout ? (
        <Pressable style={styles.webWrapper} onPress={onRequestClose}>
          {useWebContainer ? (
            <Pressable
              style={[styles.webContent, { maxWidth }, styles.webContainer]}
              onPress={(e) => e.stopPropagation()}
            >
              {children}
            </Pressable>
          ) : (
            <Pressable
              style={[styles.webContent, { maxWidth }]}
              onPress={(e) => e.stopPropagation()}
            >
              {children}
            </Pressable>
          )}
        </Pressable>
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
    paddingBottom: 80,
  },
});
