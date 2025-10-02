import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
const { width } = Dimensions.get("window");

export default function Index() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        {/* Top Logos */}
        <View style={styles.logoRow}>
          <Image 
            source={require("../assets/images/hm-clockr.png")} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.divider} />
          <Image 
            source={require("../assets/images/heidelberg.png")} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>

        {/* Sign in text */}
        <Text style={styles.title}>Sign in</Text>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Employee Id"
            value={employeeId}
            onChangeText={setEmployeeId}
          />
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showHide}>{showPassword ? <AntDesign name="eye" size={24} color="black" /> : <AntDesign name="eye-invisible" size={24} color="black" />}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>⇥ Login</Text>
          </TouchableOpacity>
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
  logoRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 40,
  },
  divider: {
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 15,
    alignSelf: "stretch",      
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
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4.13,
    marginBottom: 20,
    width: 390,
    height: 56,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  showHide: {
    width: 20,
    height: 20,
    opacity: 0.4,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#004E2B", 
    width: 390,
    height: 56,
    paddingHorizontal: 8.98,
    paddingVertical: 11.02,
    gap: 5.51,
    borderRadius: 4.13,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 15.16,
    marginTop: 10,
  },
});
