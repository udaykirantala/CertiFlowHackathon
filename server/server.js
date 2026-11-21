
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js"
import batchesRoutes from "./modules/batches/batch.routes.js"
dotenv.config();

const app = express();

const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use('/api/auth',authRoutes);
app.use('/api/batches',batchesRoutes)

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoUrl);

        console.log(
            `MongoDB connected: ${connection.connection.host}`
        );
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

const startServer = async () => {
    try {
        if (!mongoUrl) {
            throw new Error("MONGO_URL is missing in .env");
        }

        await connectDB();

        app.listen(port, () => {
            console.log(`CertiFlow server running on port ${port}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
