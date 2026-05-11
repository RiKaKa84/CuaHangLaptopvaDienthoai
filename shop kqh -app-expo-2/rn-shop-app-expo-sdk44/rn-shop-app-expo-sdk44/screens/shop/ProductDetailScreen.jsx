import React from "react";
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cart";
import ImageMapper from "../../utils/ImageMapper";

const PolicyRow = ({ icon, color, bgColor, text }) => (
    <View style={styles.policyRow}>
        <View style={[styles.policyIcon, { backgroundColor: bgColor }]}>
            <Ionicons name={icon} size={15} color={color} />
        </View>
        <Text style={styles.policyText}>{text}</Text>
    </View>
);

const ProductDetailScreen = (props) => {
    const { productId } = props.route.params;
    const selectedProduct = useSelector((state) =>
        state.products.availableProducts.find((prod) => prod.id === productId)
    );
    const dispatch = useDispatch();

    // Guard: product bị xóa hoặc ID không hợp lệ
    if (!selectedProduct) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const imageSource = ImageMapper[selectedProduct.imageUrl]
        ? ImageMapper[selectedProduct.imageUrl]
        : { uri: selectedProduct.imageUrl };
    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(selectedProduct.price);

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Image */}
                <View style={styles.imageSection}>
                    <Image style={styles.image} source={imageSource} resizeMode="contain" />

                    <View style={styles.badgeRow}>
                        <View style={styles.badge}>
                            <Ionicons name="checkmark-circle" size={13} color="#6C63FF" />
                            <Text style={styles.badgeText}> Mới 100%</Text>
                        </View>
                        <View style={[styles.badge, { backgroundColor: "#FFF0F0" }]}>
                            <Ionicons name="shield-checkmark" size={13} color="#FF6B6B" />
                            <Text style={[styles.badgeText, { color: "#FF6B6B" }]}> Nguyên seal</Text>
                        </View>
                    </View>
                </View>

                {/* Main info */}
                <View style={styles.infoCard}>
                    <Text style={styles.title}>{selectedProduct.title}</Text>

                    <View style={styles.ratingRow}>
                        {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={13} color="#FFB300" />)}
                        <Text style={styles.ratingNum}> 4.8</Text>
                        <Text style={styles.ratingMeta}>  (128 đánh giá)  •  Đã bán 350</Text>
                    </View>

                    <Text style={styles.price}>{formattedPrice}</Text>
                </View>

                {/* Policies */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông tin sản phẩm</Text>
                    <PolicyRow icon="checkmark-circle-outline" color="#2ED573" bgColor="#EDFFF5" text="Tình trạng: Mới 100% Nguyên Seal" />
                    <PolicyRow icon="shield-checkmark-outline" color="#6C63FF" bgColor="#EEF0FF" text="Bảo hành: Chính hãng 24 tháng" />
                    <PolicyRow icon="car-outline" color="#1B9CFC" bgColor="#E8F4FF" text="Vận chuyển: Miễn phí toàn quốc" />
                    <PolicyRow icon="refresh-outline" color="#FF6B6B" bgColor="#FFF0F0" text="Đổi trả: 30 ngày nếu lỗi NSX" />
                </View>

                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Đặc điểm nổi bật</Text>
                    <Text style={styles.description}>{selectedProduct.description}</Text>
                </View>

                <View style={{ height: 90 }} />
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.addCartBtn}
                    onPress={() => {
                        dispatch(cartActions.addToCart(selectedProduct));
                        Alert.alert("Thành công", "Đã thêm vào giỏ hàng! 🛒", [{ text: "OK" }]);
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="cart-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.addCartText}>Thêm giỏ hàng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        dispatch(cartActions.addToCart(selectedProduct));
                        props.navigation.navigate("Cart");
                    }}
                    activeOpacity={0.85}
                    style={{ flex: 1.2 }}
                >
                    <LinearGradient
                        colors={["#FF6B6B", "#FF8E53"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buyNowBtn}
                    >
                        <Ionicons name="flash" size={17} color="white" style={{ marginRight: 5 }} />
                        <Text style={styles.buyNowText}>Mua ngay</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export const ProductDetailsCreenOptions = (props) => {
    return {
        headerStyle: {
            backgroundColor: "#FFFFFF",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F8",
        },
        headerTintColor: "#1E1E1E",
        headerTitle: "Chi tiết sản phẩm",
        headerTitleStyle: { fontWeight: "700", fontSize: 16 },
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
    },
    imageSection: {
        backgroundColor: "#FFFFFF",
        paddingTop: 20,
        paddingBottom: 12,
        alignItems: "center",
    },
    image: {
        width: "80%",
        height: 230,
    },
    badgeRow: {
        flexDirection: "row",
        marginTop: 14,
        paddingHorizontal: 16,
        gap: 8,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEF0FF",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    badgeText: {
        color: "#6C63FF",
        fontSize: 12,
        fontWeight: "600",
    },
    infoCard: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        marginTop: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1E1E1E",
        lineHeight: 24,
        marginBottom: 10,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    ratingNum: {
        fontSize: 13,
        fontWeight: "700",
        color: "#FFB300",
    },
    ratingMeta: {
        fontSize: 12,
        color: "#8A8A8A",
    },
    price: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FF4D4F",
    },
    card: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        marginTop: 8,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1E1E1E",
        marginBottom: 14,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F8",
    },
    policyRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 11,
        gap: 12,
    },
    policyIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    policyText: {
        fontSize: 13.5,
        color: "#4B4B4B",
        flex: 1,
    },
    description: {
        fontSize: 14,
        color: "#4B4B4B",
        lineHeight: 22,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        padding: 12,
        gap: 10,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#F0F0F8",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 8,
        elevation: 12,
    },
    addCartBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        backgroundColor: "#EEF0FF",
    },
    addCartText: {
        color: Colors.primary,
        fontWeight: "700",
        fontSize: 14,
    },
    buyNowBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        borderRadius: 14,
    },
    buyNowText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
    },
});

export default ProductDetailScreen;
