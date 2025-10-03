import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoRow from "../../components/LogoRow";
import FloatingLabelInput from "../../components/FloatingLabelInput";
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
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  form: {
    width: 390,
    alignItems: "center",
    justifyContent: "center",
  },
});


