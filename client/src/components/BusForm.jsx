import React from "react";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import karnatakaPlaces from "../utils/karnatakaPlaces";
import { today } from "../utils/formHelpers";

const emptyBus = {
  busName: "",
  busNumber: "",
  busType: "AC",
  from: "Bengaluru Majestic",
  to: "Mysuru",
  departureTime: "",
  arrivalTime: "",
  journeyDate: today(),
  totalSeats: 40,
  availableSeats: 40,
  price: "",
  driverName: "",
  driverPhone: "",
  busImage: null
};

const BusForm = ({ initialBus, onSubmit, loading, buttonLabel = "Save Bus" }) => {
  const [form, setForm] = useState(emptyBus);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    if (initialBus) {
      setForm({
        ...emptyBus,
        ...initialBus,
        busImage: null
      });
    }
  }, [initialBus]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const required = [
      "busName",
      "busNumber",
      "busType",
      "from",
      "to",
      "departureTime",
      "arrivalTime",
      "journeyDate",
      "totalSeats",
      "availableSeats",
      "price",
      "driverName",
      "driverPhone"
    ];

    const missing = required.find((key) => !String(form[key] ?? "").trim());
    if (missing) {
      setError(t("All bus details are required except bus image"));
      return;
    }

    if (form.from === form.to) {
      setError(t("From and To locations cannot be the same"));
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.driverPhone)) {
      setError(t("Driver phone number must be 10 digits"));
      return;
    }

    if (Number(form.availableSeats) > Number(form.totalSeats)) {
      setError(t("Available seats cannot exceed total seats"));
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "busImage") {
        if (value) {
          payload.append(key, value);
        }
        return;
      }
      payload.append(key, value);
    });

    onSubmit(payload);
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      {error && <div className="alert error span-2">{error}</div>}
      <label>
        {t("Bus Name")}
        <input value={form.busName} onChange={(event) => setForm({ ...form, busName: event.target.value })} />
      </label>
      <label>
        {t("Bus Number")}
        <input value={form.busNumber} onChange={(event) => setForm({ ...form, busNumber: event.target.value })} />
      </label>
      <label>
        {t("Bus Type")}
        <select value={form.busType} onChange={(event) => setForm({ ...form, busType: event.target.value })}>
          {["Sleeper", "Semi Sleeper", "AC", "Non-AC", "Express"].map((type) => (
            <option key={type} value={type}>
              {t(type)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("Journey Date")}
        <input
          type="date"
          min={today()}
          value={form.journeyDate}
          onChange={(event) => setForm({ ...form, journeyDate: event.target.value })}
        />
      </label>
      <label>
        {t("From Location")}
        <select value={form.from} onChange={(event) => setForm({ ...form, from: event.target.value })}>
          {karnatakaPlaces.map((place) => (
            <option key={place} value={place}>
              {t(place)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("To Location")}
        <select value={form.to} onChange={(event) => setForm({ ...form, to: event.target.value })}>
          {karnatakaPlaces.map((place) => (
            <option key={place} value={place}>
              {t(place)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("Departure Time")}
        <input type="time" value={form.departureTime} onChange={(event) => setForm({ ...form, departureTime: event.target.value })} />
      </label>
      <label>
        {t("Arrival Time")}
        <input type="time" value={form.arrivalTime} onChange={(event) => setForm({ ...form, arrivalTime: event.target.value })} />
      </label>
      <label>
        {t("Total Seats")}
        <input
          type="number"
          min="1"
          value={form.totalSeats}
          onChange={(event) => setForm({ ...form, totalSeats: event.target.value })}
        />
      </label>
      <label>
        {t("Available Seats")}
        <input
          type="number"
          min="0"
          value={form.availableSeats}
          onChange={(event) => setForm({ ...form, availableSeats: event.target.value })}
        />
      </label>
      <label>
        {t("Ticket Price")}
        <input type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
      </label>
      <label>
        {t("Driver Name")}
        <input value={form.driverName} onChange={(event) => setForm({ ...form, driverName: event.target.value })} />
      </label>
      <label>
        {t("Driver Phone Number")}
        <input
          maxLength="10"
          value={form.driverPhone}
          onChange={(event) => setForm({ ...form, driverPhone: event.target.value })}
        />
      </label>
      <label>
        {t("Bus Image optional")}
        <input type="file" accept="image/*" onChange={(event) => setForm({ ...form, busImage: event.target.files?.[0] })} />
      </label>
      <button className="primary-button span-2" disabled={loading}>
        <Save size={18} />
        {loading ? t("Saving...") : t(buttonLabel)}
      </button>
    </form>
  );
};

export default BusForm;
