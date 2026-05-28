import React from "react";
import { Bus, CreditCard, LayoutDashboard, ListChecks, PlusCircle, QrCode, TicketCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "./Navbar";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/add-bus", label: "Add Bus", icon: PlusCircle },
  { to: "/admin/buses", label: "View Bus List", icon: Bus },
  { to: "/admin/upload-qr", label: "Upload QR Code", icon: QrCode },
  { to: "/admin/bookings", label: "View Bookings", icon: ListChecks }
];

const passengerLinks = [
  { to: "/passenger/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/search", label: "Search Bus", icon: Bus },
  { to: "/my-bookings", label: "My Bookings", icon: TicketCheck },
  { to: "/my-bookings", label: "Payments", icon: CreditCard }
];

const DashboardLayout = ({ children, title, subtitle, type = "passenger" }) => {
  const links = type === "admin" ? adminLinks : passengerLinks;
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <main className="dashboard-shell">
        <aside className="sidebar">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.label} to={link.to}>
                <Icon size={18} />
                {t(link.label)}
              </NavLink>
            );
          })}
        </aside>
        <section className="dashboard-content">
          <div className="page-heading">
            <div>
              <h1>{t(title)}</h1>
              {subtitle && <p>{t(subtitle)}</p>}
            </div>
          </div>
          {children}
        </section>
      </main>
    </>
  );
};

export default DashboardLayout;
