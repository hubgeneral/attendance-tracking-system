import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
export default function CreatePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { createPassword, currentUser } = useAuth();

  type ShowField = "current" | "new" | "confirm";

  const toggleVisibility = (field: ShowField) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCreatePassword = async () => {
  try {
    // Debug logs
    console.log("Current user:", currentUser);
    console.log("Username:", currentUser?.userName);
    console.log("Reset token:", currentUser?.resetToken);

    // Password validation
    if (!currentUser?.userName || !currentUser?.resetToken) {
      Alert.alert("Error", "Missing user information");
      return;
    }

    if (!confirmPassword) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    await createPassword({
      password: confirmPassword,
      token: currentUser.resetToken,
      username: currentUser.userName,
    });

    router.replace("/(tabs)/dashboard");
  } catch (error) {
    console.error("Password change failed:", error);
    Alert.alert("Error", "Failed to change password");
  }
};

  return (
    <View>
      {currentUser?.isPasswordReset ? (
        <Text style={[styles.modalTitle]}>Change Password</Text>
      ) : (
        <Text style={[styles.modalTitle]}>Create Password</Text>
      )}

      <FloatingLabelInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current Password"
        secureTextEntry={true}
        showPasswordToggle={true}
      />

      <FloatingLabelInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        secureTextEntry={true}
        showPasswordToggle={true}
      />

      <FloatingLabelInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry={true}
        showPasswordToggle={true}
      />

      <TouchableOpacity
        style={styles.modalButton}
        onPress={
          handleCreatePassword
          // if (!newPassword || !confirmPassword) {
          //   Alert.alert(
          //     "Missing details",
          //     "Please enter both New Password and Confirm Password."
          //   );
          //   return;
          // }

          // setShowCreatePassword(false);
          // if (newPassword === confirmPassword) {
          //   setShowResetSuccess(true);
          //   // clear fields
          //   setNewPassword("");
          //   setConfirmPassword("");
          // } else {
          //   setShowResetFailure(true);
          // }
        }
      >
        {currentUser?.isPasswordReset ? (
        <Text style={[styles.modalButtonText]}>Change Password</Text>
      ) : (
        <Text style={[styles.modalButtonText]}>Create Password</Text>
      )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#0d1b2a",
    marginBottom: 24,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 0,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  icon: {
    padding: 8,
  },

  saveButton: {
    backgroundColor: "#004d40",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#00274D",
    textAlign: "center",
    marginBottom: 40,
  },
  modalButton: {
    backgroundColor: "#004E2B",
    borderRadius: 4,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
