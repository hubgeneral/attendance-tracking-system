import AuthProvider from "@/contexts/auth-context/AuthContextProvider";
import { client } from "@/src/lib/apolloClient";
import { ApolloProvider } from "@apollo/client/react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
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
