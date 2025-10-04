import { AntDesign, Octicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusLabel from "../../components/StatusLabel";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  const [selectedDate] = useState("21/10/2025");
  const [expandedHistory, setExpandedHistory] = useState<number | null>(0);

  const toggleHistoryExpansion = (index: number) => {
    setExpandedHistory(expandedHistory === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting and Date Selector */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hi Eric</Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Octicons name="calendar" size={16} color="black" />{" "}
            <Text style={styles.dateSelectorText}>Select Date</Text>
          </TouchableOpacity>
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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>History</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Text style={styles.filterButtonText}>This Week</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.historyList}>
            {[0, 1, 2, 3, 4].map((index) => (
              <TouchableOpacity
                key={index}
                style={styles.historyItem}
                onPress={() => toggleHistoryExpansion(index)}
              >
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyDate}>{selectedDate}</Text>
                  <AntDesign
                    name={expandedHistory === index ? "up" : "down"}
                    size={16}
                    color="#666"
                  />
                </View>

                {expandedHistory === index && (
                  <View style={styles.historyDetails}>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Clock In</Text>
                      <Text style={styles.historyValue}>8:30 AM</Text>
                    </View>
                    <View style={styles.historyRow}>
                      <Text style={styles.historyLabel}>Clock Out</Text>
                      <Text style={styles.historyValue}>5:49 PM</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Requests</Text>
            <TouchableOpacity style={styles.makeRequestButton}>
              <Text style={styles.makeRequestButtonText}>Make a Request</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.requestItem}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestDate}>{selectedDate}</Text>
              <StatusLabel status="approved" />
            </View>
            <Text style={styles.requestDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris...
              Read less
            </Text>
          </View>

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Request →</Text>
          </TouchableOpacity>
        </View>
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
    width: 13.33,
    height: 13.33,
  },
  greetingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
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
    // borderRadius: 2,
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
    // marginBottom: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  filterButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterButtonText: {
    fontSize: 12,
    color: "#666",
  },
  makeRequestButton: {
    backgroundColor: "#004E2B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
});
