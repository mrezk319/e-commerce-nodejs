import express from "express";
import { addItemsToCart, checkout, clearCart, deleteItemFromCart, getActiveCarts, updateItemToCart } from "../services/cart-service";
import { CartStatus } from "../models/cart-model";
import { validateJwt } from "../middlwares/validate-jwt";

const route = express.Router();

route.get('/', validateJwt, async (req: express.Request, res: express.Response) => {
    try {
        const user = req.user;
        const cart = await getActiveCarts({ userId: user._id, status: CartStatus.ACTIVE });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

route.post('/items', validateJwt, async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        const response = await addItemsToCart({ userId, productId, quantity });
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

route.put('/items', validateJwt, async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;
        const response = await updateItemToCart({ userId, productId, quantity });
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

route.delete('/items/:productId', validateJwt, async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId } = req.params;
        const response = await deleteItemFromCart({ userId, productId });
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

route.delete('/clear', validateJwt, async (req, res) => {
    try {
        const userId = req.user._id;
        const response = await clearCart({ userId });
        res.json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

route.post('/checkout', validateJwt, async (req, res) => {
    const userId = req.user._id;
    const { address } = req.body;
    const response = await checkout({ userId, address: address });
    res.send(response);
});
export default route;

