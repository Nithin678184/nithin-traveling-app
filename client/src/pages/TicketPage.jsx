import React from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ArrowLeft, Bus, Download, Printer } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Ticket from "../components/Ticket";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const TicketPage = () => {
  const { bookingId } = useParams();
  const ticketRef = useRef(null);
  const boardingPassRef = useRef(null);
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState("");
  const [ticketView, setTicketView] = useState("ticket");
  const { t } = useLanguage();

  useEffect(() => {
    api
      .get(`/ticket/${bookingId}`)
      .then(({ data }) => setBooking(data.booking))
      .catch((error) => setMessage(t(getApiError(error))));
  }, [bookingId, t]);

  const exportPdf = async (element, suffix) => {
    const canvas = await html2canvas(element, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth() - 20;
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(image, "PNG", 10, 10, width, height);
    pdf.save(`${booking.ticketId}-${suffix}.pdf`);
  };

  const downloadTicket = async () => {
    await exportPdf(ticketRef.current, ticketView === "boarding" ? "boarding-pass" : "bus-ticket");
  };

  const downloadBoardingPass = async () => {
    await exportPdf(boardingPassRef.current, "boarding-pass");
  };

  return (
    <DashboardLayout title={t("professionalTicket")} subtitle={t("ticketSubtitle")}>
      {message && (
        <div className="empty-state">
          <Printer size={42} />
          <h2>{t("ticketNotAvailable")}</h2>
          <p>{message}</p>
          <Link className="primary-button" to="/my-bookings">
            <ArrowLeft size={18} />
            {t("backToDashboard")}
          </Link>
        </div>
      )}

      {booking && (
        <>
          <div className="ticket-actions">
            <div className="segmented-control" aria-label={t("Ticket style")}>
              <button className={ticketView === "ticket" ? "active" : ""} onClick={() => setTicketView("ticket")}>
                <Bus size={17} />
                {t("busTicket")}
              </button>
              <button className={ticketView === "boarding" ? "active" : ""} onClick={() => setTicketView("boarding")}>
                <Bus size={17} />
                {t("boardingPass")}
              </button>
            </div>
            <button className="primary-button" onClick={downloadTicket}>
              <Download size={18} />
              {t("downloadTicketPdf")}
            </button>
            <button className="secondary-button" onClick={downloadBoardingPass}>
              <Download size={18} />
              {t("downloadBoardingPass")}
            </button>
            <button className="secondary-button" onClick={() => window.print()}>
              <Printer size={18} />
              {t("printTicket")}
            </button>
            <Link className="dark-button" to="/passenger/dashboard">
              <ArrowLeft size={18} />
              {t("backToDashboard")}
            </Link>
          </div>
          <Ticket booking={booking} ref={ticketRef} variant={ticketView} />
          <div className="download-buffer" aria-hidden="true">
            <Ticket booking={booking} ref={boardingPassRef} variant="boarding" />
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default TicketPage;
