import React from "react";
import { Bus, CreditCard, MapPinned, QrCode, Search, ShieldCheck, TicketCheck, Zap } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BusCard from "../components/BusCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import karnatakaPlaces from "../utils/karnatakaPlaces";
import { today } from "../utils/formHelpers";

const demoBus = {
  busName: "Nithin Royal Express",
  busNumber: "KA-01-NT-2045",
  busType: "AC",
  from: "Bengaluru Majestic",
  to: "Mysuru",
  departureTime: "07:30",
  arrivalTime: "10:45",
  journeyDate: today(),
  availableSeats: 28,
  price: 450
};

const Home = () => {
  const navigate = useNavigate();
  const { isPassengerAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    from: "Bengaluru Majestic",
    to: "Mysuru",
    journeyDate: today()
  });
  const [error, setError] = useState("");

  const goBook = () => {
    if (isPassengerAuthenticated) {
      navigate("/search");
      return;
    }
    navigate("/login");
  };

  const handleSearch = (event) => {
    event.preventDefault();
    if (form.from === form.to) {
      setError(t("From and To locations cannot be the same"));
      return;
    }
    navigate(`/bus-results?from=${encodeURIComponent(form.from)}&to=${encodeURIComponent(form.to)}&journeyDate=${form.journeyDate}`);
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <MapPinned size={17} />
                {t("karnatakaRoutesOnly")}
              </span>
              <h1>{t("heroTitle")}</h1>
              <p>{t("heroSubtitle")}</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={goBook}>
                  <Bus size={18} />
                  {t("bookNow")}
                </button>
                <Link className="secondary-button" to="/login">
                  <ShieldCheck size={18} />
                  {t("passengerLogin")}
                </Link>
                <Link className="dark-button" to="/admin-login">
                  <CreditCard size={18} />
                  {t("adminLogin")}
                </Link>
              </div>
            </div>

            <form className="hero-search panel" onSubmit={handleSearch}>
              <h2>{t("findYourBus")}</h2>
              {error && <div className="alert error">{error}</div>}
              <label>
                {t("from")}
                <select value={form.from} onChange={(event) => setForm({ ...form, from: event.target.value })}>
                  {karnatakaPlaces.map((place) => (
                    <option key={place} value={place}>
                      {t(place)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("to")}
                <select value={form.to} onChange={(event) => setForm({ ...form, to: event.target.value })}>
                  {karnatakaPlaces.map((place) => (
                    <option key={place} value={place}>
                      {t(place)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("journeyDate")}
                <input
                  type="date"
                  min={today()}
                  value={form.journeyDate}
                  onChange={(event) => setForm({ ...form, journeyDate: event.target.value })}
                />
              </label>
              <button className="primary-button full-width">
                <Search size={18} />
                {t("searchBus")}
              </button>
            </form>
          </div>
        </section>

        <section className="feature-band">
          <div className="container feature-grid">
            <article className="feature-card">
              <Zap size={28} />
              <h3>{t("easyBooking")}</h3>
              <p>{t("easyBookingText")}</p>
            </article>
            <article className="feature-card">
              <MapPinned size={28} />
              <h3>{t("karnatakaRoutes")}</h3>
              <p>{t("karnatakaRoutesText")}</p>
            </article>
            <article className="feature-card">
              <QrCode size={28} />
              <h3>{t("secureQrPayment")}</h3>
              <p>{t("secureQrPaymentText")}</p>
            </article>
            <article className="feature-card">
              <TicketCheck size={28} />
              <h3>{t("instantTicket")}</h3>
              <p>{t("instantTicketText")}</p>
            </article>
          </div>
        </section>

        <section className="container preview-section">
          <div className="section-title">
            <span>{t("popularRoutePreview")}</span>
            <h2>{t("premiumCards")}</h2>
          </div>
          <BusCard bus={demoBus} onBook={goBook} />
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
