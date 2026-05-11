require('dotenv').config();

const FIREBASE_URL = 'https://my-ecomerce-2adb6-default-rtdb.asia-southeast1.firebasedatabase.app';

const ownerId = "u1";

const phones = [
    // iPhone 15 Pro Max
    { title: "iPhone 15 Pro Max - 256GB", price: 23600000, imageUrl: "iphone15.png", category: "phone", description: "iPhone 15 Pro Max 256GB Chính hãng VN/A", ownerId },
    { title: "iPhone 15 Pro Max - 512GB", price: 29600000, imageUrl: "iphone15.png", category: "phone", description: "iPhone 15 Pro Max 512GB Chính hãng VN/A", ownerId },
    { title: "iPhone 15 Pro Max - 1TB", price: 37600000, imageUrl: "iphone15.png", category: "phone", description: "iPhone 15 Pro Max 1TB Chính hãng VN/A", ownerId },

    // iPhone 16 Pro Max
    { title: "iPhone 16 Pro Max - 256GB", price: 29600000, imageUrl: "iphone16.png", category: "phone", description: "iPhone 16 Pro Max 256GB Chính hãng VN/A. Siêu phẩm mới từ Apple.", ownerId },
    { title: "iPhone 16 Pro Max - 512GB", price: 34500000, imageUrl: "iphone16.png", category: "phone", description: "iPhone 16 Pro Max 512GB Chính hãng VN/A. Bộ nhớ cực lớn.", ownerId },
    { title: "iPhone 16 Pro Max - 1TB", price: 40000000, imageUrl: "iphone16.png", category: "phone", description: "iPhone 16 Pro Max 1TB Chính hãng VN/A. Phá vỡ mọi giới hạn lưu trữ.", ownerId },

    // iPhone 17 Pro Max
    { title: "iPhone 17 Pro Max - 256GB", price: 37600000, imageUrl: "iphone17.png", category: "phone", description: "iPhone 17 Pro Max 256GB - Đỉnh cao công nghệ tương lai.", ownerId },
    { title: "iPhone 17 Pro Max - 512GB", price: 42600000, imageUrl: "iphone17.png", category: "phone", description: "iPhone 17 Pro Max 512GB - Đỉnh cao công nghệ tương lai.", ownerId },
    { title: "iPhone 17 Pro Max - 1TB", price: 47600000, imageUrl: "iphone17.png", category: "phone", description: "iPhone 17 Pro Max 1TB - Không giới hạn sức mạnh.", ownerId },
    { title: "iPhone 17 Pro Max - 2TB", price: 53700000, imageUrl: "iphone17.png", category: "phone", description: "iPhone 17 Pro Max 2TB - Bộ nhớ khổng lồ chưa từng có.", ownerId },

    // Samsung S26 Plus
    { title: "Samsung Galaxy S26 Plus - 256GB", price: 24000000, imageUrl: "s26plus.png", category: "phone", description: "Galaxy S26 Plus 256GB với AI tích hợp thông minh.", ownerId },
    { title: "Samsung Galaxy S26 Plus - 512GB", price: 29000000, imageUrl: "s26plus.png", category: "phone", description: "Galaxy S26 Plus 512GB - Thoải mái lưu trữ dữ liệu.", ownerId },
    { title: "Samsung Galaxy S26 Plus - 1TB", price: 36000000, imageUrl: "s26plus.png", category: "phone", description: "Galaxy S26 Plus 1TB - AI tích hợp toàn diện.", ownerId },

    // Samsung S25 Ultra
    { title: "Samsung Galaxy S25 Ultra - 12GB/256GB", price: 32000000, imageUrl: "s25ultra.png", category: "phone", description: "Siêu phẩm Galaxy S25 Ultra 12GB/256GB - Camera Mắt Thần.", ownerId },
    { title: "Samsung Galaxy S25 Ultra - 12GB/512GB", price: 36000000, imageUrl: "s25ultra.png", category: "phone", description: "Galaxy S25 Ultra 12GB/512GB - Lựa chọn hoàn hảo.", ownerId },
    { title: "Samsung Galaxy S25 Ultra - 16GB/1TB", price: 40000000, imageUrl: "s25ultra.png", category: "phone", description: "Galaxy S25 Ultra 16GB/1TB - Hiệu năng vô đối.", ownerId },
    { title: "Samsung Galaxy S25 Ultra - 16GB/2TB", price: 47000000, imageUrl: "s25ultra.png", category: "phone", description: "Galaxy S25 Ultra 16GB/2TB - Tuyệt tác công nghệ.", ownerId }
];

async function seedPhones() {
    console.log("Seeding phones...");
    for (const phone of phones) {
        const response = await fetch(`${FIREBASE_URL}/products.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(phone)
        });
        if (response.ok) {
            console.log(`✅ Seeded: ${phone.title}`);
        } else {
            console.error(`❌ Error seeding ${phone.title}`);
        }
    }
    console.log("Done!");
}

seedPhones();
