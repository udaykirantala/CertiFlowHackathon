
import mongoose from "mongoose";
import * as XLSX from "xlsx";

import Batch from "../../models/Batch.model.js";
import Student from "../../models/Student.model.js";


export const createBatch = async (data, user) => {
    const { batchName } = data;

    if (!batchName || !batchName.trim()) {
        throw new Error("Batch name is required");
    }

    const batch = await Batch.create({
        batchName: batchName.trim(),
        centreId: user._id,
        status: "DRAFT"
    });

    return batch;
};


export const uploadStudentFile = async (file, batchId, user) => {

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error("Invalid batch ID");
    }

    const batch = await Batch.findOne({
        _id: batchId,
        centreId: user._id
    });

    if (!batch) {
        throw new Error("Batch not found");
    }

    if (batch.status !== "DRAFT") {
        throw new Error("Only draft batches can receive uploads");
    }

    const workbook = XLSX.read(file.buffer, {
        type: "buffer",
        cellDates: true
    });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
        throw new Error("The uploaded file is empty");
    }

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, {
        defval: ""
    });

    if (!rows.length) {
        throw new Error("No student records found in the file");
    }

    const students = rows.map((row) => ({
        batchId: batch._id,
        studentCode: String(row.studentCode || "").trim(),
        name: String(row.name || "").trim(),
        email: String(row.email || "").trim().toLowerCase(),
        phone: String(row.phone || "").trim(),
        courseName: String(row.courseName || "").trim(),
        result: String(row.result || "").trim().toUpperCase(),
        enrollmentDate: row.enrollmentDate || undefined
    }));

    const invalidRows = [];

    students.forEach((student, index) => {
        if (
            !student.studentCode ||
            !student.name ||
            !student.courseName ||
            !["PASS", "FAIL"].includes(student.result)
        ) {
            invalidRows.push(index + 2);
        }
    });

    if (invalidRows.length) {
        throw new Error(
            `Invalid student data in spreadsheet rows: ${invalidRows.join(", ")}`
        );
    }

    await Student.insertMany(students);


    const passedStudents = students.filter(
        student => student.result === "PASS"
    ).length;

    const failedStudents = students.length - passedStudents;

    batch.totalStudents = students.length;
    batch.passedStudents = passedStudents;
    batch.failedStudents = failedStudents;

    await batch.save();

    return {
        batchId: batch._id,
        totalStudents: students.length,
        passedStudents,
        failedStudents
    };
};


export const getBatchDetails = async (batchId, user) => {
    const batch = await Batch.findOne({
        _id: batchId,
        centreId: user._id
    });

    if (!batch) {
        throw new Error("Batch not found");
    }

    return batch;
};


export const submitBatch = async (batchId, user) => {

    const batch = await Batch.findOne({
        _id: batchId,
        centreId: user._id
    });

    if (!batch) {
        throw new Error("Batch not found");
    }

    if (batch.status !== "DRAFT") {
        throw new Error("Only draft batches can be submitted");
    }

    if (batch.totalStudents === 0) {
        throw new Error("Cannot submit an empty batch");
    }

    batch.status = "SUBMITTED";
    batch.submittedAt = new Date();

    await batch.save();

    return batch;
};






