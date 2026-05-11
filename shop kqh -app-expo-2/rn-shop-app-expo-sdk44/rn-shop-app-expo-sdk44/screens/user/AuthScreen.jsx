import React, { useState, useEffect, useRef } from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    Animated,
    Dimensions,
    StatusBar,
} from "react-native";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth.jsx";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const AuthScreen = (props) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("login");
    const [focusedField, setFocusedField] = useState(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const logoScale = useRef(new Animated.Value(0.85)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
            Animated.spring(logoScale, { toValue: 1, tension: 70, friction: 7, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        if (error) {
            Alert.alert("Thông báo", error, [{ text: "Đóng" }]);
        }
    }, [error]);

    const authHandler = async () => {
        setIsLoading(true);
        setError(null);
        if (email.trim().length === 0 || password.trim().length === 0) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu.");
            setIsLoading(false);
            return;
        }
        if (activeTab === "signup" && password.trim().length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            setIsLoading(false);
            return;
        }
        try {
            if (activeTab === "signup") {
                await dispatch(authActions.signup(email.trim().toLowerCase(), password));
            } else {
                await dispatch(authActions.login(email.trim().toLowerCase(), password));
            }
        } catch (err) {
            const code = err.code || "";
            if (code.includes("invalid-email")) setError("Địa chỉ email không hợp lệ.");
            else if (code.includes("user-not-found")) setError("Không tìm thấy tài khoản với email này.");
            else if (code.includes("wrong-password")) setError("Mật khẩu không chính xác. Vui lòng thử lại.");
            else if (code.includes("invalid-credential")) setError("Email hoặc mật khẩu không chính xác.");
            else if (code.includes("email-already-in-use")) setError("Email này đã được đăng ký.");
            else if (code.includes("too-many-requests")) setError("Đăng nhập sai quá nhiều lần. Chờ 1-2 phút.");
            else if (code.includes("network-request-failed")) setError("Lỗi kết nối mạng.");
            else setError(`Đã xảy ra lỗi: ${code || err.message}`);
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />
            <LinearGradient colors={["#F5F7FB", "#EEF0FF", "#F5F7FB"]} style={styles.background}>

                {/* Logo */}
                <Animated.View style={[styles.logoArea, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="storefront" size={36} color="#6C63FF" />
                    </View>
                    <Text style={styles.brandName}>KQH Shop</Text>
                    <Text style={styles.brandTagline}>Mua sắm thông minh, giá tốt mỗi ngày</Text>
                </Animated.View>

                {/* Form Card */}
                <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    {/* Tab Switcher */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === "login" && styles.activeTab]}
                            onPress={() => setActiveTab("login")}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === "signup" && styles.activeTab]}
                            onPress={() => setActiveTab("signup")}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tabText, activeTab === "signup" && styles.activeTabText]}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Email */}
                    <View style={[styles.inputWrapper, focusedField === "email" && styles.inputWrapperFocused]}>
                        <Ionicons name="mail-outline" size={18} color={focusedField === "email" ? "#6C63FF" : "#8A8A8A"} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Email của bạn"
                            placeholderTextColor="#B0B0B0"
                            value={email}
                            keyboardType="email-address"
                            onChangeText={setEmail}
                            style={styles.input}
                            autoCapitalize="none"
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                        />
                    </View>

                    {/* Password */}
                    <View style={[styles.inputWrapper, focusedField === "password" && styles.inputWrapperFocused]}>
                        <Ionicons name="lock-closed-outline" size={18} color={focusedField === "password" ? "#6C63FF" : "#8A8A8A"} style={styles.inputIcon} />
                        <TextInput
                            placeholder="Mật khẩu của bạn"
                            placeholderTextColor="#B0B0B0"
                            value={password}
                            onChangeText={setPassword}
                            style={[styles.input, { flex: 1 }]}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            onFocus={() => setFocusedField("password")}
                            onBlur={() => setFocusedField(null)}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#8A8A8A" />
                        </TouchableOpacity>
                    </View>

                    {/* Submit */}
                    {isLoading ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color="#6C63FF" />
                        </View>
                    ) : (
                        <TouchableOpacity onPress={authHandler} activeOpacity={0.85} style={styles.submitBtnWrapper}>
                            <LinearGradient colors={["#7B73FF", "#6C63FF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                                <Text style={styles.submitBtnText}>
                                    {activeTab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                                </Text>
                                <Ionicons name="arrow-forward" size={18} color="white" style={{ marginLeft: 8 }} />
                            </LinearGradient>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                <Animated.Text style={[styles.footerText, { opacity: fadeAnim }]}>
                    Phát triển bởi Triệu Bảo Khanh • Nguyễn Đức Quân • Vũ Đức Quang Huy
                </Animated.Text>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1, alignItems: "center", justifyContent: "center" },

    logoArea: {
        alignItems: "center",
        marginBottom: 32,
    },
    logoIcon: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: "#EEF0FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14,
        shadowColor: "#6C63FF",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 6,
    },
    brandName: {
        fontSize: 30,
        fontWeight: "800",
        color: "#1E1E1E",
        letterSpacing: 0.5,
    },
    brandTagline: {
        fontSize: 13,
        color: "#8A8A8A",
        marginTop: 5,
    },

    card: {
        width: "90%",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#6C63FF",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 24,
        elevation: 10,
    },

    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#F5F7FB",
        borderRadius: 14,
        padding: 4,
        marginBottom: 22,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOpacity: 0.07,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 3,
    },
    tabText: { color: "#8A8A8A", fontWeight: "600", fontSize: 14 },
    activeTabText: { color: "#6C63FF", fontWeight: "700" },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E8EAEF",
        marginBottom: 14,
        paddingHorizontal: 14,
    },
    inputWrapperFocused: {
        borderColor: "#6C63FF",
        backgroundColor: "#FAFBFF",
    },
    inputIcon: { marginRight: 10 },
    input: {
        flex: 1,
        color: "#1E1E1E",
        fontSize: 15,
        paddingVertical: 14,
    },
    eyeBtn: { padding: 4 },

    loadingBox: { alignItems: "center", paddingVertical: 20 },
    submitBtnWrapper: { marginTop: 6 },
    submitBtn: {
        borderRadius: 14,
        paddingVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    submitBtnText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.3,
    },

    footerText: {
        color: "#B0B0B0",
        fontSize: 11,
        textAlign: "center",
        marginTop: 28,
        paddingHorizontal: 24,
        lineHeight: 17,
    },
});

export default AuthScreen;
