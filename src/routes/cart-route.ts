import express from "express";
import { getActiveCarts } from "../services/cart-service";
import { CartStatus } from "../models/cart-model";
import { validateJwt } from "../middlwares/validate-jwt";

const route = express.Router();

route.get('/', validateJwt, async (req: express.Request, res: express.Response) => {
    const user = req.user;
    const cart = await getActiveCarts({ userId: user._id, status: CartStatus.ACTIVE });
    res.status(200).json(cart);
});

export default route;