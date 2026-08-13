# 🌤️ Weather App

<div align="center">

![Project Banner](public/assets/images/desktop-design.jpg)

A modern weather application with real-time forecast data and geolocation support

[![Live Demo](https://img.shields.io/badge/Live_Demo-View%20Site-brightgreen?style=for-the-badge)](https://arvin-m-dev.github.io/Weather-App/)
[![Frontend Mentor](https://img.shields.io/badge/Frontend_Mentor-Challenge-blue?style=for-the-badge)](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49)

</div>

---

### 📸 Screenshots

<div align="center">
  <img src="public/assets/images/desktop-design.jpg" alt="Weather App" width="100%" />
</div>

---

### ✨ Features

- ✅ Real-time weather data from Open-Meteo API
- ✅ Geolocation detection with fallback
- ✅ City search with autocomplete suggestions
- ✅ Current weather display with detailed metrics
- ✅ Hourly forecast (scrollable)
- ✅ 7-day daily forecast
- ✅ Temperature unit toggle (Celsius/Fahrenheit)
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Skeleton loading animation
- ✅ Error handling with toast notifications
- ✅ Input validation with regex support for special characters
- ✅ Animation

---

### 🛠️ Tech Stack

- HTML5 Semantic
- CSS3 (Tailwind CSS v4.3, Custom Animations)
- Anime.js Library
- Vanilla JavaScript (ES6+)
- Geolocation API
- Open-Meteo Weather API
- Nominatim Reverse Geocoding API
- GitHub Pages for Deployment

---

### 🎯 Key Implementation

**Geolocation & Location Services:**
- Browser geolocation with automatic fallback to default city
- Reverse geocoding to get city name from coordinates
- Seamless city search with API suggestions

**Weather Data Management:**
- Real-time data fetching from Open-Meteo
- Hourly and daily forecast parsing
- Temperature unit conversion (Celsius ↔ Fahrenheit)
- Weather code interpretation for icons

**UI/UX Enhancements:**
- Skeleton loading during data fetch
- Smooth animations and transitions
- Input validation using regex (supports accented characters)
- Toast notifications for error handling
- Responsive grid layout for forecasts

**API Integration:**
```javascript
// Open-Meteo API
https://api.open-meteo.com/v1/forecast?
  latitude=COORD&longitude=COORD&
  daily=temperature_2m_max,weather_code&
  hourly=temperature_2m,weather_code&
  current=temperature_2m,precipitation...

// Nominatim Reverse Geocoding
https://nominatim.openstreetmap.org/reverse?
  format=jsonv2&lat=COORD&lon=COORD

// Geocoding API
https://geocoding-api.open-meteo.com/v1/search?
  name=CITY&count=5&format=json
```

---

### 🙏 Credits

- Challenge by [Frontend Mentor](https://www.frontendmentor.io?ref=challenge)
- Weather data by [Open-Meteo](https://open-meteo.com)
- Geocoding by [Nominatim](https://nominatim.org)

---

Coded with 💙 by [Arvin Dev](https://github.com/Arvin-M-Dev)
