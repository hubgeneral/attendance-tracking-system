import { Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

function parseDate(str: string): Date | null {
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const dd = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10) - 1;
  const yyyy = parseInt(parts[2], 10);
  const d = new Date(yyyy, mm, dd);
  return isNaN(d.getTime()) ? null : d;
}

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
  const [start, setStart] = useState(formatDate(defaultStart));
  const [end, setEnd] = useState(formatDate(defaultEnd));

  const apply = () => {
    const ps = parseDate(start);
    const pe = parseDate(end);
    if (ps && pe && ps.getTime() <= pe.getTime()) {
      onApply(ps, pe);
      setVisible(false);
    } else {
      // invalid, simple fallback: do nothing
      // In a real app we could surface an error
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
    setStart(formatDate(startD));
    setEnd(formatDate(endD));
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
        <Text style={styles.buttonText}>{`${start} - ${end}`}</Text>
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
                  setStart(formatDate(s));
                  setEnd(formatDate(e));
                }}
              >
                <Text style={styles.quickBtnText}>Last 7 days</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Start</Text>
                <TextInput
                  value={start}
                  onChangeText={setStart}
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>End</Text>
                <TextInput
                  value={end}
                  onChangeText={setEnd}
                  style={styles.input}
                  placeholder="DD/MM/YYYY"
                />
              </View>
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
