export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const MEASUREMENT_TYPES = [
  {
    id: 'LENGTH',
    name: 'Length',
    icon: '📏',
    description: 'Convert and calculate length measurements',
    units: ['FEET', 'INCHES', 'YARDS', 'CENTIMETERS'],
    supportsArithmetic: true
  },
  {
    id: 'WEIGHT',
    name: 'Weight',
    icon: '⚖️',
    description: 'Convert and calculate weight measurements',
    units: ['MILLIGRAM', 'GRAM', 'KILOGRAM', 'POUND', 'TONNE'],
    supportsArithmetic: true
  },
  {
    id: 'VOLUME',
    name: 'Volume',
    icon: '🧪',
    description: 'Convert and calculate volume measurements',
    units: ['LITRE', 'MILLILITRE', 'GALLON'],
    supportsArithmetic: true
  },
  {
    id: 'TEMPERATURE',
    name: 'Temperature',
    icon: '🌡️',
    description: 'Convert temperature measurements',
    units: ['CELSIUS', 'FAHRENHEIT', 'KELVIN'],
    supportsArithmetic: false
  }
];

export const OPERATIONS = {
  COMPARE: { name: 'Compare', icon: '⚖️', requiresTwoInputs: true },
  CONVERT: { name: 'Convert', icon: '🔄', requiresTwoInputs: false },
  ADD: { name: 'Add', icon: '➕', requiresTwoInputs: true },
  SUBTRACT: { name: 'Subtract', icon: '➖', requiresTwoInputs: true },
  DIVIDE: { name: 'Divide', icon: '➗', requiresTwoInputs: true }
};

export const UNIT_DISPLAY_NAMES = {
  FEET: 'Feet',
  INCHES: 'Inches',
  YARDS: 'Yards',
  CENTIMETERS: 'Centimeters',
  MILLIGRAM: 'Milligram',
  KILOGRAM: 'Kilogram',
  GRAM: 'Gram',
  POUND: 'Pound',
  TONNE: 'Tonne',
  LITRE: 'Litre',
  MILLILITRE: 'Millilitre',
  GALLON: 'Gallon',
  CELSIUS: 'Celsius',
  FAHRENHEIT: 'Fahrenheit',
  KELVIN: 'Kelvin'
};
