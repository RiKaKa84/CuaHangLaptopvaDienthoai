import React from "react";
import { Button, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import {
    createDrawerNavigator,
    DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../store/actions/auth";
import { auth } from "../store/actions/auth";

import ProductsOverviewScreen, {
    ProductsOverviewScreenOptions,
} from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen, {
    ProductDetailsCreenOptions,
} from "../screens/shop/ProductDetailScreen";
import UserProductsScreen, {
    UserProductScreenOptions,
} from "../screens/user/UserProductsScreen";
import EditProductScreen, {
    EditProductScreenOptions,
} from "../screens/user/EditProductScreen";
import CartScreen, { CartCreenOptions } from "../screens/shop/CartScreen";
import CheckoutScreen, { CheckoutScreenOptions } from "../screens/shop/CheckoutScreen";
import AuthScreen from "../screens/user/AuthScreen";
import OrderScreen, { OrderScreenOptions } from "../screens/shop/OrderScreen";
import AdminOrdersScreen, { AdminOrdersScreenOptions } from "../screens/admin/AdminOrdersScreen";
import AdminUsersScreen, { AdminUsersScreenOptions } from "../screens/admin/AdminUsersScreen";
import CustomButton from "../components/UI/CustomButton";
import Colors from "../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/UI/HeaderButton";
import UserProfileScreen, { UserProfileScreenOptions } from "../screens/user/UserProfileScreen";

const ProductsStackNavigator = createStackNavigator();
const OrdersStackNavigator = createStackNavigator();
const AdminStackNavigator = createStackNavigator();
const ShopDrawerNavigator = createDrawerNavigator();
const AdminDrawerNavigator = createDrawerNavigator();
const AuthStackNavigator = createStackNavigator();
const ProfileStackNavigator = createStackNavigator();

export const ProfileNavigator = () => {
    return (
        <ProfileStackNavigator.Navigator>
            <ProfileStackNavigator.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={UserProfileScreenOptions}
            />
        </ProfileStackNavigator.Navigator>
    );
};

export const ProductsNavigator = () => {
    return (
        <ProductsStackNavigator.Navigator>
            <ProductsStackNavigator.Screen
                name="Home"
                component={ProductsOverviewScreen}
                options={ProductsOverviewScreenOptions}
            />
            <ProductsStackNavigator.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={ProductDetailsCreenOptions}
            />
            <ProductsStackNavigator.Screen
                name="Cart"
                component={CartScreen}
                options={CartCreenOptions}
            />
            <ProductsStackNavigator.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={CheckoutScreenOptions}
            />
        </ProductsStackNavigator.Navigator>
    );
};

const CartDrawerStackNavigator = createStackNavigator();
const CartDrawerNavigator = () => {
    return (
        <CartDrawerStackNavigator.Navigator>
            <CartDrawerStackNavigator.Screen
                name="CartScreenDrawer"
                component={CartScreen}
                options={(navData) => {
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
                        headerLeft: () => (
                            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                                <Item
                                    title="drawerMenu"
                                    iconName="menu-outline"
                                    onPress={() => navData.navigation.toggleDrawer()}
                                />
                            </HeaderButtons>
                        ),
                    };
                }}
            />
            <CartDrawerStackNavigator.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={CheckoutScreenOptions}
            />
        </CartDrawerStackNavigator.Navigator>
    );
};

export const OrdersNavigator = () => {
    return (
        <OrdersStackNavigator.Navigator>
            <OrdersStackNavigator.Screen
                name="Order"
                component={OrderScreen}
                options={OrderScreenOptions}
            />
        </OrdersStackNavigator.Navigator>
    );
};

export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator>
            <AuthStackNavigator.Screen
                name="Auth"
                options={{ headerShown: false }}
                component={AuthScreen}
            />
        </AuthStackNavigator.Navigator>
    );
};

