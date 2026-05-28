import React from "react";
import { Armchair, Bus, Clock, IndianRupee, MapPin, MoveRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { assetUrl } from "../utils/api";

const BusCard = ({ bus, onBook, adminActions }) => {
  const { t } = useLanguage();

  return (
    <article className="bus-card">
      <div className="bus-image">
        {bus.busImage ? <img src={assetUrl(bus.busImage)} alt={bus.busName} /> : <Bus size={46} />}
        <span>{t(bus.busType)}</span>
      </div>

      <div className="bus-card-body">
        <div className="bus-card-top">
          <div>
            <h3>{bus.busName}</h3>
            <p>{bus.busNumber}</p>
          </div>
          <strong className="price">
            <IndianRupee size={16} />
            {bus.price}
          </strong>
        </div>

        <div className="route-line">
          <span>
            <MapPin size={16} />
            {t(bus.from)}
          </span>
          <MoveRight size={18} />
          <span>{t(bus.to)}</span>
        </div>

        <div className="bus-meta">
          <span>
            <Clock size={16} />
            {bus.departureTime} - {bus.arrivalTime}
          </span>
          <span>
            <Armchair size={16} />
            {bus.availableSeats} {t("seatsLeft")}
          </span>
          <span>{bus.journeyDate}</span>
        </div>

        {adminActions || (
          <button className="primary-button full-width" onClick={() => onBook?.(bus)}>
            <Bus size={17} />
            {t("bookNow")}
          </button>
        )}
      </div>
    </article>
  );
};

export default BusCard;
