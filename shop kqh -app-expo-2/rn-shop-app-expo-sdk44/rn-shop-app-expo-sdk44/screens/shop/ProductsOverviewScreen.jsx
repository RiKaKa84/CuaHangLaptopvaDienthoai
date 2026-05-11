import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StatusBar,
    Animated,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ProductItem from "../../components/shop/ProductItem";
import FilterPanel from "../../components/shop/FilterPanel";
import * as cartActions from "../../store/actions/cart";
import * as productsActions from "../../store/actions/products";
import Colors from "../../constants/Colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/UI/HeaderButton";

const CATEGORIES = [
    { key: "all", label: "Tất cả" },
    { key: "laptop", label: "💻 Laptop" },
    { key: "phone", label: "📱 Điện thoại" },
];

const LAPTOP_BRANDS = [
    { key: "asus",   label: "ASUS",   match: "asus" },
    { key: "acer",   label: "Acer",   match: "acer" },
    { key: "dell",   label: "Dell",   match: "dell" },
    { key: "hp",     label: "HP",     match: "hp" },
    { key: "lenovo", label: "Lenovo", match: "lenovo" },
    { key: "apple",  label: "Apple",  match: "macbook" },
];

const PHONE_BRANDS = [
    { key: "iphone",  label: "iPhone",  match: "iphone" },
    { key: "samsung", label: "Samsung", match: "samsung" },
    { key: "xiaomi",  label: "Xiaomi",  match: "xiaomi" },
    { key: "oppo",    label: "OPPO",    match: "oppo" },
    { key: "realme",  label: "Realme",  match: "realme" },
    { key: "redmi",   label: "Redmi",   match: "redmi" },
];

const DEFAULT_FILTERS = { sortBy: "popular", priceMin: "", priceMax: "", brands: [], minRating: null, rams: [], ssds: [], inStock: false, onSale: false, freeShip: false };

