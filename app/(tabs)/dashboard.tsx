import CreatePasswordScreen from "@/components/ChangePasswordScreen";
import GeolibFence, {
  PolygonEvent,
  onClockInSuccess,
  onClockOutSuccess,
} from "@/components/GeolibFence";
import HistorySection from "@/components/HistorySection";
import MetricCards from "@/components/MetricCards";
import RequestsSection from "@/components/RequestsSection";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetAttendanceByUserIdLazyQuery,
  useGetAttendanceByUsernameLazyQuery,
  useGetUserByIdQuery,
} from "@/src/generated/graphql";
import { AntDesign } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "../../components/DashboardHeader";
import DateRangePicker from "../../components/DateRangePicker";
import { OfficeRegion } from "../../components/GeolibFenceRegion";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const presentDay = new Date().toISOString().slice(0, 10);

  const { currentUser } = useAuth();

  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const [attendanceByUserName, { data, loading, error }] =
    useGetAttendanceByUsernameLazyQuery();
  const { data: userData } = useGetUserByIdQuery({
    variables: { id: Number(currentUser?.id) },
  });

  // UI state for metric cards (consolidated from 4 separate states)
  const [metrics, setMetrics] = useState({
    clockInText: "-",
    clockOutText: "-",
    hoursWorkedText: "-",
    timeOffText: "-",
  });
  const [geofenceStarted, setGeofenceStarted] = useState(false);

  // Start User Attendance History ****************************************************************************************
  const [getAttendance, { data: uid_data }] =
    useGetAttendanceByUserIdLazyQuery();

  const [dateRange] = useState<[Date | null, Date | null]>([null, null]);

  const today = new Date().toISOString().split("T")[0];

  const startDate = dateRange[0]
    ? dateRange[0].toISOString().split("T")[0]
    : today;
  const endDate = dateRange[1]
    ? dateRange[1].toISOString().split("T")[0]
    : today;

  // Helper to fetch attendance with safe guards
  const fetchAttendanceForRange = (start: string, stop: string) => {
    if (!currentUser?.id) return;
    getAttendance({
      variables: {
        startdate: start,
        stopdate: stop,
        userid: Number(currentUser.id),
      },
    });
  };
  // fetch when date range is applied (only when both start & end are set)
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchAttendanceForRange(startDate, endDate);
    }
    // intentionally do not fetch when only one boundary is set; wait for both
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, currentUser?.id]);

  // fetch last 5 days history on mount (excluding today)
  useEffect(() => {
    if (!currentUser?.id) return;

    const end = new Date(); // today
    end.setDate(end.getDate() - 1); // yesterday
    const start = new Date();
    start.setDate(end.getDate() - 4); // 5 days total: end - 4
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    fetchAttendanceForRange(startStr, endStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  // attendanceHistory: safely unwrap the lazy query result.
  // The GraphQL shape is assumed to be uid_data.attendanceByUserId (array).
  // const attendanceHistory = Array.isArray(uid_data?.attendanceByUserId)
  //   ? uid_data!.attendanceByUserId
  //   : [];

  // End  User Attendance History ******************************************************************************************
  const formatTime = (dt: any) => {
    if (!dt) return "-";
    try {
      const d = new Date(dt);
      if (isNaN(d.getTime())) return "-";
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, "0");
      const period = hours >= 12 ? "Pm" : "Am";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${period}`;
    } catch {
      return "-";
    }
  };

  // ✅ OPTIMIZATION: Memoized callback for attendance refresh to prevent duplicate registrations
  const refreshAttendanceMetrics = useCallback(() => {
    attendanceByUserName({
      variables: {
        username: currentUser?.userName ?? "",
        day: presentDay,
      },
    });
  }, [attendanceByUserName, currentUser?.userName, presentDay]);

  useEffect(() => {
    if (geofenceStarted) refreshAttendanceMetrics();
    console.log(
      "[Dashboard] Fetching attendance for user:",
      currentUser?.userName
    );
  }, [refreshAttendanceMetrics, currentUser?.userName, geofenceStarted]);

  // ✅ Register clock-in success callback to refresh attendance metrics
  useEffect(() => {
    onClockInSuccess(() => {
      console.log(
        "[Dashboard] Clock-in successful - Refreshing attendance query"
      );
      refreshAttendanceMetrics();
    });
  }, [refreshAttendanceMetrics]);

  // ✅ Register clock-out success callback to refresh attendance metrics (shared logic)
  useEffect(() => {
    onClockOutSuccess(() => {
      console.log(
        "[Dashboard] Clock-out successful - Refreshing attendance query"
      );
      refreshAttendanceMetrics();
    });
  }, [refreshAttendanceMetrics]);
  // fetch when date range is applied (only when both start & end are set)
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchAttendanceForRange(startDate, endDate);
    }
    // intentionally do not fetch when only one boundary is set; wait for both
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, currentUser?.id]);

  // fetch last 5 days history on mount (excluding today)
  useEffect(() => {
    if (!currentUser?.id) return;

    const end = new Date(); // today
    end.setDate(end.getDate() - 1); // yesterday
    const start = new Date();
    start.setDate(end.getDate() - 4); // 5 days total: end - 4
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    fetchAttendanceForRange(startStr, endStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  // attendanceHistory: safely unwrap the lazy query result.
  // The GraphQL shape is assumed to be uid_data.attendanceByUserId (array).
  const attendanceHistory = Array.isArray(uid_data?.attendanceByUserId)
    ? uid_data!.attendanceByUserId
    : [];

  // End  User Attendance History ******************************************************************************************
  // ✅ OPTIMIZATION: Memoized formatHours to prevent recreation
  const formatHours = useCallback(
    (val: number, mode: "floor" | "ceil" = "floor") => {
      if (!isFinite(val) || isNaN(val)) return "-";
      if (mode === "floor") return `${Math.floor(val)}`;
      return `${Math.ceil(val)}`;
    },
    []
  );

  // ✅ OPTIMIZATION: Memoized metric calculation to prevent unnecessary updates
  useMemo(() => {
    if (loading) {
      setMetrics({
        clockInText: "...",
        clockOutText: "...",
        hoursWorkedText: "...",
        timeOffText: "-",
      });
      return;
    }

    if (error || !data || !data?.attendanceByUserName) {
      setMetrics({
        clockInText: "-",
        clockOutText: "-",
        hoursWorkedText: "-",
        timeOffText: "-",
      });
      return;
    }

    // pick the first attendance entry (assumed to be the most relevant)
    const latestAttendance =
      data.attendanceByUserName && data.attendanceByUserName.length
        ? data.attendanceByUserName[0]
        : null;

    const clockInText = formatTime(latestAttendance?.clockIn);
    const clockOutText = formatTime(latestAttendance?.clockOut);

    // parse totalHoursWorked (may be string or number)
    let hoursNum: number | null = null;
    if (latestAttendance?.totalHoursWorked != null) {
      const parsed = Number(latestAttendance.totalHoursWorked as any);
      if (!isNaN(parsed)) hoursNum = parsed;
    }

    let hoursWorkedText = "-";
    let timeOffText = "-";

    if (hoursNum != null) {
      // Show whole numbers: floor for hours worked (don't overstate),
      // and ceil for time off (to show remaining hours conservatively)
      hoursWorkedText = `${formatHours(hoursNum, "floor")}hrs`;
      const timeOff = Math.max(0, 8 - hoursNum);
      timeOffText = `${formatHours(timeOff, "ceil")}hrs`;
    }

    setMetrics({ clockInText, clockOutText, hoursWorkedText, timeOffText });
  }, [data, loading, error, formatHours]);

  const geofenceStartedRef = useRef(false);
  // this ensures geofencing is only started once
  useEffect(() => {
    if (!geofenceStartedRef.current) {
      geofenceStartedRef.current = true;
      setGeofenceStarted(true);
    }
  }, []);

  // ⏰ Check work hours and weekdays periodically to manage geofencing
  useEffect(() => {
    const checkWorkHoursAndUpdateGeofencing = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
      const currentHour = now.getHours();
      const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
      const withinWorkHours = currentHour >= 7 && currentHour < 17; // 7 AM - 5 PM

      const shouldHaveGeofencing = isWeekday && withinWorkHours;

      if (shouldHaveGeofencing && !geofenceStarted) {
        console.log("📍 Within work hours (weekday) - Starting geofencing");
        setGeofenceStarted(true);
      } else if (!shouldHaveGeofencing && geofenceStarted) {
        console.log("⏸️  Outside work hours or weekend - Stopping geofencing");
        setGeofenceStarted(false);
      }
    };

    // Check immediately
    checkWorkHoursAndUpdateGeofencing();

    // Then check every minute
    const interval = setInterval(checkWorkHoursAndUpdateGeofencing, 60000);

    return () => clearInterval(interval);
  }, [geofenceStarted]);

  const handlePolygonEvent = (event: PolygonEvent) => {
    console.log("Polygon event detected:", event);
  };

  // Listen for keyboard events and animate bottom modals
  useEffect(() => {
    const onShow = (e: any) => {
      const height = e.endCoordinates?.height ?? 300;
      Animated.timing(keyboardOffset, {
        toValue: -height + (Platform.OS === "ios" ? 0 : 0),
        duration: e.duration ?? 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    };

    const onHide = (e: any) => {
      Animated.timing(keyboardOffset, {
        toValue: 0,
        duration: e?.duration ?? 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    };

    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardOffset]);

  useEffect(() => {
    if (currentUser?.isPasswordReset === false) {
      setIsChangePasswordVisible(true);
    } else {
      setIsChangePasswordVisible(false);
    }
  }, [currentUser]);

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting and Date Selector */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            Hi, {userData?.userById?.employeeName?.split(" ").at(0) || "User"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <DateRangePicker onApply={() => {}} />
          </View>
        </View>

        {/* Metric Cards */}
        <MetricCards data={metrics} />

        {/* History Section */}
        <HistorySection data={attendanceHistory} />

        {/* Requests Section */}
        <RequestsSection />

        {/*Modal for creating a new password*/}
        <Modal
          visible={isChangePasswordVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsChangePasswordVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomModalOverlay2}
          >
            <Animated.View
              style={[
                styles.bottomModalContent2,
                { transform: [{ translateY: keyboardOffset }] },
              ]}
            >
              <TouchableOpacity
                style={styles.modalClose2}
                onPress={() =>
                  setIsChangePasswordVisible(!currentUser?.isPasswordReset)
                }
              >
                {currentUser?.isPasswordReset ? (
                  <AntDesign name="close" size={18} color="#ccc" />
                ) : (
                  <></>
                )}
              </TouchableOpacity>

              <CreatePasswordScreen
                isPasswordReset={currentUser?.isPasswordReset}
              />
            </Animated.View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
      {/* //  this will only render after geofencing has started to avoid multiple initializations */}
      {geofenceStarted && (
        <GeolibFence polygon={OfficeRegion} onEvent={handlePolygonEvent} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logo: {
    width: 120,
    height: 40,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 20,
    height: 20,
  },
  greetingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
    marginTop: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29333D",
  },
  dateSelector: {
    width: 151,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
    gap: 6,
  },
  dateSelectorText: {
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "Inter",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 15,
  },
  metricCard: {
    width: (width - 52) / 2,
    backgroundColor: "#fff",
    padding: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 8,
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 4,
  },
  blueAccent: {
    left: 0,
    backgroundColor: "#4E63C0",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  orangeAccent: {
    right: 0,
    backgroundColor: "#C8973C",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  greenAccent: {
    left: 0,
    backgroundColor: "#7DA645",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  redAccent: {
    right: 0,
    backgroundColor: "#BE5B5B",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  metricTitle: {
    fontSize: 16,
    color: "#758DA3",
    lineHeight: 25,
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: "Inter",
  },
  metricValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  metricTime: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  metricPeriod: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  section: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#758DA3",
    margin: 8,
  },
  filterButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#D1D9E0",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#000000ff",
  },
  makeRequestButton: {
    backgroundColor: "#004E2B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  makeRequestButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    backgroundColor: "#FCFCFC",
    borderRadius: 4,
    padding: 13,
    borderColor: "#D1D9E0",
    borderWidth: 1,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  historyDetails: {
    marginTop: 12,
    gap: 8,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLabel: {
    fontSize: 14,
    color: "#666",
  },
  historyValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  requestItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  requestDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  requestDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  requestDescriptionWrapper: {
    position: "relative",
    paddingBottom: 28,
  },
  readMoreButton: {
    position: "absolute",
    right: 8,
    bottom: 6,
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  viewAllButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: "#004E2B",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#00274D",
    textAlign: "center",
    margin: 25,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
    backgroundColor: "#FAFAFA",
    marginBottom: 20,
    padding: 4,
    width: "100%",
  },
  modalInput: {
    minHeight: 200,
    padding: 12,
    fontSize: 15,
    backgroundColor: "transparent",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#004E2B",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  bottomModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bottomModalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    minHeight: "40%",
    alignItems: "center",
    justifyContent: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  successContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: "relative",
  },
  successImage: {
    width: 182,
    height: 185,
    marginBottom: 18,
  },
  successText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 50,
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
    marginTop: 8,
    fontWeight: "500",
    marginBottom: 18,
    width: 313,
    height: 24,
  },
  allRequestsModalContent: {
    width: "95%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 32,
    alignSelf: "center",
    position: "relative",
  },
  allRequestsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00274D",
    textAlign: "center",
    marginBottom: 16,
    marginTop: 25,
  },
  allRequestItem: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 12,
  },
  allRequestItemWithButton: {
    position: "relative",
    paddingBottom: 36,
  },
  allRequestTextWrapper: {
    position: "relative",
    paddingBottom: 28,
  },
  allRequestHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  allRequestDate: {
    fontSize: 15,
    color: "#222",
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 4,
    alignSelf: "flex-start",
  },
  statusBadge_approved: {
    backgroundColor: "#F2FBF6",
    borderWidth: 1,
    borderColor: "#D9F2E5",
  },
  statusBadge_pending: {
    backgroundColor: "#FFF6ED",
    borderWidth: 1,
    borderColor: "#FFE9D6",
  },
  statusBadge_rejected: {
    backgroundColor: "#FFEDED",
    borderWidth: 1,
    borderColor: "#FFD0D1",
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadgeText_approved: {
    color: "#00AB50",
  },
  statusBadgeText_pending: {
    color: "#FF8D28",
  },
  statusBadgeText_rejected: {
    color: "#FF383C",
  },
  allRequestText: {
    fontSize: 15,
    color: "#222",
    marginTop: 4,
  },
  readMoreText: {
    color: "#758DA3",
    fontSize: 14,
    fontWeight: "500",
  },
  readMoreRow: {
    alignItems: "flex-end",
    marginTop: 6,
  },
  emptyRequestsCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  emptyImage: {
    width: 93,
    height: 84,
    marginBottom: 12,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    width: 144,
    marginTop: 12,
    marginLeft: 25,
  },

  bottomModalOverlay2: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  bottomModalContent2: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "90%",
  },

  modalClose2: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 8,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
