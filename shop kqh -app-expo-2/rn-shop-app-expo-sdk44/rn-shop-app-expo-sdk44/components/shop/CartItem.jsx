import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const CartItem = (props) => {
    const formattedAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(props.amount);

    return (
        <View style={styles.cartItem}>
            {/* Product Icon */}
            <View style={styles.iconBox}>
                <Ionicons name="cube-outline" size={20} color={Colors.primary} />
            </View>

            {/* Info */}
            <View style={styles.itemData}>
                <Text style={styles.title} numberOfLines={2}>{props.title}</Text>
                <Text style={styles.price}>{formattedAmount}</Text>
            </View>

            {/* Qty + Delete */}
            <View style={styles.rightSection}>
                <View style={styles.qtyContainer}>
                    <TouchableOpacity onPress={props.onRemove} style={styles.qtyBtn}>
                        <Ionicons name="remove" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qty}>{props.quantity}</Text>
                    <TouchableOpacity onPress={props.onAdd} style={styles.qtyBtn}>
                        <Ionicons name="add" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {props.showDelete && (
                    <TouchableOpacity onPress={props.onDelete} style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={16} color={Colors.accent} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        marginHorizontal: 14,
        marginVertical: 5,
        borderRadius: 16,
        padding: 14,
        shadowColor: "#6C63FF",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: "#F0F0F8",
    },
    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#EEF0FF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    itemData: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1E1E1E",
        marginBottom: 4,
        lineHeight: 19,
    },
    price: {
        fontSize: 14,
        fontWeight: "700",
        color: "#FF4D4F",
    },
    rightSection: {
        alignItems: "flex-end",
        gap: 8,
    },
    qtyContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#E8EAEF",
        paddingHorizontal: 3,
        paddingVertical: 2,
    },
    qtyBtn: {
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
    },
    qty: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E1E1E",
        marginHorizontal: 8,
        minWidth: 16,
        textAlign: "center",
    },
    deleteBtn: {
        width: 30,
        height: 30,
        borderRadius: 8,
        backgroundColor: "#FFF0F0",
        borderWidth: 1,
        borderColor: "#FFD8D8",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default CartItem;
