import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AddBus from "./pages/AddBus.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import BusResults from "./pages/BusResults.jsx";
import EditBus from "./pages/EditBus.jsx";
import Home from "./pages/Home.jsx";
import KarnatakaMap from "./pages/KarnatakaMap.jsx";
import ManageBuses from "./pages/ManageBuses.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import PassengerDashboard from "./pages/PassengerDashboard.jsx";
import PassengerLogin from "./pages/PassengerLogin.jsx";
import PassengerRegister from "./pages/PassengerRegister.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import SearchBus from "./pages/SearchBus.jsx";
import ScanTicketPage from "./pages/ScanTicketPage.jsx";
import TicketPage from "./pages/TicketPage.jsx";
import UploadQR from "./pages/UploadQR.jsx";
import ViewBookings from "./pages/ViewBookings.jsx";

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<PassengerLogin />} />
    <Route path="/register" element={<PassengerRegister />} />
    <Route path="/admin-login" element={<AdminLogin />} />
    <Route path="/karnataka-map" element={<KarnatakaMap />} />
    <Route path="/scan-ticket/:ticketId" element={<ScanTicketPage />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
      <Route path="/search" element={<SearchBus />} />
      <Route path="/bus-results" element={<BusResults />} />
      <Route path="/booking/:busId" element={<BookingPage />} />
      <Route path="/payment/:bookingId" element={<PaymentPage />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/ticket/:bookingId" element={<TicketPage />} />
    </Route>

    <Route element={<AdminRoute />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/add-bus" element={<AddBus />} />
      <Route path="/admin/buses" element={<ManageBuses />} />
      <Route path="/admin/edit-bus/:id" element={<EditBus />} />
      <Route path="/admin/upload-qr" element={<UploadQR />} />
      <Route path="/admin/bookings" element={<ViewBookings />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
