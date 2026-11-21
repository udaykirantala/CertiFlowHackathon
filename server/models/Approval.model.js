import mongoose from "mongoose";


const approvalSchema = new mongoose.Schema({
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true
    },

    officerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    stage: {
        type: String,
        enum: ["DISTRICT", "STATE", "EXTRA_SCRUTINY"],
        required: true
    },

    decision: {
        type: String,
        enum: [
            "APPROVED",
            "REJECTED",
            "RETURNED_FOR_CORRECTION",
            "SCRUTINY_COMPLETED"
        ],
        required: true
    },

    remarks: {
        type: String,
        trim: true
    },

    decidedAt: {
        type: Date,
        default: Date.now
    }
},
{timestamps:true}
)

approvalSchema.index({ batchId: 1, decidedAt: -1 });
approvalSchema.index({ officerId: 1, decidedAt: -1 });

const Approval = mongoose.model("Approval",approvalSchema);
export default Approval;