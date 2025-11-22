import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useBreakpoint } from "../hooks/useBreakpoint";

interface WebContainerProps {
  children: React.ReactNode;
}

/**
 * WebContainer component that provides responsive layout
 * Centers content on web with max-width, keeps full-width on mobile
 */
export function WebContainer({ children }: WebContainerProps) {
  const breakpoint = useBreakpoint();
  const isWeb = Platform.OS === "web";
  const isLargeScreen = breakpoint === "xl";

  // Use centered layout on web for large screens
  if (isWeb && isLargeScreen) {
    return (
      <View style={styles.webWrapper}>
        <View style={styles.webContent}>{children}</View>
      </View>
    );
  }

  // Default mobile layout
  return <>{children}</>;
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  webContent: {
    width: "100%",
    maxWidth: "48%", 
    flex: 1,
    backgroundColor: "#f2f5f7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});
