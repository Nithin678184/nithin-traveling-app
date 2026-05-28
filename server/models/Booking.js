const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },
    passengerName: {
      type: String,
      trim: true,
      required: [true, "Passenger name is required"]
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 1
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"]
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"]
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "Email is required"]
    },
    numberOfSeats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: 1
    },
    seatNumbers: {
      type: [String],
      default: []
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"]
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected"],
      default: "Pending"
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending"
    },
    transactionId: {
      type: String,
      trim: true,
      default: ""
    },
    paymentScreenshot: {
      type: String,
      default: ""
    },
    ticketId: {
      type: String,
      unique: true,
      default: () => `NTA-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
