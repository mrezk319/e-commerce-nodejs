import { model, ObjectId, Schema } from "mongoose"

export interface IOrderItem {
    productName: string,
    quantity: number,
    unitPrice: number,
    img: string
}

interface IOrder extends Document {
    orderItems: IOrderItem[],
    total: number,
    address: string,
    userId: ObjectId | string
}

const orderItemSchema = new Schema<IOrderItem>({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    img: { type: String, required: true },
})

const orderSchema = new Schema<IOrder>({
    orderItems: [orderItemSchema],
    total: { type: Number, required: true },
    address: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

export const orderModel = model<IOrder>('Orders', orderSchema);