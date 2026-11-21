import mongoose from "mongoose";


const certificateSchema = new mongoose.Schema(
    {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true
    },

    certificateNumber: {
      type: String,
      required: true,
      unique: true
    },

    verificationCode: {
      type: String,
      required: true,
      unique: true
    },

    version: {
      type: Number,
      default: 1,
      min: 1
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUPERSEDED", "REVOKED"],
      default: "ACTIVE"
    },

    pdfUrl: {
      type: String
    },

    issuedAt: {
      type: Date,
      default: Date.now
    },

    supersedes: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate"
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);


certificateSchema.index({ studentId: 1, status: 1 });

const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);

export default Certificate;