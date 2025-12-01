/**
 * ShoreSquad - Interactive App JavaScript
 * Features: Geolocation, Weather API Integration, Event Management, Crew Rally
 */

// ========================================
// Configuration
// ========================================

const CONFIG = {
    WEATHER_API: 'https://api.open-meteo.com/v1/forecast',
    GEOLOCATION_TIMEOUT: 10000,
    STORAGE_KEYS: {
        CREW: 'shorerquad_crew',
        EVENTS: 'shorerquad_events',
        LOCATION: 'shorerquad_location'
    },
    NEXT_CLEANUP: {
        NAME: 'Pasir Ris, Singapore',
        LATITUDE: 1.381497,
        LONGITUDE: 103.955574,
        DESCRIPTION: 'Street View Asia - Pasir Ris Beach Park'
    }
};

// ========================================
// DOM Elements Caching
// ========================================

const DOM = {
    menuToggle: document.getElementById('menu-toggle'),
    navLinks: document.getElementById('nav-links'),
    getStartedBtn: document.getElementById('get-started'),
    weatherInput: document.getElementById('weather-location'),
    weatherBtn: document.getElementById('fetch-weather'),
    weatherDisplay: document.getElementById('weather-display'),
    crewList: document.getElementById('crew-list'),
    createCrewBtn: document.getElementById('create-crew'),
    joinCrewBtn: document.getElementById('join-crew'),
    eventsList: document.getElementById('events-list')
};

// ========================================
// Mobile Menu Toggle
// ========================================

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    if (!DOM.menuToggle) return;

    DOM.menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        DOM.navLinks.classList.toggle('active');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            DOM.menuToggle.setAttribute('aria-expanded', 'false');
            DOM.navLinks.classList.remove('active');
        });
    });
}

// ========================================
// Geolocation Service
// ========================================

/**
 * Get user's current location using Geolocation API
 * @returns {Promise<Object>} Location object with latitude, longitude, and accuracy in meters
 */
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy  // in meters
                });
            },
            error => {
                reject(error);
            },
            {
                timeout: CONFIG.GEOLOCATION_TIMEOUT,
                enableHighAccuracy: false
            }
        );
    });
}

/**
 * Show location permission request
 */
async function requestLocationPermission() {
    try {
        const location = await getCurrentLocation();
        console.log('Location obtained:', location);
        saveToLocalStorage(CONFIG.STORAGE_KEYS.LOCATION, location);
        return location;
    } catch (error) {
        console.warn('Location access denied or unavailable:', error.message);
        return null;
    }
}

// ========================================
// Weather API Integration
// ========================================

/**
 * Fetch weather data from Open-Meteo API
 * All values returned are in metric units:
 * - Temperature: Celsius (°C)
 * - Wind Speed: km/h
 * - Precipitation: millimeters (mm)
 * - Humidity: percentage (%)
 * @param {string} location - Beach location name
 * @returns {Promise<Object>} Weather data in metric units
 */
