# 📏 ShoreSquad - Units & Measurement System

## Overview

ShoreSquad uses **metric units exclusively** throughout the application for consistency, accuracy, and alignment with global standards.

---

## Unit System by Component

### 🌡️ Weather Data (All Metric)

| Measurement | Unit | Symbol | Example | Source |
|------------|------|--------|---------|--------|
| Temperature | Celsius | °C | 22°C | Open-Meteo API |
| Wind Speed | Kilometers/Hour | km/h | 15 km/h | Open-Meteo API |
| Precipitation | Millimeters | mm | 2.5 mm | Open-Meteo API |
| Humidity | Percentage | % | 65% | Open-Meteo API |

**API Reference:** Open-Meteo provides all weather data in metric units by default.

```javascript
// Weather API Response (all metric)
{
  temperature_2m: 22,           // Celsius
  wind_speed_10m: 15,           // km/h
  precipitation: 2.5,           // mm
  relative_humidity_2m: 65      // %
}
```

### 📍 Location & Coordinates (Decimal Degrees)

| Component | Unit | Format | Example |
|-----------|------|--------|---------|
| Latitude | Decimal Degrees | ±DD.DDDDDD | 1.381497°N |
| Longitude | Decimal Degrees | ±DD.DDDDDD | 103.955574°E |
| Geolocation Accuracy | Meters | m | ±30 m |

**Pasir Ris Cleanup Location:**
- Latitude: 1.381497°N (North of Equator)
- Longitude: 103.955574°E (East of Prime Meridian)
- Accuracy Radius: Depends on device (typically 10-100 meters)

```javascript
// Geolocation API Response (metric)
{
  latitude: 1.381497,
  longitude: 103.955574,
  accuracy: 30                   // meters
}
```

### 📐 Layout & Dimensions (Pixels - CSS Standard)

All CSS dimensions use **pixels (px)** as the standard unit for web design:

| Element | Dimension | Value |
|---------|-----------|-------|
| Base Font Size | 16px | 1rem |
| Map Height (Desktop) | 500px | Full width |
| Map Height (Mobile) | 350px | Full width |
| Max Container Width | 1200px | Full width |
| Small Screen | <480px | Mobile optimized |
| Tablet | 480-768px | Medium devices |
| Desktop | >768px | Large screens |

**Responsive Breakpoints (Pixels):**
```css
/* Mobile First */
Base styles for mobile (320px+)

/* Tablet & Above */
@media (min-width: 768px) { ... }

/* Large Desktop */
@media (min-width: 1024px) { ... }
```

### 🕐 Time Units

| Measurement | Unit | Context |
|------------|------|---------|
| Geolocation Timeout | Milliseconds | 10,000 ms = 10 seconds |
| Event Debounce | Milliseconds | 300 ms for performance |
| Animation Duration | Seconds | CSS transitions |

---

## API Integration Standards

### Open-Meteo Weather API

**All responses use metric units:**

```javascript
// Example: Fetch weather for Pasir Ris
const weatherResponse = await fetch(
  'https://api.open-meteo.com/v1/forecast' +
  '?latitude=1.381497' +
  '&longitude=103.955574' +
  '&current=temperature_2m,weather_code,wind_speed_10m,' +
  'precipitation,relative_humidity_2m' +
  '&temperature_unit=celsius' +        // Explicit metric
  '&wind_speed_unit=kmh' +             // Explicit metric
  '&precipitation_unit=mm'              // Explicit metric
);

// Response (all metric):
{
  "current": {
    "temperature_2m": 28.5,    // °C
    "wind_speed_10m": 12.3,    // km/h
    "precipitation": 0.0,       // mm
    "relative_humidity_2m": 72  // %
  }
}
```

### Geolocation API

**Returns metric by default:**

```javascript
navigator.geolocation.getCurrentPosition(
  position => {
    console.log(position.coords.latitude);  // Decimal degrees
    console.log(position.coords.longitude); // Decimal degrees
    console.log(position.coords.accuracy);  // meters
  }
);
```

---

## Data Storage Format

