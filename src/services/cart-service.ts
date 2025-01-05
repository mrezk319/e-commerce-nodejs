import { CartModel, CartStatus } from "../models/cart-model";
import { IOrderItem, orderModel } from "../models/order-model";
import productModel from "../models/product-moel";

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
    const product = await productModel.findById(productId);

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

    cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);

    const updatedCart = await cart.save();
    return {
        success: true,
        message: "Item added successfully",
        data: updatedCart
    };
}

async function recalculateCartPrices(cart: any) {
    for (const item of cart.items) {
        const product = await productModel.findById(item.productId);
        item.price = item.quantity * product.price;
    }
    cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);
    return cart;
}

export async function updateItemToCart({ userId, productId, quantity }: {
    userId: string;
    productId: string;
    quantity: number;
}) {
    const cart = await CartModel.findOne({
        userId,
        status: CartStatus.ACTIVE
    });

    if (!cart) {
        return {
            success: false,
            message: 'No active cart found'
        };
    }

    const itemIndex = cart.items.findIndex(item =>
        item.productId.toString() === productId
    );

    if (itemIndex === -1) {
        return {
            success: false,
            message: 'Product not found in cart'
        };
    }

    if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
    } else {
        cart.items[itemIndex].quantity = quantity;
    }

    await recalculateCartPrices(cart);
    const updatedCart = await cart.save();
    return {
        success: true,
        message: 'Cart updated successfully',
        data: updatedCart
    };
}

export async function deleteItemFromCart({ userId, productId }: {
    userId: string;
    productId: string;
}) {
    const cart = await getActiveCarts({ userId });

    if (!cart) {
        return {
            success: false,
            message: 'No active cart found'
        };
    }

    const itemIndex = cart.items.findIndex(item =>
        item.productId.toString() === productId
    );

    if (itemIndex === -1) {
        return {
            success: false,
            message: 'Product not found in cart'
        };
    }

    cart.items.splice(itemIndex, 1);

    cart.totalAmount = cart.items.reduce((total, item) => total + item.price, 0);

    const updatedCart = await cart.save();
    return {
        success: true,
        message: 'Item removed from cart successfully',
        data: updatedCart
    };
}

export async function clearCart({ userId }: { userId: string }) {
    const cart = await getActiveCarts({ userId });

    if (!cart) {
        return {
            success: false,
            message: 'No active cart found'
        };
    }

    // مسح جميع العناصر من السلة
    cart.items = [];
    cart.totalAmount = 0;

    const updatedCart = await cart.save();
    return {
        success: true,
        message: 'Cart cleared successfully',
        data: updatedCart
    };
}

interface ICheckout {
    userId: string;
    address: string;
}
export const checkout = async ({ userId, address }: ICheckout) => {
    if (!address) { return { success: false, message: 'Address is required', }; } console.log('Fetching active cart for user:', userId); const activeCart = await getActiveCarts({ userId }); if (!activeCart || !activeCart.items || activeCart.items.length === 0) {
        return { status: false, message: "There is no active cart" };
    } console.log('Active cart found:', activeCart); const orderItems: IOrderItem[] = [];
    for (const item of activeCart.items) {
        console.log('Fetching product for item:', item);
        const product = await productModel.findById(item.productId);
        if (!product) {
            return { status: false, message: `Product with id ${item.productId} not found` };
        }

        const orderItem: IOrderItem = { productName: product.title, unitPrice: product.price, quantity: item.quantity, img: product.image };
        orderItems.push(orderItem);
    } console.log('Order items created:', orderItems);
    const order = await orderModel.create({ userId: userId, orderItems: orderItems, total: activeCart.totalAmount, address: address });
    console.log('Order created:', order); await order.save(); activeCart.status = CartStatus.PENDING;
    await activeCart.save();
    return { success: true, message: 'Order created successfully', };
};