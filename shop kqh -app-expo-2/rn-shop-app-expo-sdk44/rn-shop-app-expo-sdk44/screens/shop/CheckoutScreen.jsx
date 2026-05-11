import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import * as orderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

// Thông tin tài khoản ngân hàng để tạo QR
const BANK_ID = "BIDV";
const ACCOUNT_NO = "3711776104";
const ACCOUNT_NAME = "TRIEU BAO KHANH";

const STATUSES = [
    { key: "warehouse", label: "Nhập kho sản phẩm", icon: "cube-outline" },
    { key: "packing", label: "Chuẩn bị đóng hộp", icon: "archive-outline" },
    { key: "shipping", label: "Đang giao hàng", icon: "bicycle-outline" },
    { key: "delivered", label: "Đã nhận hàng", icon: "checkmark-circle-outline" },
];

const CheckoutScreen = (props) => {
    const dispatch = useDispatch();
    const cartItemsMap = useSelector((state) => state.cart.items);
    const cartItems = [];
    for (const key in cartItemsMap) {
        cartItems.push({
            productId: key,
            productTitle: cartItemsMap[key].productTitle,
            productPrice: cartItemsMap[key].productPrice,
            quantity: cartItemsMap[key].quantity,
            sum: cartItemsMap[key].sum,
        });
    }
    const totalAmount = useSelector((state) => state.cart.totalAmount);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD"); // 'COD' | 'QR'
    const [isLoading, setIsLoading] = useState(false);

    const formattedTotal = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(Math.abs(totalAmount));

    // Tạo URL QR code VietQR
    const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact2.png?amount=${Math.round(
        totalAmount
    )}&addInfo=Thanh toan don hang KQH Shop&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

    const confirmOrderHandler = async () => {
        if (!name.trim() || !phone.trim() || !address.trim()) {
            Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ giao hàng.", [{ text: "Đóng" }]);
            return;
        }
        if (phone.trim().length < 9) {
            Alert.alert("Số điện thoại không hợp lệ", "Vui lòng nhập số điện thoại hợp lệ.", [{ text: "Đóng" }]);
            return;
        }

        const fullAddress = `${name.trim()} - ${phone.trim()} - ${address.trim()}`;

        setIsLoading(true);
        try {
            await dispatch(
                orderActions.addOrder(cartItems, totalAmount, fullAddress, paymentMethod)
            );
            Alert.alert(
                "Đặt hàng thành công! 🎉",
                paymentMethod === "QR"
                    ? "Cảm ơn bạn đã thanh toán qua Mã QR. Đơn hàng của bạn đang được xử lý!"
                    : "Đơn hàng của bạn đã được ghi nhận. Vui lòng chuẩn bị tiền khi nhận hàng!",
                [
                    {
                        text: "Xem đơn hàng",
                        onPress: () => props.navigation.navigate("Orders", { screen: "Order" }),
                    },
                ]
            );
        } catch (err) {
            Alert.alert("Lỗi", "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", [{ text: "Đóng" }]);
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#f5f6fa" }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header tóm tắt đơn hàng */}
                <View style={styles.orderSummaryCard}>
                    <Text style={styles.sectionTitle}>🛒 Tóm tắt đơn hàng</Text>
                    {cartItems.map((item) => (
                        <View key={item.productId} style={styles.cartItemRow}>
                            <Text style={styles.cartItemTitle} numberOfLines={1}>{item.productTitle}</Text>
                            <Text style={styles.cartItemQty}>x{item.quantity}</Text>
                            <Text style={styles.cartItemSum}>
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.sum)}
                            </Text>
                        </View>
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Tổng cộng:</Text>
                        <Text style={styles.totalAmount}>{formattedTotal}</Text>
                    </View>
                </View>

                {/* Form địa chỉ giao hàng */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📍 Thông tin giao hàng</Text>

                    <Text style={styles.label}>Họ và tên người nhận *</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nhập họ và tên"
                        placeholderTextColor="#aaa"
                    />

                    <Text style={styles.label}>Số điện thoại *</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="VD: 0912345678"
                        placeholderTextColor="#aaa"
                        keyboardType="phone-pad"
                    />

                    <Text style={styles.label}>Địa chỉ giao hàng *</Text>
                    <TextInput
                        style={[styles.input, styles.inputMultiline]}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                        placeholderTextColor="#aaa"
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Chọn phương thức thanh toán */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            paymentMethod === "COD" && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setPaymentMethod("COD")}
                    >
                        <Ionicons
                            name="cash-outline"
                            size={26}
                            color={paymentMethod === "COD" ? Colors.primary : "#888"}
                        />
                        <View style={styles.paymentTextContainer}>
                            <Text style={[styles.paymentTitle, paymentMethod === "COD" && styles.paymentTitleSelected]}>
                                Nhận hàng rồi thanh toán
                            </Text>
                            <Text style={styles.paymentSubtitle}>Thanh toán bằng tiền mặt khi nhận hàng</Text>
                        </View>
                        {paymentMethod === "COD" && (
                            <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            paymentMethod === "QR" && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setPaymentMethod("QR")}
                    >
                        <Ionicons
                            name="qr-code-outline"
                            size={26}
                            color={paymentMethod === "QR" ? Colors.primary : "#888"}
                        />
                        <View style={styles.paymentTextContainer}>
                            <Text style={[styles.paymentTitle, paymentMethod === "QR" && styles.paymentTitleSelected]}>
                                Thanh toán ngay bằng Mã QR
                            </Text>
                            <Text style={styles.paymentSubtitle}>Quét mã VietQR để thanh toán nhanh</Text>
                        </View>
                        {paymentMethod === "QR" && (
                            <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                        )}
                    </TouchableOpacity>

                    {/* Hiển thị QR nếu chọn QR */}
                    {paymentMethod === "QR" && (
                        <View style={styles.qrContainer}>
                            <Text style={styles.qrTitle}>Quét mã để thanh toán {formattedTotal}</Text>
                            <Image
                                source={{ uri: qrUrl }}
                                style={styles.qrImage}
                                resizeMode="contain"
                            />
                            <View style={styles.bankInfoBox}>
                                <Text style={styles.bankInfoText}>🏦 BIDV – CN Yên Bái</Text>
                                <Text style={styles.bankInfoText}>📋 STK: 3711776104</Text>
                                <Text style={styles.bankInfoText}>👤 TRIEU BAO KHANH</Text>
                            </View>
                            <Text style={styles.qrNote}>
                                * Sau khi quét và chuyển khoản thành công, hãy ấn "Xác nhận đặt hàng" để hoàn tất.
                            </Text>
                        </View>
                    )}
                </View>

                {/* Nút xác nhận */}
                {isLoading ? (
                    <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
                ) : (
                    <TouchableOpacity
                        style={[styles.confirmButton, cartItems.length === 0 && { opacity: 0.5 }]}
                        onPress={confirmOrderHandler}
                        disabled={cartItems.length === 0}
                    >
                        <Ionicons name="checkmark-done-outline" size={20} color="white" />
                        <Text style={styles.confirmButtonText}>  Xác nhận đặt hàng</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const CheckoutScreenOptions = {
    headerTitle: "Xác nhận đặt hàng",
    headerStyle: { backgroundColor: Colors.primary },
    headerTintColor: "white",
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    orderSummaryCard: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 12,
    },
    cartItemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    cartItemTitle: {
        flex: 1,
        fontSize: 14,
        color: "#444",
    },
    cartItemQty: {
        fontSize: 14,
        color: "#888",
        marginHorizontal: 8,
    },
    cartItemSum: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.primary,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        backgroundColor: "#fafafa",
        color: "#333",
    },
    inputMultiline: {
        height: 80,
        textAlignVertical: "top",
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        backgroundColor: "#fafafa",
    },
    paymentOptionSelected: {
        borderColor: Colors.primary,
        backgroundColor: "#f0f8ff",
    },
    paymentTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    paymentTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#444",
    },
    paymentTitleSelected: {
        color: Colors.primary,
    },
    paymentSubtitle: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    qrContainer: {
        alignItems: "center",
        marginTop: 16,
        padding: 16,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    qrTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: Colors.primary,
        marginBottom: 12,
        textAlign: "center",
    },
    qrImage: {
        width: 240,
        height: 240,
    },
    bankInfoBox: {
        marginTop: 12,
        padding: 12,
        backgroundColor: "#fff",
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
    },
    bankInfoText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 4,
        fontWeight: "500",
    },
    qrNote: {
        fontSize: 12,
        color: "#888",
        textAlign: "center",
        marginTop: 10,
        fontStyle: "italic",
    },
    confirmButton: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        marginTop: 8,
        elevation: 4,
        shadowColor: Colors.primary,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
    },
});

export default CheckoutScreen;
