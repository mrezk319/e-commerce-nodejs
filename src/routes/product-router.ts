import express from "express";
import { getAllProducts } from "../services/product-service";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allProducts = await getAllProducts();
        res.status(200).json(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            message: "An error occurred while fetching products",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

export default router;