import productMoel from "../models/product-moel";

export const calcTotalAmount = async (cart: any) => {
    for (const item of cart.items) {
        const product = await productMoel.findById(item.productId);
        item.price = item.quantity * product.price;
    }
    cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);
    return cart;
}
