import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BusForm from "../components/BusForm";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const EditBus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [bus, setBus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/buses/${id}`).then(({ data }) => setBus(data.bus)).catch((error) => setMessage(t(getApiError(error))));
  }, [id, t]);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setMessage("");
    try {
      await api.put(`/buses/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      navigate("/admin/buses");
    } catch (error) {
      setMessage(t(getApiError(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="admin" title="Update Bus" subtitle="Modify route, driver, fare and seat availability.">
      {message && <div className="alert error">{message}</div>}
      {bus ? (
        <BusForm initialBus={bus} onSubmit={handleSubmit} loading={loading} buttonLabel="Update Bus" />
      ) : (
        <div className="panel">{t("Loading bus...")}</div>
      )}
    </DashboardLayout>
  );
};

export default EditBus;
