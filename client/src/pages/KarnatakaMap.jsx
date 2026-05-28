import React from "react";
import { Bus, Compass, ExternalLink, Map, MapPinned, Navigation, Route } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const karnatakaMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=73.6000%2C11.2500%2C78.9500%2C18.6500&layer=mapnik&marker=15.3173%2C75.7139";
const openMapUrl = "https://www.openstreetmap.org/#map=7/15.3173/75.7139";

const serviceCards = [
  { icon: Route, title: "mapNetwork", text: "mapNetworkText" },
  { icon: Bus, title: "mapMajorStands", text: "mapMajorStandsText" },
  { icon: Compass, title: "mapServiceZones", text: "mapServiceZonesText" }
];

const routeIdeas = [
  ["Bengaluru Majestic", "Mysuru", "southKarnataka"],
  ["Hubballi", "Belagavi", "northKarnataka"],
  ["Mangaluru", "Udupi", "coastalRoute"],
  ["Shivamogga", "Madikeri", "malnadRoute"]
];

const highlightedStops = [
  "Bengaluru Majestic",
  "Mysuru",
  "Mangaluru",
  "Hubballi",
  "Belagavi",
  "Kalaburagi",
  "Udupi",
  "Madikeri"
];

const KarnatakaMap = () => {
  const { isPassengerAuthenticated } = useAuth();
  const { t } = useLanguage();
  const searchTarget = isPassengerAuthenticated ? "/search" : "/login";

  return (
    <>
      <Navbar />
      <main className="map-page">
        <section className="container map-hero-section">
          <div className="map-hero-copy">
            <span className="eyebrow">
              <MapPinned size={17} />
              {t("karnatakaRoutesOnly")}
            </span>
            <h1>{t("mapHeroTitle")}</h1>
            <p>{t("mapHeroText")}</p>
            <div className="hero-actions">
              <Link className="primary-button" to={searchTarget}>
                <Navigation size={18} />
                {t("openSearch")}
              </Link>
              <Link className="secondary-button" to="/">
                <Bus size={18} />
                {t("home")}
              </Link>
            </div>
          </div>

          <section className="karnataka-map-card" aria-label={t("mapHeroTitle")}>
            <div className="map-card-header">
              <div>
                <span>{t("realKarnatakaMap")}</span>
                <h2>{t("liveMap")}</h2>
              </div>
              <Map size={34} />
            </div>

            <div className="real-map-shell">
              <iframe
                className="real-map-frame"
                title={t("realKarnatakaMap")}
                src={karnatakaMapUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-stop-overlay">
                <span>{t("majorKarnatakaStops")}</span>
                <div>
                  {highlightedStops.map((stop) => (
                    <strong key={stop}>{t(stop)}</strong>
                  ))}
                </div>
              </div>
            </div>

            <div className="map-legend">
              <span className="coast">{t("coastalRoute")}</span>
              <span className="malnad">{t("malnadRoute")}</span>
              <span className="north">{t("northKarnataka")}</span>
              <span className="south">{t("southKarnataka")}</span>
            </div>
            <a className="map-source-link" href={openMapUrl} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              {t("openInOpenStreetMap")}
            </a>
          </section>
        </section>

        <section className="container map-info-grid">
          {serviceCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="feature-card map-info-card" key={card.title}>
                <Icon size={28} />
                <h3>{t(card.title)}</h3>
                <p>{t(card.text)}</p>
              </article>
            );
          })}
        </section>

        <section className="container route-idea-panel">
          <div className="section-title">
            <span>{t("routeIdea")}</span>
            <h2>{t("mapQuickSearch")}</h2>
          </div>
          <div className="route-idea-grid">
            {routeIdeas.map(([from, to, label]) => (
              <Link className="route-idea-card" to={searchTarget} key={`${from}-${to}`}>
                <span>{t(label)}</span>
                <strong>
                  {t(from)} <b>{t("to")}</b> {t(to)}
                </strong>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default KarnatakaMap;
