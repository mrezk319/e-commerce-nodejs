import express from "express";
import { addItemsToCart, deleteItemFromCart, getActiveCarts, updateItemToCart } from "../services/cart-service";
import { CartStatus } from "../models/cart-model";
import { validateJwt } from "../middlwares/validate-jwt";

const route = express.Router();

route.get('/', validateJwt, async (req: express.Request, res: express.Response) => {
    const user = req.user;
    const cart = await getActiveCarts({ userId: user._id, status: CartStatus.ACTIVE });
    res.status(200).json(cart);
});

route.post('/items', validateJwt, async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const response = await addItemsToCart({ userId, productId, quantity });
    res.json(response);
});

route.put('/items', validateJwt, async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const response = await updateItemToCart({ userId, productId, quantity });
    res.json(response);
});

route.delete('/items/:productId', validateJwt, async (req, res) => {
    const userId = req.user._id;
    const { productId }
        = req.params;
    const response = await deleteItemFromCart({ userId, productId });
    res.json(response);
});


export default route;

