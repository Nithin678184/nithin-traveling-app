import React from "react";
import { Bus, TicketCheck, UserRound, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";

const PassengerDashboard = () => {
  const { passengerUser } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/my-bookings").then(({ data }) => setBookings(data.bookings)).catch(() => setBookings([]));
  }, []);

  const confirmed = bookings.filter((booking) => booking.bookingStatus === "Confirmed").length;
  const pending = bookings.filter((booking) => booking.paymentStatus === "Pending").length;

  return (
    <DashboardLayout title="Passenger Dashboard" subtitle="Search buses, view bookings and manage your profile.">
      <div className="stats-grid">
        <article className="stat-card">
          <Bus size={24} />
          <span>{t("Total Bookings")}</span>
          <strong>{bookings.length}</strong>
        </article>
        <article className="stat-card orange">
          <WalletCards size={24} />
          <span>{t("Pending Payments")}</span>
          <strong>{pending}</strong>
        </article>
        <article className="stat-card green">
          <TicketCheck size={24} />
          <span>{t("Confirmed Tickets")}</span>
          <strong>{confirmed}</strong>
        </article>
        <article className="stat-card navy">
          <UserRound size={24} />
          <span>{t("Profile")}</span>
          <strong>{passengerUser?.name}</strong>
        </article>
      </div>

      <section className="panel action-panel">
        <div>
          <h2>{t("Ready for your next Karnataka journey?")}</h2>
          <p>{t("Search buses by from, to and journey date. Your booking will stay pending until admin confirms payment.")}</p>
        </div>
        <Link className="primary-button" to="/search">
          <Bus size={18} />
          {t("Search Bus")}
        </Link>
      </section>
    </DashboardLayout>
  );
};

export default PassengerDashboard;
