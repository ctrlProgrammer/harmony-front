import { APIProvider, Map, Marker, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import styles from "./mapView.module.css";

import MexicoNeighboors from "../../../core/data/mexico_ne.json";
import Markers from "../../../core/data/data_test.json";
import { Circle } from "./components/circle";
import { useEffect, useState } from "react";
import { MapMarker } from "@/app/core/types";
import { distanceBetweenPoints, isPointInCircle, milesToM } from "@/app/core/utils/global";

interface MapRegion {
  name: string;
  latitude: string;
  longitude: string;
  radius: number;
}

export const MapView = () => {
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null);
  const [availableMarkers, setAvailableMarkers] = useState<MapMarker[]>([]);

  const searchLocatedMarkers = () => {
    if (!selectedRegion) {
      return;
    }

    const points: Array<MapMarker> = [];
    let totalLiters = 0;
    let totalSales = 0;
    let salesUnits = 0;

    console.log("Try to load possible markers");

    if (Markers && Array.isArray(Markers)) {
      for (let i = 0; i < Markers.length; i++) {
        const distance = distanceBetweenPoints(Number(selectedRegion.latitude), Number(selectedRegion.longitude), Markers[i].latitude, Markers[i].longitude);

        if (distance * 1000 < selectedRegion.radius) {
          totalLiters += Markers[i].sales_liters;
          totalSales += Markers[i].sales_usd;
          salesUnits += Markers[i].sales_units;
          points.push(Markers[i]);
        }
      }
    }

    setAvailableMarkers(points);
  };

  useEffect(() => {
    if (selectedRegion) {
      searchLocatedMarkers();
    }
  }, [selectedRegion]);

  return (
    <div className={styles.map}>
      <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY || ""}>
        <Map style={{ width: "500px", height: "500px" }} defaultCenter={{ lat: 19.420069023890793, lng: -99.1380041169563 }} defaultZoom={11} gestureHandling={"greedy"} disableDefaultUI={true}>
          {availableMarkers && Array.isArray(availableMarkers)
            ? availableMarkers.map((mapData) => {
                return <Marker position={{ lat: mapData.latitude, lng: mapData.longitude }} clickable={true} onClick={() => alert("marker was clicked!")} title={"clickable google.maps.Marker"} />;
              })
            : ""}
          {MexicoNeighboors && Array.isArray(MexicoNeighboors)
            ? MexicoNeighboors.map((neigh) => {
                return (
                  <>
                    <Circle
                      onMouseOver={(data) => {}}
                      onClick={() => {
                        setSelectedRegion(neigh);
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
            <InfoWindow position={{ lat: Number(selectedRegion.latitude), lng: Number(selectedRegion.longitude) }} pixelOffset={[0, -2]}>
              <h4>{selectedRegion?.name}</h4>
              <ul>
                <li>Total businesses: {availableMarkers.length}</li>
                <li>Total Sales: {availableMarkers.length}</li>
                <li>Total Liters: {availableMarkers.length}</li>
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
