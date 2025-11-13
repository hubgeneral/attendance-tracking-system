import { Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { ResponsiveModal } from "./ResponsiveModal";

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
  const [end, setEnd] = useState<Date | null>(defaultEnd);
  const [selecting, setSelecting] = useState<boolean>(false);

  // helper to manage calendar marked dates
  const toKey = (d: Date) => d.toISOString().slice(0, 10);

  const buildMarked = (s: Date | null, e: Date | null) => {
    const out: any = {};
    if (!s) return out;
    if (!e) {
      const k = toKey(s);
      out[k] = {
        startingDay: true,
        endingDay: true,
        color: "#cde9d7",
        textColor: "#004E2B",
      };
      return out;
    }
    const sTime = s.getTime();
    const eTime = e.getTime();
    const step = 24 * 60 * 60 * 1000;
    for (
      let t = Math.min(sTime, eTime);
      t <= Math.max(sTime, eTime);
      t += step
    ) {
      const d = new Date(t);
      const k = toKey(d);
      out[k] = { color: "#cde9d7", textColor: "#004E2B" };
    }
    out[toKey(s)] = {
      startingDay: true,
      color: "#cde9d7",
      textColor: "#004E2B",
    };
    out[toKey(e)] = { endingDay: true, color: "#cde9d7", textColor: "#004E2B" };
    return out;
  };

  const [marked, setMarked] = useState<any>(
    buildMarked(defaultStart, defaultEnd)
  );

  const apply = () => {
    if (!end) return;
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setVisible(true);
          setSelecting(false);
        }}
      >
        <Octicons
          name="calendar"
          size={16}
          color="black"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>{`${formatDate(start)} - ${
          end ? formatDate(end) : formatDate(start)
        }`}</Text>
      </TouchableOpacity>

      <ResponsiveModal
        visible={visible}
        animationType="slide"
        transparent
        maxWidth={400}
      >
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
                  if (!selecting) {
                    // set start and clear end
                    setStart(date);
                    setEnd(null);
                    setSelecting(true);
                    setMarked(buildMarked(date, null));
                  } else {
                    // finalize end
                    let s = start;
                    let e = date;
                    if (!s) s = date;
                    if (e.getTime() < s.getTime()) {
                      const tmp = s;
                      s = e;
                      e = tmp;
                    }
                    setStart(s as Date);
                    setEnd(e as Date);
                    setSelecting(false);
                    setMarked(buildMarked(s as Date, e as Date));
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
      </ResponsiveModal>
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
