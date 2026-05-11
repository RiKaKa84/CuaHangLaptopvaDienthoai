// Cập nhật imageUrl đúng cho từng sản phẩm — chạy SAU KHI đã seed_all_products.js
// Script này chỉ seed các sản phẩm CÒN THIẾU ảnh đúng hãng
// Chạy: node seed_fix_images.js

const FIREBASE_URL = 'https://my-ecomerce-2adb6-default-rtdb.asia-southeast1.firebasedatabase.app';
const ownerId = "admin";

const fixedProducts = [

    // ═══════════════ HP (dùng hp_laptop.png) ═══════════════
    {
        title: "Laptop HP 240 G9 6L1X1PA",
        description: "i3-1215U / 8GB / 256GB SSD / 14.0 FHD / Win11 / Bạc",
        imageUrl: "hp_laptop.png", price: 9990000, category: "laptop", ownerId
    },
    {
        title: "Laptop HP Pavilion 15-eg3099TU 8U7H1PA",
        description: "i5-1335U / 16GB / 512GB / 15.6 FHD IPS / Win11 + Office / Bạc",
        imageUrl: "hp_laptop.png", price: 17490000, category: "laptop", ownerId
    },
    {
        title: "Laptop HP Envy x360 14-fa0067AU A9V56PA",
        description: "Ryzen 5 8645HS / 16GB / 512GB / 14.0 WUXGA OLED Cảm ứng / Win11",
        imageUrl: "hp_laptop.png", price: 24990000, category: "laptop", ownerId
    },
    {
        title: "Laptop HP Omen 16-xf0097AX 9J2C3PA",
        description: "Ryzen 9 7945HX / 16GB / 1TB / RX7700S 8GB / 16.1 QHD 165Hz / Win11",
        imageUrl: "hp_laptop.png", price: 39990000, category: "laptop", ownerId
    },
    {
        title: "Laptop HP Spectre x360 14-eu0098TU A9V40PA",
        description: "Intel Core Ultra 7-155H / 32GB / 2TB / 14.0 2.8K OLED Cảm ứng / Win11",
        imageUrl: "hp_laptop.png", price: 44990000, category: "laptop", ownerId
    },

    // ═══════════════ LENOVO IDEAPAD / THINKPAD (dùng lenovo_ideapad.png) ═══════════════
    {
        title: "Laptop Lenovo IdeaPad Slim 3 15IRH8 83EM0045VN",
        description: "i5-13420H / 16GB / 512GB / 15.6 FHD IPS / Win11 / Xám",
        imageUrl: "lenovo_ideapad.png", price: 14990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo ThinkPad E14 Gen 5 21JK00AMVN",
        description: "i5-1335U / 16GB / 512GB / 14.0 WUXGA / Win11 Pro / Đen",
        imageUrl: "lenovo_ideapad.png", price: 22490000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo Yoga 7 2-in-1 14AHP9 83DL001AVN",
        description: "Ryzen 7-8840HS / 16GB / 512GB / 14.0 WUXGA Cảm ứng / Win11",
        imageUrl: "lenovo_ideapad.png", price: 26990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo IdeaPad 5 2-in-1 14AHP9 83DR0028VN",
        description: "Ryzen 5-8645HS / 16GB / 512GB / 14.0 WUXGA Cảm ứng / Win11",
        imageUrl: "lenovo_ideapad.png", price: 19990000, category: "laptop", ownerId
    },

    // ═══════════════ LENOVO GAMING (dùng lenovo_gaming.png) ═══════════════
    {
        title: "Laptop Lenovo Legion 5 16IRX9 83DG00AUVN",
        description: "i7-14650HX / 16GB / 512GB / RTX 4060 8GB / 16.0 WQXGA 165Hz / Win11",
        imageUrl: "lenovo_gaming.png", price: 34990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo Legion 5i Pro 16IRX9 83DH003VVN",
        description: "i9-14900HX / 32GB / 1TB / RTX 4070 8GB / 16.0 QHD+ 240Hz / Win11",
        imageUrl: "lenovo_gaming.png", price: 49990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo LOQ 15IRX9 83DV006TVN",
        description: "i5-13450HX / 16GB / 512GB / RTX 4050 6GB / 15.6 FHD 144Hz / Win11",
        imageUrl: "lenovo_gaming.png", price: 22990000, category: "laptop", ownerId
    },

    // ═══════════════ MACBOOK AIR (dùng macbook_air.png) ═══════════════
    {
        title: "MacBook Air 13 inch M3 MRXN3SA/A 8GB/256GB - Vàng sao",
        description: "Apple M3 8 CPU 10 GPU / 8GB / 256GB / 13.6 Liquid Retina / Touch ID / Wi-Fi 6E",
        imageUrl: "macbook_air.png", price: 27990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Air 13 inch M3 MRXV3SA/A 8GB/512GB - Đêm khuya",
        description: "Apple M3 8 CPU 10 GPU / 8GB / 512GB / 13.6 Liquid Retina / Touch ID / Wi-Fi 6E",
        imageUrl: "macbook_air.png", price: 34990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Air 15 inch M3 MRYN3SA/A 8GB/256GB - Bạc",
        description: "Apple M3 8 CPU 10 GPU / 8GB / 256GB / 15.3 Liquid Retina / Touch ID",
        imageUrl: "macbook_air.png", price: 32990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Air 15 inch M3 MRYP3SA/A 16GB/512GB - Đêm khuya",
        description: "Apple M3 8 CPU 10 GPU / 16GB / 512GB / 15.3 Liquid Retina / Touch ID",
        imageUrl: "macbook_air.png", price: 42990000, category: "laptop", ownerId
    },

    // ═══════════════ MACBOOK PRO (dùng macbook_pro.png) ═══════════════
    {
        title: "MacBook Pro 14 inch M4 Pro MX2W3SA/A 24GB/512GB",
        description: "Apple M4 Pro 12 CPU 20 GPU / 24GB / 512GB / 14.2 Liquid Retina XDR / HDMI / SD card",
        imageUrl: "macbook_pro.png", price: 59990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Pro 14 inch M4 Pro MX2X3SA/A 24GB/1TB",
        description: "Apple M4 Pro 12 CPU 20 GPU / 24GB / 1TB / 14.2 Liquid Retina XDR / Đen không gian",
        imageUrl: "macbook_pro.png", price: 67990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Pro 16 inch M4 Pro MX2Y3SA/A 24GB/512GB",
        description: "Apple M4 Pro 14 CPU 20 GPU / 24GB / 512GB / 16.2 Liquid Retina XDR / HDMI / SD card",
        imageUrl: "macbook_pro.png", price: 72990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Pro 16 inch M4 Max MX303SA/A 48GB/1TB",
        description: "Apple M4 Max 16 CPU 40 GPU / 48GB / 1TB / 16.2 Liquid Retina XDR / Siêu phẩm",
        imageUrl: "macbook_pro.png", price: 99990000, category: "laptop", ownerId
    },

    // ═══════════════ SAMSUNG A56 (dùng samsung_a56.png) ═══════════════
    {
        title: "Samsung Galaxy A56 8GB/128GB",
        description: "Exynos 1580 / Camera 50MP OIS / 5G / 6.7 inch AMOLED 120Hz / Pin 5000mAh / Sạc 45W",
        imageUrl: "samsung_a56.png", price: 10990000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy A56 8GB/256GB",
        description: "Exynos 1580 / Camera 50MP OIS / 5G / 6.7 inch AMOLED 120Hz / Pin 5000mAh / AI Camera",
        imageUrl: "samsung_a56.png", price: 12990000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy A36 8GB/128GB",
        description: "Snapdragon 6 Gen 3 / Camera 50MP / 5G / 6.66 inch AMOLED 120Hz / Pin 5000mAh",
        imageUrl: "samsung_a56.png", price: 8990000, category: "phone", ownerId
    },

    // ═══════════════ REDMI (dùng redmi.png) ═══════════════
    {
        title: "Redmi Note 14 Pro 8GB/256GB",
        description: "Snapdragon 7s Gen 3 / Camera 200MP / 5G / 6.67 AMOLED 120Hz / Pin 5500mAh / Sạc 45W",
        imageUrl: "redmi.png", price: 8990000, category: "phone", ownerId
    },
    {
        title: "Redmi Note 14 Pro+ 12GB/512GB",
        description: "Snapdragon 7s Gen 3 / Camera 200MP / 5G / 6.67 AMOLED 120Hz / Sạc 90W siêu nhanh",
        imageUrl: "redmi.png", price: 11990000, category: "phone", ownerId
    },
    {
        title: "Redmi 14C 4GB/128GB",
        description: "Helio G81 Ultra / Camera 50MP / 6.88 inch IPS 90Hz / Pin 5160mAh / Sạc 18W",
        imageUrl: "redmi.png", price: 3490000, category: "phone", ownerId
    },
    {
        title: "Redmi A4 4GB/128GB",
        description: "Snapdragon 4 Gen 2 / Camera 50MP / 5G / 6.88 inch 90Hz / Pin 5030mAh / Giá siêu rẻ",
        imageUrl: "redmi.png", price: 2990000, category: "phone", ownerId
    },
];

async function seedFixed() {
    console.log(`\n🚀 Seed ${fixedProducts.length} sản phẩm với ảnh đúng hãng...\n`);
    let success = 0, fail = 0;

    for (const p of fixedProducts) {
        try {
            const res = await fetch(`${FIREBASE_URL}/products.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p)
            });
            if (res.ok) {
                console.log(`✅ [${p.category.toUpperCase()}] ${p.title}`);
                success++;
            } else {
                console.error(`❌ ${res.status}: ${p.title}`);
                fail++;
            }
        } catch (err) {
            console.error(`❌ Lỗi mạng: ${p.title}`);
            fail++;
        }
    }
    console.log(`\n✅ Thành công: ${success}  ❌ Thất bại: ${fail}\n`);
}

seedFixed();
