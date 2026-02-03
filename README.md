# Global AQI × Cigarette Calculator 🌍

A minimal, aesthetic web application that shows real-time Air Quality Index (AQI) of countries worldwide and calculates the cigarette equivalent you're breathing.

![Minimal Theme](https://img.shields.io/badge/theme-minimal%20editorial-000000?style=for-the-badge)
![Static Site](https://img.shields.io/badge/hosting-GitHub%20Pages-ffffff?style=for-the-badge)
![Vanilla JS](https://img.shields.io/badge/js-vanilla-666666?style=for-the-badge)

## ⚠️ IMPORTANT: API Key Required for Real Data

The app requires a **free API key** to display real AQI data. Without it, you'll see sample/demo data.

### Get Your Free API Key (2 minutes)

1. Visit **[aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/)**
2. Enter your email address
3. Check your email and click the confirmation link
4. Copy the API token you receive
5. Open `js/app.js` and replace line 20:
   ```javascript
   const WAQI_TOKEN = 'YOUR_API_TOKEN_HERE';
   ```

That's it! Refresh the page and you'll see real global AQI data.

---

## ✨ Features

- **Real-time Global AQI Data**: Fetches live air quality data from WAQI (AQICN) API for 80+ countries
- **Interactive World Map**: Hover over any country to see its current AQI with smooth color transitions
- **Cigarette Equivalent**: Instantly see how many cigarettes/day you're effectively breathing
- **Dark/Light Theme Toggle**: Switch between beautiful light and dark modes with saved preferences
- **Zoom & Pan Controls**: Zoom in to see small countries, pan around, and reset view
- **Premium Minimal Design**: Clean aesthetic theme with smooth animations and glassmorphic effects
- **Smart Caching**: 5-minute cache to minimize API calls
- **SEO Optimized**: Dynamic URLs, meta tags, and sitemap for better discoverability
- **Fully Static**: Runs entirely in the browser, deployable on GitHub Pages
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🌍 Country Coverage

The app includes comprehensive mapping for major countries across all continents:

- **North America**: United States, Canada, Mexico
- **Europe**: UK, France, Germany, Italy, Spain, Poland, Netherlands, and 20+ more
- **Asia**: China, India, Japan, South Korea, Indonesia, Thailand, Vietnam, and 15+ more
- **Middle East**: Turkey, Iran, Saudi Arabia, UAE, Israel, and more
- **South America**: Brazil, Argentina, Chile, Colombia, Peru
- **Africa**: Egypt, South Africa, Nigeria, Kenya, Morocco
- **Oceania**: Australia, New Zealand

## 📡 Data Source

The app uses the **WAQI (World Air Quality Index)** API from [aqicn.org](https://aqicn.org), which aggregates data from:
- Government monitoring stations
- Environmental agencies worldwide
- Scientific research institutions

When multiple monitoring stations are available for a country, the app averages them for more accurate readings.

## 🎨 Design Philosophy

Inspired by premium minimal design:
- Light mode: Soft blue gradient backgrounds with white countries
- Dark mode: Deep navy backgrounds for reduced eye strain
- Smooth transitions with zero delays for instant feedback
- Vibrant AQI colors with glow effects for visual impact
- Clean Inter typography for excellent readability
- Subtle micro-animations throughout the interface
- Glassmorphic popup panels with backdrop blur
- Small countries are easily selectable without jumping on hover

## 📊 The Formula

The cigarette equivalent is calculated using:

```
Cigarettes per day = AQI / 22
```

This is based on research suggesting that exposure to an AQI of 22 is roughly equivalent to smoking one cigarette per day.

## 🚀 Quick Start

### Step 1: Get API Key
1. Go to [aqicn.org/data-platform/token/](https://aqicn.org/data-platform/token/)
2. Enter your email
3. Click the link in your email to get your token

### Step 2: Configure
Open `js/app.js` and update line 20:
```javascript
const WAQI_TOKEN = 'your-token-here';
```

### Step 3: Run
Open `index.html` in your browser, or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Visit http://localhost:8000 in your browser.

## 📦 Project Structure

```
/global-aqi-monitor
├── index.html              # Main HTML structure
├── about.html              # About page
├── how-to-use.html         # Usage instructions
├── privacy-policy.html     # Privacy policy
├── terms.html              # Terms & conditions
├── disclaimer.html         # Disclaimer page
├── css/
│   ├── style.css          # Main theme styles with animations
│   └── pages.css          # Styles for additional pages
├── js/
│   ├── app.js             # Core application logic & WAQI API
│   ├── navigation.js      # Navigation menu handler
│   └── fallback-aqi-data.js  # 2025 IQAir AQI fallback data
├── manifest.json          # PWA manifest
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine instructions
└── README.md              # This file
```

## 🌐 Deploy to GitHub Pages

### Step 1: Configure API Key
Make sure you've added your API token to `js/app.js` first!

### Step 2: Create Repository
1. Go to [github.com/new](https://github.com/new)
2. Name your repository (e.g., `global-aqi-monitor`)
3. Set it to **Public**
4. Click **Create repository**

### Step 3: Push Your Code
```bash
cd global-aqi-monitor
git init
git add .
git commit -m "Global AQI Monitor"
git remote add origin https://github.com/YOUR_USERNAME/global-aqi-monitor.git
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. Go to your repository → **Settings** → **Pages**
2. Under **Source**, select **main** branch
3. Click **Save**
4. Wait 1-2 minutes
5. Your site is live at: `https://YOUR_USERNAME.github.io/global-aqi-monitor/`

## 🗺️ How It Works

1. **Map Rendering**: Uses D3.js with Natural Earth projection to render a world map from GeoJSON data
2. **Hover Detection**: When you hover over a country, it queries the WAQI API for that country's major cities
3. **Data Aggregation**: Averages AQI readings from multiple monitoring stations within the country
4. **Color Mapping**: Applies pastel colors based on AQI severity (Good → Green, Hazardous → Red)
5. **Side Panel**: Clicking a country opens a detailed panel showing AQI value and cigarette equivalent
6. **Caching**: Results are cached for 5 minutes to reduce API calls

## ⚡ Performance

- **Selective Preloading**: Automatically preloads data for 20 major countries on page load
- **Smart Caching**: 5-minute cache prevents redundant API requests
- **Optimized Animations**: All transitions under 250ms for snappy feel
- **Lazy Loading**: Countries load data only when hovered or clicked

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Minimal editorial theme with custom properties
- **Vanilla JavaScript** - No frameworks
- **D3.js v7** - Map rendering and interactions
- **WAQI API** - Real-time global AQI data

## 📱 Responsive Design

The application adapts to all screen sizes:
- 💻 **Desktop**: Full map with side panel
- 📱 **Tablet**: Scaled map with adaptive panels
- 📱 **Mobile**: Full-screen map with overlay panel

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest countries or features
- Submit pull requests
- Improve data coverage

## 📄 License

MIT License - Free for personal or commercial use.

## 🙏 Credits

- World map data: [D3 Graph Gallery](https://www.d3-graph-gallery.com/)
- AQI data: [WAQI/AQICN](https://aqicn.org)
- Fonts: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- Original design: Adapted from India AQI Monitor

---

**Made with 💜 for global air quality awareness**

## 🔗 Related Projects

- [India AQI Monitor](../india-aqi-calc) - State-level AQI visualization for India
