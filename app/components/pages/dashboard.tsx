"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapView } from "../organisms/map/mapView";

import styles from "./dashboard.module.css";
import { faChartBar, faMap } from "@fortawesome/free-regular-svg-icons";
import { faJediOrder } from "@fortawesome/free-brands-svg-icons";
import { faAlignCenter, faFire, faMapLocation, faMapMarked, faMapPin, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons/faMapLocationDot";
import { useEffect, useState } from "react";
import { MapMarker, MapMode, MapRegion, RegionData } from "@/app/core/types";

import Switch from "@mui/material/Switch";
import { FormControlLabel, Slider } from "@mui/material";

import MexicoNeighboors from "../../core/data/city_mexico_ne.json";
import BogotaNeighboors from "../../core/data/city_bogota_ne.json";
import MiamiNeighboors from "../../core/data/city_miami_ne.json";
import Markers from "../../core/data/data.json";

const DEFAULT_DATA_BY_CITY = {
  BOGOTA: { center: { lat: 4.711812938421693, lng: -74.07311329082448 }, regions: BogotaNeighboors, city: "Bogotá" },
  MEXICO_CITY: { center: { lat: 19.431727519606884, lng: -99.1347848053937 }, regions: MexicoNeighboors, city: "Mexico City" },
  MIAMI: { center: { lat: 25.760518824822164, lng: -80.19682987146976 }, regions: MiamiNeighboors, city: "Miami" },
};

enum City {
  BOGOTA = "BOGOTA",
  MEXICO_CITY = "MEXICO_CITY",
  MIAMI = "MIAMI",
}

export const DashboardPageComponent = () => {
  const [city, setCity] = useState<City>(City.BOGOTA);
  const [center, setCenter] = useState(DEFAULT_DATA_BY_CITY[City.BOGOTA].center);

  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<MapMarker | null>(null);

  // Configuration
  const [configDistricts, setDistricts] = useState(true);
  const [configMarkers, setShowMarkers] = useState(false);
  const [configHeatMap, setHeatMap] = useState(false);
  const [configFocusOnSales, setFocusOnSales] = useState(true);
  const [configFocusOnLiters, setFocusOnLiters] = useState(false);
  const [configFocusOnUnits, setFocusOnUnits] = useState(false);

  const maxValue = Math.max(...(Markers && Array.isArray(Markers) ? Markers : []).map((maker) => (configFocusOnSales ? maker.sales_usd : configFocusOnLiters ? maker.sales_liters : maker.sales_units)));
  const filteredDistributors = (Markers && Array.isArray(Markers) ? Markers : []).filter((mk) => mk.city === DEFAULT_DATA_BY_CITY[city].city);

  const [totalFilter, setTotalFilter] = useState<Array<number>>([0, maxValue]);

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
            <FontAwesomeIcon onClick={() => setCenter(DEFAULT_DATA_BY_CITY[city].center)} icon={faMapPin} />
          </div>
        </div>
        <div className={styles.citySelection}>
          <button
            onClick={() => {
              setCity(City.BOGOTA);
              setCenter(DEFAULT_DATA_BY_CITY[City.BOGOTA].center);
              setHeatMap(false);
            }}
          >
            Bogota
          </button>
          <button disabled>Medellin</button>
          <button
            onClick={() => {
              setCity(City.MEXICO_CITY);
              setCenter(DEFAULT_DATA_BY_CITY[City.MEXICO_CITY].center);
              setHeatMap(false);
            }}
          >
            Mexico City
          </button>
          <button
            onClick={() => {
              setCity(City.MIAMI);
              setCenter(DEFAULT_DATA_BY_CITY[City.MIAMI].center);
              setHeatMap(false);
            }}
          >
            Miami
          </button>
          <button disabled>New york</button>
        </div>
        <div className={styles.map}>
          {filteredDistributors && Array.isArray(filteredDistributors) ? (
            <MapView
              onChangeRegion={(region) => setRegionData(region)}
              totalFilter={totalFilter}
              distributorsData={filteredDistributors}
              mexicoData={DEFAULT_DATA_BY_CITY[city].regions}
              focusOnSales={configFocusOnSales}
              focusOnLiters={configFocusOnLiters}
              focusOnUnits={configFocusOnUnits}
              showDistricts={configDistricts}
              enableSellerMark={configMarkers}
              mapMode={configHeatMap ? MapMode.HEAT : MapMode.NORMAL}
              center={center}
              onChangeCenter={(coords) => setCenter(coords)}
              defaultCenter={center}
            />
          ) : (
            ""
          )}
        </div>
        <div className={styles.mapConfig}>
          <h4>Configuration</h4>
          <div>
            <FormControlLabel control={<Switch size="small" checked={configMarkers} onChange={(e) => setShowMarkers(e.target.checked)} inputProps={{ "aria-label": "controlled" }} />} label="Show seller markers" />
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
          <div className={styles.filter}>
            <h4>Filter {configFocusOnSales ? "By Sales (USD)" : configFocusOnLiters ? "By liters" : "By Units"}</h4>
            <Slider
              aria-label="Totals"
              value={totalFilter}
              onChange={(e, value) => {
                setTotalFilter(value as Array<number>);
              }}
              defaultValue={maxValue}
              getAriaValueText={(value: number) => `${Intl.NumberFormat().format(value)}`}
              valueLabelDisplay="auto"
              step={maxValue / 20}
              marks
              min={0}
              max={maxValue}
            />
            <small>We filter by different attributes to get wholesalers, distributors or subdistributors (It is not the best implementation but for now it is simple)</small>
          </div>
        </div>
      </div>
      {regionData && regionData.region ? (
        <div className={styles.distribution}>
          <div className={styles.header}>
            <div>
              <h4>District information ({regionData.region.name})</h4>
              <p>Everything about the district</p>
            </div>
          </div>
          <div className={styles.districtData}>
            <div className={styles.distributors}>
              <div onClick={() => setSelectedDistributor(null)} className={selectedDistributor == null ? styles.active : ""}>
                <h4>All</h4>
                <small>Compare all distributors on the selected region</small>
              </div>
              {regionData.distributors && Array.isArray(regionData.distributors)
                ? regionData.distributors.map((dist, index) => {
                    return (
                      <div onClick={() => setSelectedDistributor(dist)} className={selectedDistributor != null && selectedDistributor.pdv === dist.pdv ? styles.active : ""} key={dist.pdv + "_" + dist.vendor_code + "_" + index + "_" + dist.gps_coordinates}>
                        <h5>Vendor: {dist.vendor_name}</h5>
                        <small>{dist.address}</small>
                        <small>Product: {dist.product_name}</small>
                      </div>
                    );
                  })
                : ""}
            </div>

            {regionData.distributors.length > 0 ? (
              <div className={styles.distData}>
                {selectedDistributor == null ? (
                  <>
                    <h4>All sellers</h4>
                    <small>Information and comparation about all sellers on the selected region</small>
                    <div className={styles.distsSales}>
                      <h5>Sales distribution</h5>
                      <div style={{ width: "100%", height: 1000 }}>
                        {/* <TreeChart
                          data={regionData.distributors.map((dist) => {
                            return { name: dist.vendor_name, size: dist.sales_usd, percentage: (dist.sales_usd * 100) / regionData.totalSales };
                          })}
                        /> */}
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
