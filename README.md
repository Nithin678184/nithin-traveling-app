# Nithin Traveling App

A complete MERN stack Karnataka bus booking application with passenger and admin roles, JWT authentication, MongoDB storage, QR-code manual payment verification, and professional PDF/print ticket generation.

## Tech Stack

- Frontend: React.js, Vite, CSS, Lucide icons, jsPDF, html2canvas
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT + bcrypt password hashing
- Uploads: Multer for bus images, payment screenshots and QR code images
- Sessions: passenger and admin can stay logged in at the same time in different browser tabs

## Folder Structure

```text
nithin-traveling-app/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## MongoDB Connection

1. Install MongoDB Community Server or run MongoDB Atlas.
2. For local MongoDB, keep this value in `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nithin_traveling_app
```

3. For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## Backend Setup

```bash
cd server
npm install
npm run seed:admin
npm run seed:buses
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

## Frontend Setup

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Open on Mobile or Other Devices on Same Wi-Fi

1. Connect your laptop/PC and phone to the same Wi-Fi.
2. Find your laptop/PC IPv4 address:

```powershell
ipconfig
```

Look for something like:

```text
IPv4 Address . . . . . . . . . . : 192.168.1.10
```

3. Start backend:

```powershell
cd server
npm run dev:host
```

4. Start frontend in another terminal:

```powershell
cd client
npm run dev:host
```

5. Open this on your phone browser:

```text
http://YOUR-IP-ADDRESS:5173
```

Example:

```text
http://192.168.1.10:5173
```

If it does not open, allow Node.js through Windows Firewall for private networks.

## Public Internet Hosting

For a public URL that opens anywhere, deploy the backend and frontend online.

See:

```text
DEPLOYMENT.md
```

## Admin Login Setup

The seed script uses these values from `server/.env`:

```env
ADMIN_EMAIL=admin@nithintraveling.com
ADMIN_PASSWORD=admin123
```

Run:

```bash
cd server
npm run seed:admin
```

Then login from the Admin Login page using:

```text
Email: admin@nithintraveling.com
Password: admin123
```

## Sample Bus Data

Run:

```bash
cd server
npm run seed:buses
```

Sample buses include:

- Bengaluru Majestic to Mysuru
- Bengaluru Majestic to Mangaluru
- Mysuru to Madikeri
- Hubballi to Belagavi

## Sample Passenger Booking Flow

1. Register as a passenger.
2. Login as passenger.
3. Go to Search Bus.
4. Select a Karnataka From and To location, journey date and passengers.
5. Choose a bus and click Book Now.
6. Fill passenger details and continue to QR payment.
7. Scan the QR code uploaded by admin.
8. Enter transaction ID and optionally upload payment screenshot.
9. Admin opens View Bookings and confirms payment.
10. Passenger opens My Bookings and downloads or prints the confirmed ticket.
11. Passenger can switch between a colorful bus ticket and an airplane-style boarding pass before downloading PDF.
12. Ticket and boarding pass QR codes open `/scan-ticket/:ticketId`, where mobile users can view journey details and download either the bus ticket or boarding pass.

## Important API Routes

```text
POST /api/auth/register
POST /api/auth/login
POST /api/buses/add
GET /api/buses
GET /api/buses/:id
PUT /api/buses/:id
DELETE /api/buses/:id
GET /api/buses/search?from=&to=&journeyDate=
POST /api/bookings/create
PUT /api/bookings/submit-payment/:id
GET /api/bookings/my-bookings
GET /api/bookings/all
PUT /api/bookings/confirm-payment/:id
PUT /api/bookings/reject-payment/:id
POST /api/payment/upload-qr
GET /api/payment/qr
GET /api/ticket/:bookingId
```

## Notes

- Ticket download uses `html2canvas` and `jsPDF`.
- Payment status starts as `Pending`.
- Only admin can add, edit, delete buses, upload QR code and confirm or reject payments.
- Available seats decrease only after admin confirms payment.
