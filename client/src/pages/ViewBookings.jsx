import React from "react";
import { CheckCircle, ExternalLink, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api, { assetUrl } from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings/all");
      setBookings(data.bookings);
    } catch (error) {
      setMessage(t(getApiError(error)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updatePayment = async (bookingId, action) => {
    try {
      await api.put(`/bookings/${action}-payment/${bookingId}`);
      fetchBookings();
    } catch (error) {
      setMessage(t(getApiError(error)));
    }
  };

  return (
    <DashboardLayout type="admin" title="View Bookings" subtitle="Confirm or reject manual QR payment requests.">
      {message && <div className="alert error">{message}</div>}
      {loading && <div className="panel">{t("Loading all bookings...")}</div>}
      <div className="table-wrap">
        {bookings.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>{t("Passenger")}</th>
                <th>{t("Bus")}</th>
                <th>{t("Route")}</th>
                <th>{t("Seats")}</th>
                <th>{t("Amount")}</th>
                <th>{t("Txn ID")}</th>
                <th>{t("Screenshot")}</th>
                <th>{t("Status")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>
                    <strong>{booking.passengerName}</strong>
                    <small>{booking.phone}</small>
                    <small>{booking.email}</small>
                  </td>
                  <td>{booking.busId?.busName}</td>
                  <td>
                    {t(booking.busId?.from)} {t("to")} {t(booking.busId?.to)}
                  </td>
                  <td>{booking.seatNumbers?.join(", ")}</td>
                  <td>Rs. {booking.totalAmount}</td>
                  <td>{booking.transactionId || t("Not submitted")}</td>
                  <td>
                    {booking.paymentScreenshot ? (
                      <a className="small-button ghost" href={assetUrl(booking.paymentScreenshot)} target="_blank" rel="noreferrer">
                        <ExternalLink size={15} />
                        {t("View")}
                      </a>
                    ) : (
                      <span className="muted">{t("Optional")}</span>
                    )}
                  </td>
                  <td>
                    <span className={`status ${booking.paymentStatus.toLowerCase()}`}>{t(booking.paymentStatus)}</span>
                  </td>
                  <td className="table-actions">
                    <button
                      className="small-button"
                      disabled={booking.paymentStatus === "Confirmed" || !booking.transactionId}
                      onClick={() => updatePayment(booking._id, "confirm")}
                    >
                      <CheckCircle size={15} />
                      {t("Confirm")}
                    </button>
                    <button
                      className="small-button danger"
                      disabled={booking.paymentStatus === "Rejected"}
                      onClick={() => updatePayment(booking._id, "reject")}
                    >
                      <XCircle size={15} />
                      {t("Reject")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && bookings.length === 0 && <div className="panel">{t("No bookings available yet.")}</div>}
    </DashboardLayout>
  );
};

export default ViewBookings;
