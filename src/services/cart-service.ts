import { CartModel, CartStatus } from "../models/cart-model";

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
    status: CartStatus;
}

export const getActiveCarts = async ({ userId }: GetCartForUser) => {
    let cart = await CartModel.findOne({ userId, status: CartStatus.ACTIVE });
    if (!cart) {
        cart = await createCart({ userId });
    }
    return cart;
}