async function fetchWeather(location) {
    try {
        // Geocode the location to get coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        );
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Location not found');
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Fetch weather for the location
        const weatherResponse = await fetch(
            `${CONFIG.WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,precipitation,relative_humidity_2m&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        return {
            location: `${name}, ${country}`,
            ...weatherData.current,
            timezone: weatherData.timezone
        };
    } catch (error) {
        throw new Error(`Failed to fetch weather: ${error.message}`);
    }
}

/**
 * Interpret WMO weather codes
 * @param {number} code - WMO weather code
 * @returns {string} Weather description
 */
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown conditions';
}

/**
 * Display weather information in the DOM
 */
async function handleWeatherSearch() {
    const location = DOM.weatherInput.value.trim();
    if (!location) {
        showMessage(DOM.weatherDisplay, 'Please enter a location', 'error');
        return;
    }

    showMessage(DOM.weatherDisplay, 'Loading weather data...', 'loading');

    try {
        const weather = await fetchWeather(location);
        displayWeather(weather);
    } catch (error) {
        showMessage(DOM.weatherDisplay, `Error: ${error.message}`, 'error');
    }
}

/**
 * Render weather data to DOM with metric units
 * Displays temperature in Celsius (°C), wind speed in km/h, and precipitation in mm
 */
function displayWeather(weather) {
    const weatherHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3>${weather.location}</h3>
            <div style="font-size: 3rem; margin: 20px 0;">
                ${getWeatherEmoji(weather.weather_code)}
            </div>
            <p style="font-size: 1.5rem; font-weight: bold; color: #0066CC;">
                ${weather.temperature_2m}°C
            </p>
            <p style="font-size: 1.1rem; margin: 10px 0;">
                ${getWeatherDescription(weather.weather_code)}
            </p>
            <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                    <p style="margin: 0; font-weight: 600;">Wind Speed</p>
                    <p style="margin: 5px 0; color: #666;">${weather.wind_speed_10m} km/h</p>
                </div>
                <div>
                    <p style="margin: 0; font-weight: 600;">Humidity</p>
                    <p style="margin: 5px 0; color: #666;">${weather.relative_humidity_2m}%</p>
                </div>
                <div>
                    <p style="margin: 0; font-weight: 600;">Precipitation</p>
                    <p style="margin: 5px 0; color: #666;">${weather.precipitation} mm</p>
                </div>
                <div>
                    <p style="margin: 0; font-weight: 600;">Timezone</p>
                    <p style="margin: 5px 0; color: #666;">${weather.timezone}</p>
                </div>
            </div>
            <p style="margin-top: 20px; color: #2ECC71; font-weight: 600;">
                ✓ Great conditions for a beach cleanup!
            </p>
        </div>
    `;
    DOM.weatherDisplay.innerHTML = weatherHTML;
}

/**
 * Get emoji for weather code
 */
function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 86) return '❄️';
    return '⛈️';
}

// ========================================
// Crew Management
// ========================================

/**
 * Create a new crew
 */
function handleCreateCrew() {
    const crewName = prompt('Enter your crew name:');
    if (!crewName) return;

    const crew = {
        id: Date.now(),
        name: crewName,
        members: ['You'],
        createdAt: new Date().toISOString(),
        cleanup_count: 0
    };

    const crews = getFromLocalStorage(CONFIG.STORAGE_KEYS.CREW) || [];
    crews.push(crew);
    saveToLocalStorage(CONFIG.STORAGE_KEYS.CREW, crews);

    displayCrews();
    showMessage(DOM.crewList, `Crew "${crewName}" created successfully!`, 'success');
}

/**
 * Join an existing crew
 */
function handleJoinCrew() {
    const crewId = prompt('Enter crew ID to join:');
    if (!crewId) return;

    const crews = getFromLocalStorage(CONFIG.STORAGE_KEYS.CREW) || [];
    const crew = crews.find(c => c.id.toString() === crewId);

    if (!crew) {
        showMessage(DOM.crewList, 'Crew not found!', 'error');
        return;
    }

    if (!crew.members.includes('You')) {
        crew.members.push('You');
    }

    saveToLocalStorage(CONFIG.STORAGE_KEYS.CREW, crews);
    displayCrews();
    showMessage(DOM.crewList, `Joined "${crew.name}" successfully!`, 'success');
}

/**
 * Display crews in the DOM
 */
function displayCrews() {
    const crews = getFromLocalStorage(CONFIG.STORAGE_KEYS.CREW) || [];

    if (crews.length === 0) {
        DOM.crewList.innerHTML = '<p class="placeholder-text">Create or join a crew to start rallying your squad!</p>';
        return;
    }

    const crewHTML = crews.map(crew => `
        <div style="
            background: linear-gradient(135deg, #F5E6D3 0%, #ffffff 100%);
            padding: 20px;
            margin: 10px 0;
            border-radius: 8px;
            border-left: 4px solid #0066CC;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        ">
            <h4 style="color: #0066CC; margin: 0 0 10px 0;">${crew.name}</h4>
            <p style="margin: 5px 0;"><strong>ID:</strong> ${crew.id}</p>
            <p style="margin: 5px 0;"><strong>Members:</strong> ${crew.members.length}</p>
            <p style="margin: 5px 0;"><strong>Cleanups:</strong> ${crew.cleanup_count}</p>
            <div style="margin-top: 10px; display: flex; gap: 10px;">
                <button onclick="shareCrewId('${crew.id}')" style="
                    background: #0066CC;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Share ID</button>
                <button onclick="deleteCrewById('${crew.id}')" style="
                    background: #FF6B35;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Delete</button>
            </div>
        </div>
    `).join('');

    DOM.crewList.innerHTML = crewHTML;
}

