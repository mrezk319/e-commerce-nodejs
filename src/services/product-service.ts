import productMoel from "../models/product-moel";

export const getAllProducts = async () => await productMoel.find();

export const seedInitialProducts = async () => {
    const initialProducts = [
        {
            title: "هاتف ذكي سامسونج",
            price: 599.99,
            image: "samsung-phone.jpg",
            stock: 15
        },
        {
            title: "حاسوب محمول ديل",
            price: 999.99,
            image: "dell-laptop.jpg",
            stock: 8
        },
        {
            title: "سماعات آبل اللاسلكية",
            price: 199.99,
            image: "airpods.jpg",
            stock: 20
        },
        {
            title: "ساعة ذكية",
            price: 299.99,
            image: "smartwatch.jpg",
            stock: 12
        },
        {
            title: "كاميرا رقمية",
            price: 449.99,
            image: "camera.jpg",
            stock: 6
        },
        {
            title: "جهاز تابلت",
            price: 349.99,
            image: "tablet.jpg",
            stock: 10
        },
        {
            title: "شاشة كمبيوتر",
            price: 279.99,
            image: "monitor.jpg",
            stock: 7
        },
        {
            title: "لوحة مفاتيح لاسلكية",
            price: 79.99,
            image: "keyboard.jpg",
            stock: 25
        },
        {
            title: "ماوس للألعاب",
            price: 59.99,
            image: "gaming-mouse.jpg",
            stock: 18
        },
        {
            title: "مكبر صوت بلوتوث",
            price: 129.99,
            image: "bluetooth-speaker.jpg",
            stock: 14
        }
    ];
    const products = await getAllProducts();
    if (!products || products.length === 0) {
        try {
            await productMoel.insertMany(initialProducts);
            return initialProducts;
        } catch (error) {
            throw error;
        }
    }
};