import React from "react";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getApiError, isEmail } from "../utils/formHelpers";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loading, login } = useAuth();
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
      await login({ ...form, role: "admin" });
      navigate("/admin/dashboard");
    } catch (error) {
      setMessage(t(getApiError(error)));
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <section className="auth-panel single admin-auth">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h2>{t("Admin Login")}</h2>
            <p className="muted">{t("Admin can add buses, upload QR codes and confirm passenger payments.")}</p>
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
            <button className="dark-button full-width" disabled={loading}>
              <ShieldCheck size={18} />
              {loading ? t("Checking access...") : t("Admin Login")}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AdminLogin;
