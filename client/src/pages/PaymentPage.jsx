import React from "react";
import { CheckCircle, QrCode } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api, { assetUrl } from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [qr, setQr] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      try {
        const [bookingsResponse, qrResponse] = await Promise.all([
          api.get("/bookings/my-bookings"),
          api.get("/payment/qr")
        ]);
        setBooking(bookingsResponse.data.bookings.find((item) => item._id === bookingId));
        setQr(qrResponse.data.qr);
      } catch (error) {
        setMessage(t(getApiError(error)));
      }
    };

    load();
  }, [bookingId]);

  const submitPayment = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!transactionId.trim()) {
      setMessage(t("Transaction ID is required before submitting payment"));
      return;
    }

    const payload = new FormData();
    payload.append("transactionId", transactionId.trim());
    if (screenshot) {
      payload.append("paymentScreenshot", screenshot);
    }

    setLoading(true);
    try {
      await api.put(`/bookings/submit-payment/${bookingId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/my-bookings");
    } catch (error) {
      setMessage(t(getApiError(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="QR Code Payment" subtitle="Submit the transaction ID after scanning the admin QR code.">
      {message && <div className="alert error">{message}</div>}
      {!booking ? (
        <div className="panel">{t("Loading payment details...")}</div>
      ) : (
        <div className="payment-grid">
          <section className="panel payment-summary">
            <h2>{t("Booking Details")}</h2>
            <p>{booking.busId?.busName}</p>
            <div className="fare-row">
              <span>{t("Route")}</span>
              <strong>
                {t(booking.busId?.from)} {t("to")} {t(booking.busId?.to)}
              </strong>
            </div>
            <div className="fare-row">
              <span>{t("Seats")}</span>
              <strong>{booking.seatNumbers?.join(", ")}</strong>
            </div>
            <div className="fare-row">
              <span>{t("Total Amount")}</span>
              <strong>Rs. {booking.totalAmount}</strong>
            </div>
            <div className="status-row">
              <span className="status pending">{t("Payment")} {t(booking.paymentStatus)}</span>
              <span className="status pending">{t("Booking")} {t(booking.bookingStatus)}</span>
            </div>
          </section>

          <form className="panel payment-form" onSubmit={submitPayment}>
            <div className="qr-box">
              {qr?.qrImage ? (
                <img src={assetUrl(qr.qrImage)} alt={t("Payment QR code")} />
              ) : (
                <div className="qr-placeholder">
                  <QrCode size={58} />
                  <span>{t("Admin QR not uploaded yet")}</span>
                </div>
              )}
            </div>
            <p className="payment-instruction">{t("Scan this QR code and complete the payment")}</p>
            <label>
              {t("Transaction ID")}
              <input value={transactionId} onChange={(event) => setTransactionId(event.target.value)} />
            </label>
            <label>
              {t("Upload payment screenshot optional")}
              <input type="file" accept="image/*" onChange={(event) => setScreenshot(event.target.files?.[0])} />
            </label>
            <button className="primary-button full-width" disabled={loading || !qr?.qrImage}>
              <CheckCircle size={18} />
              {loading ? t("Submitting...") : t("Submit Payment")}
            </button>
            {!qr?.qrImage && <Link to="/my-bookings">{t("Go back to My Bookings")}</Link>}
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PaymentPage;
