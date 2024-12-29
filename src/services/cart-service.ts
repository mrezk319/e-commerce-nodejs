import { CartModel, CartStatus } from "../models/cart-model";
import productMoel from "../models/product-moel";

interface CreateCartForUser {
    userId: string;
}

export const createCart = async ({ userId }: CreateCartForUser) => {
    const cart = CartModel.create({ userId });
    (await cart).save();
    return cart;
}

interface GetCartForUser {
    userId: string;
    status?: CartStatus;
}

export const getActiveCarts = async ({ userId, status = CartStatus.ACTIVE }: GetCartForUser) => {
    let cart = await CartModel.findOne({ userId, status: status });
    if (!cart) {
        cart = await createCart({ userId });
    }
    return cart;
}


interface AddItemToCart {
    userId: string;
    productId: any;
    quantity: number;
}

export const addItemsToCart = async ({ userId, productId, quantity }: AddItemToCart) => {
    // Input validations
    if (!userId || !productId || !quantity) {
        return {
            success: false,
            message: 'All fields (userId, productId, quantity) are required'
        };
    }

    if (quantity <= 0) {
        return {
            success: false,
            message: 'Quantity must be greater than zero'
        };
    }

    const cart = await getActiveCarts({ userId });
    const product = await productMoel.findById(productId);

    if (!product) {
        return {
            success: false,
            message: 'Product not found'
        };
    }
    if (product.stock && product.stock < quantity) {
        return {
            success: false,
            message: 'Requested quantity is not available in stock'
        };
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId.toString());

    if (existingItem) {
        if (product.stock && (existingItem.quantity + quantity) > product.stock) {
            return {
                success: false,
                message: 'Total quantity exceeds available stock'
            };
        }
        existingItem.quantity += quantity;
        existingItem.price = existingItem.quantity * product.price;
    } else {
        cart.items.push({
            productId,
            quantity,
            price: quantity * product.price
        });
    }

    const updatedCart = await cart.save();
    return {
        success: true,
        message: "Item added successfully",
        data: updatedCart
    };
}
