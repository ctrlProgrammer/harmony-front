"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapView } from "../organisms/map/mapView";

import styles from "./dashboard.module.css";
import { faChartBar, faMap } from "@fortawesome/free-regular-svg-icons";
import { faJediOrder } from "@fortawesome/free-brands-svg-icons";
import { faAlignCenter, faFire, faMapLocation, faMapMarked, faMapPin, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons/faMapLocationDot";
import { useState } from "react";
import { MapMode } from "@/app/core/types";

const DEFAULT_CENTER = { lat: 19.431727519606884, lng: -99.1347848053937 };

export const DashboardPageComponent = () => {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [mapMode, setMapMode] = useState<MapMode>(MapMode.NORMAL);

  return (
    <div className={styles.dashBoard}>
      <div className={styles.header}>
        <div>
          <h4>Dashboard</h4>
          <p>Harmony - Global Actionable Knowledge</p>
        </div>
        <div>
          <FontAwesomeIcon icon={faMapLocationDot} />
          <FontAwesomeIcon icon={faChartBar} />
          <FontAwesomeIcon icon={faUsers} />
        </div>
      </div>
      <div className={styles.distribution}>
        <div className={styles.header}>
          <div>
            <h4>Distribution map</h4>
            <p>Discover all the information about distribution</p>
          </div>
          <div>
            <FontAwesomeIcon onClick={() => setCenter(DEFAULT_CENTER)} icon={faMapPin} />
            <FontAwesomeIcon onClick={() => setMapMode(mapMode == MapMode.HEAT ? MapMode.NORMAL : MapMode.HEAT)} icon={faFire} />
          </div>
        </div>
        <div className={styles.map}>
          <MapView mapMode={mapMode} center={center} onChangeCenter={(coords) => setCenter(coords)} defaultCenter={center} />
        </div>
      </div>
    </div>
  );
};
