import { useAuth } from "@/hooks/useAuth";
import {
  useGetRequestsByUserIdQuery,
  useMakeARequestMutation,
  useUpdateRequestMutation,
} from "@/src/generated/graphql";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import StatusLabel from "./StatusLabel";

export default function RequestsSection() {
  const { currentUser } = useAuth();
  const [requestText, setRequestText] = useState("");
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  // Fetch requests from API
  const {
    data: requestsData,
    loading: requestsLoading,
    refetch: refetchRequests,
  } = useGetRequestsByUserIdQuery({
    variables: { id: Number(currentUser?.id) },
    skip: !currentUser?.id,
  });

  const [createRequest, { loading: createLoading }] = useMakeARequestMutation({
    onCompleted: () => {
      refetchRequests();
      setRequestText("");
      setModalVisible(false);
      setTimeout(() => setShowSuccess(true), 300);
    },
    onError: (err: any) => {
      console.error("Create request error:", err);
      setModalVisible(false);
      setTimeout(() => setShowFailure(true), 300);
    },
  });

  const [updateRequest, { loading: updateLoading }] = useUpdateRequestMutation({
    onCompleted: () => {
      refetchRequests();
      setRequestText("");
      setEditingRequestId(null);
      setModalVisible(false);
      setTimeout(() => setShowSuccess(true), 300);
    },
    onError: (err: any) => {
      console.error("Update request error:", err);
      setModalVisible(false);
      setTimeout(() => setShowFailure(true), 300);
    },
  });

  const requests = requestsData?.requestLogsByUserId || [];

  // Keyboard animation
  useState(() => {
    const onShow = (e: any) => {
      const height = e.endCoordinates?.height ?? 300;
      Animated.timing(keyboardOffset, {
        toValue: -height,
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
  });

  const handleSubmitRequest = async () => {
    if (!requestText.trim()) {
      setModalVisible(false);
      setTimeout(() => setShowFailure(true), 300);
      return;
    }

    try {
      if (editingRequestId) {
        await updateRequest({
          variables: {
            requestId: editingRequestId,
            reason: requestText.trim(),
          },
        });
      } else {
        await createRequest({
          variables: {
            userId: Number(currentUser?.id),
            reason: requestText.trim(),
          },
        });
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleNewRequest = () => {
    setEditingRequestId(null);
    setRequestText("");
    setModalVisible(true);
  };

  const handleEditRequest = (request: any) => {
    const status = getStatusForDisplay(request.approvalStatus);
    if (status === "pending") {
      setEditingRequestId(request.id);
      setRequestText(request.reason);
      setModalVisible(true);
    }
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

  const formatStatus = (status: string | null | undefined) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getStatusForDisplay = (approvalStatus: string | null | undefined) => {
    const statusMap: { [key: string]: string } = {
      approved: "approved",
      pending: "pending",
      unconfirmed: "pending",
      rejected: "rejected",
    };
    const key = (approvalStatus ?? "pending").toLowerCase();
    return statusMap[key] || "pending";
  };

  useEffect(() => {
    if (editingRequestId !== null) {
      setShowAllRequests(false);
    }
  }, [editingRequestId]);

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
    <>
      <View style={styles.section}>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionTitle}>Requests</Text>
            <TouchableOpacity
              style={styles.makeRequestButton}
              onPress={handleNewRequest}
            >
              <Text style={styles.makeRequestButtonText}>Make a Request</Text>
            </TouchableOpacity>
          </View>

          <View style={{ maxHeight: 260 }}>
            {requests.length > 0 ? (
              <View style={styles.requestItem}>
                <View style={styles.requestHeader}>
                  <Text style={styles.requestDate}>
                    {formatDate(new Date().toISOString())}
                  </Text>
                  <StatusLabel
                    status={
                      getStatusForDisplay(requests[0].approvalStatus) as any
                    }
                  />
                </View>
                <ReadMoreText
                  text={requests[0].reason ?? ""}
                  numberOfLines={3}
                  style={styles.requestDescription}
                />
              </View>
            ) : (
              <View style={styles.emptyRequestsCard}>
                <Image
                  source={require("../assets/images/empty_request.png")}
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

      {/* Create/Edit Request Modal */}
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
          <Animated.View
            style={[
              styles.bottomModalContent,
              { transform: [{ translateY: keyboardOffset }] },
            ]}
          >
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
              style={[
                styles.modalButton,
                (createLoading || updateLoading) && { opacity: 0.6 },
              ]}
              onPress={handleSubmitRequest}
              disabled={createLoading || updateLoading}
            >
              {createLoading || updateLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>
                  {editingRequestId ? "Update Request" : "Submit Request"}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
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
          <Animated.View
            style={[
              styles.bottomModalContent,
              { transform: [{ translateY: keyboardOffset }] },
            ]}
          >
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowSuccess(false)}
            >
              <AntDesign name="close" size={22} color="#ccc" />
            </TouchableOpacity>
            <Image
              source={require("../assets/images/form_success.png")}
              style={styles.successImage}
              resizeMode="contain"
            />
            <Text style={styles.successText}>
              Your request has been submitted successfully.
            </Text>
          </Animated.View>
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
          <Animated.View
            style={[
              styles.bottomModalContent,
              { transform: [{ translateY: keyboardOffset }] },
            ]}
          >
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowFailure(false)}
            >
              <AntDesign name="close" size={22} color="#ccc" />
            </TouchableOpacity>
            <Image
              source={require("../assets/images/form_warning.png")}
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
          </Animated.View>
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
          <Animated.View
            style={[
              styles.bottomModalContent,
              { transform: [{ translateY: keyboardOffset }] },
            ]}
          >
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowAllRequests(false)}
            >
              <AntDesign name="close" size={22} color="#ccc" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>All Requests</Text>

            <FlatList
              data={requests}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleEditRequest(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.allRequestItem}>
                    <View style={styles.allRequestHeader}>
                      <Text style={styles.allRequestDate}>
                        {formatDate(new Date().toISOString())}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          getStatusForDisplay(item.approvalStatus) ===
                          "approved"
                            ? styles.statusBadge_approved
                            : getStatusForDisplay(item.approvalStatus) ===
                              "pending"
                            ? styles.statusBadge_pending
                            : styles.statusBadge_rejected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            getStatusForDisplay(item.approvalStatus) ===
                            "approved"
                              ? styles.statusBadgeText_approved
                              : getStatusForDisplay(item.approvalStatus) ===
                                "pending"
                              ? styles.statusBadgeText_pending
                              : styles.statusBadgeText_rejected,
                          ]}
                        >
                          {item.approvalStatus
                            ? item.approvalStatus.charAt(0).toUpperCase() +
                              item.approvalStatus.slice(1)
                            : "Pending"}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.allRequestText} numberOfLines={2}>
                      {item.reason}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={true}
              style={{ width: "100%", maxHeight: 400 }}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
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
  makeRequestButton: {
    backgroundColor: "#004E2B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  makeRequestButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
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
  readMoreText: {
    color: "#758DA3",
    fontSize: 14,
    fontWeight: "500",
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
    marginLeft: 25,
  },
  bottomModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.15)",
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
  modalClose: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 2,
    width: 33.13,
    height: 33.13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FAFAFA",
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
  successImage: {
    width: 182,
    height: 185,
    marginBottom: 18,
  },
  successText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 50,
    fontWeight: "500",
    width: 335,
    height: 24,
  },
  failureImage: {
    width: 197,
    height: 147,
    marginBottom: 18,
  },
  failureText: {
    fontSize: 16,
    color: "#1A1A1A",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
    marginBottom: 18,
    width: 313,
    height: 24,
  },
  allRequestItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  allRequestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  allRequestDate: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadge_approved: {
    backgroundColor: "#F2FBF6",
    borderWidth: 1,
    borderColor: "#D9F2E5",
  },
  statusBadge_pending: {
    backgroundColor: "#FFF6ED",
    borderWidth: 1,
    borderColor: "#FFE9D6",
  },
  statusBadge_rejected: {
    backgroundColor: "#FFEDED",
    borderWidth: 1,
    borderColor: "#FFD0D1",
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBadgeText_approved: {
    color: "#00AB50",
  },
  statusBadgeText_pending: {
    color: "#FF8D28",
  },
  statusBadgeText_rejected: {
    color: "#FF383C",
  },
  allRequestText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
