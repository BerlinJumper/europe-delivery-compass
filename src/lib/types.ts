
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Prescription {
  id: string;
  title: string;
  description: string;
  weight: number; // in grams
  dimensions: {
    length: number; // in cm
    width: number;  // in cm
    height: number; // in cm
  };
  urgent: boolean;
}

export interface WeatherCondition {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  visibility: number;
}

export type DeliveryMethod = "drone" | "car";

export interface DeliveryEstimate {
  method: DeliveryMethod;
  time: number; // in minutes
  cost: number; // in euros
  weatherSuitable: boolean;
  recommended: boolean;
  weatherCondition?: WeatherCondition;
  distance?: number; // in km
}

export interface AppState {
  currentStep: number;
  address: Address | null;
  prescription: Prescription | null;
  deliveryEstimates: DeliveryEstimate[] | null;
}
