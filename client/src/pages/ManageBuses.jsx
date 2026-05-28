import React from "react";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BusCard from "../components/BusCard";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const ManageBuses = () => {
  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState("");
  const { t } = useLanguage();

  const fetchBuses = async () => {
    try {
      const { data } = await api.get("/buses");
      setBuses(data.buses);
    } catch (error) {
      setMessage(t(getApiError(error)));
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const deleteBus = async (id) => {
    const confirmed = window.confirm(t("Delete this bus from Nithin Traveling App?"));
    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/buses/${id}`);
      fetchBuses();
    } catch (error) {
      setMessage(t(getApiError(error)));
    }
  };

  return (
    <DashboardLayout type="admin" title="View Bus List" subtitle="Edit, delete and monitor available seats.">
      <div className="button-row top-actions">
        <Link className="primary-button" to="/admin/add-bus">
          <PlusCircle size={18} />
          {t("Add Bus")}
        </Link>
      </div>
      {message && <div className="alert error">{message}</div>}
      <div className="bus-list">
        {buses.map((bus) => (
          <BusCard
            key={bus._id}
            bus={bus}
            adminActions={
              <div className="button-row">
                <Link className="small-button" to={`/admin/edit-bus/${bus._id}`}>
                  <Edit size={15} />
                  {t("Edit")}
                </Link>
                <button className="small-button danger" onClick={() => deleteBus(bus._id)}>
                  <Trash2 size={15} />
                  {t("Delete")}
                </button>
              </div>
            }
          />
        ))}
      </div>
      {buses.length === 0 && <div className="panel">{t("No buses added yet.")}</div>}
    </DashboardLayout>
  );
};

export default ManageBuses;
