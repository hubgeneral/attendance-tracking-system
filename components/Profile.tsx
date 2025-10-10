import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
  name?: string;
  email?: string;
  initials?: string;
  onChangePassword?: () => void;
  onLogout?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name = "Trudy Akortia",
  email = "trudy.akortia@heidelbergcement.com",
  initials = "TA",
  onChangePassword,
  onLogout,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.option} onPress={onChangePassword}>
        <Ionicons name="lock-closed-outline" size={20} color="#54708C" />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, styles.logout]} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#DA0901" />
        <Text style={[styles.optionText, styles.logoutText]}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    width: 300,
    alignSelf: "center",
    marginTop: 100,
  },
  avatar: {
    backgroundColor: "#CCEBE9",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#009D93",
    fontWeight: "600",
    fontSize: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: "400",
    color: "#00274D",
  },
  email: {
    fontSize: 14,
    color: "#54708C",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    width: "100%",
    marginVertical: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#00274D",
  },
  logout: {
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    marginTop: 8,
    paddingTop: 12,
  },
  logoutText: {
    color: "#00274D",

  },
});
