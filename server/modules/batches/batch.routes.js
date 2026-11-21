import express from "express";

import {
    authenticate,
    authorize
} from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.middleware.js";

import {
    createBatchController,
    getBatchDetailsController,
    getMyBatches,
    submitBatchController,
    uploadStudents
} from "./batch.controller.js";

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    authorize("TRAINING_CENTRE"),
    createBatchController
);

router.post(
    "/:batchId/upload",
    authorize("TRAINING_CENTRE"),
    upload.single("file"),
    uploadStudents
);

router.get(
  "/",
  authorize("TRAINING_CENTRE"),
  getMyBatches
);

router.get(
    "/:batchId",
    authorize("TRAINING_CENTRE"),
    getBatchDetailsController
);

router.post(
    "/:batchId/submit",
    authorize("TRAINING_CENTRE"),
    submitBatchController
);

export default router;