import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Middleware for handling file uploads using multer.
 *
 * This middleware configures multer to store uploaded files on disk with a custom naming convention.
 *
 * @returns {multer.Multer} - Configured multer instance.
 *
 * The storage configuration:
 * - `destination`: Ensures the "uploads" directory exists and sets it as the destination for uploaded files.
 * - `filename`: Generates a custom filename for each uploaded file, appending a timestamp to the original name.
 *
 * The multer configuration:
 * - `limits.fileSize`: Sets the maximum allowed file size to 16MB.
 * - `fileFilter`: Restricts the allowed file types to png, jpeg, jpg, pdf, docx, doc, ppt, pptx, and txt.
 *
 * @throws {Error} If the uploaded file type is not allowed.
 */
export const fileUploadMiddlware = () => {
    const storage = multer.diskStorage({
        destination: async function (_req, _file, callback) {
            fs.mkdir("uploads", { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            callback(null, "uploads");
        },
        filename: function (_req, file, callback) {
            const originalName = file.originalname;
            const fileExtension = path.extname(originalName);
            const baseName = path.basename(originalName, fileExtension);

            const customName = `${baseName}-${Date.now()}${fileExtension}`;
            callback(null, customName);
        },
    });
    return multer({
        storage,
        limits: { fileSize: 16000000 },
        fileFilter: function (_req, file, callback) {
            if (
                !file.originalname.match(
                    /\.(png|jpeg|jpg|pdf|docx|doc|ppt|pptx|txt)$/
                )
            ) {
                return callback(
                    new Error(
                        "Please upload a picture, a pdf, test document or a powerpoint(Allowed extensions: png,jpeg,jpg,pdf,docx,doc,ppt,pptx or txt)"
                    )
                );
            }
            callback(null, true);
        },
    }).single("file");
};
