import Batch from "../../models/Batch.model.js";
import {
    createBatch,
    getBatchDetails,
    submitBatch,
    uploadStudentFile
} from "./batch.service.js";

export const createBatchController = async (req, res, next) => {
    try {
        const batch = await createBatch(req.body, req.user);

        res.status(201).json({
            success: true,
            message: "Batch created successfully",
            data: batch
        });
    } catch (error) {
        next(error);
    }
};

export const uploadStudents = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const result = await uploadStudentFile(
            req.file,
            req.params.batchId,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Student file uploaded successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getBatchDetailsController = async (req, res, next) => {
    try {
        const batch = await getBatchDetails(
            req.params.batchId,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Batch details fetched successfully",
            data: batch
        });

    } catch (error) {
        next(error);
    }
};

export const submitBatchController = async (req, res, next) => {
    try {
        const batch = await submitBatch(
            req.params.batchId,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Batch submitted for district approval",
            data: batch
        });

    } catch (error) {
        next(error);
    }
};

export const getMyBatches = async (req, res) => {
  try {
    const batches = await Batch.find({
      centreId: req.user._id,
    }).sort({ createdAt: -1 });

    const totalBatches = batches.length;

    const totalStudents = batches.reduce(
      (sum, batch) => sum + batch.totalStudents,
      0
    );

    const passedStudents = batches.reduce(
      (sum, batch) => sum + batch.passedStudents,
      0
    );

    const failedStudents = batches.reduce(
      (sum, batch) => sum + batch.failedStudents,
      0
    );

    res.status(200).json({
      success: true,
      data: {
        batches,
        statistics: {
          totalBatches,
          totalStudents,
          passedStudents,
          failedStudents,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch batches",
    });
  }
};
