import React from "react";
import { Bus, CheckCircle, Clock3, IndianRupee, QrCode, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    buses: 0,
    bookings: 0,
    confirmed: 0,
    pending: 0,
    revenue: 0
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [busesResponse, bookingsResponse] = await Promise.all([api.get("/buses"), api.get("/bookings/all")]);
        const bookings = bookingsResponse.data.bookings;
        setStats({
          buses: busesResponse.data.buses.length,
          bookings: bookings.length,
          confirmed: bookings.filter((booking) => booking.paymentStatus === "Confirmed").length,
          pending: bookings.filter((booking) => booking.paymentStatus === "Pending").length,
          revenue: bookings
            .filter((booking) => booking.paymentStatus === "Confirmed")
            .reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0)
        });
      } catch {
        setStats({ buses: 0, bookings: 0, confirmed: 0, pending: 0, revenue: 0 });
      }
    };

    load();
  }, []);

  return (
    <DashboardLayout type="admin" title="Admin Dashboard" subtitle="Manage buses, QR payments and passenger bookings.">
      <div className="stats-grid">
        <article className="stat-card">
          <Bus size={24} />
          <span>{t("Total Buses")}</span>
          <strong>{stats.buses}</strong>
        </article>
        <article className="stat-card navy">
          <UsersRound size={24} />
          <span>{t("Total Bookings")}</span>
          <strong>{stats.bookings}</strong>
        </article>
        <article className="stat-card green">
          <CheckCircle size={24} />
          <span>{t("Confirmed")}</span>
          <strong>{stats.confirmed}</strong>
        </article>
        <article className="stat-card orange">
          <Clock3 size={24} />
          <span>{t("Pending")}</span>
          <strong>{stats.pending}</strong>
        </article>
      </div>

      <section className="panel action-panel">
        <div>
          <h2>{t("Today in control")}</h2>
          <p>{t("Upload the payment QR, add Karnataka buses and verify every passenger payment request.")}</p>
          <strong className="revenue">
            <IndianRupee size={20} />
            {stats.revenue} {t("confirmed revenue")}
          </strong>
        </div>
        <div className="button-row">
          <Link className="primary-button" to="/admin/add-bus">
            <Bus size={18} />
            {t("Add Bus")}
          </Link>
          <Link className="secondary-button" to="/admin/upload-qr">
            <QrCode size={18} />
            {t("Upload QR")}
          </Link>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AdminDashboard;
