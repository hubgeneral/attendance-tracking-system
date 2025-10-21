import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Keyboard,
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
  // not using loading in this screen
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmployeeId, setResetEmployeeId] = useState("");
  const [resetContact, setResetContact] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    console.log("Attempting login with:", { employeeId, password });
    try {
      await login({ employeeId: employeeId.trim(), password: password.trim() });

      router.replace("/(tabs)/dashboard");
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert(
        "Login Failed",
        "Invalid employee ID or password. Please try again.",
        [{ text: "OK" }]
      );
    }
    // Use thiis to test the login
    // if (employeeId === "DHG0001" && password === "dhgpass") {
    //   // Navigate to dashboard on successful login
    //   router.replace("/(tabs)/dashboard");
    // } else {
    //   // Show error alert for invalid credentials
    // }
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
            // if reset modal is open animate it up as well (move above keyboard)
            if (showReset) {
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
        if (showReset) {
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
      if (showReset) {
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
  }, [translateY, modalY, showReset]);

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
                      // Placeholder behavior: validate and close
                      if (!resetEmail && !resetEmployeeId && !resetContact) {
                        Alert.alert(
                          "Please provide at least one detail to reset your password."
                        );
                        return;
                      }
                      // TODO: call reset API
                      Alert.alert(
                        "Reset Password",
                        "If an account matches the details provided, you will receive reset instructions.",
                        [{ text: "OK", onPress: () => setShowReset(false) }]
                      );
                    }}
                  >
                    <Text style={styles.modalButtonText}>Reset Password</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowReset(false)}
                    style={styles.modalClose}
                  ></TouchableOpacity>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
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
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#00274D",
    textAlign: "center",
    height: 24,
    margin: 10,
  },
  modalSubtitle: {
    fontFamily: "Inter",
    textAlign: "center",
    color: "#667085",
    marginBottom: 20,
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
    height: 52,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
