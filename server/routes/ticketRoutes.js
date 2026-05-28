const express = require("express");
const { getTicket, getTicketByTicketId } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/scan/:ticketId", getTicketByTicketId);
router.get("/:bookingId", protect, getTicket);

module.exports = router;
