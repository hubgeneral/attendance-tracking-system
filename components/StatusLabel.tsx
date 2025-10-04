import { StyleSheet, Text, View } from "react-native";

type StatusType = "pending" | "approved" | "rejected" | "on-leave";

type StatusLabelProps = {
  status: StatusType;
};

export default function StatusLabel({ status }: StatusLabelProps) {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "pending":
        return {
          backgroundColor: "#FFF3E0",
          borderColor: "#FFB74D",
          textColor: "#E65100",
          text: "Pending",
        };
      case "approved":
        return {
          backgroundColor: "#E8F5E8",
          borderColor: "#81C784",
          textColor: "#2E7D32",
          text: "Approved",
        };
      case "rejected":
        return {
          backgroundColor: "#FFEBEE",
          borderColor: "#EF5350",
          textColor: "#C62828",
          text: "Rejected",
        };
      case "on-leave":
        return {
          backgroundColor: "#FFF3E0",
          borderColor: "#FFB74D",
          textColor: "#E65100",
          text: "On Leave",
        };
      default:
        return {
          backgroundColor: "#F5F5F5",
          borderColor: "#BDBDBD",
          textColor: "#757575",
          text: "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <View
      style={[
        styles.statusLabel,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      <Text
        style={[
          styles.statusText,
          {
            color: config.textColor,
          },
        ]}
      >
        {config.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});


