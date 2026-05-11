import React, { useRef, useEffect, useState } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, Modal,
    Animated, ScrollView, TextInput, Dimensions, Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_H } = Dimensions.get("window");
const PANEL_H = SCREEN_H * 0.88;

const SORT_OPTIONS = [
    { key: "popular",   label: "Phổ biến nhất",    icon: "flame" },
    { key: "newest",    label: "Mới nhất",          icon: "time" },
    { key: "bestsell",  label: "Bán chạy nhất",     icon: "trending-up" },
    { key: "price_asc", label: "Giá thấp → cao",    icon: "arrow-up" },
    { key: "price_desc",label: "Giá cao → thấp",    icon: "arrow-down" },
];

const BRANDS = ["ASUS", "Acer", "Dell", "Lenovo", "Apple", "HP"];
const RATINGS = [
    { key: 5, label: "⭐⭐⭐⭐⭐  5 sao" },
    { key: 4, label: "⭐⭐⭐⭐+   4 sao trở lên" },
    { key: 3, label: "⭐⭐⭐+     3 sao trở lên" },
];
const RAM_OPTIONS = ["8GB", "16GB", "32GB"];
const SSD_OPTIONS = ["256GB", "512GB", "1TB"];

const FilterPanel = ({ visible, onClose, onApply, initialFilters }) => {
    const slideAnim = useRef(new Animated.Value(PANEL_H)).current;
    const fadeAnim  = useRef(new Animated.Value(0)).current;

    const [sortBy,      setSortBy]      = useState(initialFilters?.sortBy      || "popular");
    const [priceMin,    setPriceMin]    = useState(initialFilters?.priceMin    || "");
    const [priceMax,    setPriceMax]    = useState(initialFilters?.priceMax    || "");
    const [brands,      setBrands]      = useState(initialFilters?.brands      || []);
    const [minRating,   setMinRating]   = useState(initialFilters?.minRating   || null);
    const [rams,        setRams]        = useState(initialFilters?.rams        || []);
    const [ssds,        setSsds]        = useState(initialFilters?.ssds        || []);
    const [inStock,     setInStock]     = useState(initialFilters?.inStock     || false);
    const [onSale,      setOnSale]      = useState(initialFilters?.onSale      || false);
    const [freeShip,    setFreeShip]    = useState(initialFilters?.freeShip    || false);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
                Animated.timing(fadeAnim,  { toValue: 1, duration: 280, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: PANEL_H, duration: 260, useNativeDriver: true }),
                Animated.timing(fadeAnim,  { toValue: 0,       duration: 240, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const toggleBrand = (b) => setBrands(prev =>
        prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
    const toggleRam = (r) => setRams(prev =>
        prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
    const toggleSsd = (s) => setSsds(prev =>
        prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

    const handleReset = () => {
        setSortBy("popular"); setPriceMin(""); setPriceMax("");
        setBrands([]); setMinRating(null); setRams([]); setSsds([]);
        setInStock(false); setOnSale(false); setFreeShip(false);
    };

    const handleApply = () => {
        onApply({ sortBy, priceMin, priceMax, brands, minRating, rams, ssds, inStock, onSale, freeShip });
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} onRequestClose={onClose} animationType="none">
            {/* Backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
            </Animated.View>

            {/* Panel */}
            <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
                {/* Handle */}
                <View style={styles.handle} />

                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="options" size={20} color="#6C63FF" />
                    <Text style={styles.headerTitle}>Bộ lọc</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={22} color="#8A8A8A" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* ── SẮP XẾP ── */}
                    <Text style={styles.sectionTitle}>Sắp xếp theo</Text>
                    {SORT_OPTIONS.map(opt => (
                        <TouchableOpacity key={opt.key} style={styles.radioRow} onPress={() => setSortBy(opt.key)} activeOpacity={0.7}>
                            <View style={[styles.radioOuter, sortBy === opt.key && styles.radioOuterActive]}>
                                {sortBy === opt.key && <View style={styles.radioInner} />}
                            </View>
                            <Ionicons name={opt.icon} size={16} color={sortBy === opt.key ? "#6C63FF" : "#8A8A8A"} style={{ marginHorizontal: 8 }} />
                            <Text style={[styles.radioLabel, sortBy === opt.key && styles.radioLabelActive]}>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.divider} />

                    {/* ── KHOẢNG GIÁ ── */}
                    <Text style={styles.sectionTitle}>Khoảng giá</Text>
                    <View style={styles.priceRow}>
                        <View style={styles.priceInput}>
                            <Text style={styles.priceLabel}>Từ giá</Text>
                            <TextInput
                                style={styles.priceField}
                                value={priceMin}
                                onChangeText={setPriceMin}
                                placeholder="VD: 5000000"
                                placeholderTextColor="#C0C0C0"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.priceDash} />
                        <View style={styles.priceInput}>
                            <Text style={styles.priceLabel}>Đến giá</Text>
                            <TextInput
                                style={styles.priceField}
                                value={priceMax}
                                onChangeText={setPriceMax}
                                placeholder="VD: 30000000"
                                placeholderTextColor="#C0C0C0"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Quick price chips */}
                    <View style={styles.chipRow}>
                        {[["Dưới 10tr","","10000000"],["10–20tr","10000000","20000000"],["Trên 20tr","20000000",""]].map(([label, mn, mx]) => (
                            <TouchableOpacity key={label} style={[styles.chip, priceMin===mn && priceMax===mx && styles.chipActive]}
                                onPress={() => { setPriceMin(mn); setPriceMax(mx); }}>
                                <Text style={[styles.chipText, priceMin===mn && priceMax===mx && styles.chipTextActive]}>{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    {/* ── HÃNG ── */}
                    <Text style={styles.sectionTitle}>Hãng sản xuất</Text>
                    <View style={styles.chipRow}>
                        {BRANDS.map(b => (
                            <TouchableOpacity key={b} style={[styles.chip, brands.includes(b) && styles.chipActive]}
                                onPress={() => toggleBrand(b)}>
                                <Text style={[styles.chipText, brands.includes(b) && styles.chipTextActive]}>{b}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    {/* ── ĐÁNH GIÁ ── */}
                    <Text style={styles.sectionTitle}>Đánh giá</Text>
                    {RATINGS.map(r => (
                        <TouchableOpacity key={r.key} style={styles.radioRow} onPress={() => setMinRating(minRating === r.key ? null : r.key)} activeOpacity={0.7}>
                            <View style={[styles.radioOuter, minRating === r.key && styles.radioOuterActive]}>
                                {minRating === r.key && <View style={styles.radioInner} />}
                            </View>
                            <Text style={[styles.radioLabel, { marginLeft: 10 }, minRating === r.key && styles.radioLabelActive]}>{r.label}</Text>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.divider} />

                    {/* ── RAM / SSD (Laptop) ── */}
                    <Text style={styles.sectionTitle}>RAM <Text style={styles.sectionSub}>(Laptop)</Text></Text>
                    <View style={styles.chipRow}>
                        {RAM_OPTIONS.map(r => (
                            <TouchableOpacity key={r} style={[styles.chip, rams.includes(r) && styles.chipActive]} onPress={() => toggleRam(r)}>
                                <Text style={[styles.chipText, rams.includes(r) && styles.chipTextActive]}>{r}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Ổ cứng SSD <Text style={styles.sectionSub}>(Laptop)</Text></Text>
                    <View style={styles.chipRow}>
                        {SSD_OPTIONS.map(s => (
                            <TouchableOpacity key={s} style={[styles.chip, ssds.includes(s) && styles.chipActive]} onPress={() => toggleSsd(s)}>
                                <Text style={[styles.chipText, ssds.includes(s) && styles.chipTextActive]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    {/* ── TÌNH TRẠNG ── */}
                    <Text style={styles.sectionTitle}>Tình trạng</Text>
                    <View style={styles.checkRow}>
                        {[
                            [inStock,  setInStock,  "Còn hàng",   "checkmark-circle"],
                            [onSale,   setOnSale,   "Đang giảm giá", "pricetag"],
                            [freeShip, setFreeShip, "Freeship",   "bicycle"],
                        ].map(([val, setter, label, icon]) => (
                            <TouchableOpacity key={label} style={[styles.checkChip, val && styles.chipActive]}
                                onPress={() => setter(!val)} activeOpacity={0.75}>
                                <Ionicons name={icon} size={14} color={val ? "#FFF" : "#8A8A8A"} style={{ marginRight: 5 }} />
                                <Text style={[styles.chipText, val && styles.chipTextActive]}>{label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ height: 20 }} />
                </ScrollView>

                {/* Footer Buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
                        <Text style={styles.resetText}>Đặt lại</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyBtnWrapper} onPress={handleApply} activeOpacity={0.85}>
                        <LinearGradient colors={["#7B73FF", "#6C63FF"]} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.applyBtn}>
                            <Text style={styles.applyText}>Áp dụng</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.45)",
    },
    panel: {
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: PANEL_H,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        overflow: "hidden",
    },
    handle: {
        width: 40, height: 4,
        borderRadius: 2,
        backgroundColor: "#E0E0E0",
        alignSelf: "center",
        marginTop: 12, marginBottom: 4,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F0F0F8",
    },
    headerTitle: {
        flex: 1,
        fontSize: 17,
        fontWeight: "700",
        color: "#1E1E1E",
        marginLeft: 10,
    },
    closeBtn: {
        padding: 4,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E1E1E",
        marginBottom: 12,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    sectionSub: {
        fontSize: 12,
        fontWeight: "400",
        color: "#8A8A8A",
        textTransform: "none",
    },
    divider: {
        height: 1,
        backgroundColor: "#F0F0F8",
        marginVertical: 16,
    },
    // Radio
    radioRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 9,
    },
    radioOuter: {
        width: 20, height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#D0D5E1",
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterActive: {
        borderColor: "#6C63FF",
    },
    radioInner: {
        width: 10, height: 10,
        borderRadius: 5,
        backgroundColor: "#6C63FF",
    },
    radioLabel: {
        fontSize: 14,
        color: "#4B4B4B",
        fontWeight: "500",
    },
    radioLabelActive: {
        color: "#6C63FF",
        fontWeight: "700",
    },
    // Price
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    priceInput: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 11,
        color: "#8A8A8A",
        fontWeight: "600",
        marginBottom: 5,
        textTransform: "uppercase",
        letterSpacing: 0.3,
    },
    priceField: {
        backgroundColor: "#F5F7FB",
        borderWidth: 1.5,
        borderColor: "#E8EAEF",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: "#1E1E1E",
    },
    priceDash: {
        width: 16,
        height: 2,
        backgroundColor: "#D0D5E1",
        marginHorizontal: 10,
        marginTop: 18,
    },
    // Chips
    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 4,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F5F7FB",
        borderWidth: 1.5,
        borderColor: "#E8EAEF",
    },
    chipActive: {
        backgroundColor: "#6C63FF",
        borderColor: "#6C63FF",
    },
    chipText: {
        fontSize: 13,
        color: "#4B4B4B",
        fontWeight: "600",
    },
    chipTextActive: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    checkRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    checkChip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: "#F5F7FB",
        borderWidth: 1.5,
        borderColor: "#E8EAEF",
    },
    // Footer
    footer: {
        flexDirection: "row",
        padding: 16,
        paddingBottom: Platform.OS === "ios" ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: "#F0F0F8",
        gap: 12,
    },
    resetBtn: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: "#6C63FF",
        backgroundColor: "#EEF0FF",
    },
    resetText: {
        color: "#6C63FF",
        fontWeight: "700",
        fontSize: 15,
    },
    applyBtnWrapper: {
        flex: 2,
        borderRadius: 14,
        overflow: "hidden",
    },
    applyBtn: {
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
    },
    applyText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 15,
    },
});

export default FilterPanel;
