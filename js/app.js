/**
 * ShoreSquad - Interactive App JavaScript
 * Features: Geolocation, Weather API Integration, Event Management, Crew Rally
 */

// ========================================
// Configuration
// ========================================

const CONFIG = {
    NEA_API: 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast',
    NEA_REALTIME: 'https://api.data.gov.sg/v1/environment/realtime-weather-readings',
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
    weatherDisplay: document.getElementById('weather-display'),
    refreshWeatherBtn: document.getElementById('refresh-weather'),
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
 * Fetch 4-day weather forecast from NEA API
 * All values returned are in metric units:
 * - Temperature: Celsius (°C)
 * - Wind Speed: km/h
 * - Humidity: percentage (%)
 * @returns {Promise<Object>} 4-day forecast data
 */
async function fetchNEAForecast() {
    try {
        const response = await fetch(CONFIG.NEA_API);
        if (!response.ok) {
            throw new Error('Failed to fetch NEA forecast data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('NEA Forecast API Error:', error);
        throw new Error(`Failed to fetch weather: ${error.message}`);
    }
}

/**
 * Fetch real-time weather readings from NEA API
 * Returns current temperature and humidity for Singapore
 * @returns {Promise<Object>} Real-time weather data
 */
async function fetchNEARealtimeWeather() {
    try {
        const response = await fetch(CONFIG.NEA_REALTIME);
        if (!response.ok) {
            throw new Error('Failed to fetch NEA real-time data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('NEA Real-time API Error:', error);
        throw new Error(`Failed to fetch real-time weather: ${error.message}`);
    }
}

/**
 * Get emoji for weather condition
 */
function getWeatherEmoji(condition) {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('showers')) return '🌧️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('wind')) return '🌪️';
    if (conditionLower.includes('fog') || conditionLower.includes('haze')) return '🌫️';
    return '🌤️';
}

/**
 * Display weather information in the DOM with metric units
 * Shows current weather and 4-day forecast
 */
async function displayWeatherForecast() {
    try {
        showMessage(DOM.weatherDisplay, '🔄 Loading weather data...', 'loading');

        const [forecastData, realtimeData] = await Promise.all([
            fetchNEAForecast(),
            fetchNEARealtimeWeather()
        ]);

        // Get current readings
        const currentReadings = realtimeData.items[0].readings;
        const stations = realtimeData.items[0].stations;
        
        // Find Pasir Ris station or use first available
        let currentTemp = null;
        let currentHumidity = null;
        
        if (stations && stations.length > 0) {
            const pasirRisStation = Object.keys(currentReadings).find(key => 
                key.toLowerCase().includes('pasir ris') || 
                key.toLowerCase().includes('pasir') ||
                key.toLowerCase().includes('changi')
            ) || Object.keys(currentReadings)[0];
            
            currentTemp = currentReadings[pasirRisStation]?.air_temperature;
            currentHumidity = currentReadings[pasirRisStation]?.relative_humidity;
        }

        // Build forecast HTML
        let forecastHTML = '';
        
        // Current weather section
        if (currentTemp !== null) {
            forecastHTML += `
                <div class="current-weather">
                    <h3>Current Conditions - Singapore</h3>
                    <div class="current-icon">${getWeatherEmoji('clear')}</div>
                    <div class="current-temp">${currentTemp}°C</div>
                    <div class="current-desc">
                        ${currentHumidity !== null ? `Humidity: ${currentHumidity}%` : 'Real-time conditions'}
                    </div>
                </div>
            `;
        }

        // 4-day forecast section
        if (forecastData.items && forecastData.items.length > 0) {
            forecastHTML += '<div class="forecast-header"><h3>4-Day Forecast</h3></div>';
            forecastHTML += '<div class="weather-grid">';

            forecastData.items.forEach((item, index) => {
                const date = new Date(item.valid_date);
                const dateStr = date.toLocaleDateString('en-SG', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                });

                const forecasts = item.forecasts;
                if (forecasts && forecasts.length > 0) {
                    const forecast = forecasts[0];
                    
                    // Calculate average temperature if high and low exist
                    const tempDisplay = forecast.temperature 
                        ? `${forecast.temperature}°C`
                        : forecast.high && forecast.low
                        ? `${forecast.low}-${forecast.high}°C`
                        : 'N/A';

                    forecastHTML += `
                        <div class="weather-card">
                            <div class="weather-date">${dateStr}</div>
                            <div class="weather-icon">${getWeatherEmoji(forecast.forecast || '')}</div>
                            <div class="weather-temp">${tempDisplay}</div>
                            <div class="weather-desc">${forecast.forecast || 'Scattered showers'}</div>
                            <div class="weather-details">
                                ${forecast.wind_direction ? `<div class="weather-detail-item"><span class="weather-detail-label">Wind:</span> ${forecast.wind_direction}</div>` : ''}
                                ${forecast.wind_speed ? `<div class="weather-detail-item"><span class="weather-detail-label">Speed:</span> ${forecast.wind_speed} km/h</div>` : ''}
                                ${forecast.relative_humidity ? `<div class="weather-detail-item"><span class="weather-detail-label">Humidity:</span> ${forecast.relative_humidity}%</div>` : ''}
                            </div>
                        </div>
                    `;
                }
            });

            forecastHTML += '</div>';
        }

        // Add data attribution
        forecastHTML += `
            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="font-size: 0.85rem; color: #666; margin: 0;">
                    🏢 Data provided by NEA (National Environment Agency, Singapore)
                    <br><a href="https://data.gov.sg" style="color: #0066CC;" target="_blank">data.gov.sg</a>
                </p>
            </div>
        `;

        DOM.weatherDisplay.innerHTML = forecastHTML;
    } catch (error) {
        console.error('Error displaying weather:', error);
        showMessage(DOM.weatherDisplay, 
            `⚠️ ${error.message}. Please try refreshing.`, 
            'error');
    }
}

/**
 * Handle weather refresh button click
 */
function handleWeatherRefresh() {
    displayWeatherForecast();
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

    // Weather refresh
    if (DOM.refreshWeatherBtn) {
        DOM.refreshWeatherBtn.addEventListener('click', debounce(handleWeatherRefresh, 300));
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

    // Load weather forecast on startup
    setTimeout(() => {
        displayWeatherForecast();
    }, 500);

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
