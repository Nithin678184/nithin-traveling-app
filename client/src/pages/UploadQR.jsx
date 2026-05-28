import React from "react";
import { QrCode, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api, { assetUrl } from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const UploadQR = () => {
  const [qr, setQr] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const loadQR = async () => {
    const { data } = await api.get("/payment/qr");
    setQr(data.qr);
  };

  useEffect(() => {
    loadQR().catch(() => setQr(null));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!file) {
      setMessage(t("QR code image is required"));
      return;
    }

    const payload = new FormData();
    payload.append("qrImage", file);
    setLoading(true);

    try {
      await api.post("/payment/upload-qr", payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(t("QR code uploaded successfully"));
      setFile(null);
      loadQR();
    } catch (error) {
      setMessage(t(getApiError(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="admin" title="Upload QR Code" subtitle="Passengers will scan this QR code during payment.">
      {message && <div className={message === t("QR code uploaded successfully") ? "alert success" : "alert error"}>{message}</div>}
      <div className="payment-grid">
        <form className="panel payment-form" onSubmit={handleSubmit}>
          <QrCode size={42} />
          <label>
            {t("QR Code Image")}
            <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0])} />
          </label>
          <button className="primary-button full-width" disabled={loading}>
            <UploadCloud size={18} />
            {loading ? t("Uploading...") : t("Upload QR Code")}
          </button>
        </form>

        <section className="panel current-qr">
          <h2>{t("Current QR Code")}</h2>
          {qr?.qrImage ? <img src={assetUrl(qr.qrImage)} alt={t("Current payment QR")} /> : <p>{t("No QR code uploaded yet.")}</p>}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default UploadQR;
