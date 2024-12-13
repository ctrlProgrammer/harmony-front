"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapView } from "../organisms/map/mapView";

import styles from "./dashboard.module.css";
import { faChartBar, faMap } from "@fortawesome/free-regular-svg-icons";
import { faJediOrder } from "@fortawesome/free-brands-svg-icons";
import { faAlignCenter, faFire, faMapLocation, faMapMarked, faMapPin, faUsers } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons/faMapLocationDot";
import { useEffect, useState } from "react";
import { City, MapMarker, MapMode, MapRegion, RegionData } from "@/app/core/types";

import Switch from "@mui/material/Switch";
import { FormControlLabel, Slider } from "@mui/material";

import MexicoNeighboors from "../../core/data/city_mexico_ne.json";
import BogotaNeighboors from "../../core/data/city_bogota_ne.json";
import MiamiNeighboors from "../../core/data/city_miami_ne.json";
import Markers from "../../core/data/data.json";
import Propmts from "../../core/data/posible_prompts.json";
import { categorizeSellers, generateRandomSellerHistoricalData } from "@/app/core/utils/global";
import { TreeChart } from "../organisms/charts/tree";
import { useAppStore } from "@/app/core/state/app";
import { BarChartComponent } from "../organisms/charts/bar";

const DEFAULT_DATA_BY_CITY = {
  BOGOTA: { center: { lat: 4.711812938421693, lng: -74.07311329082448 }, regions: BogotaNeighboors, city: "Bogotá" },
  MEXICO_CITY: { center: { lat: 19.431727519606884, lng: -99.1347848053937 }, regions: MexicoNeighboors, city: "Mexico City" },
  MIAMI: { center: { lat: 25.760518824822164, lng: -80.19682987146976 }, regions: MiamiNeighboors, city: "Miami" },
};

