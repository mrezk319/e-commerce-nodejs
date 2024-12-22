import userModel from "../models/user-model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const NAME_MIN_LENGTH = 2;

interface RegisterParam {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface LoginParam {
    email: string;
    password: string;
}

const validateEmail = (email: string | undefined | null): boolean => {
    if (!email) return false;
    return EMAIL_REGEX.test(email);
}

const validateName = (name: string | undefined | null): boolean => {
    if (!name) return false;
    return name.length >= NAME_MIN_LENGTH && /^[a-zA-Z\s]+$/.test(name);
}


export const register = async (data: RegisterParam) => {
    if (!data) {
        return { status: false, data: "No data provided" };
    }

    if (data.firstName === undefined || data.lastName === undefined ||
        data.email === undefined || data.password === undefined) {
        return { status: false, data: "All fields are required" };
    }

    if (!validateName(data.firstName)) {
        return { status: false, data: "First name should be at least 2 characters and contain only letters" };
    }

    if (!validateName(data.lastName)) {
        return { status: false, data: "Last name should be at least 2 characters and contain only letters" };
    }

    if (!validateEmail(data.email)) {
        return { status: false, data: "Please enter a valid email address" };
    }

    if (!data.password || data.password.length < PASSWORD_MIN_LENGTH) {
        return { status: false, data: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` };
    }

    try {

        const userFind = await userModel.findOne({ email: data.email });
        if (userFind) {
            return { status: false, data: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new userModel({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword
        });

        const result = await user.save();
        return { status: true, data: { result, token: generateJWT(data) } };
    } catch (error) {
        return { status: false, data: `${error}` };
    }
}

export const login = async (data: LoginParam) => {
    if (!data) {
        return { status: false, data: "No data provided" };
    }

    if (data.email === undefined || data.password === undefined) {
        return { status: false, data: "Email and password are required" };
    }

    if (!validateEmail(data.email)) {
        return { status: false, data: "Please enter a valid email address" };
    }

    if (!data.password) {
        return { status: false, data: "Password is required" };
    }

    try {
        const user = await userModel.findOne({ email: data.email });
        if (!user) {
            return { status: false, data: "User does not exist" };
        }
        const decryptPassword = await bcrypt.compare(data.password, user.password);
        if (!decryptPassword) {
            return { status: false, data: "Invalid credentials" };
        }

        return {
            status: true,
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: generateJWT(data)
            }
        };
    } catch (error) {
        return { status: false, data: "Error during login" };
    }
}

const keyHash = 'fHsM4Uq7eOWStmBDGhOW9w0TVjkI7gzk';
const generateJWT = (data: any) => {

    return jwt.sign(data, keyHash);

}