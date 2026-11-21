import mongoose, { model } from "mongoose";



const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: [
                "TRAINING_CENTRE",
                "DISTRICT_OFFICER",
                "STATE_OFFICER"
            ],
            required: true
        },

        centreCode: {
            type: String,
            trim: true
        },

        district: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE"],
            default: "ACTIVE"
        }
    },
    { timestamps: true }
)

const User = mongoose.model("User",userSchema);

export default User;