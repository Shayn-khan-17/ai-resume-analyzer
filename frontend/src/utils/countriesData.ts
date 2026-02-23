import type { Country } from "../components/Common/types";

export const countriesList: Country[] = [
  { code: 'us', name: 'United States' },
  { code: 'ca', name: 'Canada' },
  { code: 'mx', name: 'Mexico' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
  { code: 'ie', name: 'Ireland' },
  { code: 'au', name: 'Australia' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'sg', name: 'Singapore' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' },
  { code: 'in', name: 'India' },
  { code: 'pk', name: 'Pakistan' },
  { code: 'ae', name: 'UAE' },
  { code: 'sa', name: 'Saudi Arabia' },
  { code: 'za', name: 'South Africa' },
  { code: 'br', name: 'Brazil' },
  { code: 'ar', name: 'Argentina' }
];

export const countriesByRegion = {
  'North America': countriesList.slice(0, 3),
  'Europe': countriesList.slice(3, 10),
  'Asia Pacific': countriesList.slice(10, 15),
  'South Asia': countriesList.slice(15, 17),
  'Middle East': countriesList.slice(17, 19),
  'Africa': countriesList.slice(19, 20),
  'South America': countriesList.slice(20, 22)
};