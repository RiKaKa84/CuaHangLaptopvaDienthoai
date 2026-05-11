import React, { useEffect, useState } from "react";
import {
    FlatList,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import OrderItem from "../../components/shop/OrderItem";
import * as orderActions from "../../store/actions/orders";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";

const OrderScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(orderActions.fetchOrders())
            .then(() => setIsLoading(false))
            .catch(() => setIsLoading(false));
    }, [dispatch]);

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
                <View style={styles.emptyIcon}>
                    <Ionicons name="receipt-outline" size={40} color="#B0B0B0" />
                </View>
                <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
                <Text style={styles.emptySubtitle}>Hãy mua sắm và đặt hàng để xem lịch sử đơn hàng</Text>
                <TouchableOpacity
                    style={styles.shopBtn}
                    onPress={() => props.navigation.navigate("Products")}
                >
                    <Text style={styles.shopBtnText}>🛍️ Mua sắm ngay</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
                <Text style={styles.listHeader}>{orders.length} đơn hàng</Text>
            }
            renderItem={(itemData) => (
                <OrderItem
                    amount={itemData.item.totalAmount}
                    date={itemData.item.readableDate}
                    items={itemData.item.items}
                    address={itemData.item.address}
                    paymentMethod={itemData.item.paymentMethod}
                    status={itemData.item.status}
                    onDelete={() => dispatch(orderActions.deleteOrder(itemData.item.id))}
                />
            )}
        />
    );
};

export const OrderScreenOptions = (props) => {
    return {
        headerStyle: {
            backgroundColor: "#FFFFFF",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F8",
        },
        headerTintColor: "#1E1E1E",
        headerTitle: "Đơn hàng của tôi",
        headerTitleStyle: { fontWeight: "700", fontSize: 17 },
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="drawerMenu"
                    iconName="menu-outline"
                    onPress={() => props.navigation.toggleDrawer()}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
        paddingHorizontal: 30,
    },
    loadingText: {
        color: "#8A8A8A",
        marginTop: 12,
        fontSize: 14,
    },
    emptyIcon: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F0F0F8",
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1E1E1E",
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#8A8A8A",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    shopBtn: {
        backgroundColor: "#6C63FF",
        paddingVertical: 12,
        paddingHorizontal: 26,
        borderRadius: 13,
    },
    shopBtnText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 14,
    },
    listContent: {
        paddingBottom: 24,
        backgroundColor: "#F5F7FB",
    },
    listHeader: {
        color: "#8A8A8A",
        fontSize: 12,
        fontWeight: "600",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
});

export default OrderScreen;
