export interface Suggestion {
  adm_area1: string;
  adm_area2: string;
  country: string;
  lat: string;
  lon: string;
  name: string;
  place_id?: string;
  timezone: string;
  type: string;
}

export interface Postion {
  lat: string | number;
  lon: string | number;
  language: string;
}