const ProductsOverviewScreen = (props) => {
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const products = useSelector((state) => state.products.availableProducts);
    const dispatch = useDispatch();

    // Reset brand when category changes
    const handleCategoryChange = (key) => {
        setSelectedCategory(key);
        setSelectedBrand(null);
    };

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
        } catch (error) {
            setError(error.message);
        }
        setIsRefreshing(false);
    }, [dispatch]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => setIsLoading(false));
    }, [dispatch, loadProducts]);

    // Count active filters for badge
    const filterCount = [
        filters.sortBy !== "popular",
        filters.priceMin !== "" || filters.priceMax !== "",
        filters.brands.length > 0,
        filters.minRating !== null,
        filters.rams.length > 0 || filters.ssds.length > 0,
        filters.inStock, filters.onSale, filters.freeShip,
    ].filter(Boolean).length;

    const applyFilters = (newFilters) => setFilters(newFilters);

    // Current brand list based on category
    const currentBrands = selectedCategory === "laptop" ? LAPTOP_BRANDS
        : selectedCategory === "phone" ? PHONE_BRANDS : [];

    let filteredProducts = products.filter((p) => {
        const matchCat    = selectedCategory === "all" || p.category === selectedCategory;
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchBrand  = !selectedBrand
            ? (filters.brands.length === 0 || filters.brands.some(b => p.title.toLowerCase().includes(b.toLowerCase())))
            : p.title.toLowerCase().includes(selectedBrand);
        const matchPrMin  = !filters.priceMin || p.price >= parseFloat(filters.priceMin);
        const matchPrMax  = !filters.priceMax || p.price <= parseFloat(filters.priceMax);
        return matchCat && matchSearch && matchBrand && matchPrMin && matchPrMax;
    });

    // Best sellers = top 8 most expensive (flagship products)
    const bestSellers = [...products]
        .sort((a, b) => b.price - a.price)
        .slice(0, 8);

    // Apply sort
    filteredProducts = [...filteredProducts].sort((a, b) => {
        if (filters.sortBy === "price_asc")  return a.price - b.price;
        if (filters.sortBy === "price_desc") return b.price - a.price;
        return 0;
    });

    if (error) {
        return (
            <View style={styles.centered}>
                <View style={styles.emptyIcon}>
                    <Ionicons name="cloud-offline-outline" size={40} color={Colors.primary} />
                </View>
                <Text style={styles.emptyTitle}>Không thể tải sản phẩm</Text>
                <Text style={styles.emptySubtitle}>{error}</Text>
                <TouchableOpacity onPress={loadProducts} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Thử lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FB" />

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
                    <Ionicons
                        name="search"
                        size={16}
                        color={searchFocused ? Colors.primary : "#8A8A8A"}
                        style={{ marginRight: 8 }}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        placeholderTextColor="#B0B0B0"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    {searchQuery.length > 0 ? (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={18} color="#B0B0B0" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
                            <Ionicons name="options" size={18} color={Colors.primary} />
                            {filterCount > 0 && (
                                <View style={styles.filterBadge}>
                                    <Text style={styles.filterBadgeText}>{filterCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* TIER 1 — Loại sản phẩm */}
            <View style={styles.pillRow}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.pillContent} keyboardShouldPersistTaps="handled">
                    {CATEGORIES.map((cat) => {
                        const isActive = selectedCategory === cat.key;
                        return (
                            <TouchableOpacity key={cat.key} onPress={() => handleCategoryChange(cat.key)}
                                activeOpacity={0.75} style={[styles.pill, isActive && styles.pillActive]}>
                                <Text style={[styles.pillText, isActive && styles.pillTextActive]}
                                    allowFontScaling={false} numberOfLines={1}>{cat.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* TIER 2 — Hãng (chỉ hiện khi chọn Laptop hoặc Điện thoại) */}
            {currentBrands.length > 0 && (
                <View style={styles.brandRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.pillContent} keyboardShouldPersistTaps="handled">
                        {currentBrands.map((brand) => {
                            const isActive = selectedBrand === brand.match;
                            return (
                                <TouchableOpacity key={brand.key}
                                    onPress={() => setSelectedBrand(isActive ? null : brand.match)}
                                    activeOpacity={0.75}
                                    style={[styles.brandPill, isActive && styles.brandPillActive]}>
                                    <Text style={[styles.brandPillText, isActive && styles.brandPillTextActive]}
                                        allowFontScaling={false}>{brand.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

            {/* BEST SELLER — chỉ hiện khi không search và không filter hãng */}
            {!searchQuery && !selectedBrand && selectedCategory === "all" && (
                <View style={styles.bsSection}>
                    <View style={styles.bsHeader}>
                        <Text style={styles.bsTitle}>🔥 Bán chạy nhất</Text>
                        <Text style={styles.bsSeeAll}>Xem tất cả</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.bsScrollContent}>
                        {bestSellers.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.bsCard}
                                activeOpacity={0.85}
                                onPress={() => props.navigation.navigate("ProductDetail", {
                                    productId: item.id, productTitle: item.title
                                })}>
                                <LinearGradient colors={["#EEF0FF", "#F5F7FF"]}
                                    style={styles.bsGradient}>
                                    <View style={styles.hotBadge}>
                                        <Text style={styles.hotBadgeText}>HOT</Text>
                                    </View>
                                    <Text style={styles.bsName} numberOfLines={2}>{item.title}</Text>
                                    <Text style={styles.bsPrice}>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Result count */}
            <View style={styles.resultRow}>
                <Text style={styles.resultCount}>
                    {filteredProducts.length} <Text style={styles.resultLabel}>sản phẩm</Text>
                </Text>
                {(selectedBrand || searchQuery) && (
                    <TouchableOpacity onPress={() => { setSelectedBrand(null); setSearchQuery(""); }}
                        style={styles.clearBtn}>
                        <Text style={styles.clearBtnText}>✕ Xoá lọc</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <View style={styles.centered}>
                    <View style={styles.emptyIcon}>
                        <Ionicons name="search-outline" size={36} color="#B0B0B0" />
                    </View>
                    <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
                    <Text style={styles.emptySubtitle}>Thử tìm kiếm với từ khóa khác</Text>
                </View>
            ) : (
                <FlatList
                    onRefresh={loadProducts}
                    refreshing={isRefreshing}
                    data={filteredProducts}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    initialNumToRender={8}
                    maxToRenderPerBatch={8}
                    windowSize={5}
                    removeClippedSubviews={true}
                    contentContainerStyle={styles.listContent}
                    renderItem={(itemData) => (
                        <ProductItem
                            image={itemData.item.imageUrl}
                            title={itemData.item.title}
                            price={itemData.item.price}
                            onSelect={() =>
                                props.navigation.navigate("ProductDetail", {
                                    productId: itemData.item.id,
                                    productTitle: itemData.item.title,
                                })
                            }
                        >
                            {/* Add to Cart */}
                            <TouchableOpacity
                                style={styles.cartBtn}
                                onPress={() => dispatch(cartActions.addToCart(itemData.item))}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="cart-outline" size={13} color={Colors.primary} style={{ marginRight: 4 }} />
                                <Text style={styles.cartBtnText}>Giỏ hàng</Text>
                            </TouchableOpacity>

                            {/* Buy Now */}
                            <TouchableOpacity
                                onPress={() => {
                                    dispatch(cartActions.addToCart(itemData.item));
                                    props.navigation.navigate("Cart");
                                }}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={["#FF6B6B", "#FF8E53"]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.buyBtn}
                                >
                                    <Text style={styles.buyBtnText}>Mua ngay</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ProductItem>
                    )}
                />
            )}

            <FilterPanel
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={applyFilters}
                initialFilters={filters}
            />
        </View>
    );
};

export const ProductsOverviewScreenOptions = (props) => {
    return {
        headerStyle: {
            backgroundColor: "#FFFFFF",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F8",
        },
        headerTintColor: "#1E1E1E",
        headerTitle: () => (
            <Text style={{ color: "#1E1E1E", fontSize: 17, fontWeight: "700" }}>KQH Shop</Text>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="cart"
                    iconName="cart-outline"
                    onPress={() => props.navigation.navigate("Cart")}
                />
            </HeaderButtons>
        ),
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item
                    title="menu"
                    iconName="menu-outline"
                    onPress={() => props.navigation.toggleDrawer()}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F5F7FB",
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F7FB",
    },
    loadingText: {
        color: "#8A8A8A",
        marginTop: 12,
        fontSize: 14,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#F0F2FF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    emptyTitle: {
        color: "#1E1E1E",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 6,
    },
    emptySubtitle: {
        color: "#8A8A8A",
        fontSize: 13,
        textAlign: "center",
        paddingHorizontal: 30,
    },
    retryBtn: {
        marginTop: 20,
        backgroundColor: "#6C63FF",
        paddingVertical: 11,
        paddingHorizontal: 28,
        borderRadius: 12,
    },
    retryText: { color: "#FFF", fontWeight: "700", fontSize: 14 },

    // Search
    searchSection: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F8",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F7FB",
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#E8EAEF",
        paddingHorizontal: 12,
        height: 40,
    },
    searchBarFocused: {
        borderColor: "#6C63FF",
        backgroundColor: "#FAFBFF",
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#1E1E1E",
    },
    filterBtn: {
        padding: 4,
        position: "relative",
    },
    filterBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#FF6B6B",
        borderRadius: 8,
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    filterBadgeText: {
        color: "#FFF",
        fontSize: 9,
        fontWeight: "800",
    },

    // Category Pills
    pillRow: {
        backgroundColor: "#FFFFFF",
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F8",
        justifyContent: "center",
    },
    pillContent: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        alignItems: "center",
        flexDirection: "row",
    },
    pill: {
        flexShrink: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E8EAEF",
        marginRight: 10,
        minWidth: 80,
    },
    pillActive: {
        backgroundColor: "#6C63FF",
        borderColor: "#6C63FF",
        shadowColor: "#6C63FF",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 4,
    },
    pillText: {
        fontSize: 14,
        color: "#4B4B4B",
        fontWeight: "600",
        includeFontPadding: false,
        textAlignVertical: "center",
    },
    pillTextActive: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    // Brand pills — Tier 2
    brandRow: {
        backgroundColor: "#FAFBFF",
        height: 52,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F8",
        justifyContent: "center",
    },
    brandPill: {
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1.5,
        borderColor: "#E0E2F0",
        marginRight: 8,
        minWidth: 60,
    },
    brandPillActive: {
        backgroundColor: "#6C63FF",
        borderColor: "#6C63FF",
        elevation: 3,
        shadowColor: "#6C63FF",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    brandPillText: {
        fontSize: 13,
        color: "#555",
        fontWeight: "600",
        includeFontPadding: false,
    },
    brandPillTextActive: {
        color: "#FFFFFF",
        fontWeight: "700",
    },

    // Best Seller Section
    bsSection: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F8",
    },
    bsHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    bsTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: "#1E1E1E",
        letterSpacing: 0.2,
    },
    bsSeeAll: {
        fontSize: 13,
        color: "#6C63FF",
        fontWeight: "600",
    },
    bsScrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 4,
    },
    bsCard: {
        width: 150,
        marginRight: 12,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#6C63FF",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
    },
    bsGradient: {
        padding: 14,
        minHeight: 110,
        justifyContent: "space-between",
    },
    hotBadge: {
        alignSelf: "flex-start",
        backgroundColor: "#FF6B6B",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 8,
    },
    hotBadgeText: {
        color: "#FFF",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    bsName: {
        fontSize: 12,
        fontWeight: "700",
        color: "#1E1E1E",
        lineHeight: 17,
        flex: 1,
    },
    bsPrice: {
        fontSize: 13,
        fontWeight: "800",
        color: "#6C63FF",
        marginTop: 8,
    },

    // Result row
    resultRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 4,
    },
    clearBtn: {
        backgroundColor: "#FFF0F0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FFD0D0",
    },
    clearBtnText: {
        color: "#FF6B6B",
        fontSize: 12,
        fontWeight: "700",
    },
    resultCount: {
        fontSize: 14,
        color: "#1E1E1E",
        fontWeight: "700",
    },
    resultLabel: {
        color: "#8A8A8A",
        fontWeight: "400",
    },

    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 20,
    },

    // Buttons inside card
    cartBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: "#6C63FF",
        backgroundColor: "#F0F0FF",
    },
    cartBtnText: {
        color: "#6C63FF",
        fontWeight: "700",
        fontSize: 12,
    },
    buyBtn: {
        borderRadius: 12,
        paddingVertical: 9,
        alignItems: "center",
        justifyContent: "center",
    },
    buyBtnText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 12,
    },
});

export default ProductsOverviewScreen;
