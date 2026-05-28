import React from "react";
import { forwardRef } from "react";
import {
  Armchair,
  Bus,
  CalendarDays,
  Clock,
  IndianRupee,
  MapPin,
  ShieldCheck,
  TicketCheck,
  UserRound
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "../context/LanguageContext";

const buildPlatform = (ticketId = "") => {
  const code = ticketId.replace(/\D/g, "");
  const number = code ? Number(code.slice(-2)) : 7;
  return `B${(number % 9) + 1}`;
};

const Ticket = forwardRef(({ booking, variant = "ticket" }, ref) => {
  const { t } = useLanguage();
  const bus = booking?.busId || {};
  const seatText = booking.seatNumbers?.join(", ") || t("Auto assigned");
  const platform = buildPlatform(booking.ticketId);
  const scanUrl =
    typeof window !== "undefined" ? `${window.location.origin}/scan-ticket/${booking.ticketId}` : booking.ticketId;

  if (variant === "boarding") {
    return (
      <section className="boarding-pass" ref={ref}>
        <div className="boarding-main">
          <div className="boarding-top">
            <div className="ticket-brand dark-brand">
              <span className="brand-mark">
                <Bus size={24} />
              </span>
              <div>
                <h2>{t("appName")}</h2>
                <p>{t("busBoardingPass")}</p>
              </div>
            </div>
            <div className="boarding-badge-group">
              <span className="boarding-badge">{t("boardingPass")}</span>
              <small>{t("shubhaPrayana")}</small>
            </div>
          </div>

          <div className="kannada-ribbon">
            <span>{t("happyJourney")}</span>
            <strong>{t("shubhaPrayana")}</strong>
            <span>{t("kannadaService")}</span>
          </div>

          <div className="boarding-route">
            <div>
              <span>{t("from")}</span>
              <strong>{t(bus.from)}</strong>
            </div>
            <div className="flight-path">
              <span />
              <Bus size={26} />
              <span />
            </div>
            <div>
              <span>{t("to")}</span>
              <strong>{t(bus.to)}</strong>
            </div>
          </div>

          <div className="boarding-grid">
            <div>
              <span>{t("passengerLabel")}</span>
              <strong>{booking.passengerName}</strong>
            </div>
            <div>
              <span>{t("date")}</span>
              <strong>{bus.journeyDate}</strong>
            </div>
            <div>
              <span>{t("boarding")}</span>
              <strong>{bus.departureTime}</strong>
            </div>
            <div>
              <span>{t("arrival")}</span>
              <strong>{bus.arrivalTime}</strong>
            </div>
            <div>
              <span>{t("platform")}</span>
              <strong>{platform}</strong>
            </div>
            <div>
              <span>{t("seat")}</span>
              <strong>{seatText}</strong>
            </div>
          </div>

          <p className="journey-note">{t("safeJourneyNote")}</p>
        </div>

        <aside className="boarding-stub">
          <span>{t("ticketId")}</span>
          <strong>{booking.ticketId}</strong>
          <div className="qr-art">
            <QRCodeSVG value={scanUrl} size={106} level="H" includeMargin />
          </div>
          <small>{t("scanViewDownload")}</small>
          <small>
            {bus.busNumber} - {t(bus.busType)}
          </small>
          <span className="status-pill">{t("payment")} {t(booking.paymentStatus)}</span>
        </aside>
      </section>
    );
  }

  return (
    <section className="ticket futuristic-ticket" ref={ref}>
      <div className="ticket-header">
        <div className="ticket-brand">
          <span className="brand-mark">
            <Bus size={24} />
          </span>
          <div>
            <h2>{t("appName")}</h2>
            <p>{t("premiumTicket")}</p>
          </div>
        </div>
        <div className="ticket-status">
          <TicketCheck size={22} />
          {t("confirmed")}
        </div>
      </div>

      <div className="happy-journey-banner">
        <span>{t("happyJourney")}</span>
        <strong>{t("shubhaPrayana")}</strong>
        <span>{t("safeJourneyNote")}</span>
      </div>

      <div className="ticket-hero-strip">
        <div>
          <span>{t("route")}</span>
          <strong>
            {t(bus.from)} {t("to")} {t(bus.to)}
          </strong>
        </div>
        <div>
          <span>{t("total")}</span>
          <strong>Rs. {booking.totalAmount}</strong>
        </div>
      </div>

      <div className="ticket-id-row">
        <div>
          <span>{t("ticketId")}</span>
          <strong>{booking.ticketId}</strong>
        </div>
        <div className="ticket-code-stack">
          <div className="ticket-qr">
            <QRCodeSVG value={scanUrl} size={92} level="H" includeMargin />
            <small>{t("scanDetails")}</small>
          </div>
          <div className="barcode" aria-label={`${t("Ticket barcode")} ${booking.ticketId}`} />
        </div>
      </div>

      <div className="ticket-grid">
        <div className="ticket-field accent-blue">
          <UserRound size={16} />
          <div>
            <span>{t("passengerLabel")}</span>
            <strong>{booking.passengerName}</strong>
            <small>{booking.email}</small>
          </div>
        </div>
        <div className="ticket-field accent-orange">
          <ShieldCheck size={16} />
          <div>
            <span>{t("phoneNumber")}</span>
            <strong>{booking.phone}</strong>
            <small>{t("payment")} {t(booking.paymentStatus)}</small>
          </div>
        </div>
        <div className="ticket-field accent-green">
          <Bus size={16} />
          <div>
            <span>{t("busLabel")}</span>
            <strong>{bus.busName}</strong>
            <small>
              {bus.busNumber} - {t(bus.busType)}
            </small>
          </div>
        </div>
        <div className="ticket-field accent-violet">
          <MapPin size={16} />
          <div>
            <span>{t("boardingPlatform")}</span>
            <strong>{platform}</strong>
            <small>{t(bus.from)}</small>
          </div>
        </div>
        <div className="ticket-field accent-blue">
          <CalendarDays size={16} />
          <div>
            <span>{t("journeyDate")}</span>
            <strong>{bus.journeyDate}</strong>
          </div>
        </div>
        <div className="ticket-field accent-orange">
          <Clock size={16} />
          <div>
            <span>{t("timing")}</span>
            <strong>
              {bus.departureTime} - {bus.arrivalTime}
            </strong>
          </div>
        </div>
        <div className="ticket-field accent-green">
          <Armchair size={16} />
          <div>
            <span>{t("seatNumber")}</span>
            <strong>{seatText}</strong>
            <small>{booking.numberOfSeats} {t("seats")}</small>
          </div>
        </div>
        <div className="ticket-field accent-violet">
          <IndianRupee size={16} />
          <div>
            <span>{t("ticketPrice")}</span>
            <strong>Rs. {bus.price}</strong>
            <small>{t("total")} Rs. {booking.totalAmount}</small>
          </div>
        </div>
      </div>

      <div className="ticket-terms">
        <strong>{t("terms")}</strong>
        <p>{t("termsText")}</p>
      </div>
    </section>
  );
});

Ticket.displayName = "Ticket";

export default Ticket;
