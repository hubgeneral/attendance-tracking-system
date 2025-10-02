import { StyleSheet, Text, TouchableOpacity } from "react-native";

type PrimaryButtonProps = {
  title: string;
  onPress?: () => void;
};

export default function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
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
    gap: 5.51,
    borderRadius: 4.13,
    alignItems: "center",
    justifyContent: "center",
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


