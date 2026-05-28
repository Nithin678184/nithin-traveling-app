const mongoose = require("mongoose");
const { karnatakaPlaces } = require("../utils/karnatakaPlaces");

const busSchema = new mongoose.Schema(
  {
    busName: {
      type: String,
      trim: true,
      required: [true, "Bus name is required"]
    },
    busNumber: {
      type: String,
      trim: true,
      required: [true, "Bus number is required"]
    },
    busType: {
      type: String,
      enum: ["Sleeper", "Semi Sleeper", "AC", "Non-AC", "Express"],
      required: [true, "Bus type is required"]
    },
    from: {
      type: String,
      enum: karnatakaPlaces,
      required: [true, "From location is required"]
    },
    to: {
      type: String,
      enum: karnatakaPlaces,
      required: [true, "To location is required"]
    },
    departureTime: {
      type: String,
      required: [true, "Departure time is required"]
    },
    arrivalTime: {
      type: String,
      required: [true, "Arrival time is required"]
    },
    journeyDate: {
      type: String,
      required: [true, "Journey date is required"]
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats are required"],
      min: 1
    },
    availableSeats: {
      type: Number,
      required: [true, "Available seats are required"],
      min: 0
    },
    price: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: 1
    },
    driverName: {
      type: String,
      trim: true,
      required: [true, "Driver name is required"]
    },
    driverPhone: {
      type: String,
      trim: true,
      required: [true, "Driver phone is required"]
    },
    busImage: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
