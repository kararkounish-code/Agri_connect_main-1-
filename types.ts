import React from 'react';

export enum ServiceId {
  CROP_RECOMMENDATION = 'CROP_RECOMMENDATION',
  YIELD_PREDICTION = 'YIELD_PREDICTION',
  DISEASE_RISK = 'DISEASE_RISK',
  FERTILIZER_RECOMMENDATION = 'FERTILIZER_RECOMMENDATION',
  WEATHER_FORECAST = 'WEATHER_FORECAST',
  PLANT_DOCTOR = 'PLANT_DOCTOR',
}

export type InputType = 'text' | 'number' | 'select';

export interface FormField {
  id: string;
  label: string;
  type: InputType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
  unit?: string;
}

export interface Service {
  id: ServiceId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: FormField[];
}

export type FormData = Record<string, string | number>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  isLoading?: boolean;
}
