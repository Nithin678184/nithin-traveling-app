import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Bus, Download, Printer, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Ticket from "../components/Ticket";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const ScanTicketPage = () => {
  const { ticketId } = useParams();
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [view, setView] = useState("ticket");
  const activeRef = useRef(null);
  const busTicketRef = useRef(null);
  const boardingPassRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    api
      .get(`/ticket/scan/${ticketId}`)
      .then(({ data }) => setBooking(data.booking))
      .catch((error) => setMessage(t(getApiError(error))));
  }, [ticketId, t]);

  const exportPdf = async (element, suffix) => {
    const canvas = await html2canvas(element, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 20;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 10, 10, width, height);
    pdf.save(`${booking.ticketId}-${suffix}.pdf`);
  };

  return (
    <main className="scan-page">
      <section className="scan-hero">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={17} />
            {t("verifiedQrTicket")}
          </span>
          <h1>{t("ticketDetails")}</h1>
          <p>{t("scannedTicketText")}</p>
        </div>
        <Link className="secondary-button" to="/">
          <ArrowLeft size={18} />
          {t("home")}
        </Link>
      </section>

      {message && (
        <div className="scan-card">
          <Bus size={42} />
          <h2>{t("ticketNotAvailable")}</h2>
          <p>{message}</p>
        </div>
      )}

      {booking && (
        <>
          <section className="scan-summary">
            <div>
              <span>{t("passengerLabel")}</span>
              <strong>{booking.passengerName}</strong>
            </div>
            <div>
              <span>{t("route")}</span>
              <strong>
                {t(booking.busId?.from)} {t("to")} {t(booking.busId?.to)}
              </strong>
            </div>
            <div>
              <span>{t("journey")}</span>
              <strong>{booking.busId?.journeyDate}</strong>
            </div>
            <div>
              <span>{t("seat")}</span>
              <strong>{booking.seatNumbers?.join(", ")}</strong>
            </div>
          </section>

          <div className="scan-controls">
            <div className="segmented-control" aria-label={t("Scanned ticket style")}>
              <button className={view === "ticket" ? "active" : ""} onClick={() => setView("ticket")}>
                <Bus size={17} />
                {t("busTicket")}
              </button>
              <button className={view === "boarding" ? "active" : ""} onClick={() => setView("boarding")}>
                <Bus size={17} />
                {t("boardingPass")}
              </button>
            </div>
            <button className="primary-button" onClick={() => exportPdf(busTicketRef.current, "bus-ticket")}>
              <Download size={18} />
              {t("downloadTicket")}
            </button>
            <button className="secondary-button" onClick={() => exportPdf(boardingPassRef.current, "boarding-pass")}>
              <Download size={18} />
              {t("downloadBoardingPass")}
            </button>
            <button className="dark-button" onClick={() => window.print()}>
              <Printer size={18} />
              {t("print")}
            </button>
          </div>

          <Ticket booking={booking} variant={view} ref={activeRef} />

          <div className="download-buffer" aria-hidden="true">
            <Ticket booking={booking} variant="ticket" ref={busTicketRef} />
            <Ticket booking={booking} variant="boarding" ref={boardingPassRef} />
          </div>

          <div className="scan-download-bar">
            <button onClick={() => exportPdf(busTicketRef.current, "bus-ticket")}>
              <Download size={17} />
              {t("ticket")}
            </button>
            <button onClick={() => exportPdf(boardingPassRef.current, "boarding-pass")}>
              <Download size={17} />
              {t("boardingPass")}
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default ScanTicketPage;
