import { useAuth } from "@/hooks/useAuth";
import { useResetPasswordMutation } from "@/src/generated/graphql";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FloatingLabelInput from "../components/FloatingLabelInput";

export default function CreatePasswordScreen({ isPasswordReset }: any) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { currentUser, updateUser } = useAuth();
  const [resetPassword, { loading }] = useResetPasswordMutation();

  type ShowField = "current" | "new" | "confirm";

  const toggleVisibility = (field: ShowField) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCreatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(
        "Missing details",
        "Please enter both new password and confirm password. "
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password mismatch",
        "New password and confirm password must match."
      );
    }

    const token = currentUser?.resetToken;

    if (!token) {
      Alert.alert(
        "No reset token",
        "Reset token not found. Please request a password reset again"
      );
      return;
    }

    try {
      const { data } = await resetPassword({
        variables: { token, newPassword },
      });

      const success = (data as any)?.resetPassword ?? false;
      if (success) {
        Alert.alert(
          "Success",
          "Password has been reset. Please log in with your new password."
        );

        //clear reset flag locally
        if (currentUser) {
          updateUser({ ...currentUser, isPasswordReset: false });
        }

        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert(
          "Failed",
          "Could not reset password. Try again or contact support."
        );
      }
    } catch (err) {
      console.error("Reset password error:", err);
      Alert.alert("Error", "An error occured while resetting password");
    }
  };
  return (
    <View>
      {isPasswordReset ? (
        <Text style={[styles.modalTitle]}>Create Password</Text>
      ) : (
        <Text style={[styles.modalTitle]}>Change Password</Text>
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
        disabled={loading}
      >
        {isPasswordReset ? (
          <Text style={styles.modalButtonText}>Create Password</Text>
        ) : (
          <Text style={styles.modalButtonText}>Change Password</Text>
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
