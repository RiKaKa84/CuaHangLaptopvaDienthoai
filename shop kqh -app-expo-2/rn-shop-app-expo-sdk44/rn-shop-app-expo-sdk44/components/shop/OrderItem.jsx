import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CartItem from "./CartItem";
import Colors from "../../constants/Colors";
import CustomButton from "../UI/CustomButton";

const ORDER_STATUSES = [
    { key: "warehouse", label: "Nhập kho sản phẩm", icon: "cube-outline", color: "#6C63FF" },
    { key: "packing",   label: "Chuẩn bị đóng hộp", icon: "archive-outline", color: "#FFA502" },
    { key: "shipping",  label: "Đang giao hàng",    icon: "bicycle-outline", color: "#1B9CFC" },
    { key: "delivered", label: "Đã nhận hàng ✓",   icon: "checkmark-circle-outline", color: "#2ED573" },
];

const STATUS_INDEX = {
    warehouse: 0,
    packing: 1,
    shipping: 2,
    delivered: 3,
};

const PAYMENT_LABELS = {
    COD: "💵 Thanh toán khi nhận hàng",
    QR: "📱 Đã thanh toán qua Mã QR",
};

const OrderItem = (props) => {
    const [showDetails, setShowDetails] = useState(false);

    const formattedAmount = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(props.amount);

    const currentStatusIndex = STATUS_INDEX[props.status] ?? 0;

    return (
        <View style={styles.orderItem}>
            {/* Header: Tiền + ngày */}
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>{formattedAmount}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>

            {/* Thông tin địa chỉ và phương thức */}
            {!!props.address && (
                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={15} color="#666" />
                    <Text style={styles.infoText} numberOfLines={2}> {props.address}</Text>
                </View>
            )}
            {!!props.paymentMethod && (
                <View style={styles.infoRow}>
                    <Text style={styles.infoText}>{PAYMENT_LABELS[props.paymentMethod] || props.paymentMethod}</Text>
                </View>
            )}

            {/* Timeline trạng thái đơn hàng */}
            <View style={styles.verticalTimelineContainer}>
                {ORDER_STATUSES.map((step, index) => {
                    const isDone = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const isLast = index === ORDER_STATUSES.length - 1;

                    return (
                        <View key={step.key} style={styles.verticalTimelineStep}>
                            {/* Cột Icon & Đường nối */}
                            <View style={styles.verticalTimelineIconCol}>
                                <View
                                    style={[
                                        styles.verticalTimelineDot,
                                        isDone ? { backgroundColor: step.color } : styles.timelineDotPending,
                                        isCurrent && styles.timelineDotCurrent,
                                    ]}
                                >
                                    <Ionicons
                                        name={step.icon}
                                        size={16}
                                        color={isDone ? "white" : "#999"}
                                    />
                                </View>
                                {/* Đường kẻ dọc nối xuống item tiếp theo */}
                                {!isLast && (
                                    <View
                                        style={[
                                            styles.verticalTimelineLine,
                                            index < currentStatusIndex ? { backgroundColor: step.color } : styles.timelineLinePending,
                                        ]}
                                    />
                                )}
                            </View>

                            {/* Cột Text */}
                            <View style={[styles.verticalTimelineTextCol, isLast && { paddingBottom: 0 }]}>
                                <Text
                                    style={[
                                        styles.verticalTimelineLabel,
                                        isDone ? { color: step.color, fontWeight: "bold" } : styles.timelineLabelPending,
                                    ]}
                                >
                                    {step.label}
                                </Text>
                                {isCurrent && (
                                    <Text style={styles.verticalTimelineSubLabel}>
                                        Đơn hàng của bạn đang ở bước này
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Nút xem chi tiết + Xóa */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center", marginTop: 8 }}>
                <CustomButton
                    title={showDetails ? "Thu gọn" : "Xem chi tiết"}
                    onPress={() => setShowDetails((prev) => !prev)}
                />
                <Pressable onPress={props.onDelete} style={{ padding: 10 }}>
                    <Text style={{ color: "red", fontWeight: "bold" }}>Xóa</Text>
                </Pressable>
            </View>

            {/* Chi tiết sản phẩm */}
            {showDetails && (
                <View style={styles.detailItems}>
                    {props.items && props.items.map((cartItem) => (
                        <CartItem
                            key={cartItem.productId}
                            quantity={cartItem.quantity}
                            amount={cartItem.sum}
                            title={cartItem.productTitle}
                            showDelete={false}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        shadowColor: "#6C63FF",
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        elevation: 4,
        borderRadius: 18,
        backgroundColor: "white",
        margin: 12,
        marginHorizontal: 14,
        padding: 16,
        alignItems: "flex-start",
        borderWidth: 1,
        borderColor: "#F0F0F8",
    },
    summary: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 8,
    },
    totalAmount: {
        fontWeight: "700",
        fontSize: 17,
        color: "#FF4D4F",
    },
    date: {
        fontSize: 12,
        color: "#8A8A8A",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
        width: "100%",
    },
    infoText: {
        fontSize: 13,
        color: "#666",
        flexShrink: 1,
    },
    // Vertical Timeline Styles
    verticalTimelineContainer: {
        width: "100%",
        marginTop: 15,
        paddingLeft: 5,
    },
    verticalTimelineStep: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    verticalTimelineIconCol: {
        alignItems: "center",
        width: 30,
        marginRight: 15,
    },
    verticalTimelineDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
    },
    timelineDotCurrent: {
        borderWidth: 3,
        borderColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    timelineDotPending: {
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#ddd",
    },
    verticalTimelineLine: {
        width: 3,
        height: 35, // Độ dài đường kẻ nối 2 mốc
        marginVertical: -3, // Đẩy lùi lên trên để che đi khoảng hở giữa hình tròn và đường kẻ
        zIndex: 1,
    },
    timelineLinePending: {
        backgroundColor: "#eee",
    },
    verticalTimelineTextCol: {
        flex: 1,
        paddingTop: 6,
        paddingBottom: 25, // Tạo khoảng cách với mốc tiếp theo
    },
    verticalTimelineLabel: {
        fontSize: 15,
    },
    timelineLabelPending: {
        color: "#aaa",
        fontWeight: "500",
    },
    verticalTimelineSubLabel: {
        fontSize: 12,
        color: "#7f8c8d",
        marginTop: 4,
        fontStyle: "italic",
    },
    detailItems: {
        width: "100%",
        marginTop: 8,
    },
});

export default OrderItem;
