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