// Custom Drawer Content - Shop
const ShopDrawerContent = (props) => {
    const dispatch = useDispatch();
    const currentEmail = auth?.currentUser?.email || "";

    return (
        <SafeAreaView style={drawerStyles.container} forceInset={{ top: "always", horizontal: "never" }}>
            {/* Profile Section */}
            <View style={drawerStyles.profileSection}>
                <View style={drawerStyles.avatarWrap}>
                    <Ionicons name="person" size={28} color="#6C63FF" />
                </View>
                <View>
                    <Text style={drawerStyles.greetText}>Xin chào 👋</Text>
                    <Text style={drawerStyles.emailText} numberOfLines={1}>{currentEmail || "Khách hàng"}</Text>
                </View>
            </View>

            <View style={drawerStyles.divider} />

            {/* Menu Items */}
            <DrawerItemList {...props} />

            <View style={drawerStyles.footer}>
                <TouchableOpacity
                    onPress={() => dispatch(authActions.logout())}
                    style={drawerStyles.logoutBtn}
                    activeOpacity={0.8}
                >
                    <Ionicons name="log-out-outline" size={18} color="#FF4757" style={{ marginRight: 8 }} />
                    <Text style={drawerStyles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Custom Drawer Content - Admin
const AdminDrawerContent = (props) => {
    const dispatch = useDispatch();
    return (
        <SafeAreaView style={drawerStyles.container} forceInset={{ top: "always", horizontal: "never" }}>
            <View style={[drawerStyles.profileSection, { backgroundColor: "#1A1A2E" }]}>
                <View style={[drawerStyles.avatarWrap, { backgroundColor: "rgba(108,99,255,0.3)" }]}>
                    <Ionicons name="shield-checkmark" size={26} color="#6C63FF" />
                </View>
                <View>
                    <Text style={[drawerStyles.greetText, { color: "#FFF" }]}>⚙️ Admin Panel</Text>
                    <Text style={[drawerStyles.emailText, { color: "#8A8A8A" }]}>trieubaokhanh2005@gmail.com</Text>
                </View>
            </View>

            <View style={drawerStyles.divider} />
            <DrawerItemList {...props} />

            <View style={drawerStyles.footer}>
                <TouchableOpacity
                    onPress={() => dispatch(authActions.logout())}
                    style={drawerStyles.logoutBtn}
                    activeOpacity={0.8}
                >
                    <Ionicons name="log-out-outline" size={18} color="#FF4757" style={{ marginRight: 8 }} />
                    <Text style={drawerStyles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const drawerStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        paddingTop: 24,
        backgroundColor: "#FAFBFF",
        gap: 14,
    },
    avatarWrap: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: "#EEF0FF",
        justifyContent: "center",
        alignItems: "center",
    },
    greetText: {
        fontSize: 13,
        color: "#8A8A8A",
        fontWeight: "500",
        marginBottom: 2,
    },
    emailText: {
        fontSize: 14,
        color: "#1E1E1E",
        fontWeight: "700",
        maxWidth: 180,
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F8",
        marginHorizontal: 16,
        marginBottom: 8,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 20,
        right: 20,
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF0F0",
        borderWidth: 1,
        borderColor: "#FFD8D8",
        borderRadius: 14,
        paddingVertical: 13,
    },
    logoutText: {
        color: "#FF4757",
        fontWeight: "700",
        fontSize: 15,
    },
});

// Drawer screen options helper
const drawerScreenOptions = {
    drawerActiveTintColor: "#6C63FF",
    drawerInactiveTintColor: "#4B4B4B",
    drawerActiveBackgroundColor: "#EEF0FF",
    drawerStyle: {
        width: 280,
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
    },
    drawerLabelStyle: {
        fontWeight: "600",
        fontSize: 14,
        marginLeft: -8,
    },
    drawerItemStyle: {
        borderRadius: 12,
        marginHorizontal: 8,
        marginVertical: 2,
    },
};

// Admin Navigator (Drawer riêng cho Admin)
export const AdminNavigator = () => {
    return (
        <AdminDrawerNavigator.Navigator
            drawerContent={(props) => <AdminDrawerContent {...props} />}
            screenOptions={{ headerShown: false, ...drawerScreenOptions }}
        >
            <AdminDrawerNavigator.Screen
                name="AdminOrders"
                component={AdminOrdersNavigatorStack}
                options={{
                    title: "Quản lý Đơn hàng",
                    drawerIcon: ({ color }) => <Ionicons name="receipt-outline" size={20} color={color} />,
                }}
            />
            <AdminDrawerNavigator.Screen
                name="AdminProducts"
                component={AdminProductsNavigatorStack}
                options={{
                    title: "Quản lý Sản phẩm",
                    drawerIcon: ({ color }) => <Ionicons name="cube-outline" size={20} color={color} />,
                }}
            />
            <AdminDrawerNavigator.Screen
                name="AdminUsers"
                component={AdminUsersNavigatorStack}
                options={{
                    title: "Quản lý Tài khoản",
                    drawerIcon: ({ color }) => <Ionicons name="people-outline" size={20} color={color} />,
                }}
            />
        </AdminDrawerNavigator.Navigator>
    );
};

const AdminOrdersStack = createStackNavigator();
const AdminOrdersNavigatorStack = () => (
    <AdminOrdersStack.Navigator>
        <AdminOrdersStack.Screen
            name="AdminOrdersList"
            component={AdminOrdersScreen}
            options={AdminOrdersScreenOptions}
        />
    </AdminOrdersStack.Navigator>
);

const AdminProductsStack = createStackNavigator();
const AdminProductsNavigatorStack = () => (
    <AdminProductsStack.Navigator>
        <AdminProductsStack.Screen
            name="AdminProductsList"
            component={UserProductsScreen}
            options={UserProductScreenOptions}
        />
        <AdminProductsStack.Screen
            name="EditProduct"
            component={EditProductScreen}
            options={EditProductScreenOptions}
        />
    </AdminProductsStack.Navigator>
);

const AdminUsersStack = createStackNavigator();
const AdminUsersNavigatorStack = () => (
    <AdminUsersStack.Navigator>
        <AdminUsersStack.Screen
            name="AdminUsersList"
            component={AdminUsersScreen}
            options={AdminUsersScreenOptions}
        />
    </AdminUsersStack.Navigator>
);

export const ShopNavigator = () => {
    return (
        <ShopDrawerNavigator.Navigator
            drawerContent={(props) => <ShopDrawerContent {...props} />}
            screenOptions={{ headerShown: false, ...drawerScreenOptions }}
        >
            <ShopDrawerNavigator.Screen
                name="Products"
                component={ProductsNavigator}
                options={{
                    title: "Trang chủ",
                    drawerIcon: ({ color }) => <Ionicons name="home-outline" size={20} color={color} />,
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Orders"
                component={OrdersNavigator}
                options={{
                    title: "Đơn hàng của tôi",
                    drawerIcon: ({ color }) => <Ionicons name="receipt-outline" size={20} color={color} />,
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Giỏ hàng đã thêm"
                component={CartDrawerNavigator}
                options={{
                    title: "Giỏ hàng",
                    drawerIcon: ({ color }) => <Ionicons name="cart-outline" size={20} color={color} />,
                }}
            />
            <ShopDrawerNavigator.Screen
                name="Tài khoản của tôi"
                component={ProfileNavigator}
                options={{
                    title: "Tài khoản",
                    drawerIcon: ({ color }) => <Ionicons name="person-outline" size={20} color={color} />,
                }}
            />
        </ShopDrawerNavigator.Navigator>
    );
};
