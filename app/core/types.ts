export interface User {
  name: string;
  password: string;
  role: string;
  email: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface ValidateSession {
  fromUser: string;
  sessionCode: string;
}

export interface MapMarker {
  pdv: number;
  vendor_code: string;
  address: string;
  sales_liters: number;
  sales_usd: number;
  period: number;
  latitude: number;
  isocrona: string;
  city: string;
  longitude: number;
  sales_units: number;
  product_name: string;
  route: number;
  gps_coordinates: string;
  is_returnable: string;
  vendor_name: string;
  route_id: number;
  country: string;
  continent: string;
  channel: string;
  category: string;
  brand: string;
  sub_brand: string;
  item: string;
  year: number;
  semester: string;
  quarter: string;
  month: string;
  segment_type: string;
  NSE: number;
}

export enum MapMode {
  HEAT = "HEAT",
  NORMAL = "NORMAL",
}

export enum MapModeIteration {
  SALES = "SALES",
  LITERS = "LITERS",
  UNITS = "UNITS",
  DISTRIBUTORS = "DISTRIBUTORS",
}

export interface MapRegion {
  name: string;
  latitude: string;
  longitude: string;
  radius: number;
}

export interface MapCoords {
  lat: number;
  lng: number;
}

export interface HeatMapCoords {
  lat: number;
  lng: number;
  weight: number;
}
