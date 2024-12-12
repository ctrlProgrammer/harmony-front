import { useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { FeatureCollection, Point, GeoJsonProperties } from "geojson";
import { HeatMapCoords } from "@/app/core/types";

type HeatmapProps = {
  points: HeatMapCoords[];
  radius: number;
  opacity: number;
};
const Heatmap = ({ points, radius, opacity }: HeatmapProps) => {
  const map = useMap();
  const visualization = useMapsLibrary("visualization");

  const heatmap = useMemo(() => {
    if (!visualization) return null;

    return new google.maps.visualization.HeatmapLayer({
      radius: radius,
      opacity: opacity,
    });
  }, [visualization, radius, opacity]);

  useEffect(() => {
    if (!heatmap) return;

    heatmap.setData(
      points.map((point) => {
        return {
          location: new google.maps.LatLng(point.lat, point.lng),
          weight: point.weight,
        };
      })
    );
  }, [heatmap, radius, opacity]);

  useEffect(() => {
    if (!heatmap) return;
    heatmap.setMap(map);
    return () => heatmap.setMap(null);
  }, [heatmap, map]);

  return null;
};

export default Heatmap;
