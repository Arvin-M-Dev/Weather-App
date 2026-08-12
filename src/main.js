import { animate, cubicBezier, onScroll, createScope, stagger } from "animejs";

// ==================== DOM REFERENCES ====================

const tempBtns = document.querySelectorAll(".temp-btn");
const windBtns = document.querySelectorAll(".wind-btn");
const precipitationBtns = document.querySelectorAll(".prec-btn");
const unitsList = document.getElementById("units-list");
const unitsBtn = document.querySelector(".units-btn");
const unitDropDownIcon = document.getElementById("unit-chevron");
const daysList = document.getElementById("days-list");
const daysListDropDownIcon = document.getElementById("days-list-chevron");
const daysListBtn = document.querySelector(".days-list-btn");
const searchForm = document.getElementById("form");
const searchFormInput = document.getElementById("from-input");
const searchResult = document.getElementById("search-result");
const currentWeather = document.getElementById("current-weather");
const currentFeelsLike = document.getElementById("current-feels-like");
const currentHumidity = document.getElementById("current-humidity");
const currentWindSpeed = document.getElementById("current-wind-speed");
const currentPrecipitation = document.getElementById("current-Precipitation");
const hourlyForecast = document.getElementById("hurly-forecast");
const selectedDayContainer = document.getElementById("selected-day-container");
const dailyContainer = document.getElementById("daily-container");
const errorContainer = document.getElementById("error-container");
const mainContainer = document.getElementById("main-container");
const mainContentContainer = document.querySelector(".main-content-container");

// ==================== STATE ====================

const state = {
  location: null,
  weatherData: null,

  selectedDayIndex: 0,

  units: {
    temperature: "Celsius",
    wind: "km/h",
    precipitation: "mm",
  },

  isFirstLoading: true,
};

const date = new Date();

const formatted = date.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

// ==================== CONFIGURATION ====================

const errorStyle = {
  bg: "bg-red-500/10",
  bgIcon: "bg-red-500/20",
  border: "border-red-400/20",
  title: "text-red-200",
  text: "text-red-100",
};

const infoStyle = {
  bg: "bg-blue-500/10",
  bgIcon: "bg-blue-500/20",
  border: "border-blue-400/20",
  title: "text-blue-200",
  text: "text-blue-100",
};

const warnStyle = {
  bg: "bg-amber-500/10",
  bgIcon: "bg-amber-500/20",
  border: "border-amber-400/20",
  title: "text-amber-200",
  text: "text-amber-100",
};

const successStyle = {
  bg: "bg-green-500/10",
  bgIcon: "bg-green-500/20",
  border: "border-green-400/20",
  title: "text-green-200",
  text: "text-green-100",
};

const bannerTypes = {
  network: {
    title: "Connection failed",
    message: "Check your internet connection and try again.",
    icon: "error",
    styles: errorStyle,
  },
  api: {
    title: "Unable to load weather data",
    message: "Please try again in a few moments.",
    icon: "error",
    styles: errorStyle,
  },

  cityNotFound: {
    title: "City not found",
    message: "Try searching for another city.",
    icon: "info",
    styles: infoStyle,
  },
  locationDenied: {
    title: "Location access denied",
    message:
      "We couldn't access your location, so we're showing weather for the default city instead.",
    icon: "warn",
    styles: warnStyle,
  },

  locationDetected: {
    title: "Location detected",
    message: "Showing weather for your current location.",
    icon: "check-circle",
    styles: successStyle,
  },
  inValidInput: {
    title: "Invalid Input",
    message: "Please enter only letters, numbers, and spaces.",
    icon: "warn",
    styles: warnStyle,
  },
};

const weatherIcons = {
  // sunny/clear
  0: "./assets/images/icon-sunny.webp",
  // party-cloudy
  2: "./assets/images/icon-partly-cloudy.webp",
  // overcast
  3: "./assets/images/icon-overcast.webp",
  // storm
  95: "./assets/images/icon-storm.webp",
  // snow
  77: "./assets/images/icon-snow.webp",
  // rain
  61: "./assets/images/icon-rain.webp",
  // drizzle
  51: "./assets/images/icon-drizzle.webp",
  // fog
  45: "./assets/images/icon-fog.webp",
};

// ==================== UTILITY FUNCTIONS ====================

