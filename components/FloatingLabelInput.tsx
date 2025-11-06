import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardTypeOptions,
} from "react-native";

type FloatingLabelInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  showPasswordToggle?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

export default function FloatingLabelInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = "none",
  showPasswordToggle = false,
  keyboardType,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  // Initialize visibility: if secureTextEntry is true we start hidden (showPassword=false), otherwise visible
  const [showPassword, setShowPassword] = useState(!secureTextEntry);
  const isFloating = isFocused || value.length > 0;
  const isPasswordVisible = showPasswordToggle
    ? showPassword
    : !secureTextEntry;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          isFloating && styles.labelFloating,
          isFocused && styles.labelFocused,
        ]}
      >
        {placeholder}
      </Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          showPasswordToggle && styles.inputWithIcon,
        ]}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!isPasswordVisible}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {showPasswordToggle && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword((s) => !s)}
        >
          <AntDesign
            name={showPassword ? "eye" : "eye-invisible"}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: 56,
    marginBottom: 15,
  },
  label: {
    position: "absolute",
    left: 9.5,
    top: 20,
    fontSize: 16,
    color: "#999",
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    zIndex: 1,
    pointerEvents: "none",
  },
  labelFloating: {
    top: 8,
    fontSize: 10,
    color: "#666",
  },
  labelFocused: {
    color: "#004E2B",
  },
  input: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4.13,
    paddingHorizontal: 12,
    paddingTop: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  inputFocused: {
    borderColor: "#004E2B",
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 18,
    zIndex: 1,
  },
});
