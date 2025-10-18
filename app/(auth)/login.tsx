import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import LogoRow from "../../components/LogoRow";
import PrimaryButton from "../../components/PrimaryButton";
import { useGetAllUsersQuery } from "@/src/generated/graphql";
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Use thiis to test the login
    if (employeeId === "DHG0001" && password === "dhgpass") {
      // Navigate to dashboard on successful login
      router.replace("/(tabs)/dashboard");
    } else {
      // Show error alert for invalid credentials
      Alert.alert(
        "Login Failed",
        "Invalid employee ID or password. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const { data, loading, error } = useGetAllUsersQuery();
  useEffect(() => {
    if (data) {
      console.log("Fetched users:", data);
    }
    if (error) {
      console.error("Error fetching users:", error.message);
    }
    if (loading) {
      console.log("Loading users...");
    }
  }, [data, error, loading]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <LogoRow />

        <Text style={styles.title}>Sign in</Text>

        <View style={styles.form}>
          <FloatingLabelInput
            value={employeeId}
            onChangeText={setEmployeeId}
            placeholder="Employee Id"
          />

          <FloatingLabelInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <PrimaryButton title="Login" onPress={handleLogin} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inner: {
    width: width - 40,
    maxWidth: 380,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#00274D",
    marginBottom: 20,
  },
  form: {
    width: 390,
    alignItems: "center",
    justifyContent: "center",
  },
});
