import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

interface MetricData {
  clockInText: string;
  clockOutText: string;
  hoursWorkedText: string;
  timeOffText: string;
}

interface MetricCardsProps {
  data?: MetricData;
}

export default function MetricCards({ data }: MetricCardsProps) {
  const clockInText = data?.clockInText ?? "-";
  const clockOutText = data?.clockOutText ?? "-";
  const hoursWorkedText = data?.hoursWorkedText ?? "-";
  const timeOffText = data?.timeOffText ?? "-";

  return (
    <>
      {/* Metric Cards */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <View style={[styles.cardAccent, styles.blueAccent]} />
          <Text style={styles.metricTitle}>Clock In Time</Text>
          <Text style={styles.metricValue}>
            <Text style={styles.metricTime}>{clockInText.split(" ")[0]}</Text>
            <Text style={styles.metricPeriod}>
              {" " + (clockInText.split(" ")[1] ?? "")}
            </Text>
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.cardAccent, styles.orangeAccent]} />
          <Text style={styles.metricTitle}>Clock Out Time</Text>
          <Text style={styles.metricValue}>
            <Text style={styles.metricTime}>{clockOutText.split(" ")[0]}</Text>
            <Text style={styles.metricPeriod}>
              {" " + (clockOutText.split(" ")[1] ?? "")}
            </Text>
          </Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.cardAccent, styles.greenAccent]} />
          <Text style={styles.metricTitle}>Hours Worked</Text>
          <Text style={styles.metricValue}>{hoursWorkedText}</Text>
        </View>

        <View style={styles.metricCard}>
          <View style={[styles.cardAccent, styles.redAccent]} />
          <Text style={styles.metricTitle}>Time Off</Text>
          <Text style={styles.metricValue}>{timeOffText}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    fontWeight: "500",
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
});
