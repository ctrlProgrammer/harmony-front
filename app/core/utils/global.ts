import { MapMarker, SellerHistoricalData } from "../types";

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
export const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

export const isPointInCircle = (centerLat: number, centerLon: number, pointLat: number, pointLon: number, radius: number) => {
  const earthRadiusKm = 6371; // Radio de la Tierra en kilómetros

  const dLat = degreesToRadians(pointLat - centerLat);
  const dLon = degreesToRadians(pointLon - centerLon);
  const rCenterLat = degreesToRadians(centerLat);
  const rPointLat = degreesToRadians(pointLat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rCenterLat) * Math.cos(rPointLat);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c;

  return distance <= radius;
};

export const distanceBetweenPoints = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const rLat1 = degreesToRadians(lat1);
  const rLat2 = degreesToRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadiusKm * c;

  return distance;
};

export const milesToM = (miles: number) => {
  return (miles * 1609.34) / 1;
};

export const categorizeSellers = (data: MapMarker[]) => {
  const totalSellers = data.length;
  const topCount = Math.ceil(totalSellers * 0.01);
  const lowCount = Math.ceil(totalSellers * 0.01);
  const mediumCount = totalSellers - topCount - lowCount;
  const topPerformers = data.slice(0, topCount);
  const mediumPerformers = data.slice(topCount, topCount + mediumCount);
  const lowPerformers = data.slice(topCount + mediumCount);
  return { topPerformers, mediumPerformers, lowPerformers };
};

export const generateRandomSellerHistoricalData = (): SellerHistoricalData[] => {
  const data: SellerHistoricalData[] = [];
  for (let i = 0; i < 12; i++) data.push({ month: i + 1, sales: randomNumber(1000, 50000) });
  return data;
};

export const randomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
