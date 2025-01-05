import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from "../models/user-model";

export const validateJwt = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header('authorization')?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload: any) => {
            if (err) {
                console.log(err);
                res.status(401).json({ message: 'Invalid token' });
            }
            else {
                const user = await userModel.findOne({ email: payload.email });
                if (!user) {
                    res.status(401).json({ message: 'Invalid token' });
                    return;
                }
                console.log(payload);
                (req as any).user = user;
                next();
            }
        });


    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
}
