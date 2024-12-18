import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Circle } from "./components/circle";
import { HeatMapCoords, MapCoords, MapMarker, MapMode, MapRegion, RegionData } from "@/core/types";
import { distanceBetweenPoints, isPointInCircle, milesToM } from "@/core/utils/global";
import Heatmap from "./components/heatmap";

import styles from "./mapView.module.css";

interface MapViewProps {
  defaultCenter: MapCoords;
  center: MapCoords;
  mapMode: MapMode;
  showDistricts: boolean;
  focusOnSales: boolean;
  focusOnLiters: boolean;
  focusOnUnits: boolean;
  mexicoData: MapRegion[];
  distributorsData: MapMarker[];
  totalFilter: Array<number>;
  enableSellerMark: boolean;
  onChangeRegion: (regionData: RegionData) => void;
  onChangeCenter: (coors: MapCoords) => void;
}

export const MapView = (props: MapViewProps) => {
  const [coords, setCoords] = useState(props.center);
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [heatMapMarkers, setHeatMapMarkers] = useState<HeatMapCoords[]>([]);
  const [regionData, setRegionData] = useState<RegionData | null>(null);
  const [loadMap, setLoadMap] = useState<boolean>(true);

  const searchLocatedMarkers = () => {
    const points: Array<MapMarker> = [];
    const heatMapPoints: Array<HeatMapCoords> = [];

    let totalLiters = 0;
    let totalSales = 0;
    let totalUnits = 0;

    if (props.distributorsData && Array.isArray(props.distributorsData)) {
      for (let i = 0; i < props.distributorsData.length; i++) {
        const data: MapMarker = props.distributorsData[i];
        const representativeData = props.focusOnSales ? data.sales_usd : props.focusOnLiters ? data.sales_liters : data.sales_units;

        if (representativeData < props.totalFilter[1] && representativeData > props.totalFilter[0]) {
          if (selectedRegion) {
            const distance = distanceBetweenPoints(Number(selectedRegion.latitude), Number(selectedRegion.longitude), props.distributorsData[i].latitude, props.distributorsData[i].longitude);

            if (distance * 1000 < selectedRegion.radius) {
              totalLiters += data.sales_liters;
              totalSales += data.sales_usd;
              totalUnits += data.sales_units;
              points.push(data);
            }
          }

          heatMapPoints.push({ lat: data.latitude, lng: data.longitude, weight: representativeData });
        }
      }
    }

    setHeatMapMarkers(heatMapPoints);

    const regionData = {
      distributors: points,
      totalLiters: totalLiters,
      totalSales: totalSales,
      totalUnits: totalUnits,
      region: selectedRegion,
    } as RegionData;

    setRegionData(regionData);
    props.onChangeRegion(regionData);
    setLoadMap(false);
  };

  useEffect(() => {
    setLoadMap(true);
  }, [selectedRegion, props.mapMode, props.focusOnLiters, props.focusOnSales, props.focusOnUnits, props.totalFilter]);

  useEffect(() => {
    if (loadMap) searchLocatedMarkers();
  }, [loadMap]);

  useEffect(() => setCoords(props.center), [props.center]);

  return (
    <div className={styles.map}>
      <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY || ""}>
        <Map style={{ width: "100%", height: "500px" }} defaultCenter={props.center} defaultZoom={11} gestureHandling={"greedy"} disableDefaultUI={true}>
          {props.mapMode == MapMode.HEAT && !loadMap ? (
            heatMapMarkers && Array.isArray(heatMapMarkers) ? (
              <Heatmap points={heatMapMarkers} opacity={0.6} radius={20} />
            ) : (
              ""
            )
          ) : !loadMap && regionData?.distributors && Array.isArray(regionData?.distributors) && props.enableSellerMark ? (
            regionData?.distributors.map((mapData, index) => {
              return <Marker key={index + "_" + mapData.vendor_name + "_" + mapData.pdv} position={{ lat: mapData.latitude, lng: mapData.longitude }} clickable={false} />;
            })
          ) : (
            ""
          )}

          {props.showDistricts && props.mexicoData && Array.isArray(props.mexicoData)
            ? props.mexicoData.map((neigh) => {
                return (
                  <>
                    <Circle
                      key={neigh.name}
                      onMouseOver={() => {}}
                      onClick={() => setSelectedRegion(neigh)}
                      radius={neigh.radius}
                      center={{ lat: Number(neigh.latitude), lng: Number(neigh.longitude) }}
                      strokeColor={"#0c4cb3"}
                      strokeOpacity={1}
                      strokeWeight={1}
                      fillColor={"#3b82f6"}
                      fillOpacity={0.3}
                      editable={false}
                      draggable={false}
                    />
                  </>
                );
              })
            : ""}

          {selectedRegion && props.showDistricts ? (
            <InfoWindow
              onClose={() => setSelectedRegion(null)}
              headerContent={<h3>{selectedRegion?.name}</h3>}
              style={{ width: 200, paddingTop: -25 }}
              disableAutoPan
              position={{ lat: Number(selectedRegion.latitude) + selectedRegion.radius / 120000, lng: Number(selectedRegion.longitude) }}
              pixelOffset={[0, -2]}
            >
              <ul>
                <li>Total businesses: {regionData?.distributors.length}</li>
                <li>Total Sales: $ {Intl.NumberFormat("en-US").format(regionData?.totalSales || 0)}</li>
                <li>Total Liters: {Intl.NumberFormat("en-US").format(regionData?.totalLiters || 0)}</li>
                <li>Total Units: {Intl.NumberFormat("en-US").format(regionData?.totalUnits || 0)}</li>
              </ul>
            </InfoWindow>
          ) : (
            ""
          )}
        </Map>
      </APIProvider>
    </div>
  );
};
