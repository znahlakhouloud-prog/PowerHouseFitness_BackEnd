import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads", "receipts");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {

        const unique =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

        cb(null, `${unique}${path.extname(file.originalname)}`);

    }

});

const fileFilter = (req, file, cb) => {

    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];

    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG or PDF files are allowed"));
    }

};

const uploadReceipt = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// Wraps multer so file-type/size errors come back as the same JSON
// shape as every other validation error in this app, instead of
// falling through to Express's default HTML error page.
export const handleReceiptUpload = (req, res, next) => {

    uploadReceipt.single("receipt")(req, res, (err) => {

        if (err) {
            return res.status(400).json({ message: err.message });
        }

        next();

    });

};
