import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    ScrollView,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as productActions from "../../store/actions/products";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

const EditProductScreen = (props) => {
    const dispatch = useDispatch();

    const [prodId, setProdId] = useState(props.route.params.prodId);
    const editedProduct = useSelector((state) =>
        state.products.availableProducts.find((prod) => prod.id === prodId)
    );

    const [isNewProduct] = useState(prodId == -1 ? true : false);
    const [title, setTitle] = useState(isNewProduct ? "" : (editedProduct?.title || ""));
    const [imageUrl, setImageUrl] = useState(isNewProduct ? "" : (editedProduct?.imageUrl || ""));
    const [price, setPrice] = useState(isNewProduct ? "" : (editedProduct?.price?.toString() || ""));
    const [description, setDescription] = useState(isNewProduct ? "" : (editedProduct?.description || ""));

    // Guard: if editing a product that no longer exists, go back
    useEffect(() => {
        if (!isNewProduct && !editedProduct) {
            props.navigation.goBack();
        }
    }, [editedProduct, isNewProduct]);

    const isInputValid = () => {
        if (isNewProduct) {
            if (
                title.trim().length === 0 ||
                imageUrl.trim().length === 0 ||
                price.trim().length === 0 ||
                description.trim().length === 0
            ) return false;
        } else {
            if (
                title.trim().length === 0 ||
                imageUrl.trim().length === 0 ||
                description.trim().length === 0
            ) return false;
        }
        return true;
    };

    const submitHandler = useCallback(async () => {
        if (!isInputValid()) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin sản phẩm", [{ text: "Đóng" }]);
            return;
        }

        if (!isNewProduct) {
            await dispatch(productActions.updateProduct(prodId, title, description, imageUrl));
        } else {
            await dispatch(productActions.createProduct(title, description, imageUrl, price));
        }
        props.navigation.goBack();
    }, [title, description, imageUrl, price, isNewProduct, prodId, dispatch, props.navigation]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4, // Reduce quality to save database size
            base64: true,
        });

        if (!result.canceled) {
            // Store as base64 data URI so it works seamlessly with Image component and Realtime DB
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImageUrl(base64Img);
        }
    };

    useEffect(() => {
        if (props.route.params?.submitted) {
            submitHandler();
            props.navigation.setParams({ submitted: false });
        }
    }, [props.route.params?.submitted, submitHandler]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <ScrollView style={styles.container}>
                <View style={styles.form}>
                    {/* Khu vực chọn ảnh */}
                    <View style={styles.imagePickerContainer}>
                        <Text style={styles.label}>Ảnh sản phẩm</Text>
                        <TouchableOpacity style={styles.imagePreview} onPress={pickImage}>
                            {imageUrl ? (
                                <Image style={styles.image} source={{ uri: imageUrl }} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Ionicons name="camera-outline" size={40} color="#95a5a6" />
                                    <Text style={styles.imagePlaceholderText}>Bấm để chọn ảnh từ thư viện</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Các trường thông tin khác */}
                    <View style={styles.card}>
                        <View style={styles.formControl}>
                            <Text style={styles.label}>Tên sản phẩm</Text>
                            <TextInput
                                style={styles.input}
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                                autoCapitalize="sentences"
                                placeholder="Nhập tên sản phẩm..."
                                placeholderTextColor="#bdc3c7"
                            />
                        </View>

                        {isNewProduct && (
                            <View style={styles.formControl}>
                                <Text style={styles.label}>Giá tiền (VNĐ)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={price}
                                    onChangeText={(text) => setPrice(text)}
                                    keyboardType="decimal-pad"
                                    placeholder="Ví dụ: 15000000"
                                    placeholderTextColor="#bdc3c7"
                                />
                            </View>
                        )}

                        <View style={[styles.formControl, { borderBottomWidth: 0, marginBottom: 0 }]}>
                            <Text style={styles.label}>Mô tả chi tiết</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={(text) => setDescription(text)}
                                multiline
                                numberOfLines={4}
                                placeholder="Nhập mô tả sản phẩm..."
                                placeholderTextColor="#bdc3c7"
                                textAlignVertical="top"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const EditProductScreenOptions = (props) => {
    const isNew = props.route.params && props.route.params.prodId === -1;
    return {
        headerStyle: {
            backgroundColor: "#1a1a2e",
            elevation: 0,
            shadowOpacity: 0,
        },
        headerTintColor: "#ffffff",
        headerTitle: isNew ? "Thêm Sản Phẩm" : "Sửa Sản Phẩm",
        headerBackTitleVisible: false, // Fix the bug where "Quản lý kho" overlaps with the title
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Lưu"
                    iconName="checkmark"
                    onPress={() => {
                        props.navigation.setParams({ submitted: true });
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
    form: {
        margin: 20,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 3,
    },
    imagePickerContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#34495E",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: 16,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E0E6ED",
        borderStyle: "dashed",
    },
    imagePlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    imagePlaceholderText: {
        color: "#95a5a6",
        marginTop: 10,
        fontSize: 14,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    formControl: {
        width: "100%",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f2f5",
        paddingBottom: 5,
    },
    input: {
        paddingHorizontal: 5,
        paddingVertical: 8,
        fontSize: 16,
        color: "#2C3E50",
    },
    textArea: {
        height: 100,
    },
});

export default EditProductScreen;
