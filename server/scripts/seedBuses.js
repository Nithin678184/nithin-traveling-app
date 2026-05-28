const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Bus = require("../models/Bus");

dotenv.config();

const nextDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const buses = [
  {
    busName: "Nithin Royal Express",
    busNumber: "KA-01-NT-2045",
    busType: "AC",
    from: "Bengaluru Majestic",
    to: "Mysuru",
    departureTime: "07:30",
    arrivalTime: "10:45",
    journeyDate: nextDate(1),
    totalSeats: 40,
    availableSeats: 40,
    price: 450,
    driverName: "Ramesh Gowda",
    driverPhone: "9876543210"
  },
  {
    busName: "Coastal Comfort",
    busNumber: "KA-19-NT-8821",
    busType: "Sleeper",
    from: "Bengaluru Majestic",
    to: "Mangaluru",
    departureTime: "21:00",
    arrivalTime: "06:30",
    journeyDate: nextDate(1),
    totalSeats: 36,
    availableSeats: 36,
    price: 980,
    driverName: "Sandeep Kumar",
    driverPhone: "9876501234"
  },
  {
    busName: "Malnad Premium",
    busNumber: "KA-14-NT-6110",
    busType: "Semi Sleeper",
    from: "Mysuru",
    to: "Madikeri",
    departureTime: "08:15",
    arrivalTime: "12:15",
    journeyDate: nextDate(2),
    totalSeats: 32,
    availableSeats: 32,
    price: 520,
    driverName: "Prakash Hegde",
    driverPhone: "9123456789"
  },
  {
    busName: "North Karnataka Link",
    busNumber: "KA-25-NT-4701",
    busType: "Express",
    from: "Hubballi",
    to: "Belagavi",
    departureTime: "15:00",
    arrivalTime: "18:10",
    journeyDate: nextDate(2),
    totalSeats: 45,
    availableSeats: 45,
    price: 360,
    driverName: "Mahesh Patil",
    driverPhone: "9988776655"
  }
];

const seedBuses = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const bus of buses) {
    const exists = await Bus.findOne({
      busNumber: bus.busNumber,
      journeyDate: bus.journeyDate
    });

    if (!exists) {
      await Bus.create(bus);
      console.log(`Added ${bus.busName}`);
    }
  }

  console.log("Sample buses are ready");
  await mongoose.disconnect();
};

seedBuses().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
