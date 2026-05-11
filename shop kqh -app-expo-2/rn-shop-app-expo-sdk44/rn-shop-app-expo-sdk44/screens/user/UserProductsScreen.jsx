import React from "react";
import { FlatList, Alert, View, Text, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import * as productsActions from "../../store/actions/products";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";

const UserProductsScreen = (props) => {
    const userProducts = useSelector((state) => state.products.userProducts);
    const dispatch = useDispatch();

    const deleteHandler = (id) => {
        Alert.alert("Cảnh báo", "Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                style: "destructive",
                onPress: () => {
                    dispatch(productsActions.deleteProduct(id));
                },
            },
        ]);
    };

    const editHandler = (id) => {
        props.navigation.navigate("EditProduct", { prodId: id });
    };

    const renderProductCard = (itemData) => {
        const product = itemData.item;
        const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

        return (
            <View style={styles.productCard}>
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                    <View style={styles.productMeta}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{product.category ? product.category.toUpperCase() : "CHUNG"}</Text>
                        </View>
                    </View>
                    <Text style={styles.productPrice}>{formattedPrice}</Text>
                </View>
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => editHandler(product.id)} style={styles.actionBtn}>
                        <Ionicons name="pencil" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteHandler(product.id)} style={[styles.actionBtn, styles.deleteBtn]}>
                        <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const totalValue = userProducts.reduce((sum, item) => sum + Number(item.price), 0);
    const formattedTotalValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalValue);

    return (
        <View style={styles.container}>
            {/* Tóm tắt Dashboard */}
            <View style={styles.dashboardHeader}>
                <View style={styles.statBox}>
                    <Ionicons name="cube" size={24} color={Colors.primary} />
                    <Text style={styles.statValue}>{userProducts.length}</Text>
                    <Text style={styles.statLabel}>Sản phẩm</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                    <Ionicons name="cash" size={24} color="#2ecc71" />
                    <Text style={[styles.statValue, { color: "#2ecc71", fontSize: 18 }]}>{formattedTotalValue}</Text>
                    <Text style={styles.statLabel}>Tổng giá trị</Text>
                </View>
            </View>

            {userProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="folder-open-outline" size={80} color="#ddd" />
                    <Text style={styles.emptyTitle}>Kho hàng trống</Text>
                    <Text style={styles.emptyText}>Chưa có sản phẩm nào trong cửa hàng. Hãy thêm ngay sản phẩm đầu tiên của bạn!</Text>
                </View>
            ) : (
                <FlatList
                    data={userProducts}
                    keyExtractor={(item) => item.id}
                    renderItem={renderProductCard}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {/* Nút thêm mới nổi (Floating Action Button) */}
            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => props.navigation.navigate("EditProduct", { prodId: -1 })}
            >
                <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
};

export const UserProductScreenOptions = (props) => {
    return {
        headerStyle: {
            backgroundColor: "#1a1a2e", // Màu tối chuyên nghiệp như màn AdminOrders
            elevation: 0,
            shadowOpacity: 0,
        },
        headerTintColor: "#ffffff",
        title: "📦 Quản Lý Kho",
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Menu"
                    iconName="menu"
                    onPress={() => {
                        props.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Thêm"
                    iconName="add-circle-outline"
                    onPress={() => {
                        props.navigation.navigate("EditProduct", {
                            prodId: -1,
                        });
                    }}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6F9",
    },
    // Dashboard Stats
    dashboardHeader: {
        flexDirection: 'row',
        backgroundColor: "white",
        margin: 15,
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: "#E0E6ED",
        marginVertical: 5,
    },
    statValue: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2C3E50",
        marginTop: 8,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: "#7F8C8D",
        textTransform: "uppercase",
        fontWeight: "600",
    },
    // List & Cards
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 100, // Make room for FAB
    },
    productCard: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 2,
        alignItems: "center",
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 12,
        backgroundColor: "#F8F9FA",
        borderWidth: 1,
        borderColor: "#F1F3F5",
    },
    productInfo: {
        flex: 1,
        marginLeft: 15,
        justifyContent: "center",
    },
    productTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#2C3E50",
        marginBottom: 4,
    },
    productMeta: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    badge: {
        backgroundColor: "#E8F4F8",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        color: Colors.primary,
        fontWeight: "800",
    },
    productPrice: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#E74C3C",
    },
    actionsContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        height: 70,
        paddingLeft: 10,
        borderLeftWidth: 1,
        borderLeftColor: "#F1F3F5",
        marginLeft: 5,
    },
    actionBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#F0F4F8",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteBtn: {
        backgroundColor: "#FDECEA",
    },
    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 30,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#34495E",
        marginTop: 15,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 15,
        color: "#7F8C8D",
        textAlign: "center",
        lineHeight: 22,
    },
    // FAB
    fab: {
        position: "absolute",
        bottom: 25,
        right: 20,
        backgroundColor: Colors.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: Colors.primary,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 6,
    }
});

export default UserProductsScreen;
