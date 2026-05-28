import React from "react";
import { ArrowRight, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError, isEmail, isPhone } from "../utils/formHelpers";

const BookingPage = () => {
  const { busId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { passengerUser } = useAuth();
  const { t } = useLanguage();
  const [bus, setBus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    passengerName: passengerUser?.name || "",
    age: "",
    gender: "Male",
    phone: passengerUser?.phone || "",
    email: passengerUser?.email || "",
    numberOfSeats: params.get("seats") || 1,
    seatNumbers: ""
  });

  useEffect(() => {
    api.get(`/buses/${busId}`).then(({ data }) => setBus(data.bus)).catch((error) => setMessage(t(getApiError(error))));
  }, [busId, t]);

  const totalAmount = bus ? Number(form.numberOfSeats || 0) * bus.price : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const requiredFields = ["passengerName", "age", "gender", "phone", "email", "numberOfSeats"];
    if (requiredFields.some((field) => String(form[field] ?? "").trim() === "")) {
      setMessage(t("All booking fields are required. Seat numbers are optional."));
      return;
    }

    if (!isEmail(form.email)) {
      setMessage(t("Enter a valid email address"));
      return;
    }

    if (!isPhone(form.phone)) {
      setMessage(t("Phone number must be 10 digits"));
      return;
    }

    if (Number(form.numberOfSeats) > bus.availableSeats) {
      setMessage(t("Seats requested exceed available seats"));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/bookings/create", {
        ...form,
        busId,
        seatNumbers: form.seatNumbers
      });
      navigate(`/payment/${data.booking._id}`);
    } catch (error) {
      setMessage(t(getApiError(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Booking Details"
      subtitle={bus ? `${bus.busName} - ${t(bus.from)} ${t("to")} ${t(bus.to)}` : "Loading bus details"}
    >
      {message && <div className="alert error">{message}</div>}
      {!bus ? (
        <div className="panel">{t("Loading booking form...")}</div>
      ) : (
        <div className="booking-grid">
          <form className="panel form-grid" onSubmit={handleSubmit}>
            <label>
              {t("Passenger Name")}
              <input value={form.passengerName} onChange={(event) => setForm({ ...form, passengerName: event.target.value })} />
            </label>
            <label>
              {t("Age")}
              <input type="number" min="1" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} />
            </label>
            <label>
              {t("Gender")}
              <select value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
                {["Male", "Female", "Other"].map((gender) => (
                  <option key={gender} value={gender}>
                    {t(gender)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("Phone Number")}
              <input maxLength="10" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <label>
              {t("Email")}
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label>
              {t("Number of Seats")}
              <input
                type="number"
                min="1"
                max={bus.availableSeats}
                value={form.numberOfSeats}
                onChange={(event) => setForm({ ...form, numberOfSeats: event.target.value })}
              />
            </label>
            <label className="span-2">
              {t("Seat Numbers if possible")}
              <input
                placeholder={t("Example: S1, S2")}
                value={form.seatNumbers}
                onChange={(event) => setForm({ ...form, seatNumbers: event.target.value })}
              />
            </label>
            <button className="primary-button span-2" disabled={loading}>
              <ArrowRight size={18} />
              {loading ? t("Creating booking...") : t("Continue to Payment")}
            </button>
          </form>

          <aside className="fare-panel">
            <h2>{t("Fare Summary")}</h2>
            <p>{bus.busName}</p>
            <div className="fare-row">
              <span>{t("Ticket Price")}</span>
              <strong>Rs. {bus.price}</strong>
            </div>
            <div className="fare-row">
              <span>{t("Seats")}</span>
              <strong>{form.numberOfSeats}</strong>
            </div>
            <div className="fare-total">
              <span>{t("Total Amount")}</span>
              <strong>
                <IndianRupee size={19} />
                {totalAmount}
              </strong>
            </div>
            <small>{t("Payment status will remain Pending until admin confirms your QR payment.")}</small>
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BookingPage;
