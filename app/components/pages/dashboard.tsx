"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapView } from "../organisms/map/mapView";

import styles from "./dashboard.module.css";
import { faChartBar, faMap } from "@fortawesome/free-regular-svg-icons";
import { faJediOrder } from "@fortawesome/free-brands-svg-icons";
import { faAlignCenter, faFire, faMapLocation, faMapMarked, faMapPin, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons/faMapLocationDot";
import { useEffect, useState } from "react";
import { MapMode, MapRegion } from "@/app/core/types";

import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";

import MexicoNeighboors from "../../core/data/mexico_ne.json";
import Markers from "../../core/data/data_test.json";

const DEFAULT_CENTER = { lat: 19.431727519606884, lng: -99.1347848053937 };

export const DashboardPageComponent = () => {
  const [center, setCenter] = useState(DEFAULT_CENTER);

  const [selectedDistrict, setSelectedDistrict] = useState<MapRegion | null>(null);

  // Configuration
  const [configDistricts, setDistricts] = useState(true);
  const [configHeatMap, setHeatMap] = useState(false);
  const [configFocusOnSales, setFocusOnSales] = useState(true);
  const [configFocusOnLiters, setFocusOnLiters] = useState(false);
  const [configFocusOnUnits, setFocusOnUnits] = useState(false);

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
          </div>
        </div>
        <div className={styles.map}>
          <MapView
            distributorsData={Markers}
            mexicoData={MexicoNeighboors}
            focusOnSales={configFocusOnSales}
            focusOnLiters={configFocusOnLiters}
            focusOnUnits={configFocusOnUnits}
            showDistricts={configDistricts}
            mapMode={configHeatMap ? MapMode.HEAT : MapMode.NORMAL}
            center={center}
            onChangeCenter={(coords) => setCenter(coords)}
            defaultCenter={center}
          />
        </div>
        <div className={styles.mapConfig}>
          <h4>Configuration</h4>
          <div>
            <FormControlLabel control={<Switch size="small" checked={configDistricts} onChange={(e) => setDistricts(e.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Show districts" />
            <FormControlLabel control={<Switch size="small" checked={configHeatMap} onChange={(e) => setHeatMap(e.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Heat map" />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={configFocusOnSales}
                  onChange={(e) => {
                    setFocusOnSales(true);
                    setFocusOnLiters(false);
                    setFocusOnUnits(false);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Focus on Sales"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={configFocusOnUnits}
                  onChange={(e) => {
                    setFocusOnSales(false);
                    setFocusOnLiters(false);
                    setFocusOnUnits(true);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Focus on units"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={configFocusOnLiters}
                  onChange={(e) => {
                    setFocusOnSales(false);
                    setFocusOnLiters(true);
                    setFocusOnUnits(false);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Focus on liters"
            />
          </div>
        </div>
      </div>
      {selectedDistrict ? (
        <div className={styles.distribution}>
          <div className={styles.header}>
            <div>
              <h4>District information</h4>
              <p>Everything about the district</p>
            </div>
            <div>
              <FontAwesomeIcon onClick={() => setCenter(DEFAULT_CENTER)} icon={faMapPin} />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
