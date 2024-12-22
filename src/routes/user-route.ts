import Express from "express";
import { login, register } from "../services/user-service";

const router = Express.Router();

router.post('/register', async (req, res) => {
    const result = await register(req.body);
    if(result.status){
        res.status(200).json(result.data);
    }else{
        res.status(500).json(result.data);
    }
});

router.post('/login', async (req, res) => {
    const result = await login(req.body);
    if(result.status){
        res.status(200).json(result.data);
    }else{
        res.status(500).json(result.data);
    }
});


export default router;