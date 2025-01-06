import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
// Equivalent to __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const uploadPath = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        }
        catch (err) {
            cb(err, '');
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
function fileFilter(req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
    cb(null, true);
}
export const upload = multer({
    storage,
    fileFilter
});
