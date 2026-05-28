import React from "react";
import { Bus, Languages, LogOut, Menu, Moon, Sun, TicketCheck, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("nta_theme") || "light");
  const {
    adminUser,
    isAdminAuthenticated,
    isPassengerAuthenticated,
    logout,
    passengerUser
  } = useAuth();
  const { language, t, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");
  const activeUser = isAdminPage ? adminUser : passengerUser;
  const activeRole = isAdminPage ? "admin" : "passenger";
  const hasAnySession = isPassengerAuthenticated || isAdminAuthenticated;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nta_theme", theme);
  }, [theme]);

  const handleLogout = () => {
    logout(activeRole);
    navigate(activeRole === "admin" ? "/admin-login" : "/");
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <nav className="navbar container">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark">
            <Bus size={24} />
          </span>
          <span>{t("appName")}</span>
        </Link>

        <button className="icon-button mobile-menu" onClick={() => setOpen((value) => !value)} aria-label={t("Toggle menu")}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>
            {t("home")}
          </NavLink>
          <NavLink to="/search" onClick={closeMenu}>
            {t("searchBus")}
          </NavLink>
          <NavLink to="/karnataka-map" onClick={closeMenu}>
            {t("karnatakaMap")}
          </NavLink>

          {!hasAnySession && (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                {t("login")}
              </NavLink>
              <NavLink to="/register" onClick={closeMenu}>
                {t("register")}
              </NavLink>
              <NavLink to="/admin-login" onClick={closeMenu}>
                {t("adminLogin")}
              </NavLink>
            </>
          )}

          {isPassengerAuthenticated && (
            <>
              <NavLink to="/passenger/dashboard" onClick={closeMenu}>
                {t("passenger")}
              </NavLink>
              <NavLink to="/my-bookings" onClick={closeMenu}>
                {t("myBookings")}
              </NavLink>
            </>
          )}

          {isAdminAuthenticated && (
            <NavLink to="/admin/dashboard" onClick={closeMenu}>
              {t("admin")}
            </NavLink>
          )}

          {hasAnySession && !isPassengerAuthenticated && (
            <NavLink to="/login" onClick={closeMenu}>
              {t("passengerLogin")}
            </NavLink>
          )}

          {hasAnySession && !isAdminAuthenticated && (
            <NavLink to="/admin-login" onClick={closeMenu}>
              {t("adminLogin")}
            </NavLink>
          )}

          {activeUser && (
            <button className="nav-logout" onClick={handleLogout}>
              <LogOut size={16} />
              {t("logout")} {activeRole === "admin" ? t("admin") : t("passenger")}
            </button>
          )}

          <button
            className="language-toggle"
            onClick={toggleLanguage}
            aria-label={language === "en" ? t("kannada") : t("english")}
            title={language === "en" ? t("kannada") : t("english")}
          >
            <Languages size={16} />
            {language === "en" ? "ಕನ್ನಡ" : "EN"}
          </button>

          <button
            className="theme-toggle"
            onClick={() => setTheme((value) => (value === "dark" ? "light" : "dark"))}
            aria-label={theme === "dark" ? t("whiteMode") : t("darkMode")}
            title={theme === "dark" ? t("whiteMode") : t("darkMode")}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? t("whiteMode") : t("darkMode")}
          </button>
        </div>
      </nav>

      {hasAnySession && (
        <div className="user-strip">
          <div className="container user-strip-inner">
            {passengerUser && (
              <span>
                <UserRound size={15} />
                {t("passenger")}: {passengerUser.name}
              </span>
            )}
            {adminUser && (
              <span>
                <TicketCheck size={15} />
                {t("admin")}: {adminUser.name}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
