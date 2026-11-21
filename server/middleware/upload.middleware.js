import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            ".csv",
            ".xlsx",
            ".xls"
        ];

        const extension = file.originalname
            .substring(file.originalname.lastIndexOf("."))
            .toLowerCase();

        if (!allowedTypes.includes(extension)) {
            return cb(
                new Error("Only CSV and Excel files are allowed")
            );
        }

        cb(null, true);
    }
});

export default upload;
