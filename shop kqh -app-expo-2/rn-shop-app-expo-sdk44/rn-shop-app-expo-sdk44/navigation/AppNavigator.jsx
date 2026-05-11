import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { ShopNavigator, AuthNavigator, AdminNavigator } from "./ShopNavigator";
import * as authActions from "../store/actions/auth";
import Colors from "../constants/Colors";

const AppNavigator = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector((state) => !!state.auth.token);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

    useEffect(() => {
        // Gọi listener và lưu hàm unsubscribe để cleanup khi app tắt
        const unsubscribe = dispatch(authActions.listenToAuthChanges());
        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, [dispatch]);

    // Chờ Firebase kiểm tra session → hiện loading
    if (!didTryAutoLogin) {
        return (
            <View style={styles.splash}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {!isAuth && <AuthNavigator />}
            {isAuth && isAdmin && <AdminNavigator />}
            {isAuth && !isAdmin && <ShopNavigator />}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});

export default AppNavigator;