function formatDate(dateString, optionsValues) {
  const date = new Date(dateString);
  const options = { weekday: optionsValues };
  return date.toLocaleDateString("en-US", options);
}

function convertTemperature(value, unit) {
  if (unit === "Fahrenheit") {
    return value * 1.8 + 32;
  }

  return value;
}

function convertWindSpeed(value, unit) {
  if (unit === "mph") {
    return value * 0.621371;
  }
  return value;
}

function convertPrecipitation(value, unit) {
  if (unit === "in") {
    return value / 25.4;
  }

  return value;
}

function isValidCity(city) {
  return /^[a-zA-Z0-9\s\-\u0100-\u017F\u0180-\u024F\u0600-\u06FF]+$/.test(
    city.trim(),
  );
}

function getWeatherInfo(code) {
  return weatherIcons[code] || "./assets/images/icon-sunny.webp";
}

function resetUnitButtons(btn) {
  btn.classList.remove("active-btn");
  btn.querySelector("svg").classList.add("hidden");
}

function setActiveUnitButton(btn) {
  btn.classList.add("active-btn");
  btn.querySelector("svg").classList.remove("hidden");
}

// ==================== API FUNCTIONS ====================

async function getWeather(lnt, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lnt}&longitude=${lon}&daily=temperature_2m_max,weather_code,wind_speed_10m_max&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m&current=temperature_2m,precipitation,weather_code,apparent_temperature,relative_humidity_2m,wind_speed_10m&timezone=auto`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch :)");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    showErrorState();
    showNotification("api");
    return null;
  }
}

async function getGeocoding(cityName) {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=5&language=en&format=json`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch!");
    }

    const data = await response.json();

    return data.results || [];
  } catch (error) {
    showErrorState();
    showNotification("api");
    return null;
  }
}

