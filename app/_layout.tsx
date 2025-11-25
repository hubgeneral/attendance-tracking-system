import AuthProvider from "../contexts/auth-context/AuthContextProvider";
import { client } from "../src/lib/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Platform } from "react-native";
import { injectScrollbarStyles } from "../utils/scrollbarStyles";

export default function RootLayout() {
  // Inject custom scrollbar styles on web
  useEffect(() => {
    if (Platform.OS === "web") {
      injectScrollbarStyles();
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
