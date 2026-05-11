// Seed sản phẩm mới với 5 ảnh vừa được thêm
// Chạy: node seed_new_phones.js

const FIREBASE_URL = 'https://my-ecomerce-2adb6-default-rtdb.asia-southeast1.firebasedatabase.app';
const ownerId = "admin";

const newProducts = [

    // ═══════════════ SAMSUNG Z FOLD 6 ═══════════════
    {
        title: "Samsung Galaxy Z Fold 6 256GB - Navy",
        description: "Snapdragon 8 Gen 3 / Màn hình gập 7.6 inch Dynamic AMOLED / Camera 50MP / 5G / S Pen / AI Galaxy",
        imageUrl: "samsung_zfold.png", price: 46990000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy Z Fold 6 512GB - Navy",
        description: "Snapdragon 8 Gen 3 / 7.6 inch Dynamic AMOLED / Camera 50MP / 5G / 12GB RAM / AI Galaxy",
        imageUrl: "samsung_zfold.png", price: 52990000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy Z Fold 6 1TB - Navy",
        description: "Snapdragon 8 Gen 3 / Màn hình gập lớn nhất 7.6 inch / 1TB lưu trữ khổng lồ / 5G",
        imageUrl: "samsung_zfold.png", price: 58990000, category: "phone", ownerId
    },

    // ═══════════════ SAMSUNG Z FLIP ═══════════════
    {
        title: "Samsung Galaxy Z Flip 6 256GB - Lavender",
        description: "Snapdragon 8 Gen 3 / Màn hình gập dọc 6.7 inch / Camera 50MP / 5G / Sạc 25W / Thời trang",
        imageUrl: "samsung_zflip.png", price: 24990000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy Z Flip 6 512GB - Lavender",
        description: "Snapdragon 8 Gen 3 / 6.7 inch AMOLED / Camera 50MP OIS / 5G / AI Galaxy / Nhỏ gọn thời thượng",
        imageUrl: "samsung_zflip.png", price: 28990000, category: "phone", ownerId
    },
    {
        title: "Samsung Galaxy Z Flip 5 256GB - Lavender",
        description: "Snapdragon 8 Gen 2 / Màn hình phụ lớn 3.4 inch / Camera 12MP / 5G / Pin 3700mAh",
        imageUrl: "samsung_zflip.png", price: 17990000, category: "phone", ownerId
    },

    // ═══════════════ XIAOMI ═══════════════
    {
        title: "Xiaomi 14 12GB/256GB - Đen",
        description: "Snapdragon 8 Gen 3 / Leica Summilux Camera 50MP / 5G / AMOLED 1-120Hz / Sạc 90W / HyperOS",
        imageUrl: "xiaomi14.png", price: 16990000, category: "phone", ownerId
    },
    {
        title: "Xiaomi 14 12GB/512GB - Đen",
        description: "Snapdragon 8 Gen 3 / Leica Camera 50MP / 5G / 6.36 inch AMOLED / Sạc nhanh 90W",
        imageUrl: "xiaomi14.png", price: 19990000, category: "phone", ownerId
    },
    {
        title: "Xiaomi 14 Ultra 16GB/512GB - Đen",
        description: "Snapdragon 8 Gen 3 / Leica Summilux Camera 50MP x4 / 5G / 6.73 inch AMOLED / Sạc 90W",
        imageUrl: "xiaomi14.png", price: 31990000, category: "phone", ownerId
    },
    {
        title: "Xiaomi 14T Pro 12GB/256GB - Đen",
        description: "Dimensity 9300+ / Leica Camera 50MP / 5G / 6.67 inch AMOLED 144Hz / Sạc 120W / HyperOS",
        imageUrl: "xiaomi14.png", price: 17990000, category: "phone", ownerId
    },
    {
        title: "Xiaomi 15 12GB/256GB - Đen",
        description: "Snapdragon 8 Elite / Leica Camera 50MP / 5G / AMOLED 120Hz / Sạc 90W / HyperOS 2.0",
        imageUrl: "xiaomi14.png", price: 22990000, category: "phone", ownerId
    },

    // ═══════════════ OPPO ═══════════════
    {
        title: "OPPO Reno 13 8GB/256GB - Trắng",
        description: "Dimensity 8350 / Camera 50MP OIS / 5G / 6.59 inch AMOLED 120Hz / Sạc 80W / Trắng bạch tuyết",
        imageUrl: "oppo.png", price: 10990000, category: "phone", ownerId
    },
    {
        title: "OPPO Reno 13 Pro 12GB/256GB - Trắng",
        description: "Dimensity 8350 / Camera 50MP OIS / 5G / 6.83 inch AMOLED 120Hz / Sạc 80W / Thiết kế sang trọng",
        imageUrl: "oppo.png", price: 14990000, category: "phone", ownerId
    },
    {
        title: "OPPO Find X8 16GB/512GB - Trắng",
        description: "Dimensity 9400 / Hasselblad Camera 50MP / 5G / 6.59 inch AMOLED LTPO / Sạc 100W",
        imageUrl: "oppo.png", price: 27990000, category: "phone", ownerId
    },
    {
        title: "OPPO Find X8 Pro 16GB/512GB - Trắng",
        description: "Dimensity 9400 / Hasselblad Periscope 50MP / 5G / 6.78 inch AMOLED 120Hz / Sạc 100W",
        imageUrl: "oppo.png", price: 32990000, category: "phone", ownerId
    },
    {
        title: "OPPO A5 Pro 8GB/256GB - Trắng",
        description: "Snapdragon 6 Gen 1 / Camera 50MP / 5G / 6.7 inch LCD 120Hz / Pin 5000mAh / Sạc 45W",
        imageUrl: "oppo.png", price: 7490000, category: "phone", ownerId
    },

    // ═══════════════ REALME ═══════════════
    {
        title: "Realme C65 6GB/128GB - Đen",
        description: "Helio G85 / Camera 50MP AI / 6.67 inch IPS 90Hz / Pin 5000mAh / Sạc 45W / Giá tốt",
        imageUrl: "realme_c65.png", price: 3990000, category: "phone", ownerId
    },
    {
        title: "Realme C65 8GB/256GB - Đen",
        description: "Helio G85 / Camera 50MP AI / 6.67 inch IPS 90Hz / Pin 5000mAh / Sạc 45W / Bộ nhớ lớn",
        imageUrl: "realme_c65.png", price: 4990000, category: "phone", ownerId
    },
    {
        title: "Realme 13 Pro 8GB/256GB",
        description: "Snapdragon 7s Gen 3 / Camera Sony 50MP OIS / 6.7 inch AMOLED 120Hz / 5G / Sạc 67W",
        imageUrl: "realme_c65.png", price: 8490000, category: "phone", ownerId
    },
    {
        title: "Realme 13 Pro+ 12GB/512GB",
        description: "Snapdragon 7s Gen 3 / Camera Sony 50MP OIS / 6.7 inch AMOLED 120Hz / 5G / Sạc 80W",
        imageUrl: "realme_c65.png", price: 11490000, category: "phone", ownerId
    },
    {
        title: "Realme GT 6 12GB/256GB",
        description: "Snapdragon 8s Gen 3 / Camera 50MP / 6.78 inch AMOLED 120Hz / 5G / Sạc siêu nhanh 120W",
        imageUrl: "realme_c65.png", price: 13990000, category: "phone", ownerId
    },
];

async function seedNewPhones() {
    console.log(`\n🚀 Bắt đầu seed ${newProducts.length} sản phẩm mới...\n`);
    let success = 0, fail = 0;

    for (const product of newProducts) {
        try {
            const response = await fetch(`${FIREBASE_URL}/products.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (response.ok) {
                console.log(`✅ [${product.category.toUpperCase()}] ${product.title}`);
                success++;
            } else {
                console.error(`❌ Lỗi ${response.status}: ${product.title}`);
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

seedNewPhones();
