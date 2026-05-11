import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    RefreshControl,
    Linking
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import config from "../../config";

const AdminUsersScreen = (props) => {
    const token = useSelector((state) => state.auth.token);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${config.DATABASE_URL}/profiles.json?auth=${token}`);
            if (!response.ok) {
                throw new Error("Lỗi khi tải danh sách người dùng");
            }
            const resData = await response.json();
            const loadedUsers = [];
            
            for (const key in resData) {
                loadedUsers.push({
                    id: key,
                    fullName: resData[key].fullName || "Người dùng ẩn danh",
                    phone: resData[key].phone || "Chưa cập nhật",
                    dob: resData[key].dob || "Chưa cập nhật",
                    gender: resData[key].gender || "Không xác định",
                });
            }
            setUsers(loadedUsers);
        } catch (err) {
            console.log(err);
        }
    }, [token]);

    useEffect(() => {
        setIsLoading(true);
        fetchUsers().then(() => {
            setIsLoading(false);
        });
    }, [fetchUsers]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUsers();
        setRefreshing(false);
    };

    const callUser = (phone) => {
        if (phone !== "Chưa cập nhật") {
            Linking.openURL(`tel:${phone}`);
        }
    };

    const getAvatar = (gender) => {
        if (gender === 'Nam') {
            return require('../../assets/avatar_male.png');
        } else if (gender === 'Nữ') {
            return require('../../assets/avatar_female.png');
        }
        return { uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" };
    };

    const renderUserCard = ({ item }) => {
        return (
            <View style={styles.userCard}>
                <View style={styles.avatarContainer}>
                    <Image source={getAvatar(item.gender)} style={styles.avatar} />
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>{item.fullName}</Text>
                    
                    <View style={styles.infoRow}>
                        <Ionicons name="call-outline" size={14} color="#7f8c8d" />
                        <Text style={styles.infoText} onPress={() => callUser(item.phone)}>
                            {item.phone}
                        </Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={14} color="#7f8c8d" />
                        <Text style={styles.infoText}>{item.dob}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Ionicons 
                            name={item.gender === 'Nam' ? "male-outline" : item.gender === 'Nữ' ? "female-outline" : "help-circle-outline"} 
                            size={14} 
                            color={item.gender === 'Nam' ? "#3498db" : item.gender === 'Nữ' ? "#e74c3c" : "#7f8c8d"} 
                        />
                        <Text style={styles.infoText}>{item.gender}</Text>
                    </View>
                </View>
                
                {/* ID Badge */}
                <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>ID: {item.id.substring(0, 5).toUpperCase()}</Text>
                </View>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1a1a2e" />
                <Text style={{ marginTop: 10, color: "#888" }}>Đang tải danh sách tài khoản...</Text>
            </View>
        );
    }

    const maleCount = users.filter(u => u.gender === 'Nam').length;
    const femaleCount = users.filter(u => u.gender === 'Nữ').length;

    return (
        <View style={styles.container}>
            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{users.length}</Text>
                    <Text style={styles.statLabel}>Tất cả</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#3498db' }]}>{maleCount}</Text>
                    <Text style={styles.statLabel}>Nam</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: '#e74c3c' }]}>{femaleCount}</Text>
                    <Text style={styles.statLabel}>Nữ</Text>
                </View>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderUserCard}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1a1a2e"]} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.centered}>
                        <Ionicons name="people-circle-outline" size={60} color="#ccc" />
                        <Text style={{ color: "#aaa", marginTop: 10 }}>Chưa có người dùng nào</Text>
                    </View>
                )}
            />
        </View>
    );
};

export const AdminUsersScreenOptions = (navData) => {
    return {
        headerTitle: " Admin – Quản lý Tài khoản",
        headerStyle: { backgroundColor: "#1a1a2e" },
        headerTintColor: "white",
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="Menu"
                    iconName="menu"
                    onPress={() => navData.navigation.toggleDrawer()}
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
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    statsBar: {
        flexDirection: "row",
        backgroundColor: "#1a1a2e",
        paddingVertical: 15,
        justifyContent: "space-around",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    statItem: {
        alignItems: "center",
    },
    statNumber: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
    },
    statLabel: {
        fontSize: 12,
        color: "#aaa",
        marginTop: 4,
        textTransform: "uppercase",
    },
    listContainer: {
        padding: 15,
        paddingBottom: 30,
    },
    userCard: {
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 3,
        alignItems: "center",
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#E0E6ED",
    },
    avatar: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    userInfo: {
        flex: 1,
        marginLeft: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2C3E50",
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: "#7f8c8d",
        marginLeft: 6,
    },
    badgeContainer: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#E8F4F8",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 10,
        color: "#3498db",
        fontWeight: "bold",
    }
});

export default AdminUsersScreen;
