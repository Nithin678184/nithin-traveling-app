import React from "react";
import { CreditCard, Eye, Printer, TicketCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api
      .get("/bookings/my-bookings")
      .then(({ data }) => setBookings(data.bookings))
      .catch((error) => setMessage(t(getApiError(error))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Bookings" subtitle="Track booking status, payment status and confirmed tickets.">
      {message && <div className="alert error">{message}</div>}
      {loading && <div className="panel">{t("Loading your bookings...")}</div>}
      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          <TicketCheck size={42} />
          <h2>{t("No bookings yet")}</h2>
          <Link className="primary-button" to="/search">
            {t("Search Bus")}
          </Link>
        </div>
      )}
      <div className="table-wrap">
        {bookings.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>{t("Ticket")}</th>
                <th>{t("Bus")}</th>
                <th>{t("Route")}</th>
                <th>{t("Seats")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Payment")}</th>
                <th>{t("Booking")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.ticketId}</td>
                  <td>{booking.busId?.busName}</td>
                  <td>
                    {t(booking.busId?.from)} {t("to")} {t(booking.busId?.to)}
                  </td>
                  <td>{booking.seatNumbers?.join(", ")}</td>
                  <td>Rs. {booking.totalAmount}</td>
                  <td>
                    <span className={`status ${booking.paymentStatus.toLowerCase()}`}>{t(booking.paymentStatus)}</span>
                  </td>
                  <td>
                    <span className={`status ${booking.bookingStatus.toLowerCase()}`}>{t(booking.bookingStatus)}</span>
                  </td>
                  <td className="table-actions">
                    {booking.bookingStatus === "Confirmed" ? (
                      <Link className="small-button" to={`/ticket/${booking._id}`}>
                        <Printer size={15} />
                        {t("Ticket")}
                      </Link>
                    ) : booking.paymentStatus === "Rejected" ? (
                      <span className="muted">{t("Rejected")}</span>
                    ) : (
                      <Link className="small-button" to={`/payment/${booking._id}`}>
                        <CreditCard size={15} />
                        {t("Pay")}
                      </Link>
                    )}
                    <Link className="small-button ghost" to={`/ticket/${booking._id}`} title={t("View confirmed ticket only")}>
                      <Eye size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyBookings;
