import React from "react";
import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BusCard from "../components/BusCard";
import DashboardLayout from "../components/DashboardLayout";
import { useLanguage } from "../context/LanguageContext";
import api from "../utils/api";
import { getApiError } from "../utils/formHelpers";

const BusResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBuses = async () => {
      setLoading(true);
      setMessage("");
      try {
        const { data } = await api.get("/buses/search", {
          params: {
            from: params.get("from"),
            to: params.get("to"),
            journeyDate: params.get("journeyDate")
          }
        });
        setBuses(data.buses);
      } catch (error) {
        setMessage(t(getApiError(error)));
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [params]);

  const handleBook = (bus) => {
    navigate(`/booking/${bus._id}?seats=${params.get("passengers") || 1}`);
  };

  return (
    <DashboardLayout
      title="Available Buses"
      subtitle={`${t(params.get("from"))} ${t("to")} ${t(params.get("to"))} - ${params.get("journeyDate")}`}
    >
      {message && <div className="alert error">{message}</div>}
      {loading && <div className="panel">{t("Searching matching Karnataka buses...")}</div>}

      {!loading && buses.length === 0 && (
        <div className="empty-state">
          <SearchX size={42} />
          <h2>{t("No buses found")}</h2>
          <p>{t("Try another date or Karnataka route.")}</p>
          <Link className="primary-button" to="/search">
            {t("Search Again")}
          </Link>
        </div>
      )}

      <div className="bus-list">
        {buses.map((bus) => (
          <BusCard key={bus._id} bus={bus} onBook={handleBook} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default BusResults;
