const Bus = require("../models/Bus");
const { isKarnatakaPlace } = require("../utils/karnatakaPlaces");

const phoneRegex = /^[6-9]\d{9}$/;
const busTypes = ["Sleeper", "Semi Sleeper", "AC", "Non-AC", "Express"];

const filePath = (folder, file) => (file ? `/uploads/${folder}/${file.filename}` : "");

const normalizeBusPayload = (body) => ({
  busName: body.busName?.trim(),
  busNumber: body.busNumber?.trim()?.toUpperCase(),
  busType: body.busType,
  from: body.from,
  to: body.to,
  departureTime: body.departureTime,
  arrivalTime: body.arrivalTime,
  journeyDate: body.journeyDate,
  totalSeats: Number(body.totalSeats),
  availableSeats: Number(body.availableSeats),
  price: Number(body.price),
  driverName: body.driverName?.trim(),
  driverPhone: body.driverPhone?.trim()
});

const validateBus = (payload) => {
  const required = [
    "busName",
    "busNumber",
    "busType",
    "from",
    "to",
    "departureTime",
    "arrivalTime",
    "journeyDate",
    "driverName",
    "driverPhone"
  ];

  const missing = required.find((field) => !payload[field]);
  if (missing) {
    return `${missing} is required`;
  }

  if (!busTypes.includes(payload.busType)) {
    return "Select a valid bus type";
  }

  if (!isKarnatakaPlace(payload.from) || !isKarnatakaPlace(payload.to)) {
    return "Only Karnataka routes are allowed";
  }

  if (payload.from === payload.to) {
    return "From and To locations cannot be the same";
  }

  if (!Number.isInteger(payload.totalSeats) || payload.totalSeats <= 0) {
    return "Total seats must be a positive number";
  }

  if (!Number.isInteger(payload.availableSeats) || payload.availableSeats < 0) {
    return "Available seats cannot be negative";
  }

  if (payload.availableSeats > payload.totalSeats) {
    return "Available seats cannot exceed total seats";
  }

  if (!payload.price || payload.price <= 0) {
    return "Ticket price must be greater than zero";
  }

  if (!phoneRegex.test(payload.driverPhone)) {
    return "Driver phone number must be 10 digits";
  }

  return "";
};

const addBus = async (req, res, next) => {
  try {
    const payload = normalizeBusPayload(req.body);
    const error = validateBus(payload);

    if (error) {
      return res.status(400).json({ message: error });
    }

    const bus = await Bus.create({
      ...payload,
      busImage: filePath("buses", req.file)
    });

    return res.status(201).json({ message: "Bus added successfully", bus });
  } catch (error) {
    return next(error);
  }
};

const getBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find().sort({ journeyDate: 1, departureTime: 1 });
    return res.json({ buses });
  } catch (error) {
    return next(error);
  }
};

const getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    return res.json({ bus });
  } catch (error) {
    return next(error);
  }
};

const searchBuses = async (req, res, next) => {
  try {
    const { from, to, journeyDate } = req.query;

    if (!from || !to || !journeyDate) {
      return res.status(400).json({ message: "From, To and Journey Date are required" });
    }

    if (!isKarnatakaPlace(from) || !isKarnatakaPlace(to)) {
      return res.status(400).json({ message: "Only Karnataka places are allowed" });
    }

    if (from === to) {
      return res.status(400).json({ message: "From and To locations cannot be the same" });
    }

    const buses = await Bus.find({
      from,
      to,
      journeyDate,
      availableSeats: { $gt: 0 }
    }).sort({ departureTime: 1 });

    return res.json({ buses });
  } catch (error) {
    return next(error);
  }
};

const updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const payload = normalizeBusPayload({
      ...bus.toObject(),
      ...req.body
    });
    const error = validateBus(payload);

    if (error) {
      return res.status(400).json({ message: error });
    }

    Object.assign(bus, payload);

    if (req.file) {
      bus.busImage = filePath("buses", req.file);
    }

    await bus.save();
    return res.json({ message: "Bus updated successfully", bus });
  } catch (error) {
    return next(error);
  }
};

const deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    await bus.deleteOne();
    return res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addBus,
  deleteBus,
  getBusById,
  getBuses,
  searchBuses,
  updateBus
};
