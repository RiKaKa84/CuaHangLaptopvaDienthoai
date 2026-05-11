import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import * as cartActions from "../../store/actions/cart";

const CartScreen = (props) => {
    const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
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
    cartItems.sort((a, b) => (a.productId > b.productId ? 1 : -1));

    const dispatch = useDispatch();
    const formattedTotalAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(Math.abs(cartTotalAmount));

    const isEmpty = cartItems.length === 0;

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />

            {isEmpty ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="cart-outline" size={46} color="#B0B0B0" />
                    </View>
                    <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
                    <Text style={styles.emptySubtitle}>Thêm sản phẩm vào giỏ để tiến hành thanh toán</Text>
                    <TouchableOpacity
                        style={styles.shopBtn}
                        onPress={() => props.navigation.navigate("Products", { screen: "Home" })}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.shopBtnText}>🛍️ Tiếp tục mua sắm</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item.productId}
                        contentContainerStyle={styles.listContent}
                        ListHeaderComponent={
                            <Text style={styles.listHeader}>{cartItems.length} sản phẩm trong giỏ</Text>
                        }
                        renderItem={(itemData) => (
                            <CartItem
                                quantity={itemData.item.quantity}
                                title={itemData.item.productTitle}
                                amount={itemData.item.sum}
                                showDelete={true}
                                onAdd={() => dispatch(cartActions.addToCart({
                                    id: itemData.item.productId,
                                    title: itemData.item.productTitle,
                                    price: itemData.item.productPrice,
                                }))}
                                onRemove={() => dispatch(cartActions.removeFromCart(itemData.item.productId))}
                                onDelete={() => dispatch(cartActions.deleteFromCart(itemData.item.productId))}
                            />
                        )}
                    />

                    {/* Summary Bar */}
                    <View style={styles.summaryBar}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tổng cộng</Text>
                            <Text style={styles.totalAmount}>{formattedTotalAmount}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => props.navigation.navigate("Checkout")}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={["#7B73FF", "#6C63FF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.checkoutBtn}
                            >
                                <Text style={styles.checkoutText}>Đặt hàng ngay</Text>
                                <Ionicons name="arrow-forward" size={17} color="white" style={{ marginLeft: 8 }} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

export const CartCreenOptions = (props) => {
    return {
        headerStyle: {
            backgroundColor: "#FFFFFF",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F8",
        },
        headerTintColor: "#1E1E1E",
        headerTitle: "Giỏ hàng",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },
    // Empty state
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    emptyIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F0F0F8",
    },
    emptyTitle: {
        color: "#1E1E1E",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#8A8A8A",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 21,
        marginBottom: 28,
    },
    shopBtn: {
        backgroundColor: "#6C63FF",
        paddingVertical: 13,
        paddingHorizontal: 28,
        borderRadius: 14,
    },
    shopBtnText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 15,
    },

    // List
    listContent: {
        paddingTop: 8,
        paddingBottom: 170,
    },
    listHeader: {
        color: "#8A8A8A",
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    // Summary bar
    summaryBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F8",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: -4 },
        shadowRadius: 12,
        elevation: 16,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    totalLabel: {
        color: "#8A8A8A",
        fontSize: 14,
        fontWeight: "600",
    },
    totalAmount: {
        color: "#FF4D4F",
        fontSize: 20,
        fontWeight: "700",
    },
    checkoutBtn: {
        flexDirection: "row",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    checkoutText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },
});

export default CartScreen;
