const express = require("express");
const {
  addBus,
  deleteBus,
  getBusById,
  getBuses,
  searchBuses,
  updateBus
} = require("../controllers/busController");
const { adminOnly, protect } = require("../middleware/authMiddleware");
const { uploadBusImage } = require("../middleware/upload");

const router = express.Router();

router.get("/search", searchBuses);
router.post("/add", protect, adminOnly, uploadBusImage, addBus);
router.get("/", getBuses);
router.get("/:id", getBusById);
router.put("/:id", protect, adminOnly, uploadBusImage, updateBus);
router.delete("/:id", protect, adminOnly, deleteBus);

module.exports = router;
