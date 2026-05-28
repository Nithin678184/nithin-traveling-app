const PaymentQR = require("../models/PaymentQR");

const uploadQR = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "QR code image is required" });
    }

    const qr = await PaymentQR.create({
      qrImage: `/uploads/qr/${req.file.filename}`,
      uploadedByAdmin: req.user._id
    });

    return res.status(201).json({ message: "Payment QR uploaded successfully", qr });
  } catch (error) {
    return next(error);
  }
};

const getQR = async (req, res, next) => {
  try {
    const qr = await PaymentQR.findOne().sort({ createdAt: -1 }).populate("uploadedByAdmin", "name email");
    return res.json({ qr });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getQR, uploadQR };
