import GeolibFence, { PolygonEvent } from "../../components/GeolibFence";
import HistorySection from "@/components/HistorySection";
import MetricCards from "@/components/MetricCards";
import RequestsSection from "@/components/RequestsSection";
import { useAuth } from "@/hooks/useAuth";
import {
  useGetAttendanceByUserIdLazyQuery,
  useGetAttendanceByUsernameQuery,
  useGetUserByIdQuery,
} from "@/src/generated/graphql";
// icon imports not used in this file (DashboardHeader/Profile handle icons)
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
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
import StatusLabel from "../../components/StatusLabel";
import { WebContainer } from "../../components/WebContainer";
import { ResponsiveModal } from "../../components/ResponsiveModal";
import { usePlatform } from "../../hooks/usePlatform";

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
  const { currentUser } = useAuth();
  const { shouldUseWebLayout, isWeb } = usePlatform();

  const keyboardOffset = useRef(new Animated.Value(0)).current;
  const { data, loading, error, refetch } = useGetAttendanceByUsernameQuery({
    variables: {
      username: currentUser?.userName ?? "",
      day: presentDay,
    },
  });
  const { data: userData } = useGetUserByIdQuery({
    variables: { id: Number(currentUser?.id) },
  });

  // UI state for metric cards (updated when query result changes)
  const [clockInText, setClockInText] = useState<string>("-");
  const [clockOutText, setClockOutText] = useState<string>("-");
  const [hoursWorkedText, setHoursWorkedText] = useState<string>("-");
  const [timeOffText, setTimeOffText] = useState<string>("-");
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
  const attendanceHistory = Array.isArray(uid_data?.attendanceByUserId)
    ? uid_data!.attendanceByUserId
    : [];

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

  /**
   * Format hours as whole numbers for display.
   * - mode: 'floor' will round down (used for Hours Worked)
   * - mode: 'ceil' will round up (used for Time Off)
   */
  const formatHours = (val: number, mode: "floor" | "ceil" = "floor") => {
    if (!isFinite(val) || isNaN(val)) return "-";
    if (mode === "floor") return `${Math.floor(val)}`;
    return `${Math.ceil(val)}`;
  };

  useEffect(() => {
    if (loading) {
      setClockInText("...");
      setClockOutText("...");
      setHoursWorkedText("...");
      setTimeOffText("-");
      return;
    }

    if (error || !data || !data?.attendanceByUserName) {
      setClockInText("-");
      setClockOutText("-");
      setHoursWorkedText("-");
      setTimeOffText("-");
      return;
    }

    // pick the first attendance entry (assumed to be the most relevant)
    const latestAttendance =
      data.attendanceByUserName && data.attendanceByUserName.length
        ? data.attendanceByUserName[0]
        : null;

    setClockInText(formatTime(latestAttendance?.clockIn));
    setClockOutText(formatTime(latestAttendance?.clockOut));
    // parse totalHoursWorked (may be string or number)
    let hoursNum: number | null = null;
    if (latestAttendance?.totalHoursWorked != null) {
      const parsed = Number(latestAttendance.totalHoursWorked as any);
      if (!isNaN(parsed)) hoursNum = parsed;
    }

    if (hoursNum != null) {
      // Show whole numbers: floor for hours worked (don't overstate),
      // and ceil for time off (to show remaining hours conservatively)
      setHoursWorkedText(`${formatHours(hoursNum, "floor")}hrs`);
      const timeOff = Math.max(0, 8 - hoursNum);
      setTimeOffText(`${formatHours(timeOff, "ceil")}hrs`);
    } else {
      setHoursWorkedText("-");
      setTimeOffText("-");
    }
  }, [data, loading, error]);

  const geofenceStartedRef = useRef(false);
  // this ensures geofencing is only started once
  useEffect(() => {
    if (!geofenceStartedRef.current) {
      geofenceStartedRef.current = true;
      setGeofenceStarted(true);
    }
  }, []);

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
    if (geofenceStarted) {
      refetch({ username: currentUser?.userName ?? "", day: today });
    }
  }, [geofenceStarted, refetch, currentUser?.userName, today]);

  const toggleHistoryExpansion = (index: number) => {
    setExpandedHistory(expandedHistory === index ? null : index);
  };

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
      <WebContainer>
        <DashboardHeader />
        <ScrollView
          style={[
            styles.scrollView,
            shouldUseWebLayout && styles.scrollView_web,
          ]}
          showsVerticalScrollIndicator={shouldUseWebLayout}
          contentContainerStyle={
            shouldUseWebLayout ? { paddingBottom: 20 } : undefined
          }
        >
          {/* Greeting and Date Selector */}
          <View
            style={[
              styles.greetingSection,
              shouldUseWebLayout && styles.greetingSection_web,
            ]}
          >
            <Text style={styles.greeting}>Hi {currentUser?.userName}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
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

          {/* History Section */}
          <HistorySection rangeStart={null} rangeEnd={null} />

          {/* Requests Section */}
          <RequestsSection />
        </ScrollView>
        {/* //  this will only render after geofencing has started to avoid multiple initializations */}
        {geofenceStarted && (
          <GeolibFence polygon={OfficeRegion} onEvent={handlePolygonEvent} />
        )}
      </WebContainer>
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
    maxHeight: "100%",
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

  // Web-specific responsive styles
  scrollView_web: {
    // @ts-ignore - web only
    overflowY: "scroll",
    // @ts-ignore - web only
    overflowX: "hidden",
  },
  greetingSection_web: {
    paddingHorizontal: 24,
  },
  metricsGrid_web: {
    paddingHorizontal: 24,
  },
  metricCard_web: {
    width: "100%",
  },
});
