import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>{t("appName")}</h3>
          <p>{t("footerDesc")}</p>
        </div>
        <div className="footer-contact">
          <span>
            <Phone size={16} />
            +91 98765 43210
          </span>
          <span>
            <Mail size={16} />
            support@nithintraveling.com
          </span>
          <span>
            <MapPin size={16} />
            {t("Bengaluru Majestic")}, {t("Karnataka")}
          </span>
        </div>
        <div className="footer-copy">{t("copyright")}</div>
      </div>
    </footer>
  );
};

export default Footer;
