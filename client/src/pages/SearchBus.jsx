import React from "react";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import karnatakaPlaces from "../utils/karnatakaPlaces";
import { today } from "../utils/formHelpers";

const SearchBus = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    from: "Bengaluru Majestic",
    to: "Mysuru",
    journeyDate: today(),
    passengers: 1
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!form.from || !form.to || !form.journeyDate || !form.passengers) {
      setMessage(t("All search fields are required"));
      return;
    }

    if (form.from === form.to) {
      setMessage(t("From and To locations cannot be the same"));
      return;
    }

    navigate(
      `/bus-results?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&journeyDate=${form.journeyDate}&passengers=${form.passengers}`
    );
  };

  return (
    <DashboardLayout title="Search Bus" subtitle="Choose only Karnataka bus stands and routes.">
      <form className="panel form-grid" onSubmit={handleSubmit}>
        {message && <div className="alert error span-2">{message}</div>}
        <label>
          {t("From")}
          <select value={form.from} onChange={(event) => setForm({ ...form, from: event.target.value })}>
            {karnatakaPlaces.map((place) => (
              <option key={place} value={place}>
                {t(place)}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("To")}
          <select value={form.to} onChange={(event) => setForm({ ...form, to: event.target.value })}>
            {karnatakaPlaces.map((place) => (
              <option key={place} value={place}>
                {t(place)}
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
          {t("Number of Passengers")}
          <input
            type="number"
            min="1"
            value={form.passengers}
            onChange={(event) => setForm({ ...form, passengers: event.target.value })}
          />
        </label>
        <button className="primary-button span-2">
          <Search size={18} />
          {t("Search Bus")}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default SearchBus;
