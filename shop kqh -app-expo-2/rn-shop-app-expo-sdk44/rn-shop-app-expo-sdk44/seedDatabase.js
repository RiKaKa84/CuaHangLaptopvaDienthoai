// Using native fetch in Node 24

const DATABASE_URL = 'https://my-ecomerce-2adb6-default-rtdb.asia-southeast1.firebasedatabase.app';

const laptops = [
    {
        title: 'Laptop Acer Gaming Aspire 7 A715-59G-57TU',
        description: 'I5-12450H/16GB/512GB PCIE/VGA 6GB RTX3050/15.6 FHD 144HZ/WIN11',
        imageUrl: 'laptop1.png',
        price: 21490000,
        ownerId: 'admin'
    },
    {
        title: 'Laptop ASUS Vivobook S 14 FLIP TP3402VA-LZ632W',
        description: 'I5-13420H/16GB/512GB PCIE/14.0 WUXGA/CẢM ỨNG/BÚT/WIN11/BẠC',
        imageUrl: 'laptop2.png',
        price: 21490000,
        ownerId: 'admin'
    },
    {
        title: 'Laptop Dell 14 DC14250 DC4C5386W',
        description: 'CORE 5-120U/16GB/512GB PCIE/14.0 FHD+/WIN11 + OFFICE/BẠC',
        imageUrl: 'laptop3.png',
        price: 21990000,
        ownerId: 'admin'
    },
    {
        title: 'Laptop ASUS Vivobook S14 S3407VA-LY146W',
        description: 'CORE 5-210H/16GB/512GB PCIE/14.0 WUXGA/WIN11/BẠC',
        imageUrl: 'laptop4.png',
        price: 20390000,
        ownerId: 'admin'
    },
    {
        title: 'MacBook Neo 13 inch A18 Pro 2026',
        description: '6CPU 5GPU 8GB 512GB Touch ID | Chính hãng Apple Việt Nam',
        imageUrl: 'laptop5.png',
        price: 18490000,
        ownerId: 'admin'
    }
];

async function seed() {
    console.log('Starting seed...');
    for (const laptop of laptops) {
        try {
            const response = await fetch(`${DATABASE_URL}/products.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(laptop)
            });
            const data = await response.json();
            console.log(`Seeded ${laptop.title}:`, data);
        } catch (err) {
            console.error(`Error seeding ${laptop.title}:`, err);
        }
    }
    console.log('Seed complete!');
}

seed();
