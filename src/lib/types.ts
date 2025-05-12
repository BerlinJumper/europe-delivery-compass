
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
  // New fields for prescription details
  patientName?: string;
  insuranceCompany?: string;
  birthDate?: string;
  prescriptionFee?: number;
}

export interface NonPrescriptionItem {
  id: string;
  name: string;
  category: string;
  price: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  imageUrl?: string;
}

export interface WeatherCondition {
  temperature: number;
  windSpeed: number;
  precipitation: number;
  visibility: number;
}

export type DeliveryMethod = "drone" | "car";

export type MedicationType = "prescription" | "nonPrescription" | "both";

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
  medicationType: MedicationType | null;
  address: Address | null;
  prescription: Prescription | null;
  nonPrescriptionItems: NonPrescriptionItem[] | null;
  deliveryEstimates: DeliveryEstimate[] | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  savedAddresses: Address[];
  savedPrescriptions: Prescription[];
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  type: "creditCard" | "paypal" | "bankTransfer";
  details: object;
}
