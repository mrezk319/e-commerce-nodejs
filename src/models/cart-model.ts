import { IProductModel } from "./product-moel";
import { Schema, model } from 'mongoose';

interface ICartItem extends Document {
    product: IProductModel;
    unitPrice: number;
    quantity: number;
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


const cartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 }
});

const cartSchema = new Schema<ICart>({
    userId: { type: String, required: true, ref: 'User' },
    items: [cartItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    status: { 
        type: String, 
        required: true, 
        enum: Object.values(CartStatus), 
        default: CartStatus.ACTIVE 
    }
}, {
    timestamps: true
});

export const CartModel = model<ICart>('Cart', cartSchema);
export type { ICart, ICartItem };