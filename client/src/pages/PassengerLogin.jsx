import React from "react";
import { Bus, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getApiError, isEmail } from "../utils/formHelpers";

const PassengerLogin = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!form.email || !form.password) {
      setMessage(t("Email and password are required"));
      return;
    }

    if (!isEmail(form.email)) {
      setMessage(t("Enter a valid email address"));
      return;
    }

    try {
      await login({ ...form, role: "passenger" });
      navigate("/passenger/dashboard");
    } catch (error) {
      setMessage(t(getApiError(error)));
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section className="auth-panel">
          <div className="auth-visual">
            <Bus size={54} />
            <h1>{t("Welcome back, traveler")}</h1>
            <p>{t("Login to search Karnataka buses, complete QR payments and download confirmed tickets.")}</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{t("Passenger Login")}</h2>
            {message && <div className="alert error">{message}</div>}
            <label>
              {t("Email")}
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label>
              {t("Password")}
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
              />
            </label>
            <button className="primary-button full-width" disabled={loading}>
              <LogIn size={18} />
              {loading ? t("Signing in...") : t("Login")}
            </button>
            <p className="muted center">
              {t("New passenger?")} <Link to="/register">{t("Create an account")}</Link>
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PassengerLogin;
