import CreatePasswordScreen from "@/components/ChangePasswordScreen";
import GeolibFence, { PolygonEvent } from "@/components/GeolibFence";
import HistorySection from "@/components/HistorySection";
import MetricCards from "@/components/MetricCards";
import RequestsSection from "@/components/RequestsSection";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetAttendanceByUserIdLazyQuery,
  useGetAttendanceByUsernameQuery,
import GeolibFence, {
  PolygonEvent,
  onClockInSuccess,
  onClockOutSuccess,
} from "@/components/GeolibFence";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateNewRequestMutation,
  useGetAttendanceByUserIdLazyQuery,
  useGetAttendanceByUsernameLazyQuery,
  useGetRequestsByUserIdQuery,
  useGetUserByIdQuery,
  useMakeARequestMutation,
  useUpdateRequestMutation,
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

  const [selectedDate] = useState(presentDay);
  const [expandedHistory, setExpandedHistory] = useState<number | null>(0);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { currentUser } = useAuth();

  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

  const [requestText, setRequestText] = useState("");
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);

  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const [attendanceByUserName, { data, loading, error }] =
    useGetAttendanceByUsernameLazyQuery();
  const { data: userData } = useGetUserByIdQuery({
    variables: { id: Number(currentUser?.id) },
  });

  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useGetRequestsByUserIdQuery({
    variables: { id: Number(currentUser?.id) },
    skip: !currentUser?.id,
  });

  const [createRequest, { loading: createLoading }] = useMakeARequestMutation({
    onCompleted: () => {
      refetchRequests();
      setRequestText("");
      setModalVisible(false);
      setTimeout(() => setShowSuccess(true), 300);
    },
    onError: (err: any) => {
      console.error("Create request error:", err);
      setModalVisible(false);
      setTimeout(() => setShowFailure(true), 300);
    },
  });

  const [updateRequest, { loading: updateLoading }] = useUpdateRequestMutation({
    onCompleted: () => {
      refetchRequests();
      setRequestText("");
      setEditingRequestId(null);
      setModalVisible(false);
      setTimeout(() => setShowSuccess(true), 300);
    },
    onError: (err: any) => {
      console.error("Update request error:", err);
      setModalVisible(false);
      setTimeout(() => setShowFailure(true), 300);
    },
  });

  const requests = requestsData?.requestLogsByUserId || [];

  // UI state for metric cards (consolidated from 4 separate states)
  const [metrics, setMetrics] = useState({
    clockInText: "-",
    clockOutText: "-",
    hoursWorkedText: "-",
    timeOffText: "-",
  });
  const [geofenceStarted, setGeofenceStarted] = useState(false);

  // Start User Attendance History ****************************************************************************************
  // const [getAttendance, {uid_data,uid_loading,uid_error}] = useGetAttendanceByUserIdLazyQuery();
  const [
    getAttendance,
    { data: uid_data, loading: uid_loading, error: uid_error },
  ] = useGetAttendanceByUserIdLazyQuery();

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

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

  const toggleHistoryExpansion = (index: number) => {
    setExpandedHistory(expandedHistory === index ? null : index);
  };

  const handleSubmitRequest = async () => {
    if (!requestText.trim()) {
      setModalVisible(false);
      setTimeout(() => setShowFailure(true), 300);
      return;
    }

    try {
      if (editingRequestId) {
        await updateRequest({
          variables: {
            requestId: editingRequestId,
            reason: requestText.trim(),
          },
        });
      } else {
        await createRequest({
          variables: {
            userId: Number(currentUser?.id),
            reason: requestText.trim(),
          },
        });
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleNewRequest = () => {
    setEditingRequestId(null);
    setRequestText("");
    setModalVisible(true);
  };

  const handleEditRequest = (request: any) => {
    const status = getStatusForDisplay(request.approvalStatus);
    if (status === "pending") {
      setEditingRequestId(request.id);
      setRequestText(request.reason);
      setModalVisible(true);
    }
  };

  useEffect(() => {
    if (editingRequestId !== null) {
      setShowAllRequests(false);
    }
  }, [editingRequestId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  const getStatusForDisplay = (approvalStatus: string | null | undefined) => {
    // Map your backend status to what StatusLabel expects
    const statusMap: { [key: string]: string } = {
      approved: "approved",
      pending: "pending",
      unconfirmed: "pending",
      rejected: "rejected",
    };
    const key = (approvalStatus ?? "pending").toLowerCase();
    return statusMap[key] || "pending";
  };

  const ReadMoreText = ({
    text,
    numberOfLines = 4,
    style,
  }: {
    text: string;
    numberOfLines?: number;
    style?: any;
  }) => {
    const [expanded, setExpanded] = useState(false);

    const approxCharsPerLine = 40;
    const maxChars = numberOfLines * approxCharsPerLine;

    const needsTrim = text.length > maxChars;

    let displayText = text;
    if (!expanded && needsTrim) {
      // Trim to nearest word boundary before maxChars - leave room for ellipses + link
      const reserve = 12; // space for '... Read more'
      const cutAt = Math.max(0, maxChars - reserve);
      const head = text.slice(0, cutAt);
      // remove trailing partial word
      const trimmed = head.replace(/\s?\S+$/, "").trim();
      displayText = trimmed + "...";
    }

    return (
      <View style={{ overflow: expanded ? "visible" : "hidden" }}>
        <Text style={style}>
          {displayText}
          {!expanded && needsTrim ? (
            <Text style={styles.readMoreText} onPress={() => setExpanded(true)}>
              Read more
            </Text>
          ) : null}
          {expanded ? (
            <Text
              style={styles.readMoreText}
              onPress={() => setExpanded(false)}
            >
              {"\n"}Read less
            </Text>
          ) : null}
        </Text>
      </View>
    );
  };

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
            <DateRangePicker
              onApply={(s, e) => {
                setRangeStart(s);
                setRangeEnd(e);
              }}
            />
          </View>
        </View>

        {/* Metric Cards */}
        <MetricCards />
        <View style={styles.section}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>History</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>This Week</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
              {/* Render attendanceHistory (safely handled) */}
              {attendanceHistory.length === 0 ? (
                <Text style={{ padding: 12, color: "#666" }}>
                  No history available
                </Text>
              ) : (
                attendanceHistory
                  // if the dateRange buttons are used, filter accordingly
                  .filter((d: any) => {
                    if (!rangeStart || !rangeEnd) return true;
                    // expecting d.date in DD/MM/YYYY
                    const parts = (d.currentDate || "").split("/");
                    if (parts.length !== 3) return true;
                    const dt = new Date(
                      Number(parts[2]),
                      Number(parts[1]) - 1,
                      Number(parts[0])
                    );
                    return (
                      dt.getTime() >= rangeStart.getTime() &&
                      dt.getTime() <= rangeEnd.getTime()
                    );
                  })
                  .map((item: any, index: number) => (
                    <TouchableOpacity
                      key={(item.currentDate ?? "") + "-" + index}
                      style={styles.historyItem}
                      onPress={() => toggleHistoryExpansion(index)}
                    >
                      <View style={styles.historyItemHeader}>
                        <Text style={styles.historyDate}>
                          {formatDate(item.currentDate)}
                        </Text>
                        <AntDesign
                          name={expandedHistory === index ? "up" : "down"}
                          size={12}
                          color="#666"
                        />
                      </View>

                      {expandedHistory === index && (
                        <View style={styles.historyDetails}>
                          <View style={styles.historyRow}>
                            <Text style={styles.historyLabel}>Clock In</Text>
                            <Text style={styles.historyValue}>
                              {formatTime(item.clockIn)}
                            </Text>
                          </View>

                          <View style={styles.historyRow}>
                            <Text style={styles.historyLabel}>Clock Out</Text>
                            <Text style={styles.historyValue}>
                              {formatTime(item.clockOut)}
                            </Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))
              )}
            </View>
          </View>
        </View>

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

  readMoreText: {
    color: "#758DA3",
    fontSize: 14,
    fontWeight: "500",
  },
  readMoreRow: {
    alignItems: "flex-end",
    marginTop: 6,
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
