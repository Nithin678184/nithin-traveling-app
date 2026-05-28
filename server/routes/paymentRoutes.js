const express = require("express");
const { getQR, uploadQR } = require("../controllers/paymentController");
const { adminOnly, protect } = require("../middleware/authMiddleware");
const { uploadQRImage } = require("../middleware/upload");

const router = express.Router();

router.post("/upload-qr", protect, adminOnly, uploadQRImage, uploadQR);
router.get("/qr", getQR);

module.exports = router;
