import { APIProvider, Map, Marker, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import styles from "./mapView.module.css";

import MexicoNeighboors from "../../../core/data/mexico_ne.json";
import Markers from "../../../core/data/data_test.json";
import { Circle } from "./components/circle";
import { useEffect, useState } from "react";
import { HeatMapCoords, MapCoords, MapMarker, MapMode, MapRegion } from "@/app/core/types";
import { distanceBetweenPoints, isPointInCircle, milesToM } from "@/app/core/utils/global";
import Heatmap from "./components/heatmap";

interface MapViewProps {
  defaultCenter: MapCoords;
  center: MapCoords;
  mapMode: MapMode;
  showDistricts: boolean;
  focusOnSales: boolean;
  focusOnLiters: boolean;
  focusOnUnits: boolean;
  onChangeCenter: (coors: MapCoords) => void;
}

export const MapView = (props: MapViewProps) => {
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [availableMarkers, setAvailableMarkers] = useState<MapMarker[]>([]);
  const [heatMapMarkers, setHeatMapMarkers] = useState<HeatMapCoords[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [totalLiters, setTotalLiters] = useState<number>(0);

  const searchLocatedMarkers = () => {
    if (!selectedRegion) {
      return;
    }

    const points: Array<MapMarker> = [];

    let totalLiters = 0;
    let totalSales = 0;
    let totalUnits = 0;

    if (Markers && Array.isArray(Markers)) {
      for (let i = 0; i < Markers.length; i++) {
        const distance = distanceBetweenPoints(Number(selectedRegion.latitude), Number(selectedRegion.longitude), Markers[i].latitude, Markers[i].longitude);

        if (distance * 1000 < selectedRegion.radius) {
          totalLiters += Markers[i].sales_liters;
          totalSales += Markers[i].sales_usd;
          totalUnits += Markers[i].sales_units;
          points.push(Markers[i]);
        }
      }
    }

    setAvailableMarkers(points);
    setTotalSales(totalSales);
    setTotalUnits(totalUnits);
    setTotalLiters(totalLiters);
  };

  const preloadHeatMapData = () => {
    const points: Array<HeatMapCoords> = [];

    if (Markers && Array.isArray(Markers)) {
      for (let i = 0; i < Markers.length; i++) {
        // Maginute based on total sells
        const data: MapMarker = Markers[i];
        points.push({ lat: data.latitude, lng: data.longitude, weight: props.focusOnSales ? data.sales_usd : props.focusOnLiters ? data.sales_liters : data.sales_units });
      }
    }

    console.log(points);
    setHeatMapMarkers(points);
  };

  useEffect(() => {
    if (selectedRegion) searchLocatedMarkers();
  }, [selectedRegion]);

  useEffect(() => {
    if (props.mapMode == MapMode.HEAT) preloadHeatMapData();
  }, [props.mapMode, props.focusOnLiters, props.focusOnSales, props.focusOnUnits]);

  return (
    <div className={styles.map}>
      <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY || ""}>
        <Map
          style={{ width: "100%", height: "500px" }}
          defaultCenter={props.center}
          onCenterChanged={(e) => {
            const getted = e.map.getCenter();

            if (getted) {
              const coors = { lat: getted.lat(), lng: getted.lng() } as MapCoords;
              props.onChangeCenter(coors);
            }
          }}
          center={props.center}
          defaultZoom={11}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
        >
          {props.mapMode == MapMode.HEAT ? (
            heatMapMarkers && Array.isArray(heatMapMarkers) ? (
              <Heatmap points={heatMapMarkers} opacity={0.6} radius={80} />
            ) : (
              ""
            )
          ) : availableMarkers && Array.isArray(availableMarkers) ? (
            availableMarkers.map((mapData, index) => {
              return <Marker position={{ lat: mapData.latitude, lng: mapData.longitude }} clickable={true} onClick={() => alert("marker was clicked!")} title={"clickable google.maps.Marker"} />;
            })
          ) : (
            ""
          )}

          {props.showDistricts && MexicoNeighboors && Array.isArray(MexicoNeighboors)
            ? MexicoNeighboors.map((neigh) => {
                return (
                  <>
                    <Circle
                      key={neigh.name}
                      onMouseOver={() => {}}
                      onClick={() => {
                        setSelectedRegion(neigh);
                        // props.onChangeCenter({ lat: Number(neigh.latitude), lng: Number(neigh.longitude) });
                      }}
                      radius={neigh.radius}
                      center={{ lat: Number(neigh.latitude), lng: Number(neigh.longitude) }}
                      strokeColor={"#0c4cb3"}
                      strokeOpacity={1}
                      strokeWeight={3}
                      fillColor={"#3b82f6"}
                      fillOpacity={0.3}
                      editable={false}
                      draggable={false}
                    />
                  </>
                );
              })
            : ""}

          {selectedRegion ? (
            <InfoWindow headerContent={<h3>{selectedRegion?.name}</h3>} style={{ width: 200, paddingTop: -25 }} disableAutoPan position={{ lat: Number(selectedRegion.latitude) + selectedRegion.radius / 120000, lng: Number(selectedRegion.longitude) }} pixelOffset={[0, -2]}>
              <ul>
                <li>Total businesses: {availableMarkers.length}</li>
                <li>Total Sales: $ {Intl.NumberFormat("en-US").format(totalSales)}</li>
                <li>Total Liters: {Intl.NumberFormat("en-US").format(totalLiters)}</li>
                <li>Total Units: {Intl.NumberFormat("en-US").format(totalUnits)}</li>
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
