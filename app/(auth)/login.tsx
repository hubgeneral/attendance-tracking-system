import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloatingLabelInput from "../../components/FloatingLabelInput";
import LogoRow from "../../components/LogoRow";
import PrimaryButton from "../../components/PrimaryButton";
import { useGetAllUsersQuery } from "@/src/generated/graphql";
const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const translateY = useRef(new Animated.Value(0)).current;
  const innerRef = useRef<any>(null);

  const handleLogin = () => {
    // Use thiis to test the login
    if (employeeId === "DHG0001" && password === "dhgpass") {
      // Navigate to dashboard on successful login
      router.replace("/(tabs)/dashboard");
    } else {
      // Show error alert for invalid credentials
      Alert.alert(
        "Login Failed",
        "Invalid employee ID or password. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const { data, loading, error } = useGetAllUsersQuery();
  useEffect(() => {
    if (data) {
      console.log("Fetched users:", data);
    }
    if (error) {
      console.error("Error fetching users:", error.message);
    }
    if (loading) {
      console.log("Loading users...");
    }
  }, [data, error, loading]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onKeyboardShow = (e: any) => {
      const keyboardHeight = e.endCoordinates?.height ?? 0;
      // measure inner view and compute overlap
      if (innerRef.current && (innerRef.current as any).measureInWindow) {
        (innerRef.current as any).measureInWindow((x: number, y: number, w: number, h: number) => {
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
        });
      } else {
        // fallback: move up by half the keyboard height
        Animated.timing(translateY, {
          toValue: -(keyboardHeight / 2),
          duration: 250,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    };

    const onKeyboardHide = () => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [translateY]);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
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

            <PrimaryButton title="Login" onPress={handleLogin} />
          </View>
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
});
