import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        batchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: true
        },
        studentCode: {
            type: String,
            required: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        courseName: {
            type: String,
            required: true,
            trim: true
        },

        result: {
            type: String,
            enum: ["PASS", "FAIL"],
            required: true
        },

        enrollmentDate: {
            type: Date
        }
    },
    {timestamps:true}
);

studentSchema.index(
    {batchId:1,studentCode:1},
    {unique:true}
);

studentSchema.index({batchId:1,result:1});

const Student = mongoose.model("Student",studentSchema);

export default Student;