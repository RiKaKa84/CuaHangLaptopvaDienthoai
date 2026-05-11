import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Modal,
    Pressable,
    ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";

const ORDER_STATUSES = [
    { key: "warehouse", label: "Nhập kho sản phẩm", icon: "cube-outline", color: "#6c7ae0" },
    { key: "packing", label: "Chuẩn bị đóng hộp", icon: "archive-outline", color: "#f7a731" },
    { key: "shipping", label: "Đang giao hàng", icon: "bicycle-outline", color: "#2ecc71" },
    { key: "delivered", label: "Đã nhận hàng", icon: "checkmark-circle-outline", color: "#27ae60" },
];

const PAYMENT_LABELS = {
    COD: "💵 COD (Nhận hàng trả tiền)",
    QR: "📱 Đã thanh toán QR",
};

const STATUS_INDEX = { warehouse: 0, packing: 1, shipping: 2, delivered: 3 };

const AdminOrdersScreen = (props) => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders.orders);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const loadAllOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            await dispatch(orderActions.fetchAllOrders());
        } catch (err) {
            Alert.alert("Lỗi", "Không thể tải danh sách đơn hàng.", [{ text: "Đóng" }]);
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        loadAllOrders();
    }, [loadAllOrders]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(orderActions.fetchAllOrders());
        setRefreshing(false);
    };

    const openUpdateModal = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const updateStatus = async (newStatus) => {
        if (!selectedOrder) return;
        setUpdatingStatus(true);
        try {
            await dispatch(
                orderActions.updateOrderStatus(selectedOrder.userId, selectedOrder.id, newStatus)
            );
            setModalVisible(false);
            Alert.alert("Thành công", "Đã cập nhật trạng thái đơn hàng!", [{ text: "OK" }]);
        } catch (err) {
            Alert.alert("Lỗi", "Không thể cập nhật trạng thái.", [{ text: "Đóng" }]);
        }
        setUpdatingStatus(false);
    };

    const getStatusInfo = (statusKey) =>
        ORDER_STATUSES.find((s) => s.key === statusKey) || ORDER_STATUSES[0];

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.centered}>
                <Ionicons name="receipt-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
            </View>
        );
    }

    const renderOrderCard = ({ item }) => {
        const statusInfo = getStatusInfo(item.status);
        const formattedAmount = new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(item.totalAmount);

        return (
            <View style={styles.orderCard}>
                {/* Header */}
                <View style={styles.orderHeader}>
                    <View style={styles.orderIdBadge}>
                        <Text style={styles.orderIdText}>#{item.id.slice(-6).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.orderDate}>{item.readableDate}</Text>
                </View>

                {/* Trạng thái hiện tại */}
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + "22", borderColor: statusInfo.color }]}>
                    <Ionicons name={statusInfo.icon} size={16} color={statusInfo.color} />
                    <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>
                        {" "}{statusInfo.label}
                    </Text>
                </View>

                {/* Thông tin khách hàng */}
                {!!item.address && (
                    <View style={styles.customerSection}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="person-outline" size={16} color="#555" />
                            <Text style={styles.sectionTitle}>  Người mua</Text>
                        </View>
                        <Text style={styles.customerText} numberOfLines={2}>{item.address}</Text>
                    </View>
                )}

                {/* Thông tin đơn / Sản phẩm */}
                <View style={styles.productsSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="cart-outline" size={16} color="#555" />
                        <Text style={styles.sectionTitle}>  Sản phẩm</Text>
                    </View>
                    
                    {item.items && item.items.map((prod, index) => (
                        <View key={index} style={styles.productRow}>
                            <Text style={styles.productQty}>{prod.quantity}x</Text>
                            <Text style={styles.productTitle} numberOfLines={2}>{prod.productTitle}</Text>
                            <Text style={styles.productPrice}>
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(prod.sum)}
                            </Text>
                        </View>
                    ))}
                    
                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalAmount}>{formattedAmount}</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Ionicons name="card-outline" size={16} color="#e67e22" />
                        <Text style={styles.paymentText}>  {PAYMENT_LABELS[item.paymentMethod] || item.paymentMethod}</Text>
                    </View>
                </View>

                {/* Nút cập nhật trạng thái */}
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => openUpdateModal(item)}
                >
                    <Ionicons name="create-outline" size={16} color="white" />
                    <Text style={styles.updateButtonText}>  Cập nhật trạng thái</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
            {/* Stats Vertical List */}
            <View style={styles.statsContainer}>
                <View style={styles.statRowMain}>
                    <Text style={styles.statMainLabel}>TỔNG SỐ ĐƠN HÀNG</Text>
                    <Text style={styles.statMainNumber}>{orders.length}</Text>
                </View>
                <View style={styles.statsGrid}>
                    {ORDER_STATUSES.map((s) => {
                        const count = orders.filter((o) => o.status === s.key).length;
                        return (
                            <View key={s.key} style={styles.statGridItem}>
                                <View style={styles.statGridLeft}>
                                    <Ionicons name={s.icon} size={18} color={s.color} />
                                    <Text style={[styles.statGridLabel, { color: s.color }]}>  {s.label}</Text>
                                </View>
                                <Text style={[styles.statGridNumber, { color: s.color }]}>{count}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderCard}
                contentContainerStyle={{ padding: 12 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                }
            />

            {/* Modal cập nhật trạng thái */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Cập nhật trạng thái đơn hàng</Text>
                        {selectedOrder && (
                            <Text style={styles.modalOrderId}>
                                Đơn #{selectedOrder.id.slice(-6).toUpperCase()}
                            </Text>
                        )}

                        {updatingStatus ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
                        ) : (
                            <View style={styles.statusOptions}>
                                {ORDER_STATUSES.map((s, index) => {
                                    const currentIdx = STATUS_INDEX[selectedOrder?.status] ?? 0;
                                    const isSelected = selectedOrder?.status === s.key;
                                    return (
                                        <TouchableOpacity
                                            key={s.key}
                                            style={[
                                                styles.statusOption,
                                                isSelected && { borderColor: s.color, backgroundColor: s.color + "15" },
                                            ]}
                                            onPress={() => updateStatus(s.key)}
                                        >
                                            <View style={[styles.statusOptionDot, { backgroundColor: s.color }]}>
                                                <Ionicons name={s.icon} size={16} color="white" />
                                            </View>
                                            <Text style={[styles.statusOptionLabel, isSelected && { color: s.color, fontWeight: "bold" }]}>
                                                {index + 1}. {s.label}
                                            </Text>
                                            {isSelected && (
                                                <Ionicons name="checkmark-circle" size={20} color={s.color} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}

                        <Pressable style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseBtnText}>Đóng</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export const AdminOrdersScreenOptions = (navData) => ({
    headerTitle: " Admin – Quản lý Đơn hàng",
    headerStyle: { backgroundColor: "#1a1a2e" },
    headerTintColor: "white",
    headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
                title="Menu"
                iconName="menu"
                onPress={() => navData.navigation.toggleDrawer()}
            />
        </HeaderButtons>
    ),
});

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f6fa",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: "#999",
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: "#aaa",
    },
    statsContainer: {
        backgroundColor: "#1a1a2e",
        padding: 16,
        paddingBottom: 20,
    },
    statRowMain: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.1)",
        paddingBottom: 10,
    },
    statMainLabel: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    statMainNumber: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },
    statsGrid: {
        flexDirection: "column",
    },
    statGridItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    statGridLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    statGridLabel: {
        fontSize: 14,
        fontWeight: "600",
    },
    statGridNumber: {
        fontSize: 16,
        fontWeight: "bold",
    },
    orderCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    orderIdBadge: {
        backgroundColor: "#1a1a2e",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    orderIdText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 13,
    },
    orderDate: {
        fontSize: 12,
        color: "#aaa",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        alignSelf: "flex-start",
        marginBottom: 12,
    },
    statusBadgeText: {
        fontSize: 13,
        fontWeight: "600",
    },
    customerSection: {
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    productsSection: {
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#444",
    },
    customerText: {
        fontSize: 13,
        color: "#555",
        lineHeight: 18,
    },
    productRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    productQty: {
        fontSize: 13,
        fontWeight: "bold",
        color: Colors.primary,
        width: 25,
    },
    productTitle: {
        flex: 1,
        fontSize: 13,
        color: "#333",
        paddingRight: 10,
    },
    productPrice: {
        fontSize: 13,
        color: "#666",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#e74c3c",
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    paymentText: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#e67e22",
    },
    updateButton: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
    },
    updateButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1a1a2e",
        textAlign: "center",
        marginBottom: 4,
    },
    modalOrderId: {
        fontSize: 13,
        color: "#888",
        textAlign: "center",
        marginBottom: 20,
    },
    statusOptions: {
        marginBottom: 16,
    },
    statusOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#eee",
        marginBottom: 10,
        backgroundColor: "#fafafa",
    },
    statusOptionDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    statusOptionLabel: {
        flex: 1,
        fontSize: 15,
        color: "#333",
    },
    modalCloseBtn: {
        paddingVertical: 14,
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#f0f0f0",
    },
    modalCloseBtnText: {
        color: "#555",
        fontSize: 15,
        fontWeight: "600",
    },
});

export default AdminOrdersScreen;