async function getReverseGeocoding(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&layer=address&zoom=10`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch!");
    }

    const data = await response.json();

    return data.address;
  } catch (error) {
    showErrorState();
    showNotification("api");
    return null;
  }
}

async function fetchLocation(city) {
  const location = await getGeocoding(city);

  if (!location) return null;

  if (!location.length) {
    showNotification("cityNotFound");
    return null;
  }

  return location;
}

async function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    if (!navigator.onLine) {
      showErrorState();
      showNotification("network");
      reject(new Error("No internet connection."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 1_000 },
    );
  });
}

// ==================== NOTIFICATION HANDLING ====================

function showErrorState() {
  errorContainer.querySelector("button").addEventListener("click", () => {
    location.reload();
  });
  errorContainer.classList.remove("hidden");
  errorContainer.classList.add("flex");
  mainContainer.classList.add("hidden");
  unitsBtn.disabled = true;
}

function hideNotification(toast) {
  toast.classList.remove("md:animate-slide-in");
  toast.classList.remove("animate-fade-in");
  toast.classList.add("md:animate-slide-out");
  toast.classList.add("animate-fade-out");
  setTimeout(() => {
    toast.remove();
  }, 300);
}

function showNotification(type) {
  const toastContainer = document.querySelector(".toast-container");

  const toast = createNotificationMarkup(type);

  toastContainer.append(toast);

  setupNotificationDismiss(toast);
}

function createNotificationMarkup(type) {
  const toast = document.createElement("div");
  toast.isDismissed = false;
  toast.className =
    "animate-fade-in md:animate-slide-in backdrop-blur-md rounded-2xl";
  toast.innerHTML = `
  <div class="mb-5 flex items-start gap-3 rounded-2xl transition-all duration-300 px-4 py-3 ${bannerTypes[type].styles.bg} border ${bannerTypes[type].styles.border} ${bannerTypes[type].styles.text}">
      <div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bannerTypes[type].styles.bgIcon}">
        <svg class="size-5 ${bannerTypes[type].styles.title}">
              <use xlink:href="#${bannerTypes[type].icon}"></use>
          </svg>
      </div>

      <div class="flex-1">
        <h3 class="font-semibold ${bannerTypes[type].styles.title}">
          ${bannerTypes[type].title}
        </h3>

        <p class="mt-1 text-sm ${bannerTypes[type].styles.text}">
          ${bannerTypes[type].message}
        </p>
      </div>

      <button class="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white/20 cursor-pointer remove-toast-btn">
        Dismiss
      </button>
    </div>
    `;

  return toast;
}

function setupNotificationDismiss(toast) {
  const closeBtn = toast.querySelector(".remove-toast-btn");

  closeBtn.addEventListener("click", () => {
    toast.isDismissed = true;
    hideNotification(toast);
  });

  setTimeout(() => {
    if (!toast.isDismissed && toast.parentElement) {
      hideNotification(toast);
    }
  }, 3000);
}

// ==================== WEATHER DATA TRANSFORMATION ====================

function getCurrentWeatherValues(current, units) {
  let temp = convertTemperature(current.temperature_2m, units.temperature);
  let feel = convertTemperature(
    current.apparent_temperature,
    units.temperature,
  );

  let windSpeed = convertWindSpeed(current.wind_speed_10m, units.wind);

  let precipitation = convertPrecipitation(
    current.precipitation,
    units.precipitation,
  );

  return { temp, feel, windSpeed, precipitation };
}

function getHourlyForecastData(hourly, index, temperature) {
  const temp = convertTemperature(hourly.temperature_2m[index], temperature);

  const weatherIcon = getWeatherInfo(hourly.weather_code[index]);

  return {
    temp,
    weatherIcon,
    time: hourly.time[index],
  };
}

function getDailyForecastValues(daily, index, units) {
  let temp = convertTemperature(
    daily.temperature_2m_max[index],
    units.temperature,
  );

  let windSpeed = convertWindSpeed(daily.wind_speed_10m_max[index], units.wind);

  return { temp, windSpeed };
}

// Hours 15-22 represent the afternoon/evening window displayed for each day.
function isHourInSelectedRange(time, selectedDate) {
  const hour = Number(time.slice(11, 13));

  return time.startsWith(selectedDate) && hour >= 15 && hour <= 22;
}

// ==================== MARKUP CREATION ====================

function createCurrentWeatherMarkup(cityLocation, weatherIcon, temp) {
  currentWeather.innerHTML = `
  <div class="flex flex-col gap-3">
      <h2 id="city-name-container" class="text-[29px] font-dmsans-semibold skeleton skeleton-text" data-skeleton="city-name">${cityLocation.name}, ${cityLocation.country}</h2>
      <p class="text-neutral-200 skeleton skeleton-text" id="current-date" data-skeleton="now-date">${formatted}</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="skeleton skeleton-image size-30" data-skeleton="current-icon">
        <img src="${weatherIcon}" alt="weatherIcon" class="size-full">
      </div>
      <h1 class="text-[92px] font-dmsans-semibold-italic skeleton skeleton-text" data-skeleton="current-temp">${Math.round(temp)}°</h1>
    </div>
    `;
}

function renderCurrentInfoCard(element, title, value, unit) {
  element.innerHTML = `
                <p class="font-dmsans-light text-neutral-300 skeleton skeleton-text" data-skeleton="${title.id}-title">${title.title}</p>
                <h2 class="text-[28px] font-dmsans-light skeleton skeleton-text" data-skeleton="${title.id}">${Math.round(value)} ${unit}</h2>
              `;
}

function createDayButtonMarkup(dayName, index) {
  return `<button type="button" class="w-full flex items-center justify-between p-2 text-base transition-all hover:bg-neutral-600 rounded-lg cursor-pointer day skeleton skeleton-text " data-index="${index}" data-skeleton="day-btn">${dayName}</button>`;
}

function selectedDayContainerMarkup(dayName) {
  selectedDayContainer.innerHTML = `<p class="text-neutral-200 skeleton skeleton-text" data-skeleton="selected-day">${dayName}</p>`;
}

function createHourlyForecastCard(weatherIcon, time, temp) {
  return `<div class="px-4 h-15  flex items-center justify-between bg-neutral-600 rounded-lg">
             <div class="flex items-center gap-2">
               <div class="skeleton skeleton-image skeleton-image-hourly w-13 h-13 xs:w-16 xs:h-16" data-skeleton="hourly-forecast-icon">
                <img src="${weatherIcon}" alt="weatherIcon" class="size-full">
               </div>
               <p class="skeleton skeleton-text" data-skeleton="hourly-forecast-time">${Number(time.slice(11, 13)) - 12} PM</p>
             </div>
             <p class="skeleton skeleton-text skeleton-text-hourly" data-skeleton="hourly-forecast-temp">${Math.round(temp)}°</p>
        </div>`;
}

function createDailyForecastCard({ temp, windSpeed, weatherIcon, dayName }) {
  return `<div class="daily-cards flex flex-col items-center justify-between gap-2.75 py-5 px-2.5 leading-[100%] bg-neutral-800 border border-neutral-600 rounded-xl">
        <h4 class="skeleton skeleton-text w-8" data-skeleton="daily-forecast-card-title">${dayName}</h4>
        <div class="w-13 h-13 xs:w-16 xs:h-16 skeleton skeleton-image" data-skeleton="daily-forecast-card-icon">
          <img src="${weatherIcon}" alt="weatherIcon" class="size-full">
        </div>
        <div class="flex items-center justify-between w-full">
          <p class="skeleton skeleton-text w-6.5" data-skeleton="daily-forecast-card-temp">${Math.round(temp)}°</p>
          <p class="skeleton skeleton-text w-4" data-skeleton="daily-forecast-card-wind-speed">${Math.round(windSpeed)}</p>
        </div>
      </div>`;
}

function renderSuggestionLoading() {
  searchResult.innerHTML = `<div class="flex items-center gap-7 px-4 py-2 select-none pointer-events-none">
        <div class="w-[4.8px] h-[4.8px] rounded-full animate-spin shadow-[12px_0px_0_0_#ffffff,7.4px_9.4px_0_0_#ffffff,-2.6px_11.6px_0_0_#ffffff,-10.8px_5.2px_0_0_#ffffff,-10.8px_-5.2px_0_0_#ffffff,-2.6px_-11.6px_0_0_#ffffff,7.4px_-9.4px_0_0_#ffffff]"></div>
          <p class="">Search in progress</p>
       </div>`;
}

function renderSuggestionEmpty() {
  searchResult.innerHTML = `
    <p class="px-2 py-2 select-none pointer-events-none">
      No search result found!
    </p>`;
}

// ==================== RENDERING ====================

function renderWeather() {
  renderCurrentWeather(state);
  renderDailyWeather(state);
  renderHourlyWeather(state);
}

function renderCurrentWeather(city) {
  const weatherIcon = getWeatherInfo(city.weatherData.current.weather_code);
  const { temp, feel, windSpeed, precipitation } = getCurrentWeatherValues(
    city.weatherData.current,
    city.units,
  );

  createCurrentWeatherMarkup(city.location, weatherIcon, temp);

  renderCurrentWeatherCards({
    feel,
    humidity: city.weatherData.current.relative_humidity_2m,
    windSpeed,
    precipitation,
    units: city.units,
  });
}

function renderCurrentWeatherCards(currentWeather) {
  renderCurrentInfoCard(
    currentFeelsLike,
    { id: "feels-like", title: "Feels like" },
    currentWeather.feel,
    "°",
  );
  renderCurrentInfoCard(
    currentHumidity,
    { id: "humidity", title: "Humidity" },
    currentWeather.humidity,
    "%",
  );
  renderCurrentInfoCard(
    currentWindSpeed,
    { id: "wind-speed", title: "Wind" },
    currentWeather.windSpeed,
    currentWeather.units.wind,
  );
  renderCurrentInfoCard(
    currentPrecipitation,
    { id: "precipitation", title: "Precipitation" },
    currentWeather.precipitation,
    currentWeather.units.precipitation,
  );
}

function renderHourlyWeather(city) {
  renderDaysList(city);
}

function renderDaysList(city) {
  renderHourlyForecast();
  daysList.innerHTML = "";

  city.weatherData.daily.time.forEach((dateString, index) => {
    const dayName = formatDate(dateString, "long");

    if (index === state.selectedDayIndex) {
      selectedDayContainerMarkup(dayName);
    }

    daysList.insertAdjacentHTML(
      "beforeend",
      createDayButtonMarkup(dayName, index),
    );
  });

}

function renderHourlyForecast() {
  hourlyForecast.innerHTML = "<!--->";
  const selectedDate = state.weatherData.daily.time[state.selectedDayIndex];
  state.weatherData.hourly.time.forEach((time, index) => {
    if (!isHourInSelectedRange(time, selectedDate)) return;

    const {
      temp,
      weatherIcon,
      time: hourlyTime,
    } = getHourlyForecastData(
      state.weatherData.hourly,
      index,
      state.units.temperature,
    );

    hourlyForecast.insertAdjacentHTML(
      "beforeend",
      createHourlyForecastCard(weatherIcon, hourlyTime, temp),
    );
  });
}

function renderDailyWeather(city) {
  dailyContainer.innerHTML = "";
  city.weatherData.daily.time.forEach((dateString, index) => {
    const dayName = formatDate(dateString, "short");

    const { temp, windSpeed } = getDailyForecastValues(
      city.weatherData.daily,
      index,
      city.units,
    );

    const weatherIcon = getWeatherInfo(
      city.weatherData.daily.weather_code[index],
    );

    dailyContainer.insertAdjacentHTML(
      "beforeend",
      createDailyForecastCard({
        temp,
        windSpeed,
        weatherIcon,
        dayName,
      }),
    );
  });
}

async function renderSuggestion() {
  searchResult.classList.remove("hidden");
  searchResult.classList.add("flex");
  renderSuggestionLoading();

  const cities = await fetchLocation(searchFormInput.value);

  if (!cities) {
    renderSuggestionEmpty();
    return;
  }

  if (cities.length) {
    renderSuggestionResults(cities);
  } else {
    renderSuggestionEmpty();
  }
}

function renderSuggestionResults(cities) {
  searchResult.innerHTML = "<!---->";
  cities.forEach((city) => {
    searchResult.insertAdjacentHTML(
      "beforeend",
      `
         <button type="button" class="w-full text-left px-2 py-2 focus rounded-lg transition-all hover:bg-neutral-700 border border-transparent hover:border-neutral-600 cursor-pointer city-name"  data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}" data-country="${city.country}">${city.name} | ${city.country_code}</button>
         `,
    );
  });
  document.querySelectorAll(".city-name").forEach((cityBtn) => {
    cityBtn.addEventListener("click", (e) => {
      const cityName = cityBtn.dataset.name;
      const cityCountry = cityBtn.dataset.country;
      const cityLon = cityBtn.dataset.lon;
      const cityLat = cityBtn.dataset.lat;
      const city = {
        name: cityName,
        country: cityCountry,
      };

      searchFormInput.value = cityName;
      hideSuggestions();

      skeletonShow();
      selectCity(cityLat, cityLon, city);
    });
  });
}

// ==================== LOADING STATE ====================

function disableSearchForm() {
  searchForm.querySelector("input").disabled = true;
  searchForm.querySelector("button").disabled = true;
}

function enableSearchForm() {
  searchForm.querySelector("input").disabled = false;
  searchForm.querySelector("button").disabled = false;
}

function skeletonShow() {
  mainContentContainer.classList.add("skeletons-container");
  currentWeather.classList.remove("has-image");
  disableSearchForm();
}

function skeletonHide() {
  mainContentContainer.classList.remove("skeletons-container");
  currentWeather.classList.add("has-image");
  enableSearchForm();
}

// ==================== EVENT HANDLERS ====================

function setupUnitButtons(buttons, unitKey) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach(resetUnitButtons);

      setActiveUnitButton(btn);
      state.units[unitKey] = btn.dataset.name;

      renderWeather();
    });
  });
}

function handleDropdown(e, elemClassName, containerList, dropDownIcon) {
  const button = e.target.closest(`.${elemClassName}`);

  if (button) {
    containerList.classList.toggle("list-open");
    dropDownIcon.classList.toggle("-rotate-180");
    return;
  }

  containerList.classList.remove("list-open");
  dropDownIcon.classList.remove("-rotate-180");
}

function handleDropdownClick(e) {
  handleDropdown(e, "units-btn", unitsList, unitDropDownIcon);
  handleDropdown(e, "days-list-btn", daysList, daysListDropDownIcon);
}

function handleDaySelection(e) {
  const dayBtn = e.target.closest(".day");
  if (!dayBtn) return;
  selectedDayContainerMarkup(dayBtn.textContent);
  const selectedIndex = Number(dayBtn.dataset.index);
  state.selectedDayIndex = selectedIndex;

  renderHourlyForecast();
}

async function searchCity(city) {
  try {
    skeletonShow();

    if (!isValidCity(city)) {
      showNotification("inValidInput");
      searchFormInput.value = "";
      return;
    }

    const location = await fetchLocation(city);
    searchFormInput.value = "";

    if (!location) return;

    const weatherData = await getWeather(
      location[0].latitude,
      location[0].longitude,
    );

    if (!weatherData) return;

    state.location = location[0];

    state.weatherData = weatherData;
    renderWeather();

    unitsBtn.disabled = false;
    daysListBtn.disabled = false;
  } finally {
    skeletonHide();
  }
}

async function selectCity(lat, lon, locationData) {
  const weatherData = await getWeather(lat, lon);

  if (!weatherData) return;

  state.location = locationData;
  state.weatherData = weatherData;
  renderWeather();
  skeletonHide();
}

function hideSuggestions() {
  searchResult.classList.add("hidden");
  searchResult.classList.remove("flex");
}

// ==================== ANIMATION ====================

function animateElements() {
  createScope({
    mediaQueries: {
      mobile: "(max-width: 640px)",
      reduceMotion: "(prefers-reduced-motion)",
    },
  }).add((self) => {
    const { mobile, reduceMotion } = self.matches;
    animate([".current-types", "#daily-forecast-title", ".daily-cards"], {
      opacity: [0, 1],
      y: [-200, 0],
      duration: stagger(200, { start: 500 }),
      delay: stagger(200, { start: 500 }),
      easing: cubicBezier(0.25, 0.1, 0.25, 1),
    });
    animate(".aside", {
      opacity: [0, 1],
      y: mobile ? [300, 0] : 0,
      x: mobile ? 0 : [300, 0],
      autoplay: mobile
        ? onScroll(document.querySelector(".aside"), { once: true })
        : true,
      easing: cubicBezier(0.25, 0.1, 0.25, 1),
    });
  });
  animate(currentWeather, {
    opacity: [0, 1],
    x: [-300, 0],
    easing: cubicBezier(0.25, 0.1, 0.25, 1),
  });
}

// ==================== EVENT LISTENERS ====================

setupUnitButtons(tempBtns, "temperature");
setupUnitButtons(windBtns, "wind");
setupUnitButtons(precipitationBtns, "precipitation");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    searchFormInput.value.trim() !== "" &&
    searchFormInput.value.length >= 3
  ) {
    searchCity(searchFormInput.value.toLocaleLowerCase());
    hideSuggestions();
    return;
  }
});

searchFormInput.addEventListener("keyup", (e) => {
  if (
    searchFormInput.value.trim() !== "" &&
    searchFormInput.value.length >= 3
  ) {
    enableSearchForm();
    if (!isValidCity(searchFormInput.value)) {
      showNotification("inValidInput");
      hideSuggestions();
      return;
    }

    renderSuggestion();
    return;
  }
  hideSuggestions();
});

document.addEventListener("click", handleDropdownClick);

daysList.addEventListener("click", handleDaySelection);

window.addEventListener("DOMContentLoaded", initializeApp);

// ==================== INITIALIZATION ====================

// Fall back to the default city when geolocation or location lookup fails.
async function handleLocationFallback() {
  showErrorState();
  showNotification("locationDenied");
  await searchCity("tehran");
}

async function initializeApp() {
  window.scrollTo(0,0);
  try {
    const location = await getUserLocation();


    const cityData = await getReverseGeocoding(location.lat, location.lon);

    if (!cityData) {
      await handleLocationFallback();
      return;
    }
    state.location = {
      lat: location.lat,
      lon: location.lon,
      name: cityData.city || cityData.town || cityData.county,
      country: cityData.country,
    };

    const weatherData = await getWeather(
      state.location.lat,
      state.location.lon,
    );

    if (!weatherData) return;

    state.weatherData = weatherData;
    renderWeather();

    unitsBtn.disabled = false;
    daysListBtn.disabled = false;

    showNotification("locationDetected");
  } catch (error) {
    if (error.code === 1 || error.code === 3) {
      showNotification("locationDenied");
    }
    await searchCity("tehran");
  } finally {
    if (state.isFirstLoading) {
      animateElements();
      state.isFirstLoading = false;
    }

    skeletonHide();
  }
}
