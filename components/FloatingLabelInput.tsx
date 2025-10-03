import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type FloatingLabelInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  showPasswordToggle?: boolean;
};

export default function FloatingLabelInput({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = "none",
  showPasswordToggle = false,
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isFloating = isFocused || value.length > 0;
  const isPasswordVisible = showPasswordToggle ? showPassword : !secureTextEntry;

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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {showPasswordToggle && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
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
    width: 390,
    height: 56,
    marginBottom: 20,
  },
  label: {
    position: "absolute",
    left: 12,
    top: 18,
    fontSize: 16,
    color: "#999",
    backgroundColor: "#fff",
    paddingHorizontal: 4,
    zIndex: 1,
    transition: "all 0.2s ease",
  },
  labelFloating: {
    top: 6,
    fontSize: 12,
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
    paddingTop: 24,
    fontSize: 16,
    backgroundColor: "#fff",
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
