# ShoreSquad 🏖️

**Rally your crew, track weather, and hit the next beach cleanup with our dope map app!**

## Overview

ShoreSquad is an interactive web application designed to mobilize young people to clean beaches by combining real-time weather tracking, interactive mapping, and social crew features. The app makes eco-action fun, connected, and impactful.

## Features

### 🗺️ Interactive Maps
- Find nearby beaches and cleanup hotspots
- Intuitive map interface for event location planning
- Integration-ready for Leaflet.js or Google Maps API

### 🌤️ Real-Time Weather
- Live weather data via Open-Meteo API
- Check conditions before planning cleanup events
- Forecast integration for better event scheduling

### 👥 Crew Rally System
- Create and manage cleanup crews
- Invite friends to join your crew
- Track crew progress and cleanup counts
- Social sharing features with unique crew IDs

### 📍 Geolocation Services
- Automatic location detection (with user consent)
- Find events near your current location
- Offline capability with Service Workers

### 🎯 Event Tracking
- Browse upcoming cleanup events
- RSVP and join events
- Log completed cleanups
- Track your eco-impact

## Technology Stack

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Responsive design with mobile-first approach
- **JavaScript (ES6+)** - Modern interactive features

### APIs & Services
- **Geolocation API** - User location access (with permission)
- **Open-Meteo API** - Free weather data (no API key required)
- **OpenCage Geocoding API** - Location search and reverse geocoding
- **LocalStorage** - Client-side data persistence
- **Service Workers** - Progressive Web App capability

## Brand Identity

### Color Palette
- **Primary Ocean Blue**: `#0066CC` - Trust, cleanliness, sea connection
- **Accent Orange**: `#FF6B35` - Energy, youth, call-to-action
- **Sand Neutral**: `#F5E6D3` - Warm, approachable, natural
- **Eco Green**: `#2ECC71` - Sustainability, achievement
- **Dark Text**: `#1A1A1A` - High contrast, accessibility

### Typography
- Clean, modern sans-serif font: "Segoe UI", Tahoma, Geneva, Verdana
- Clear hierarchy for mobile-first experience
- WCAG 2.1 AA compliant contrast ratios

## UX Design Principles

### Accessibility (WCAG 2.1 AA)
✓ Semantic HTML with ARIA labels  
✓ Keyboard navigation support  
✓ Color contrast compliant (4.5:1 for text)  
✓ Reduced motion preferences respected  
✓ Screen reader friendly  
✓ Focus indicators on all interactive elements  

### Mobile-First Design
✓ Responsive grid layouts  
✓ Touch-friendly button sizes  
✓ Optimized viewport settings  
✓ Fast loading times  

### Usability
✓ Intuitive navigation  
✓ Clear call-to-action buttons  
✓ Consistent design patterns  
✓ Error handling with user feedback  
✓ Success messages for actions  

## Project Structure

```
ShoreSquad/
├── index.html              # Main HTML5 boilerplate
├── css/
│   └── styles.css          # Responsive styles with color palette
├── js/
│   └── app.js              # Interactive features and API integration
├── images/                 # Asset folder
├── .vscode/
│   └── settings.json       # Live Server configuration
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── sw.js                   # Service worker (optional, for offline)
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local development server (Live Server extension recommended)

### Installation

1. **Open the project in VS Code**
   ```bash
   code "c:\Users\weiqi\Desktop\C240- AI\ShoreSquad"
   ```

2. **Install Live Server Extension** (if not already installed)
   - Open Extensions (Ctrl+Shift+X)
   - Search "Live Server"
   - Install by Ritwick Dey

3. **Start Live Server**
   - Right-click `index.html`
   - Select "Open with Live Server"
   - Browser opens at `http://localhost:5500`

### Development Setup

```bash
# Navigate to project directory
cd ShoreSquad

# Initialize git (already done)
git init

# View git status
git status

# Stage all files
git add .

# Create initial commit
git commit -m "Initial ShoreSquad project setup"
```

## Features Usage

### Weather Search
1. Navigate to "Weather" section
2. Enter a beach location (e.g., "Sunset Beach, CA")
3. Click "Get Weather" to fetch real-time conditions
4. View temperature, wind speed, humidity, and precipitation

### Crew Management
1. Click "Create Crew" to start your cleanup squad
2. Share your crew ID with friends
3. Friends can use "Join Crew" to connect
4. Track crew size and cleanup history

### Geolocation
- App requests location permission on first load
- Used to find nearby events and beaches
- Data stored locally in browser

## API Integration

### Open-Meteo Weather API
```javascript
// Free, no authentication required
GET https://api.open-meteo.com/v1/forecast
?latitude=40.7128&longitude=-74.0060
&current=temperature_2m,weather_code,wind_speed_10m
```

### Geocoding API
```javascript
// Convert location names to coordinates
GET https://geocoding-api.open-meteo.com/v1/search
?name=Sunset Beach&count=1&language=en
```

## Performance Optimizations

✓ **Lazy Loading** - Images load only when visible  
✓ **Debouncing** - Event handlers debounced for efficiency  
✓ **Local Storage** - Minimal API calls with caching  
✓ **Service Workers** - Offline access capability  
✓ **CSS Grid/Flexbox** - Efficient responsive layouts  
✓ **Event Delegation** - Reduced event listener count  

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Latest versions |
| Firefox | ✅ Full | Latest versions |
| Safari | ✅ Full | iOS 14+ |
| Edge | ✅ Full | Latest versions |
| IE 11 | ❌ Not Supported | Use modern browsers |

## Git Workflow

```bash
# Check status
git status

# Stage changes
git add .
git add filename.html

# Commit changes
git commit -m "Feature: Add weather search"

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature/new-feature
```

## Future Enhancements

- 🗺️ Full interactive map with Leaflet.js
- 📱 Mobile app version (React Native)
- 🔐 User authentication and profiles
- 💬 Real-time crew chat
- 🏆 Badge/achievement system
- 📸 Event photo uploads
- 🌍 Multi-language support
- 📈 Impact dashboard and analytics

## Contributing

Contributions welcome! Please:
1. Create a feature branch
2. Make changes with clear commits
3. Test across different devices
4. Submit pull request with description

## License

MIT License - See LICENSE file for details

## Contact & Support

- 📧 support@shorerquad.local
- 🌐 www.shorerquad.local
- 📱 Social: @ShoreSquad on all platforms

---

**Made with ❤️ for our oceans and communities**

*Last Updated: December 1, 2025*
