import { useAuth } from "@/hooks/useAuth";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import LogoRow from "../../components/LogoRow";
import PrimaryButton from "../../components/PrimaryButton";
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const translateY = useRef(new Animated.Value(0)).current;
  const innerRef = useRef<any>(null);
  const modalY = useRef(new Animated.Value(0)).current;
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmployeeId, setResetEmployeeId] = useState("");
  const [resetContact, setResetContact] = useState("");
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [showResetFailure, setShowResetFailure] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login } = useAuth();

  // const handleLogin = async () => {
  //   try {
  //     await login({ employeeId: employeeId.trim(), password: password.trim() });

  //     router.replace("/(tabs)/dashboard");
  //     console.log("Login successful");
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     Alert.alert(
  //       "Login Failed",
  //       "Invalid employee ID or password. Please try again.",
  //       [{ text: "OK" }]
  //     );
  //   }
  //   // Use thiis to test the login
  //   if (employeeId === "DHG0001" && password === "dhgpass") {
  //     // Navigate to dashboard on successful login
  //     router.replace("/(tabs)/dashboard");
  //   } else {
  //     // Show error alert for invalid credentials
  //   }
  // };

  const handleLogin = async () => {
  try {
    await login({ employeeId: employeeId.trim(), password: password.trim() });

   
    // await AsyncStorage.setItem("USER_ID", employeeId.trim());
    // console.log("UserId stored for geofence:", employeeId.trim());

    router.replace("/(tabs)/dashboard");
  } catch (error) {
    console.error("Login failed:", error);
    Alert.alert("Login Failed", "Invalid credentials");
  }
};

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onKeyboardShow = (e: any) => {
      const keyboardHeight = e.endCoordinates?.height ?? 0;
      // measure inner view and compute overlap
      if (innerRef.current && (innerRef.current as any).measureInWindow) {
        (innerRef.current as any).measureInWindow(
          (x: number, y: number, w: number, h: number) => {
            const windowHeight = Dimensions.get("window").height;
            const innerBottom = y + h;
            const overlap = innerBottom - (windowHeight - keyboardHeight);
            const moveUp = overlap > 0 ? overlap + 20 : 0;
            Animated.timing(translateY, {
              toValue: -moveUp,
              duration: 250,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }).start();
            // if reset or create-password modal is open animate it up as well (move above keyboard)
            if (showReset || showCreatePassword) {
              const modalOffset = Math.max(keyboardHeight - 20, 40);
              Animated.timing(modalY, {
                toValue: -modalOffset,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }).start();
            }
          }
        );
      } else {
        // fallback: move up by half the keyboard height
        Animated.timing(translateY, {
          toValue: -(keyboardHeight / 2),
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
        if (showReset || showCreatePassword) {
          const modalOffset = Math.max(keyboardHeight - 20, 40);
          Animated.timing(modalY, {
            toValue: -modalOffset,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        }
      }
    };

    const onKeyboardHide = () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
      if (showReset || showCreatePassword) {
        Animated.timing(modalY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    };

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY, modalY, showReset, showCreatePassword]);

  // Watch showReset to reset modal position when opening/closing
  useEffect(() => {
    if (!showReset) {
      modalY.setValue(0);
    }
  }, [showReset, modalY]);
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <SafeAreaView style={styles.container}>
        <Animated.View
          ref={innerRef}
          style={[styles.inner, { transform: [{ translateY }] }]}
        >
          <LogoRow />

          <Text style={styles.title}>Sign in</Text>

          <View style={styles.form}>
            <FloatingLabelInput
              value={employeeId}
              onChangeText={setEmployeeId}
              placeholder="Employee Id"
            />

            <FloatingLabelInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry={true}
              showPasswordToggle={true}
            />

            <TouchableOpacity
              onPress={() => setShowReset(true)}
              style={styles.resetLinkContainer}
            >
              <Text style={styles.resetLink}>Reset password?</Text>
            </TouchableOpacity>

            <PrimaryButton title="login" onPress={handleLogin} />
          </View>

          <Modal visible={showReset} transparent animationType="fade">
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
              }}
            >
              <View style={styles.modalOverlay}>
                <Animated.View
                  style={[
                    styles.modal,
                    { transform: [{ translateY: modalY }] },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.modalClose}
                    onPress={() => setShowReset(false)}
                  >
                    <AntDesign name="close" size={20} color="#797979" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Forgot Password?</Text>
                  <Text style={styles.modalSubtitle}>
                    Enter your account details to reset your password.
                  </Text>

                  <FloatingLabelInput
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                  />

                  <FloatingLabelInput
                    value={resetEmployeeId}
                    onChangeText={setResetEmployeeId}
                    placeholder="Employee Id"
                    autoCapitalize="characters"
                  />

                  <FloatingLabelInput
                    value={resetContact}
                    onChangeText={setResetContact}
                    placeholder="Contact"
                    keyboardType="phone-pad"
                  />

                  <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => {
                      // Validation: require ALL fields to be provided
                      if (!resetEmail || !resetEmployeeId || !resetContact) {
                        Alert.alert(
                          "Missing details",
                          "Please fill Email, Employee Id and Contact to reset your password."
                        );
                        return;
                      }

                      const isValidEmail = (s: string) =>
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
                      const isValidEmployeeId = (s: string) =>
                        /^[A-Za-z0-9\-]{3,}$/.test(s);
                      const isValidContact = (s: string) =>
                        /^\+?\d{7,15}$/.test(s.replace(/\s+/g, ""));

                      const allValid =
                        isValidEmail(resetEmail) &&
                        isValidEmployeeId(resetEmployeeId) &&
                        isValidContact(resetContact);

                      setShowReset(false);
                      if (allValid) {
                        // Credentials look valid -> open Create Password modal
                        setShowCreatePassword(true);
                      } else {
                        // Show a popup alert for incorrect credentials
                        Alert.alert(
                          "Invalid details",
                          "The credentials entered are incorrect."
                        );
                      }
                    }}
                  >
                    <Text style={styles.modalButtonText}>Reset Password</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowReset(false)}
                    style={styles.modalClose}
                  >
                    <AntDesign name="close" size={20} color="#797979" />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Success modal for password reset */}
          {/* Create New Password modal */}
          <Modal
            visible={showCreatePassword}
            transparent
            animationType="fade"
            onRequestClose={() => setShowCreatePassword(false)}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.modalOverlay}
            >
              <Animated.View
                style={[
                  styles.modal,
                  styles.createModal,
                  { transform: [{ translateY: modalY }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setShowCreatePassword(false)}
                >
                  <AntDesign name="close" size={20} color="#797979" />
                </TouchableOpacity>
                <Text style={[styles.modalTitle]}>Create New Password</Text>

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

                    setShowCreatePassword(false);
                    if (newPassword === confirmPassword) {
                      setShowResetSuccess(true);
                      // clear fields
                      setNewPassword("");
                      setConfirmPassword("");
                    } else {
                      setShowResetFailure(true);
                    }
                  }}
                >
                  <Text style={styles.modalButtonText}>Create Password</Text>
                </TouchableOpacity>
              </Animated.View>
            </KeyboardAvoidingView>
          </Modal>
          <Modal
            visible={showResetSuccess}
            transparent
            animationType="fade"
            onRequestClose={() => setShowResetSuccess(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setShowResetSuccess(false)}
                >
                  <AntDesign name="close" size={20} color="#797979" />
                </TouchableOpacity>
                <Image
                  source={require("../../assets/images/form_success.png")}
                  style={styles.successImage}
                  resizeMode="contain"
                />
                <Text style={styles.successText}>
                  Your password has been reset successfully
                </Text>
              </View>
            </View>
          </Modal>

          {/* Failure modal for password reset */}
          <Modal
            visible={showResetFailure}
            transparent
            animationType="fade"
            onRequestClose={() => setShowResetFailure(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modal, styles.compactModal]}>
                <Image
                  source={require("../../assets/images/form_warning.png")}
                  style={styles.failureImage}
                  resizeMode="contain"
                />
                <Text style={styles.failureText}>
                  Sorry, we could not reset your password
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowResetFailure(false);
                    setShowCreatePassword(true);
                  }}
                >
                  <Text style={styles.modalButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </Animated.View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inner: {
    width: width - 40,
    maxWidth: 380,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#00274D",
    marginBottom: 20,
  },
  form: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  resetLinkContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 18,
  },
  resetLink: {
    color: "#019150",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modal: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 50,
    minHeight: "40%",
    alignItems: "center",
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#00274D",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  successImage: {
    width: 182,
    height: 185,
    marginBottom: 18,
    alignSelf: "center",
  },
  successText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
    width: 335,
    height: 24,
  },
  failureImage: {
    width: 197,
    height: 147,
    marginBottom: 18,
  },
  failureText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 18,
    width: 313,
    height: 24,
  },
  compactModal: {
    paddingTop: 100,
    paddingBottom: 18,
    justifyContent: "flex-start",
  },
  createModal: {
    paddingTop: 50,
    paddingBottom: 24,
    minHeight: "auto",
    justifyContent: "flex-start",
  },
  modalSubtitle: {
    fontFamily: "Inter",
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
    width: 335,
    height: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 10,
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
    textAlign: "center",
  },
  modalClose: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 2,
    width: 33.13,
    height: 33.13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FAFAFA",
    color: "#797979",
  },
});
