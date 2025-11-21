import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HistorySectionProps {
  rangeStart: Date | null;
  rangeEnd: Date | null;
}

export default function HistorySection({
  rangeStart,
  rangeEnd,
}: HistorySectionProps) {
  const [expandedHistory, setExpandedHistory] = useState<number | null>(0);

  const toggleHistoryExpansion = (index: number) => {
    setExpandedHistory(expandedHistory === index ? null : index);
  };

  const exampleData = [
    { date: "02/10/2025", in: "8:00 AM", out: "5:00 PM" },
    { date: "03/10/2025", in: "8:02 AM", out: "4:59 PM" },
    { date: "04/10/2025", in: "8:05 AM", out: "5:10 PM" },
    { date: "05/10/2025", in: "8:00 AM", out: "5:00 PM" },
    { date: "06/10/2025", in: "8:15 AM", out: "5:05 PM" },
  ];

  const filtered = exampleData.filter((d) => {
    if (!rangeStart || !rangeEnd) return true;
    const parts = d.date.split("/");
    const dt = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    );
    return (
      dt.getTime() >= rangeStart.getTime() && dt.getTime() <= rangeEnd.getTime()
    );
  });

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
          {filtered.map((item, index) => (
            <TouchableOpacity
              key={item.date + index}
              style={styles.historyItem}
              onPress={() => toggleHistoryExpansion(index)}
            >
              <View style={styles.historyItemHeader}>
                <Text style={styles.historyDate}>{item.date}</Text>
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
                    <Text style={styles.historyValue}>{item.in}</Text>
                  </View>

                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Clock Out</Text>
                    <Text style={styles.historyValue}>{item.out}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
