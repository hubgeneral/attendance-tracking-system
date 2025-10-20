import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type PasswordFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function PasswordField({
  value,
  onChangeText,
  placeholder,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.passwordWrapper}>
      <TextInput
        style={styles.passwordInput}
        placeholder={placeholder ?? "Password"}
        value={value}
        secureTextEntry={!showPassword}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.showHide}>
          {showPassword ? (
            <AntDesign name="eye" size={24} color="black" />
          ) : (
            <AntDesign name="eye-invisible" size={24} color="black" />
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4.13,
    marginBottom: 20,
    width: "100%",
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
});