export const DashboardPageComponent = () => {
  const { generatedPrescriptions, generatePrescription, rejectPrescription, acceptPrescription } = useAppStore();

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

  let sortedSellers: MapMarker[] = [];
  let averageSalesPerSeller = 0;
  let averageUnitsPerSeller = 0;
  let averagelitersPerSeller = 0;
  let totalSales = 0;
  let topSellerSales = 0;
  let topSellerName = "";
  let topSellers: MapMarker[] = [];
  let lowSellers: MapMarker[] = [];
  let separationByProducts: any = {};

  if (regionData != null && regionData.distributors.length > 0) {
    sortedSellers = [...regionData.distributors].sort((a, b) => b.sales_usd - a.sales_usd);

    for (let i = 0; i < sortedSellers.length; i++) {
      if (sortedSellers[i].sales_usd > topSellerSales) {
        topSellerSales = sortedSellers[i].sales_usd;
        topSellerName = sortedSellers[i].vendor_name;
      }

      totalSales += sortedSellers[i].sales_usd;
      averageSalesPerSeller += sortedSellers[i].sales_usd;
      averageUnitsPerSeller += sortedSellers[i].sales_units;
      averagelitersPerSeller += sortedSellers[i].sales_liters;

      if (Object.keys(separationByProducts).includes(sortedSellers[i].product_name)) {
        separationByProducts[sortedSellers[i].product_name] += sortedSellers[i].sales_usd;
      } else {
        separationByProducts[sortedSellers[i].product_name] = sortedSellers[i].sales_usd;
      }
    }

    averageSalesPerSeller /= sortedSellers.length;
    averageUnitsPerSeller /= sortedSellers.length;
    averagelitersPerSeller /= sortedSellers.length;

    const { lowPerformers, topPerformers } = categorizeSellers(sortedSellers);

    topSellers = topPerformers;
    lowSellers = lowPerformers;
  }

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
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={configMarkers}
                  onChange={(e) => {
                    setShowMarkers(e.target.checked);
                    setHeatMap(false);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Show seller markers"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={configDistricts}
                  onChange={(e) => {
                    setDistricts(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Show districts"
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={configHeatMap}
                  onChange={(e) => {
                    setHeatMap(e.target.checked);
                    setShowMarkers(false);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Heat map"
            />
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
      <div className={styles.distribution}>
        <div className={styles.header} style={{ marginBottom: 5 }}>
          <div>
            <h4>Generate prescriptions ({city})</h4>
            <p>Solve problems or improve your distribution on {city}. Use the filters on the map to create clusters and fincrease the precision of the prescriptions.</p>
          </div>
        </div>
        <div className={styles.prompt}>
          <button onClick={() => generatePrescription(city)}>Generate</button>
        </div>

        <div className={styles.prescriptions}>
          <h4>Generated prescriptions</h4>
          <small>Take action or reject proposals</small>
          <div>
            {generatedPrescriptions
              .filter((pres) => pres.city === city && !pres.rejected && !pres.actionable)
              .map((pres) => {
                return (
                  <div>
                    <h6>City - {pres.city}</h6>
                    <p>{pres.text}</p>
                    <div>
                      <button onClick={() => rejectPrescription(pres.uuid)}>Reject</button>
                      <button onClick={() => acceptPrescription(pres.uuid)}>Take action</button>
                    </div>
                  </div>
                );
              })}
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
              {sortedSellers && Array.isArray(sortedSellers)
                ? sortedSellers.map((dist, index) => {
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

                    <div className={styles.basicData}>
                      <div>
                        <h6>Total sellers</h6>
                        <span>{regionData.distributors.length}</span>
                      </div>
                      <div>
                        <h6>Average sales</h6>
                        <span>$ {Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(averageSalesPerSeller)}</span>
                      </div>
                      <div>
                        <h6>Average liters</h6>
                        <span>{Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(averagelitersPerSeller)}</span>
                      </div>
                      <div>
                        <h6>Average units</h6>
                        <span>{Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(averageUnitsPerSeller)}</span>
                      </div>
                      <div>
                        <h6>Top seller</h6>
                        <span>{topSellerName}</span>
                        <span>${Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(topSellerSales)}</span>
                      </div>
                    </div>

                    <div className={styles.distsSales}>
                      <h4>Sales distribution by product</h4>
                      <small>Total sales by product on selected district</small>
                      <div style={{ width: "100%", height: 400, marginTop: 10 }}>
                        <TreeChart
                          data={Object.keys(separationByProducts).map((product) => {
                            return { name: product, size: separationByProducts[product], percentage: (separationByProducts[product] * 100) / totalSales };
                          })}
                        />
                      </div>
                    </div>

                    <div className={styles.byPerformance}>
                      <div>
                        <h5>Top performers (1%)</h5>
                        <div>
                          {topSellers
                            ? topSellers.map((seller) => {
                                return (
                                  <div>
                                    <h5>{seller.vendor_name}</h5>
                                    <span>Sales: $ {Intl.NumberFormat().format(seller.sales_usd)}</span>
                                    <span>Product: {seller.product_name}</span>
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                      <div>
                        <h5>Low performers (1%)</h5>
                        <div>
                          {lowSellers
                            ? lowSellers.map((seller) => {
                                return (
                                  <div>
                                    <h5>{seller.vendor_name}</h5>
                                    <span>Sales: $ {Intl.NumberFormat().format(seller.sales_usd)}</span>
                                    <span>Product: {seller.product_name}</span>
                                  </div>
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h4>Seller - {selectedDistributor.vendor_name}</h4>
                    <div className={styles.dist}>
                      <ul>
                        <li>Country: {selectedDistributor.country}</li>
                        <li>City: {selectedDistributor.city}</li>
                        <li>Address: {selectedDistributor.address}</li>
                        <li>Product: {selectedDistributor.product_name}</li>
                        <li>Brand: {selectedDistributor.brand}</li>
                        <li>Sales USD: $ {Intl.NumberFormat().format(selectedDistributor.sales_usd)}</li>
                        <li>Sales Liters: {selectedDistributor.sales_liters}</li>
                        <li>Sales Units: {selectedDistributor.sales_units}</li>
                      </ul>

                      <div>
                        <BarChartComponent data={generateRandomSellerHistoricalData()} />
                      </div>
                    </div>
                  </>
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
