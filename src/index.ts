import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/user-route";
import productRoute from "./routes/product-router";
import cartRoute from "./routes/cart-route";
import { seedInitialProducts } from "./services/product-service";
const app = express();
const PORT = 3000;

mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log("Connected to MongoDB");
}).catch((e) => {
    console.log(e);
}
);

seedInitialProducts();

app.use(express.json());

app.use('/user', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});