### LocalStorage (Metric)

All data stored in browser LocalStorage uses metric values:

```javascript
// Crew object
{
  "id": 1701395460589,
  "name": "Pasir Ris Cleanup Crew",
  "members": ["User1", "User2"],
  "cleanup_count": 3,
  "createdAt": "2025-12-01T10:00:00Z"
}

// Location object
{
  "latitude": 1.381497,
  "longitude": 103.955574,
  "accuracy": 25  // meters
}
```

---

## Frontend Display Standards

### Weather Display

```html
<!-- Temperature: Always °C -->
<p>22°C</p>

<!-- Wind Speed: Always km/h -->
<p>15 km/h</p>

<!-- Precipitation: Always mm -->
<p>2.5 mm</p>

<!-- Humidity: Always % -->
<p>65%</p>
```

### Location Display

```html
<!-- Coordinates: Always decimal degrees -->
<p>1.381497°N, 103.955574°E</p>

<!-- Distance: Always meters (if displayed) -->
<p>±30 m accuracy</p>
```

---

## Conversion Reference (For Future Use)

If conversion from imperial is ever needed:

### Temperature
```javascript
// Fahrenheit to Celsius
celsius = (fahrenheit - 32) × 5/9

// Example: 72°F → 22.2°C
(72 - 32) × 5/9 = 22.2°C
```

### Speed
```javascript
// mph to km/h
kmh = mph × 1.60934

// Example: 10 mph → 16.1 km/h
10 × 1.60934 = 16.1 km/h
```

### Distance
```javascript
// Miles to Kilometers
km = miles × 1.60934

// Feet to Meters
m = feet × 0.3048
```

### Precipitation
```javascript
// Inches to Millimeters
mm = inches × 25.4
```

---

## Code Comments & Documentation

### JavaScript Comments

All weather functions include metric unit documentation:

```javascript
/**
 * Fetch weather data from Open-Meteo API
 * All values returned are in metric units:
 * - Temperature: Celsius (°C)
 * - Wind Speed: km/h
 * - Precipitation: millimeters (mm)
 * - Humidity: percentage (%)
 */
```

### CSS Comments

CSS header specifies unit system:

```css
/* Unit System:
   - Layout & Dimensions: Pixels (px) - CSS standard
   - Weather Data: Metric (°C, km/h, mm) - see app.js
   - Coordinates: Decimal degrees (latitude/longitude)
*/
```

---

## Testing & Verification

### Unit Compliance Checklist

- [x] Weather API calls use Celsius (°C)
- [x] Wind speed displays in km/h
- [x] Precipitation displays in mm
- [x] Humidity shows as percentage (%)
- [x] Coordinates use decimal degrees
- [x] Geolocation accuracy in meters
- [x] CSS dimensions in pixels (px)
- [x] Responsive breakpoints in pixels
- [x] All documentation specifies metric
- [x] No imperial units in codebase

---

## Maintenance Guidelines

### When Adding New Features

1. **Always use metric units** for weather/climate data
2. **Document units** in function comments
3. **Display with symbols** (°C, km/h, mm, %)
4. **Store coordinates** as decimal degrees
5. **Validate** all external API responses for metric compliance

### When Updating APIs

1. Verify API returns metric data
2. Update conversion if switching APIs
3. Update comments if defaults change
4. Test all unit displays

---

## References

### Standards Used
- **SI Units (International System)**: Metric
- **ISO 6093**: Celsius temperature
- **ISO 80000-3**: Kilometer as length unit
- **WGS84**: Latitude/Longitude standard

### API Documentation
- Open-Meteo: https://open-meteo.com (metric by default)
- Geolocation API: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation (metric by default)
- W3C CSS: https://www.w3.org/TR/css-values-3/ (px as default)

---

## Summary

✅ **100% Metric Compliant**

- Weather: °C, km/h, mm, %
- Location: Decimal degrees, meters
- Layout: Pixels (CSS standard)
- Consistent across all components
- Well-documented in code

---

*Last Updated: December 1, 2025*
*All systems verified for metric compliance*
