import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AttendanceItem {
  currentDate?: string;
  clockIn?: string | null;
  clockOut?: string | null;
}

interface HistorySectionProps {
  data?: AttendanceItem[];
}

export default function HistorySection({ data = [] }: HistorySectionProps) {
  const [expandedHistory, setExpandedHistory] = useState<number | null>(0);

  const toggleHistoryExpansion = (index: number) => {
    setExpandedHistory(expandedHistory === index ? null : index);
  };

  const formatTime = (dt: any) => {
    if (!dt) return "-";
    try {
      const date = new Date(dt);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const period = date.getHours() >= 12 ? "PM" : "AM";
      const displayHours = date.getHours() % 12 || 12;
      return `${displayHours}:${minutes} ${period}`;
    } catch {
      return "-";
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionTitle}>History</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>This Week</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          {data.length === 0 ? (
            <Text style={{ padding: 12, color: "#666" }}>
              No history available
            </Text>
          ) : (
            data.map((item, index) => (
              <TouchableOpacity
                key={(item.currentDate ?? "") + "-" + index}
                style={styles.historyItem}
                onPress={() => toggleHistoryExpansion(index)}
              >
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyDate}>{item.currentDate}</Text>
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
  );
}

const styles = StyleSheet.create({
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
});
