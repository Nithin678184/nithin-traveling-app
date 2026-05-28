import React from "react";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getApiError, isEmail, isPhone } from "../utils/formHelpers";

const PassengerRegister = () => {
  const navigate = useNavigate();
  const { loading, register } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (Object.values(form).some((value) => !value.trim())) {
      setMessage(t("All fields are required"));
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

    if (form.password.length < 6) {
      setMessage(t("Password must be at least 6 characters"));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage(t("Passwords do not match"));
      return;
    }

    try {
      await register(form);
      navigate("/passenger/dashboard");
    } catch (error) {
      setMessage(t(getApiError(error)));
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section className="auth-panel single">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{t("Passenger Register")}</h2>
            {message && <div className="alert error">{message}</div>}
            <label>
              {t("Full Name")}
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label>
              {t("Email")}
              <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label>
              {t("Phone Number")}
              <input value={form.phone} maxLength="10" onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </label>
            <div className="two-col">
              <label>
                {t("Password")}
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
              </label>
              <label>
                {t("Confirm Password")}
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                />
              </label>
            </div>
            <button className="primary-button full-width" disabled={loading}>
              <UserPlus size={18} />
              {loading ? t("Creating account...") : t("Register")}
            </button>
            <p className="muted center">
              {t("Already registered?")} <Link to="/login">{t("Login here")}</Link>
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default PassengerRegister;
