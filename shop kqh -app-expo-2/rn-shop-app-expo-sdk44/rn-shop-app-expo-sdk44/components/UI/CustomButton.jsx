import React from "react";
import { StyleSheet, Pressable, Text, Animated } from "react-native";
import Colors from "../../constants/Colors";

const CustomButton = (props) => {
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
    };
    const handlePressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }).start();
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.buttonStyle,
                { opacity: pressed ? 0.9 : 1 },
                {...props.style}
            ]}
            onPress={props.onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={props.disabled}
        >
            <Text style={[styles.textStyle, props.textStyle]}>{props.title}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    buttonStyle: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderRadius: 13,
        elevation: 2,
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
    },
    textStyle: {
        fontSize: 14,
        letterSpacing: 0.2,
        color: "#FFFFFF",
        fontWeight: "700",
    },
});

export default CustomButton;