/**
 * Share crew ID to clipboard
 */
function shareCrewId(crewId) {
    navigator.clipboard.writeText(crewId).then(() => {
        alert(`Crew ID ${crewId} copied to clipboard!`);
    });
}

/**
 * Delete crew by ID
 */
function deleteCrewById(crewId) {
    if (!confirm('Are you sure you want to delete this crew?')) return;

    const crews = getFromLocalStorage(CONFIG.STORAGE_KEYS.CREW) || [];
    const filtered = crews.filter(c => c.id.toString() !== crewId);
    saveToLocalStorage(CONFIG.STORAGE_KEYS.CREW, filtered);
    displayCrews();
}

// ========================================
// Event Management
// ========================================

/**
 * Log a cleanup event
 */
function logCleanupEvent(eventId) {
    const events = getFromLocalStorage(CONFIG.STORAGE_KEYS.EVENTS) || [];
    const event = events.find(e => e.id.toString() === eventId);

    if (event) {
        event.attended = true;
        event.attendedDate = new Date().toISOString();
        saveToLocalStorage(CONFIG.STORAGE_KEYS.EVENTS, events);
        alert(`Cleanup at ${event.location} logged successfully!`);
    }
}

// ========================================
// Local Storage Utilities
// ========================================

/**
 * Save data to localStorage
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('LocalStorage error:', error);
    }
}

/**
 * Retrieve data from localStorage
 */
function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('LocalStorage error:', error);
        return null;
    }
}

// ========================================
// UI Utilities
// ========================================

/**
 * Display message in container
 */
function showMessage(container, message, type = 'info') {
    const color = {
        success: '#2ECC71',
        error: '#FF6B35',
        loading: '#0066CC',
        info: '#666'
    }[type] || '#666';

    container.innerHTML = `
        <div style="
            color: ${color};
            font-weight: 500;
            padding: 20px;
            text-align: center;
        ">
            ${message}
        </div>
    `;
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Event Listeners Setup
// ========================================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Menu toggle
    initMobileMenu();

    // Get Started button
    if (DOM.getStartedBtn) {
        DOM.getStartedBtn.addEventListener('click', () => {
            document.getElementById('crew').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Weather search with debounce
    if (DOM.weatherBtn) {
        DOM.weatherBtn.addEventListener('click', debounce(handleWeatherSearch, 300));
    }

    if (DOM.weatherInput) {
        DOM.weatherInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleWeatherSearch();
            }
        });
    }

    // Crew management
    if (DOM.createCrewBtn) {
        DOM.createCrewBtn.addEventListener('click', handleCreateCrew);
    }

    if (DOM.joinCrewBtn) {
        DOM.joinCrewBtn.addEventListener('click', handleJoinCrew);
    }
}

// ========================================
// Service Worker Registration
// ========================================

/**
 * Register service worker for offline capability
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(error => {
            console.log('Service worker registration failed:', error);
        });
    }
}

// ========================================
// Performance Optimization
// ========================================

/**
 * Lazy load images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========================================
// Application Initialization
// ========================================

/**
 * Initialize the application
 */
function initApp() {
    console.log('🏖️ ShoreSquad App Initializing...');

    // Initialize event listeners
    initEventListeners();

    // Display crews
    displayCrews();

    // Request location permission on page load
    setTimeout(() => {
        requestLocationPermission();
    }, 1000);

    // Register service worker
    registerServiceWorker();

    // Initialize lazy loading
    initLazyLoading();

    console.log('✓ ShoreSquad App Ready!');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// ========================================
// Global Functions for HTML Event Handlers
// ========================================

// Make functions available globally
window.shareCrewId = shareCrewId;
window.deleteCrewById = deleteCrewById;
window.logCleanupEvent = logCleanupEvent;
