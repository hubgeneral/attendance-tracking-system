import { AntDesign, Octicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { startGeofencing,isUserInsideRegion } from '../../components/geoFencing';
import regions from '../../components/regions';

import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardHeader from "../../components/DashboardHeader";
import DateRangePicker from "../../components/DateRangePicker";
import StatusLabel from "../../components/StatusLabel";
import * as Notifications from 'expo-notifications';

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
  const [selectedDate] = useState("21/10/2025");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(0);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [requests, setRequests] = useState<
    { date: string; status: string; text: string }[]
  >([]);
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [expandedAllRequest, setExpandedAllRequest] = useState<number | null>(
    null
  );

  // useEffect(() => {
  //   startGeofencing(regions);
  //   console.log("Geofencing started with regions:", regions);
  // }, []);

   useEffect(() => {
    const init = async () => {
      await startGeofencing(regions);

      // ✅ Auto-check on launch
      const inside = await isUserInsideRegion(regions[0]);
      if (inside) {
        console.log(`✅ You are currently inside ${regions[0].identifier}`);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'You are already inside 🏢',
            body: `Currently inside ${regions[0].identifier}`,
          },
          trigger: null,
        });
      } else {
        console.log(`🚶‍♂️ You are outside ${regions[0].identifier}`);
      }
    };
    handleManualCheck();
    init();
  }, []);

  const handleManualCheck = async () => {
    const inside = await isUserInsideRegion(regions[0]);
    Alert.alert(
      'Geofence Check',
      inside
        ? `✅ You are currently inside ${regions[0].identifier}`
        : `🚶‍♂️ You are outside ${regions[0].identifier}`
    );
  };

  const toggleHistoryExpansion = (index: number) => {
    setExpandedHistory(expandedHistory === index ? null : index);
  };

  const handleSubmitRequest = () => {
    if (requestText.trim()) {
      setRequests([
        {
          date: selectedDate,
          status: "pending",
          text: requestText.trim(),
        },
        ...requests,
      ]);
      setRequestText("");
      setModalVisible(false);
      setTimeout(() => setShowSuccess(true), 300);
    } else {
      setModalVisible(false);
      setTimeout(() => setShowFailure(true), 300);
    }
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
          <Text style={styles.greeting}>Hi Eric</Text>
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
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.cardAccent, styles.blueAccent]} />
            <Text style={styles.metricTitle}>Clock In Time</Text>
            <Text style={styles.metricValue}>8:00 AM</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.cardAccent, styles.orangeAccent]} />
            <Text style={styles.metricTitle}>Clock Out Time</Text>
            <Text style={styles.metricValue}>5:00 PM</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.cardAccent, styles.greenAccent]} />
            <Text style={styles.metricTitle}>Hours Worked</Text>
            <Text style={styles.metricValue}>7hrs</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.cardAccent, styles.redAccent]} />
            <Text style={styles.metricTitle}>Time Off</Text>
            <Text style={styles.metricValue}>1hrs</Text>
          </View>
        </View>

        {/* History Section */}
        <View style={styles.section}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>History</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Text style={styles.filterButtonText}>This Week</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
              {/* Example static history data with date strings matching DD/MM/YYYY */}
              {(() => {
                const exampleData = [
                  { date: "02/10/2025", in: "8:00 AM", out: "5:00 PM" },
                  { date: "03/10/2025", in: "8:02 AM", out: "4:59 PM" },
                  { date: "04/10/2025", in: "8:05 AM", out: "5:10 PM" },
                  { date: "05/10/2025", in: "8:00 AM", out: "5:00 PM" },
                  { date: "06/10/2025", in: "8:15 AM", out: "5:05 PM" },
                ];

                // filter by selected range if provided
                const filtered = exampleData.filter((d) => {
                  if (!rangeStart || !rangeEnd) return true;
                  const parts = d.date.split("/");
                  const dt = new Date(
                    Number(parts[2]),
                    Number(parts[1]) - 1,
                    Number(parts[0])
                  );
                  return (
                    dt.getTime() >= rangeStart.getTime() &&
                    dt.getTime() <= rangeEnd.getTime()
                  );
                });

                return filtered.map((item, index) => (
                  <TouchableOpacity
                    key={item.date + index}
                    style={styles.historyItem}
                    onPress={() => toggleHistoryExpansion(index)}
                  >
                    <View style={styles.historyItemHeader}>
                      <Text style={styles.historyDate}>{item.date}</Text>
                      <AntDesign
                        name={expandedHistory === index ? "up" : "down"}
                        size={14}
                        color="#666"
                      />
                    </View>

                    {expandedHistory === index && (
                      <View style={styles.historyDetails}>
                        <View style={styles.historyRow}>
                          <Text style={styles.historyLabel}>Clock In</Text>
                          <Text style={styles.historyValue}>{item.in}</Text>
                        </View>
                        <View style={styles.historyRow}>
                          <Text style={styles.historyLabel}>Clock Out</Text>
                          <Text style={styles.historyValue}>{item.out}</Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                ));
              })()}
            </View>
          </View>
        </View>

        {/* Requests Section */}
        <View style={styles.section}>
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.sectionTitle}>Requests</Text>
              <TouchableOpacity
                style={styles.makeRequestButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.makeRequestButtonText}>Make a Request</Text>
              </TouchableOpacity>
            </View>

            <View style={{ maxHeight: 260 }}>
              {requests.length > 0 ? (
                <View style={styles.requestItem}>
                  <View style={styles.requestHeader}>
                    <Text style={styles.requestDate}>{requests[0].date}</Text>
                    <StatusLabel status={requests[0].status as any} />
                  </View>
                  <Text
                    style={styles.requestDescription}
                    numberOfLines={expandedRequest === 0 ? undefined : 3}
                  >
                    {requests[0].text}
                  </Text>
                  {requests[0].text.length > 80 && (
                    <TouchableOpacity
                      onPress={() =>
                        setExpandedRequest(expandedRequest === 0 ? null : 0)
                      }
                    >
                      <Text
                        style={{
                          color: "#004E2B",
                          fontWeight: "500",
                          marginTop: 4,
                        }}
                      >
                        {expandedRequest === 0 ? "Read less" : "Read more"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.emptyRequestsCard}>
                  <Image
                    source={require("../../assets/images/empty_request.png")}
                    style={styles.emptyImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>No requests available</Text>
                </View>
              )}
            </View>

            {requests.length > 0 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => setShowAllRequests(true)}
              >
                <Text style={styles.viewAllText}>View All Requests →</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Modal for making a request */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomModalOverlay}
          >
            <View style={styles.bottomModalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={22} color="#ccc" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Requests</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Type your request here"
                  value={requestText}
                  onChangeText={setRequestText}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSubmitRequest}
              >
                <Text style={styles.modalButtonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Success Modal */}
        <Modal
          visible={showSuccess}
          animationType="slide"
          transparent
          onRequestClose={() => setShowSuccess(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomModalOverlay}
          >
            <View style={styles.bottomModalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowSuccess(false)}
              >
                <AntDesign name="close" size={22} color="#ccc" />
              </TouchableOpacity>
              <Image
                source={require("../../assets/images/form_success.png")}
                style={styles.successImage}
                resizeMode="contain"
              />
              <Text style={styles.successText}>
                Your request has been submitted successfully.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* Failure Modal */}
        <Modal
          visible={showFailure}
          animationType="slide"
          transparent
          onRequestClose={() => setShowFailure(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomModalOverlay}
          >
            <View style={styles.bottomModalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowFailure(false)}
              >
                <AntDesign name="close" size={22} color="#ccc" />
              </TouchableOpacity>
              <Image
                source={require("../../assets/images/form_warning.png")}
                style={styles.failureImage}
                resizeMode="contain"
              />
              <Text style={styles.failureText}>
                Sorry, we could not submit your request.
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowFailure(false);
                  setModalVisible(true);
                }}
              >
                <Text style={styles.modalButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* View All Requests Modal */}
        <Modal
          visible={showAllRequests}
          animationType="slide"
          transparent
          onRequestClose={() => setShowAllRequests(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.bottomModalOverlay}
          >
            <View style={styles.bottomModalContent}>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowAllRequests(false)}
              >
                <AntDesign name="close" size={22} color="#ccc" />
              </TouchableOpacity>
              <Text style={styles.allRequestsTitle}>All Requests</Text>
              <FlatList
                data={requests}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.allRequestItem}>
                    <View style={styles.allRequestHeader}>
                      <Text style={styles.allRequestDate}>{item.date}</Text>
                      <View style={{ position: "absolute", top: 0, right: 0 }}>
                        <View
                          style={[
                            styles.statusBadge,
                            item.status === "approved"
                              ? styles.statusBadge_approved
                              : item.status === "pending"
                              ? styles.statusBadge_pending
                              : styles.statusBadge_rejected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              item.status === "approved"
                                ? styles.statusBadgeText_approved
                                : item.status === "pending"
                                ? styles.statusBadgeText_pending
                                : styles.statusBadgeText_rejected,
                            ]}
                          >
                            {item.status.charAt(0).toUpperCase() +
                              item.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {expandedAllRequest === index ? (
                      <Text style={styles.allRequestText}>
                        {item.text}{" "}
                        <Text
                          style={styles.readMoreText}
                          onPress={() => setExpandedAllRequest(null)}
                        >
                          Read less
                        </Text>
                      </Text>
                    ) : item.text.length > 99 ? (
                      <Text
                        style={styles.allRequestText}
                        numberOfLines={4}
                        ellipsizeMode="tail"
                      >
                        {item.text.slice(0, item.text.length - 10) + "... "}
                        <Text
                          style={styles.readMoreText}
                          onPress={() => setExpandedAllRequest(index)}
                        >
                          Read more
                        </Text>
                      </Text>
                    ) : (
                      <Text style={styles.allRequestText}>{item.text}</Text>
                    )}
                  </View>
                )}
                showsVerticalScrollIndicator={true}
                style={{ width: "100%" }}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
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
    marginBottom: 32,
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
    elevation: 3,
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
    lineHeight: 34,
    letterSpacing: 0,
    fontWeight: 500,
    fontFamily: "Inter",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  section: {
    paddingHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: "300",
    color: "#D1D9E0",
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
    margin: 10,
  },
  makeRequestButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    backgroundColor: "#fff",
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
    right: 15,
    top: 15,
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
    width: 120,
    height: 120,
    marginBottom: 18,
  },
  successText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 50,
    fontWeight: "500",
  },
  failureImage: {
    width: 120,
    height: 120,
    marginBottom: 18,
  },
  failureText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
    marginBottom: 18,
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
    marginTop: 8,
  },
  allRequestItem: {
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 12,
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
    backgroundColor: "#E8F5E8",
  },
  statusBadge_pending: {
    backgroundColor: "#FFF3E0",
  },
  statusBadge_rejected: {
    backgroundColor: "#FFEBEE",
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusBadgeText_approved: {
    color: "#2E7D32",
  },
  statusBadgeText_pending: {
    color: "#E65100",
  },
  statusBadgeText_rejected: {
    color: "#C62828",
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
  },
});
