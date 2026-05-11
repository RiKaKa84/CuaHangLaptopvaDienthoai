import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Alert,
    ActivityIndicator,
    Platform,
    TouchableOpacity
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../../components/UI/HeaderButton";
import CustomButton from "../../components/UI/CustomButton";
import Colors from "../../constants/Colors";
import * as profileActions from "../../store/actions/profile";
import { auth } from "../../store/actions/auth";

const UserProfileScreen = (props) => {
    const dispatch = useDispatch();
    const profile = useSelector(state => state.profile);
    
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const currentUserEmail = auth.currentUser ? auth.currentUser.email : "user@example.com";

    useEffect(() => {
        setIsLoading(true);
        dispatch(profileActions.fetchProfile()).then(() => {
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
            console.log(err);
        });
    }, [dispatch]);

    useEffect(() => {
        setFullName(profile.fullName);
        setDob(profile.dob);
        setPhone(profile.phone);
        setGender(profile.gender || "");
    }, [profile]);

    const handleDobChange = (text) => {
        // Chỉ lấy số
        let cleaned = text.replace(/[^0-9]/g, '');
        let formatted = '';
        if (cleaned.length > 0) {
            formatted = cleaned.substring(0, 2);
        }
        if (cleaned.length > 2) {
            formatted += '/' + cleaned.substring(2, 4);
        }
        if (cleaned.length > 4) {
            formatted += '/' + cleaned.substring(4, 8);
        }
        setDob(formatted);
    };
    
    const saveHandler = async () => {
        setIsSaving(true);
        try {
            // Update profile info
            await dispatch(profileActions.updateProfile(fullName, dob, phone, gender));

            // Update password if fields are filled
            if (oldPassword && newPassword) {
                if (newPassword.length < 6) {
                    Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự.", [{ text: "Đóng" }]);
                    setIsSaving(false);
                    return;
                }
                await dispatch(profileActions.updateUserPassword(oldPassword, newPassword));
                setOldPassword("");
                setNewPassword("");
                Alert.alert("Thành công", "Đã cập nhật hồ sơ và mật khẩu!", [{ text: "Tuyệt vời" }]);
            } else {
                Alert.alert("Thành công", "Đã cập nhật hồ sơ!", [{ text: "Đóng" }]);
            }
        } catch (error) {
            Alert.alert("Lỗi", error.message || "Có lỗi xảy ra, vui lòng thử lại.", [{ text: "Đóng" }]);
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    let avatarSource = { uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }; // Không xác định
    if (gender === 'Nam') {
        avatarSource = require('../../assets/avatar_male.png');
    } else if (gender === 'Nữ') {
        avatarSource = require('../../assets/avatar_female.png');
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: '#F5F7FB' }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.screen}>
                
                <View style={styles.avatarContainer}>
                    <Image 
                        source={avatarSource} 
                        style={styles.avatar} 
                    />
                    <Text style={styles.emailText}>{currentUserEmail}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Họ và tên</Text>
                        <TextInput 
                            style={styles.input} 
                            value={fullName} 
                            onChangeText={setFullName}
                            placeholder="Nhập họ và tên"
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Ngày tháng năm sinh</Text>
                        <TextInput 
                            style={styles.input} 
                            value={dob} 
                            onChangeText={handleDobChange}
                            placeholder="VD: 01/01/2000"
                            keyboardType="numeric"
                            maxLength={10}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Số điện thoại</Text>
                        <TextInput 
                            style={styles.input} 
                            value={phone} 
                            onChangeText={setPhone}
                            placeholder="VD: 0912345678"
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Giới tính</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity 
                                style={[styles.genderOption, gender === 'Nam' && styles.genderOptionSelected]}
                                onPress={() => setGender('Nam')}
                            >
                                <Text style={[styles.genderText, gender === 'Nam' && styles.genderTextSelected]}>Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.genderOption, gender === 'Nữ' && styles.genderOptionSelected]}
                                onPress={() => setGender('Nữ')}
                            >
                                <Text style={[styles.genderText, gender === 'Nữ' && styles.genderTextSelected]}>Nữ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.genderOption, gender === 'Không xác định được giới tính' && styles.genderOptionSelected]}
                                onPress={() => setGender('Không xác định được giới tính')}
                            >
                                <Text style={[styles.genderText, gender === 'Không xác định được giới tính' && styles.genderTextSelected]}>Không xác định được giới tính</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Đổi mật khẩu</Text>
                    <Text style={styles.hintText}>(Bỏ trống nếu không muốn đổi)</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mật khẩu cũ</Text>
                        <TextInput 
                            style={styles.input} 
                            value={oldPassword} 
                            onChangeText={setOldPassword}
                            placeholder="Nhập mật khẩu hiện tại"
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mật khẩu mới</Text>
                        <TextInput 
                            style={styles.input} 
                            value={newPassword} 
                            onChangeText={setNewPassword}
                            placeholder="Nhập mật khẩu mới"
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    {isSaving ? (
                        <ActivityIndicator size="large" color={Colors.primary} />
                    ) : (
                        <CustomButton 
                            title="Lưu Cập Nhật" 
                            onPress={saveHandler} 
                            style={{ width: '100%', paddingVertical: 15 }}
                        />
                    )}
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const UserProfileScreenOptions = (navData) => {
    return {
        headerTitle: "Tài khoản của tôi",
        headerStyle: {
            backgroundColor: '#FFFFFF',
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: '#F0F0F8',
        },
        headerTintColor: "#1E1E1E",
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Menu"
                    iconName="menu-outline"
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    screen: {
        padding: 16,
        alignItems: "center",
    },
    centered: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#F5F7FB',
    },
    avatarContainer: {
        alignItems: "center",
        paddingVertical: 20,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F0F0F8',
        shadowColor: '#6C63FF',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        elevation: 3,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: Colors.primary,
        marginBottom: 10,
    },
    emailText: {
        fontSize: 14,
        fontWeight: "600",
        color: '#4B4B4B',
    },
    card: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#F0F0F8',
        shadowColor: '#6C63FF',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 14,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 16,
        color: Colors.primary,
        letterSpacing: 0.2,
    },
    hintText: {
        fontSize: 12,
        color: "#8A8A8A",
        marginBottom: 14,
        marginTop: -10,
    },
    inputContainer: {
        marginBottom: 13,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 6,
        color: '#8A8A8A',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1.5,
        borderColor: '#E8EAEF',
        borderRadius: 11,
        padding: 12,
        fontSize: 15,
        backgroundColor: '#F5F7FB',
        color: '#1E1E1E',
    },
    genderContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 4,
        gap: 8,
    },
    genderOption: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: '#E8EAEF',
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: '#F5F7FB',
    },
    genderOptionSelected: {
        backgroundColor: '#EEF0FF',
        borderColor: Colors.primary,
    },
    genderText: {
        fontSize: 13,
        color: '#8A8A8A',
        textAlign: 'center',
        fontWeight: '600',
    },
    genderTextSelected: {
        color: Colors.primary,
        fontWeight: "700",
    },
    buttonContainer: {
        width: "100%",
        marginTop: 6,
        marginBottom: 30,
    }
});

export default UserProfileScreen;
