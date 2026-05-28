const express = require("express");
const {
  confirmPayment,
  createBooking,
  getAllBookings,
  getMyBookings,
  rejectPayment,
  submitPayment
} = require("../controllers/bookingController");
const { adminOnly, protect } = require("../middleware/authMiddleware");
const { uploadPaymentScreenshot } = require("../middleware/upload");

const router = express.Router();

router.post("/create", protect, createBooking);
router.put("/submit-payment/:id", protect, uploadPaymentScreenshot, submitPayment);
router.get("/my-bookings", protect, getMyBookings);
router.get("/all", protect, adminOnly, getAllBookings);
router.put("/confirm-payment/:id", protect, adminOnly, confirmPayment);
router.put("/reject-payment/:id", protect, adminOnly, rejectPayment);

module.exports = router;
