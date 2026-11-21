import mongoose from "mongoose";


const batchSchema = new mongoose.Schema(
    {
    batchName: {
      type: String,
      required: true,
      trim: true
    },

    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    totalStudents: {
      type: Number,
      default: 0,
      min: 0
    },

    passedStudents: {
      type: Number,
      default: 0,
      min: 0
    },

    failedStudents: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "DISTRICT_REVIEW",
        "RETURNED_FOR_CORRECTION",
        "DISTRICT_REJECTED",
        "STATE_REVIEW",
        "STATE_REJECTED",
        "APPROVED",
        "CERTIFICATES_ISSUED"
      ],
      default: "DRAFT"
    },

    requiresExtraScrutiny: {
      type: Boolean,
      default: false
    },

    scrutinyStatus: {
      type: String,
      enum: [
        "NOT_REQUIRED",
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED"
      ],
      default: "NOT_REQUIRED"
    },

    submittedAt: {
      type: Date
    }
  },
   { timestamps: true }
)

batchSchema.index({ centreId: 1, createdAt: -1 });
batchSchema.index({ status: 1, createdAt: -1 });


const Batch = mongoose.model("Batch",batchSchema);

export default Batch;