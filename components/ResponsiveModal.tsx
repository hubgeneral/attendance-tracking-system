import React from "react";
import { View, StyleSheet, Modal, ModalProps } from "react-native";
import { usePlatform } from "../hooks/usePlatform";

interface ResponsiveModalProps extends ModalProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export function ResponsiveModal({
  children,
  maxWidth = 480,
  ...modalProps
}: ResponsiveModalProps) {
  const { shouldUseWebLayout } = usePlatform();

  return (
    <Modal {...modalProps}>
      {shouldUseWebLayout ? (
        <View style={styles.webWrapper}>
          <View style={[styles.webContent, { maxWidth }]}>{children}</View>
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
  },
  webContent: {
    width: "100%",
    alignSelf: "center",
  },
});
