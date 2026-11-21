import User from "../../models/User.model.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";


export const registerUser = async (data) => {
    const { name, email, password, centreCode, district } = data;

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "TRAINING_CENTRE",
        centreCode,
        district
    })
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};


export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new Error("Invalid email or password")
    }

    if (user.status !== 'ACTIVE') {
        throw new Error("Account is inactive");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}