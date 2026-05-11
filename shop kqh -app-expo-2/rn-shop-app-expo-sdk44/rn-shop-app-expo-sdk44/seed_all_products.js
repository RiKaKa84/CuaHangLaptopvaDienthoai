// Script seed toàn bộ sản phẩm vào Firebase
// Chạy: node seed_all_products.js

const FIREBASE_URL = 'https://my-ecomerce-2adb6-default-rtdb.asia-southeast1.firebasedatabase.app';
const ownerId = "admin";

const products = [

    // ═══════════════ LAPTOP - ASUS ═══════════════
    {
        title: "Laptop ASUS Vivobook 15 X1504ZA-NJ460W",
        description: "Intel Core i5-1235U / 16GB RAM / 512GB SSD / 15.6 inch FHD / Win11 / Bạc",
        imageUrl: "laptop2.png", price: 13990000, category: "laptop", ownerId
    },
    {
        title: "Laptop ASUS Vivobook S 14 FLIP TP3402VA-LZ632W",
        description: "i5-13420H / 16GB / 512GB PCIE / 14.0 WUXGA / Cảm ứng / Bút / Win11 / Bạc",
        imageUrl: "laptop2.png", price: 21490000, category: "laptop", ownerId
    },
    {
        title: "Laptop ASUS ZenBook 14 OLED UX3405MA-PP539W",
        description: "Intel Core Ultra 7 155H / 16GB / 1TB / 14.0 OLED 2.8K 120Hz / Win11",
        imageUrl: "laptop2.png", price: 28990000, category: "laptop", ownerId
    },
    {
        title: "Laptop ASUS ROG Strix G16 G614JI-N4072W",
        description: "i9-13980HX / 16GB / 1TB / RTX 4070 8GB / 16.0 QHD 240Hz / Win11 / Xám",
        imageUrl: "laptop2.png", price: 44990000, category: "laptop", ownerId
    },
    {
        title: "Laptop ASUS TUF Gaming A15 FA507NUR-LP044W",
        description: "Ryzen 7-7435HS / 16GB / 512GB / RTX 4050 6GB / 15.6 FHD 144Hz / Win11",
        imageUrl: "laptop2.png", price: 21990000, category: "laptop", ownerId
    },
    {
        title: "Laptop ASUS Vivobook S14 S3407VA-LY146W",
        description: "Core 5-210H / 16GB / 512GB PCIE / 14.0 WUXGA / Win11 / Bạc",
        imageUrl: "laptop4.png", price: 20390000, category: "laptop", ownerId
    },

    // ═══════════════ LAPTOP - ACER ═══════════════
    {
        title: "Laptop Acer Gaming Aspire 7 A715-59G-57TU",
        description: "i5-12450H / 16GB / 512GB PCIe / VGA RTX3050 6GB / 15.6 FHD 144Hz / Win11",
        imageUrl: "laptop1.png", price: 21490000, category: "laptop", ownerId
    },
    {
        title: "Laptop Acer Aspire 3 A315-510P-394T",
        description: "Intel Core i3-N305 / 8GB / 512GB SSD / 15.6 FHD / Win11 / Bạc",
        imageUrl: "laptop1.png", price: 10490000, category: "laptop", ownerId
    },
    {
        title: "Laptop Acer Swift 14 AI SF14-51-51AL",
        description: "Intel Core Ultra 5-226V / 16GB / 512GB / 14.0 2.8K OLED / Win11",
        imageUrl: "laptop1.png", price: 23990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Acer Predator Helios Neo 16 PHN16-71-72J6",
        description: "i7-13700HX / 16GB / 1TB / RTX 4060 8GB / 16.0 FHD 165Hz / Win11",
        imageUrl: "laptop1.png", price: 36990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Acer Nitro 5 AN515-58-50TJ",
        description: "i5-12500H / 8GB / 512GB / RTX 3050 4GB / 15.6 FHD 144Hz / Win11",
        imageUrl: "laptop1.png", price: 19990000, category: "laptop", ownerId
    },

    // ═══════════════ LAPTOP - DELL ═══════════════
    {
        title: "Laptop Dell 14 DC14250 DC4C5386W",
        description: "Core 5-120U / 16GB / 512GB PCIE / 14.0 FHD+ / Win11 + Office / Bạc",
        imageUrl: "laptop3.png", price: 21990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Dell Inspiron 15 3520 71054297",
        description: "i5-1235U / 16GB / 512GB SSD / 15.6 FHD / Win11 / Office / Bạc",
        imageUrl: "laptop3.png", price: 15490000, category: "laptop", ownerId
    },
    {
        title: "Laptop Dell Inspiron 14 5440 N7I5107W1",
        description: "Intel Core 5-120U / 16GB / 512GB SSD / 14.0 FHD+ / Win11 / Office",
        imageUrl: "laptop3.png", price: 19990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Dell XPS 14 9440 71093737",
        description: "Intel Core Ultra 7-155H / 32GB / 1TB / 14.5 OLED 3.2K / Win11",
        imageUrl: "laptop3.png", price: 52990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Dell Gaming G16 7630 G16-7630-i9RTX4070",
        description: "i9-13900HX / 32GB / 1TB / RTX 4070 8GB / 16.0 QHD+ 240Hz / Win11",
        imageUrl: "laptop3.png", price: 59990000, category: "laptop", ownerId
    },

    // ═══════════════ LAPTOP - LENOVO ═══════════════
    {
        title: "Laptop Lenovo IdeaPad Slim 3 15IRH8 83EM0045VN",
        description: "i5-13420H / 16GB / 512GB / 15.6 FHD IPS / Win11 / Xám",
        imageUrl: "laptop4.png", price: 14990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo ThinkPad E14 Gen 5 21JK00AMVN",
        description: "i5-1335U / 16GB / 512GB / 14.0 WUXGA / Win11 Pro / Đen",
        imageUrl: "laptop4.png", price: 22490000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo Yoga 7 2-in-1 14AHP9 83DL001AVN",
        description: "Ryzen 7-8840HS / 16GB / 512GB / 14.0 WUXGA IPS Cảm ứng / Win11",
        imageUrl: "laptop4.png", price: 26990000, category: "laptop", ownerId
    },
    {
        title: "Laptop Lenovo Legion 5 16IRX9 83DG00AUVN",
        description: "i7-14650HX / 16GB / 512GB / RTX 4060 8GB / 16.0 WQXGA 165Hz / Win11",
        imageUrl: "laptop4.png", price: 34990000, category: "laptop", ownerId
    },

    // ═══════════════ LAPTOP - APPLE MACBOOK ═══════════════
    {
        title: "MacBook Air 13 inch M3 MRXN3SA/A 8GB/256GB",
        description: "Apple M3 8 CPU / 10 GPU / 8GB / 256GB / 13.6 inch Liquid Retina / Vàng sao",
        imageUrl: "laptop5.png", price: 27990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Air 13 inch M3 MRXV3SA/A 8GB/512GB",
        description: "Apple M3 8 CPU / 10 GPU / 8GB / 512GB / 13.6 inch Liquid Retina / Đêm khuya",
        imageUrl: "laptop5.png", price: 34990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Pro 14 inch M4 Pro MX2W3SA/A",
        description: "Apple M4 Pro 12 CPU / 20 GPU / 24GB / 512GB / 14.2 inch Liquid Retina XDR",
        imageUrl: "laptop5.png", price: 59990000, category: "laptop", ownerId
    },
    {
        title: "MacBook Pro 16 inch M4 Pro MX2Y3SA/A",
        description: "Apple M4 Pro 14 CPU / 20 GPU / 24GB / 512GB / 16.2 inch Liquid Retina XDR",
        imageUrl: "laptop5.png", price: 72990000, category: "laptop", ownerId
    },

    // ═══════════════ LAPTOP - HP ═══════════════
    {
        title: "Laptop HP 240 G9 6L1X1PA",
        description: "i3-1215U / 8GB / 256GB SSD / 14.0 FHD / Win11 / Bạc",
        imageUrl: "laptop3.png", price: 9990000, category: "laptop", ownerId
    },
    {
        title: "Laptop HP Pavilion 15-eg3099TU 8U7H1PA",
        description: "i5-1335U / 16GB / 512GB / 15.6 FHD IPS / Win11 + Office / Bạc",
        imageUrl: "laptop3.png", price: 17490000, category: "laptop", ownerId
    },
    {
        title: "Laptop HP Envy x360 14-fa0067AU A9V56PA",
        description: "Ryzen 5 8645HS / 16GB / 512GB / 14.0 WUXGA OLED Cảm ứng / Win11",
        imageUrl: "laptop3.png", price: 24990000, category: "laptop", ownerId
    },
    {
        title: "Laptop HP Omen 16-xf0097AX 9J2C3PA",
        description: "Ryzen 9 7945HX / 16GB / 1TB / RX7700S 8GB / 16.1 QHD 165Hz / Win11",
        imageUrl: "laptop3.png", price: 39990000, category: "laptop", ownerId
    },

    // ═══════════════ ĐIỆN THOẠI - IPHONE ═══════════════
    {
        title: "iPhone 15 Pro Max 256GB Chính hãng VN/A",
        description: "Chip A17 Pro / Khung Titan / Camera 48MP / 5G / Pin 4422mAh / iOS 17",
        imageUrl: "iphone15.png", price: 23600000, category: "phone", ownerId
    },
    {
        title: "iPhone 15 Pro Max 512GB Chính hãng VN/A",
        description: "Chip A17 Pro / Khung Titan / Camera 48MP / 5G / Lưu trữ cực lớn",
        imageUrl: "iphone15.png", price: 29600000, category: "phone", ownerId
    },
    {
        title: "iPhone 16 Pro Max 256GB Chính hãng VN/A",
        description: "Chip A18 Pro / Camera 48MP 5x / 5G / iOS 18 / Apple Intelligence",
        imageUrl: "iphone16.png", price: 29600000, category: "phone", ownerId
    },
    {
        title: "iPhone 16 Pro Max 512GB Chính hãng VN/A",
        description: "Chip A18 Pro / Camera 48MP 5x / 5G / Apple Intelligence / Titan Desert",
        imageUrl: "iphone16.png", price: 34500000, category: "phone", ownerId
    },
    {
        title: "iPhone 16 Pro Max 1TB Chính hãng VN/A",
        description: "Chip A18 Pro / Camera 48MP / 5G / Bộ nhớ 1TB cực khủng",
        imageUrl: "iphone16.png", price: 40000000, category: "phone", ownerId
    },
    {
        title: "iPhone 16 128GB Chính hãng VN/A",
        description: "Chip A18 / Camera 48MP / Dynamic Island / 5G / iOS 18",
        imageUrl: "iphone16.png", price: 22990000, category: "phone", ownerId
    },

    // ═══════════════ ĐIỆN THOẠI - SAMSUNG ═══════════════
    {
        title: "Samsung Galaxy S25 Ultra 12GB/256GB",
        description: "Snapdragon 8 Elite / Bút S Pen / Camera 200MP / 5G / AI Galaxy",
        imageUrl: "s25ultra.png", price: 32000000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy S25 Ultra 12GB/512GB",
        description: "Snapdragon 8 Elite / Bút S Pen / Camera 200MP / 5G / Titanium Gray",
        imageUrl: "s25ultra.png", price: 36000000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy S25 Ultra 16GB/1TB",
        description: "Snapdragon 8 Elite / S Pen / Camera 200MP / 5G / Hiệu năng đỉnh",
        imageUrl: "s25ultra.png", price: 40000000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy S26 Plus 256GB",
        description: "Snapdragon 8 Elite Gen 2 / Camera 50MP / 5G / Galaxy AI nâng cấp",
        imageUrl: "s26plus.png", price: 24000000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy S26 Plus 512GB",
        description: "Snapdragon 8 Elite Gen 2 / Camera 50MP / 5G / AI tích hợp toàn diện",
        imageUrl: "s26plus.png", price: 29000000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy Z Fold 6 256GB",
        description: "Snapdragon 8 Gen 3 / Màn hình gập 7.6 inch / 5G / S Pen / Camera 50MP",
        imageUrl: "s25ultra.png", price: 46000000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy Z Flip 6 256GB",
        description: "Snapdragon 8 Gen 3 / Màn hình gập nhỏ gọn / Camera 50MP / 5G",
        imageUrl: "s26plus.png", price: 24990000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy A56 8GB/256GB",
        description: "Exynos 1580 / Camera 50MP OIS / 5G / 6.7 inch 120Hz / Pin 5000mAh",
        imageUrl: "s26plus.png", price: 11990000, category: "phone", ownerId
    },

    // ═══════════════ ĐIỆN THOẠI - XIAOMI ═══════════════
    {
        title: "Xiaomi 14 Ultra 16GB/512GB",
        description: "Snapdragon 8 Gen 3 / Leica Camera 50MP / 5G / 90W Sạc nhanh / Đen",
        imageUrl: "iphone16.png", price: 31990000, category: "phone", ownerId
    },
    {
        title: "Xiaomi 14T Pro 12GB/256GB",
        description: "Dimensity 9300+ / Leica Camera 50MP / 5G / 144Hz AMOLED / Sạc 120W",
        imageUrl: "iphone16.png", price: 17990000, category: "phone", ownerId
    },
    {
        title: "Redmi Note 14 Pro 12GB/256GB",
        description: "Snapdragon 7s Gen 3 / Camera 200MP / 5G / AMOLED 120Hz / Pin 5500mAh",
        imageUrl: "s26plus.png", price: 8990000, category: "phone", ownerId
    },

    // ═══════════════ ĐIỆN THOẠI - OPPO ═══════════════
    {
        title: "OPPO Find X8 Pro 16GB/512GB",
        description: "Dimensity 9400 / Camera Hasselblad 50MP / 5G / 100W Sạc nhanh",
        imageUrl: "iphone15.png", price: 27990000, category: "phone", ownerId
    },
    {
        title: "OPPO Reno 13 Pro 5G 12GB/256GB",
        description: "Dimensity 8350 / Camera 50MP OIS / 5G / AMOLED 120Hz / Sạc 80W",
        imageUrl: "iphone15.png", price: 14990000, category: "phone", ownerId
    },
    {
        title: "OPPO A5 Pro 8GB/256GB",
        description: "Snapdragon 6 Gen 1 / Camera 50MP / 5G / 6.7 inch 120Hz / Pin 5000mAh",
        imageUrl: "s26plus.png", price: 7490000, category: "phone", ownerId
    },

    // ═══════════════ ĐIỆN THOẠI - GOOGLE PIXEL ═══════════════
    {
        title: "Google Pixel 9 Pro 128GB",
        description: "Google Tensor G4 / Camera 50MP AI / 5G / 6.3 inch OLED / Android 15",
        imageUrl: "iphone16.png", price: 25990000, category: "phone", ownerId
    },
    {
        title: "Google Pixel 9 Pro XL 256GB",
        description: "Google Tensor G4 / Camera 50MP AI / 5G / 6.8 inch OLED / 30W Sạc",
        imageUrl: "iphone16.png", price: 32990000, category: "phone", ownerId
    },
];

async function seedAll() {
    console.log(`\n🚀 Bắt đầu seed ${products.length} sản phẩm...\n`);
    let success = 0, fail = 0;

    for (const product of products) {
        try {
            const response = await fetch(`${FIREBASE_URL}/products.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ [${product.category.toUpperCase()}] ${product.title}`);
                success++;
            } else {
                console.error(`❌ Lỗi HTTP ${response.status}: ${product.title}`);
                fail++;
            }
        } catch (err) {
            console.error(`❌ Lỗi mạng: ${product.title} →`, err.message);
            fail++;
        }
    }

    console.log(`\n═══════════════════════════════`);
    console.log(`✅ Thành công: ${success} sản phẩm`);
    if (fail > 0) console.log(`❌ Thất bại:  ${fail} sản phẩm`);
    console.log(`═══════════════════════════════\n`);
}

seedAll();
