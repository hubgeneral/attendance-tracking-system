import { Image, StyleSheet, Text, View } from "react-native";

type HeidelbergLogoProps = {
  size?: "small" | "medium" | "large";
  showText?: boolean;
};

export default function HeidelbergLogo({ size = "medium", showText = true }: HeidelbergLogoProps) {
  const getSizeConfig = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small":
        return { logoSize: 24, fontSize: 12 };
      case "medium":
        return { logoSize: 32, fontSize: 14 };
      case "large":
        return { logoSize: 40, fontSize: 16 };
      default:
        return { logoSize: 32, fontSize: 14 };
    }
  };

  const sizeConfig = getSizeConfig(size);

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { width: sizeConfig.logoSize, height: sizeConfig.logoSize }]}>
        <Image
          source={require("../assets/images/heidelberg.png")}
          style={[styles.logo, { width: sizeConfig.logoSize, height: sizeConfig.logoSize }]}
          resizeMode="contain"
        />
      </View>
      {showText && (
        <Text style={[styles.text, { fontSize: sizeConfig.fontSize }]}>Heidelberg Materials</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoContainer: {
    backgroundColor: "#004E2B",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    // Size will be set dynamically
  },
  text: {
    fontWeight: "600",
    color: "#004E2B",
  },
});


