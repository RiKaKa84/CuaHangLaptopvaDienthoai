import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ImageMapper from "../../utils/ImageMapper";
import Colors from "../../constants/Colors";

const ProductItem = (props) => {
    const [imageLoading, setImageLoading] = useState(true);
    const scaleValue = new Animated.Value(1);

    const imageSource = ImageMapper[props.image]
        ? ImageMapper[props.image]
        : { uri: props.image };

    const formattedPrice = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(props.price);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 30,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    return (
        <Animated.View style={[styles.product, { transform: [{ scale: scaleValue }] }]}>
            <TouchableOpacity
                onPress={props.onSelect}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
                style={styles.touchable}
            >
                {/* Image Container */}
                <View style={styles.imageContainer}>
                    {imageLoading && (
                        <View style={styles.imageSkeleton}>
                            <ActivityIndicator size="small" color={Colors.primary} />
                        </View>
                    )}
                    <Image
                        style={styles.image}
                        source={imageSource}
                        resizeMode="contain"
                        onLoadEnd={() => setImageLoading(false)}
                        fadeDuration={250}
                    />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Title */}
                    <Text style={styles.title} numberOfLines={2}>{props.title}</Text>

                    {/* Rating row */}
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={11} color="#FFB300" />
                        <Text style={styles.ratingText}>4.8</Text>
                        <Text style={styles.soldText}>  •  Đã bán 350</Text>
                    </View>

                    {/* Price */}
                    <Text style={styles.price}>{formattedPrice}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {props.children}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    product: {
        backgroundColor: "#FFFFFF",
        margin: 6,
        flex: 1,
        maxWidth: "47%",
        borderRadius: 18,
        shadowColor: "#6C63FF",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F0F0F8",
    },
    touchable: {
        borderRadius: 18,
        overflow: "hidden",
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#F8F9FF",
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
        padding: 12,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imageSkeleton: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F0F2FF",
        zIndex: 1,
    },
    content: {
        paddingHorizontal: 11,
        paddingTop: 10,
        paddingBottom: 4,
    },
    title: {
        fontSize: 13,
        fontWeight: "600",
        color: "#1E1E1E",
        lineHeight: 18,
        marginBottom: 5,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    ratingText: {
        fontSize: 11,
        color: "#FFB300",
        fontWeight: "700",
        marginLeft: 3,
    },
    soldText: {
        fontSize: 11,
        color: "#8A8A8A",
    },
    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#FF4D4F",
        letterSpacing: 0.2,
    },
    actions: {
        paddingHorizontal: 10,
        paddingBottom: 11,
        paddingTop: 8,
        gap: 6,
    },
});

export default ProductItem;
