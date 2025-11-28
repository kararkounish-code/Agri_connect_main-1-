import { Service, ServiceId } from './types';
import {
  LeafIcon,
  ChartBarIcon,
  ShieldExclamationIcon,
  BeakerIcon,
  CloudIcon,
  ChatBubbleLeftRightIcon
} from './components/Icons';

export const SERVICES: Service[] = [
  {
    id: ServiceId.PLANT_DOCTOR,
    name: "AI Plant Doctor",
    description: "Chat with our AI botanist. Upload photos of your plants to diagnose issues and get care tips.",
    icon: ChatBubbleLeftRightIcon,
    fields: [], // Special service with custom UI
  },
  {
    id: ServiceId.CROP_RECOMMENDATION,
    name: "Crop Recommendation",
    description: "Get crop suggestions based on your farm's conditions.",
    icon: LeafIcon,
    fields: [
      { id: 'rainfall', label: 'Expected Annual Rainfall', type: 'number', placeholder: 'e.g., 900', required: true, unit: 'mm' },
      { id: 'temperature', label: 'Average Temperature', type: 'number', placeholder: 'e.g., 25', required: true, unit: '°C' },
      { id: 'humidity', label: 'Average Humidity', type: 'number', placeholder: 'e.g., 70', required: true, unit: '%' },
      { id: 'soilType', label: 'Soil Type', type: 'select', options: ['Loamy', 'Sandy', 'Clayey', 'Silty', 'Peaty'], required: true },
      { id: 'soilPh', label: 'Soil pH Level', type: 'number', placeholder: 'e.g., 6.5', required: true },
      { id: 'season', label: 'Preferred Season', type: 'select', options: ['Kharif', 'Rabi', 'Zaid', 'All Year'], required: true },
      { id: 'farmSize', label: 'Farm Size', type: 'number', placeholder: 'e.g., 10', required: true, unit: 'hectares' },
      { id: 'waterAvailability', label: 'Water Availability', type: 'select', options: ['Good', 'Moderate', 'Scarce'], required: true },
      { id: 'experience', label: 'Farming Experience', type: 'number', placeholder: 'e.g., 5', required: true, unit: 'years' },
      { id: 'market', label: 'Market Preferences', type: 'text', placeholder: 'e.g., high-value cash crops', required: false }
    ],
  },
  {
    id: ServiceId.YIELD_PREDICTION,
    name: "Yield Prediction",
    description: "Forecast your crop yield with high accuracy.",
    icon: ChartBarIcon,
    fields: [
      { id: 'cropType', label: 'Crop Type', type: 'text', placeholder: 'e.g., Wheat', required: true },
      { id: 'rainfall', label: 'Annual Rainfall', type: 'number', placeholder: 'e.g., 750', required: true, unit: 'mm' },
      { id: 'pesticide', label: 'Pesticide Usage', type: 'number', placeholder: 'e.g., 25', required: true, unit: 'kg/ha' },
      { id: 'temperature', label: 'Average Temperature', type: 'number', placeholder: 'e.g., 22', required: true, unit: '°C' },
    ],
  },
  {
    id: ServiceId.DISEASE_RISK,
    name: "Disease Risk Prediction",
    description: "Assess potential disease risks for your crops.",
    icon: ShieldExclamationIcon,
    fields: [
      { id: 'cropType', label: 'Crop Type', type: 'text', placeholder: 'e.g., Potato', required: true },
      { id: 'recentRainfall', label: 'Recent Rainfall', type: 'number', placeholder: 'e.g., 50', required: true, unit: 'mm' },
      { id: 'temperature', label: 'Average Temperature', type: 'number', placeholder: 'e.g., 28', required: true, unit: '°C' },
      { id: 'humidity', label: 'Humidity', type: 'number', placeholder: 'e.g., 85', required: true, unit: '%' },
      { id: 'pesticideDays', label: 'Recent Pesticide Application', type: 'number', placeholder: 'e.g., 3', required: true, unit: 'days ago' },
      { id: 'season', label: 'Current Season', type: 'select', options: ['Kharif', 'Rabi', 'Zaid', 'Monsoon', 'Winter'], required: true },
    ],
  },
  {
    id: ServiceId.FERTILIZER_RECOMMENDATION,
    name: "Fertilizer Recommendation",
    description: "Find the best fertilizer mix for your soil and crop.",
    icon: BeakerIcon,
    fields: [
      { id: 'cropType', label: 'Crop Type', type: 'text', placeholder: 'e.g., Maize', required: true },
      { id: 'rainfall', label: 'Expected Annual Rainfall', type: 'number', placeholder: 'e.g., 800', required: true, unit: 'mm' },
      { id: 'soilType', label: 'Soil Type', type: 'select', options: ['Loamy', 'Sandy', 'Clayey', 'Red Soil', 'Black Soil'], required: true },
      { id: 'fieldSize', label: 'Field Size', type: 'number', placeholder: 'e.g., 15', required: true, unit: 'hectares' },
      { id: 'growthStage', label: 'Current Growth Stage', type: 'select', options: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting'], required: true },
      { id: 'soilPh', label: 'Soil pH (if known)', type: 'number', placeholder: 'e.g., 7.0', required: false },
    ],
  },
  {
    id: ServiceId.WEATHER_FORECAST,
    name: "Agriculture Weather Forecast",
    description: "Plan your crop cycle with long-range weather analysis.",
    icon: CloudIcon,
    fields: [
      { id: 'year', label: 'Forecast Year', type: 'number', placeholder: 'e.g., 2024', required: true },
      { id: 'location', label: 'Location / Region', type: 'text', placeholder: 'e.g., Punjab, India', required: true },
      { id: 'season', label: 'Primary Season of Interest', type: 'select', options: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'], required: true },
      { id: 'planning', label: 'Crop Cycle Planning', type: 'text', placeholder: 'e.g., Planning for rice and wheat rotation', required: false },
    ],
  },
];
