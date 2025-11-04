import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FloatingLabelInput from "../components/FloatingLabelInput";

export default function CreatePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Create Password</Text>

      {/* Current Password */}
      <FloatingLabelInput
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current Password"
        secureTextEntry
        showPasswordToggle
      />

      {/* New Password */}
      <FloatingLabelInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New Password"
        secureTextEntry
        showPasswordToggle
      />

      {/* Confirm Password */}
      <FloatingLabelInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
        showPasswordToggle
      />

    //   {/* Save Button */}
    //   <TouchableOpacity style={styles.saveButton}>
    //     <Text style={styles.saveButtonText}>Save Password</Text>
    //   </TouchableOpacity>
    // </View>

    <View>
                      <Text style={[styles.modalTitle]}>
                        Create Password
                      </Text>
      
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
                        onPress={() => {
                          if (!newPassword || !confirmPassword) {
                            Alert.alert(
                              "Missing details",
                              "Please enter both New Password and Confirm Password."
                            );
                            return;
                          }
      
                          // setShowCreatePassword(false);
                          // if (newPassword === confirmPassword) {
                          //   setShowResetSuccess(true);
                          //   // clear fields
                          //   setNewPassword("");
                          //   setConfirmPassword("");
                          // } else {
                          //   setShowResetFailure(true);
                          // }
                        }}
                      >
                        <Text style={styles.modalButtonText}>Create Password</Text>
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
    paddingVertical: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#00274D",
    textAlign: "center",
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: "#004E2B",
    borderRadius: 8,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
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
