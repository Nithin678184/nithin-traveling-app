const fs = require("fs");
const multer = require("multer");
const path = require("path");

const ensureFolder = (folder) => {
  const target = path.join(__dirname, "..", "uploads", folder);
  fs.mkdirSync(target, { recursive: true });
  return target;
};

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, ensureFolder(folder));
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "-");
      cb(null, `${Date.now()}-${safeName}`);
    }
  });

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image uploads are allowed"));
  }

  return cb(null, true);
};

const makeUploader = (folder) =>
  multer({
    storage: createStorage(folder),
    fileFilter: imageFilter,
    limits: { fileSize: 4 * 1024 * 1024 }
  });

module.exports = {
  uploadBusImage: makeUploader("buses").single("busImage"),
  uploadPaymentScreenshot: makeUploader("payments").single("paymentScreenshot"),
  uploadQRImage: makeUploader("qr").single("qrImage")
};
