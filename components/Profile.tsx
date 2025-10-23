import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";


import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CreatePasswordScreen from "../components/ChangePasswordScreen";

interface ProfileCardProps {
  name?: string;
  email?: string;
  initials?: string;
  onChangePassword?: () => void;
  onLogout?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  email,
  initials,
  onChangePassword,
  onLogout,
}) => {
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

   

  const keyboardOffset = useRef(new Animated.Value(0)).current;

 useEffect(() => {
  const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
  const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

  const showSub = Keyboard.addListener(showEvent, (e) => {
    Animated.timing(keyboardOffset, {
      toValue: -e.endCoordinates.height + 40,
      duration: 250,
      useNativeDriver: true,
    }).start();
  });

  const hideSub = Keyboard.addListener(hideEvent, () => {
    Animated.timing(keyboardOffset, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);


  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>

      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.option}
        onPress={() => setIsChangePasswordVisible(true)}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#54708C" />
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.option, styles.logout]} onPress={onLogout}>
        <Ionicons name="log-out-outline" size={20} color="#DA0901" />
        <Text style={[styles.optionText, styles.logoutText]}>Log out</Text>
      </TouchableOpacity>

    
      <Modal
        visible={isChangePasswordVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsChangePasswordVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.bottomModalOverlay}
        >
          <Animated.View
            style={[
              styles.bottomModalContent,
              { transform: [{ translateY: keyboardOffset }] },
            ]}
          >
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setIsChangePasswordVisible(false)}
            >
              <AntDesign name="close" size={18} color="#ccc" />
            </TouchableOpacity>

            <CreatePasswordScreen />
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
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
    width: "100%",
    alignSelf: "stretch",
    marginTop: 80,
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
  avatarText: { color: "#009D93", fontWeight: "600", fontSize: 20 },
  name: { fontSize: 18, fontWeight: "400", color: "#00274D" },
  email: { fontSize: 14, color: "#54708C", marginTop: 4 },
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
  optionText: { marginLeft: 8, fontSize: 16, color: "#00274D" },
  logout: {
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    marginTop: 8,
    paddingTop: 12,
  },
  logoutText: { color: "#00274D" },

  
  bottomModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  
  bottomModalContent: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "90%",
  },

  modalClose: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 8,
  },
});

