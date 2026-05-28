const Booking = require("../models/Booking");
const Bus = require("../models/Bus");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;

const parseSeatNumbers = (seatNumbers) => {
  if (!seatNumbers) {
    return [];
  }

  if (Array.isArray(seatNumbers)) {
    return seatNumbers.map((seat) => String(seat).trim()).filter(Boolean);
  }

  return String(seatNumbers)
    .split(",")
    .map((seat) => seat.trim())
    .filter(Boolean);
};

const generateSeatNumbers = async (bus, requestedSeats, numberOfSeats) => {
  const bookings = await Booking.find({
    busId: bus._id,
    bookingStatus: { $ne: "Cancelled" },
    paymentStatus: { $ne: "Rejected" }
  }).select("seatNumbers");

  const usedSeats = new Set(bookings.flatMap((booking) => booking.seatNumbers));
  const requested = parseSeatNumbers(requestedSeats);

  if (requested.length) {
    if (requested.length !== numberOfSeats) {
      throw Object.assign(new Error("Seat count should match selected seats"), { statusCode: 400 });
    }

    const invalidSeat = requested.find((seat) => {
      const seatNumber = Number(seat.replace(/\D/g, ""));
      return !seatNumber || seatNumber < 1 || seatNumber > bus.totalSeats;
    });

    if (invalidSeat) {
      throw Object.assign(new Error("Selected seat number is invalid"), { statusCode: 400 });
    }

    const unavailable = requested.find((seat) => usedSeats.has(seat));
    if (unavailable) {
      throw Object.assign(new Error(`Seat ${unavailable} is already selected`), { statusCode: 400 });
    }

    return requested;
  }

  const seats = [];
  for (let index = 1; index <= bus.totalSeats && seats.length < numberOfSeats; index += 1) {
    const label = `S${index}`;
    if (!usedSeats.has(label)) {
      seats.push(label);
    }
  }

  if (seats.length < numberOfSeats) {
    throw Object.assign(new Error("Not enough seats are available"), { statusCode: 400 });
  }

  return seats;
};

const validateBookingPayload = ({ passengerName, age, gender, phone, email, numberOfSeats }) => {
  if (!passengerName || !age || !gender || !phone || !email || !numberOfSeats) {
    return "All booking fields are required";
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    return "Select a valid gender";
  }

  if (!emailRegex.test(email)) {
    return "Enter a valid email address";
  }

  if (!phoneRegex.test(phone)) {
    return "Phone number must be 10 digits";
  }

  if (!Number.isInteger(Number(numberOfSeats)) || Number(numberOfSeats) <= 0) {
    return "Number of seats must be at least 1";
  }

  return "";
};

const createBooking = async (req, res, next) => {
  try {
    const { busId, passengerName, age, gender, phone, email, numberOfSeats, seatNumbers } = req.body;
    const error = validateBookingPayload({ passengerName, age, gender, phone, email, numberOfSeats });

    if (error) {
      return res.status(400).json({ message: error });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const seatsCount = Number(numberOfSeats);
    if (seatsCount > bus.availableSeats) {
      return res.status(400).json({ message: "Seats requested exceed available seats" });
    }

    const assignedSeats = await generateSeatNumbers(bus, seatNumbers, seatsCount);
    const booking = await Booking.create({
      passengerId: req.user._id,
      busId: bus._id,
      passengerName,
      age: Number(age),
      gender,
      phone,
      email,
      numberOfSeats: seatsCount,
      seatNumbers: assignedSeats,
      totalAmount: seatsCount * bus.price,
      paymentStatus: "Pending",
      bookingStatus: "Pending"
    });

    const populatedBooking = await Booking.findById(booking._id).populate("busId");
    return res.status(201).json({
      message: "Booking created. Complete QR payment to request confirmation.",
      booking: populatedBooking
    });
  } catch (error) {
    return next(error);
  }
};

const submitPayment = async (req, res, next) => {
  try {
    const { transactionId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.passengerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can update only your booking" });
    }

    if (!transactionId || !transactionId.trim()) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    booking.transactionId = transactionId.trim();
    booking.paymentStatus = "Pending";
    booking.bookingStatus = "Pending";
    if (req.file) {
      booking.paymentScreenshot = `/uploads/payments/${req.file.filename}`;
    }

    await booking.save();
    const populatedBooking = await Booking.findById(booking._id).populate("busId");
    return res.json({
      message: "Payment submitted. Admin will verify and confirm your ticket.",
      booking: populatedBooking
    });
  } catch (error) {
    return next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ passengerId: req.user._id })
      .populate("busId")
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (error) {
    return next(error);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("passengerId", "name email phone role")
      .populate("busId")
      .sort({ createdAt: -1 });

    return res.json({ bookings });
  } catch (error) {
    return next(error);
  }
};

const confirmPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("busId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.transactionId) {
      return res.status(400).json({ message: "Passenger has not submitted transaction ID" });
    }

    if (booking.paymentStatus !== "Confirmed") {
      const bus = await Bus.findById(booking.busId._id);
      if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
      }

      if (bus.availableSeats < booking.numberOfSeats) {
        return res.status(400).json({ message: "Not enough seats are available now" });
      }

      bus.availableSeats -= booking.numberOfSeats;
      await bus.save();
    }

    booking.paymentStatus = "Confirmed";
    booking.bookingStatus = "Confirmed";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("passengerId", "name email phone role")
      .populate("busId");

    return res.json({ message: "Payment confirmed and ticket generated", booking: populatedBooking });
  } catch (error) {
    return next(error);
  }
};

const rejectPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus === "Confirmed") {
      await Bus.findByIdAndUpdate(booking.busId, {
        $inc: { availableSeats: booking.numberOfSeats }
      });
    }

    booking.paymentStatus = "Rejected";
    booking.bookingStatus = "Cancelled";
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("passengerId", "name email phone role")
      .populate("busId");

    return res.json({ message: "Payment rejected", booking: populatedBooking });
  } catch (error) {
    return next(error);
  }
};

const getTicket = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("passengerId", "name email phone role")
      .populate("busId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isOwner = booking.passengerId._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (booking.bookingStatus !== "Confirmed" || booking.paymentStatus !== "Confirmed") {
      return res.status(403).json({ message: "Ticket is available only after payment confirmation" });
    }

    return res.json({ booking });
  } catch (error) {
    return next(error);
  }
};

const getTicketByTicketId = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ ticketId: req.params.ticketId })
      .populate("passengerId", "name email phone role")
      .populate("busId");

    if (!booking) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (booking.bookingStatus !== "Confirmed" || booking.paymentStatus !== "Confirmed") {
      return res.status(403).json({ message: "Ticket is not confirmed yet" });
    }

    return res.json({ booking });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  confirmPayment,
  createBooking,
  getAllBookings,
  getMyBookings,
  getTicket,
  getTicketByTicketId,
  rejectPayment,
  submitPayment
};
