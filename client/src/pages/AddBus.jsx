import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BusForm from "../components/BusForm";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const AddBus = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setMessage("");
    try {
      await api.post("/buses/add", payload, {
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
    <DashboardLayout type="admin" title="Add Bus" subtitle="Create a new Karnataka route bus schedule.">
      {message && <div className="alert error">{message}</div>}
      <BusForm onSubmit={handleSubmit} loading={loading} buttonLabel="Add Bus" />
    </DashboardLayout>
  );
};

export default AddBus;
