import { Schema, Document, model } from "mongoose";

interface IProductModel extends Document {
    title: string;
    price: number;
    image: string;
    stock: number;
}

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,

    }
});

export default model<IProductModel>('Product', ProductSchema);