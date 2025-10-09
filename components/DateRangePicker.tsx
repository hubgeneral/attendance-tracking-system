import { Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

type Props = {
  startDate?: Date;
  endDate?: Date;
  onApply: (start: Date, end: Date) => void;
};

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// parseDate removed: using native Date objects now

export default function DateRangePicker({
  startDate,
  endDate,
  onApply,
}: Props) {
  const today = new Date();
  const defaultEnd = endDate ?? today;
  const defaultStart =
    startDate ??
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);

  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState<Date>(defaultStart);
  const [end, setEnd] = useState<Date>(defaultEnd);

  // helper to manage calendar marked dates
  const toKey = (d: Date) => d.toISOString().slice(0, 10);
  const [marked, setMarked] = useState<any>({
    [toKey(start)]: {
      startingDay: true,
      color: "#cde9d7",
      textColor: "#004E2B",
    },
    [toKey(end)]: { endingDay: true, color: "#cde9d7", textColor: "#004E2B" },
  });

  const apply = () => {
    if (start && end && start.getTime() <= end.getTime()) {
      onApply(start, end);
      setVisible(false);
    }
  };

  const setThisWeek = () => {
    const now = new Date();
    const endD = now;
    const startD = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 6
    );
    setStart(startD);
    setEnd(endD);
    onApply(startD, endD);
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Octicons
          name="calendar"
          size={16}
          color="black"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>{`${formatDate(start)} - ${formatDate(
          end
        )}`}</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Date Range</Text>
            <View style={styles.quickRow}>
              <TouchableOpacity style={styles.quickBtn} onPress={setThisWeek}>
                <Text style={styles.quickBtnText}>This Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickBtn}
                onPress={() => {
                  // last 7 days
                  const now = new Date();
                  const s = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    now.getDate() - 6
                  );
                  const e = now;
                  setStart(s);
                  setEnd(e);
                }}
              >
                <Text style={styles.quickBtnText}>Last 7 days</Text>
              </TouchableOpacity>
            </View>

            <View>
              <Calendar
                markingType={"period"}
                markedDates={marked}
                onDayPress={(day: any) => {
                  const date = new Date(day.timestamp);
                  if (
                    !start ||
                    (start && end && start.getTime() && end.getTime())
                  ) {
                    // start fresh
                    setStart(date);
                    setEnd(date);
                    const key = toKey(date);
                    setMarked({
                      [key]: {
                        startingDay: true,
                        endingDay: true,
                        color: "#cde9d7",
                        textColor: "#004E2B",
                      },
                    });
                  } else if (start && !end) {
                    if (date.getTime() < start.getTime()) {
                      setEnd(start);
                      setStart(date);
                    } else {
                      setEnd(date);
                    }
                    // build range marking
                    const range: any = {};
                    const s = start.getTime();
                    const e = date.getTime();
                    const step = 24 * 60 * 60 * 1000;
                    for (
                      let t = Math.min(s, e);
                      t <= Math.max(s, e);
                      t += step
                    ) {
                      const d = new Date(t);
                      const k = toKey(d);
                      range[k] = { color: "#cde9d7", textColor: "#004E2B" };
                    }
                    // mark endpoints
                    const ks = toKey(start);
                    const ke = toKey(date);
                    range[ks] = {
                      startingDay: true,
                      color: "#cde9d7",
                      textColor: "#004E2B",
                    };
                    range[ke] = {
                      endingDay: true,
                      color: "#cde9d7",
                      textColor: "#004E2B",
                    };
                    setMarked(range);
                  }
                }}
              />
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={apply}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E1E6EB",
    paddingHorizontal: 8,
  },
  buttonText: {
    fontSize: 13,
    color: "#333",
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
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  quickBtn: {
    backgroundColor: "#F3F6F8",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  quickBtnText: {
    color: "#333",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E6E9EC",
    padding: Platform.OS === "web" ? 8 : 10,
    borderRadius: 6,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: { color: "#666" },
  applyBtn: {
    backgroundColor: "#004E2B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyText: { color: "#fff" },
});
