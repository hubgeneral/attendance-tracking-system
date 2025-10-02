import { Image, StyleSheet, View } from "react-native";

export default function LogoRow() {
  return (
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
  );
}

const styles = StyleSheet.create({
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
});


