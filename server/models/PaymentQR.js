const mongoose = require("mongoose");

const paymentQRSchema = new mongoose.Schema(
  {
    qrImage: {
      type: String,
      required: [true, "QR image is required"]
    },
    uploadedByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentQR", paymentQRSchema);
