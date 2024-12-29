import { IProductModel } from "./product-moel";
import { Schema, model } from 'mongoose';

interface ICartItem {
    productId: any;
    quantity: number;
    price: number;
}

export enum CartStatus {
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
    PENDING = 'Pending',
    CANCELLED = 'Cancelled'
}

interface ICart extends Document {
    userId: string;
    items: ICartItem[];
    totalAmount: number;
    status: CartStatus;
}

const cartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    status: { type: String, enum: Object.values(CartStatus), default: CartStatus.ACTIVE },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true, default: 0 }
});

export const CartModel = model<ICart>('Cart', cartSchema);
export type { ICart, ICartItem };