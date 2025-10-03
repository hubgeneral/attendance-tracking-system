import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PrimaryButtonProps = {
  title: string;
  onPress?: () => void;
};

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonContent}>
        <MaterialIcons name="login" size={20} color="#fff" />
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#004E2B",
    width: 390,
    height: 56,
    paddingHorizontal: 8.98,
    paddingVertical: 11.02,
    borderRadius: 4.13,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Inter",
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 24,
  },
});


