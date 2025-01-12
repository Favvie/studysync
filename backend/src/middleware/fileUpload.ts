import multer from "multer";
import path from "path";
import fs from 'fs';

export const fileUploadMiddlware = () => {
  const storage = multer.diskStorage({
    destination: async function (_req, _file, callback) {
        fs.mkdir('uploads', { recursive: true }, (err) => {
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
        !file.originalname.match(/\.(png|jpeg|jpg|pdf|docx|doc|ppt|pptx|txt)$/)
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
