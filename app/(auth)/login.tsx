import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoRow from "../../components/LogoRow";
import PasswordField from "../../components/PasswordField";
import PrimaryButton from "../../components/PrimaryButton";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: wire up auth
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <LogoRow />

        <Text style={styles.title}>Sign in</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Employee Id"
            value={employeeId}
            onChangeText={setEmployeeId}
          />

          <PasswordField
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
          />

          <PrimaryButton title="⇥ Login" onPress={handleLogin} />
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
    width: 85,
    height: 24,
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    width: 390,
    height: 284,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  input: {
    width: 390,
    height: 56,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4.13,
    padding: 12,
    fontSize: 16,
  },
});


