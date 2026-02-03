/**
 * Global AQI × Cigarette Calculator
 * Real-time AQI data visualization with cigarette equivalent for countries worldwide
 * 
 * Features:
 * - Interactive world map with hover effects
 * - Real-time AQI data from WAQI (World Air Quality Index)
 * - Cigarette equivalent calculation (1 cig ≈ 22 AQI)
 * - 5-minute cache for API results
 * 
 * Data Sources:
 * 1. WAQI (World Air Quality Index) - aqicn.org
 */

// =========================================
// Configuration - API Keys
// =========================================

// WAQI API Token - Get your free token from https://aqicn.org/data-platform/token/
const WAQI_TOKEN = 'ff992c04fe07e110e36ede6250ef5f96e34eaa23';

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// =========================================
// Cache Implementation
// =========================================

const aqiCache = new Map();

/**
 * Get cached AQI data for a country
 * Returns null if cache is expired or doesn't exist
 */
function getCachedAQI(countryName) {
    const cached = aqiCache.get(countryName);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
        aqiCache.delete(countryName);
        return null;
    }

    return cached.data;
}

/**
 * Store AQI data in cache with timestamp
 */
function setCachedAQI(countryName, data) {
    aqiCache.set(countryName, {
        data: data,
        timestamp: Date.now()
    });
}

// =========================================
// Country Data with Major Cities
// =========================================

const COUNTRY_DATA = {
    // North America
    'United States': { cities: ['new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'seattle', 'san francisco'] },
    'Canada': { cities: ['toronto', 'vancouver', 'montreal', 'calgary', 'ottawa'] },
    'Mexico': { cities: ['mexico city', 'guadalajara', 'monterrey', 'puebla', 'tijuana'] },

    // South America
    'Brazil': { cities: ['sao paulo', 'rio de janeiro', 'brasilia', 'salvador', 'fortaleza'] },
    'Argentina': { cities: ['buenos aires', 'cordoba', 'rosario', 'mendoza'] },
    'Chile': { cities: ['santiago', 'valparaiso', 'concepcion'] },
    'Colombia': { cities: ['bogota', 'medellin', 'cali', 'barranquilla'] },
    'Peru': { cities: ['lima', 'arequipa', 'trujillo', 'cusco'] },
    'Venezuela': { cities: ['caracas', 'maracaibo', 'valencia'] },
    'Ecuador': { cities: ['quito', 'guayaquil', 'cuenca'] },

    // Europe
    'United Kingdom': { cities: ['london', 'manchester', 'birmingham', 'glasgow', 'edinburgh'] },
    'France': { cities: ['paris', 'marseille', 'lyon', 'toulouse', 'nice'] },
    'Germany': { cities: ['berlin', 'munich', 'hamburg', 'frankfurt', 'cologne'] },
    'Italy': { cities: ['rome', 'milan', 'naples', 'turin', 'florence'] },
    'Spain': { cities: ['madrid', 'barcelona', 'valencia', 'seville', 'bilbao'] },
    'Poland': { cities: ['warsaw', 'krakow', 'lodz', 'wroclaw', 'poznan'] },
    'Netherlands': { cities: ['amsterdam', 'rotterdam', 'the hague', 'utrecht'] },
    'Belgium': { cities: ['brussels', 'antwerp', 'ghent', 'bruges'] },
    'Switzerland': { cities: ['zurich', 'geneva', 'basel', 'bern'] },
    'Austria': { cities: ['vienna', 'salzburg', 'graz', 'innsbruck'] },
    'Sweden': { cities: ['stockholm', 'gothenburg', 'malmo'] },
    'Norway': { cities: ['oslo', 'bergen', 'trondheim'] },
    'Denmark': { cities: ['copenhagen', 'aarhus', 'odense'] },
    'Finland': { cities: ['helsinki', 'espoo', 'tampere'] },
    'Portugal': { cities: ['lisbon', 'porto', 'braga'] },
    'Greece': { cities: ['athens', 'thessaloniki', 'patras'] },
    'Czech Republic': { cities: ['prague', 'brno', 'ostrava'] },
    'Romania': { cities: ['bucharest', 'cluj-napoca', 'timisoara'] },
    'Hungary': { cities: ['budapest', 'debrecen', 'szeged'] },
    'Ireland': { cities: ['dublin', 'cork', 'galway'] },
    'Russia': { cities: ['moscow', 'saint petersburg', 'novosibirsk', 'yekaterinburg', 'kazan'] },
    'Ukraine': { cities: ['kyiv', 'kharkiv', 'odesa', 'dnipro', 'lviv'] },

    // Asia
    'China': { cities: ['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'wuhan', 'hangzhou'] },
    'India': { cities: ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune'] },
    'Japan': { cities: ['tokyo', 'osaka', 'yokohama', 'nagoya', 'sapporo', 'fukuoka', 'kyoto'] },
    'South Korea': { cities: ['seoul', 'busan', 'incheon', 'daegu', 'daejeon'] },
    'Indonesia': { cities: ['jakarta', 'surabaya', 'bandung', 'medan', 'semarang'] },
    'Thailand': { cities: ['bangkok', 'chiang mai', 'phuket', 'pattaya', 'khon kaen'] },
    'Vietnam': { cities: ['ho chi minh city', 'hanoi', 'da nang', 'can tho', 'hai phong'] },
    'Philippines': { cities: ['manila', 'quezon city', 'davao', 'cebu', 'zamboanga'] },
    'Malaysia': { cities: ['kuala lumpur', 'george town', 'ipoh', 'johor bahru'] },
    'Singapore': { cities: ['singapore'] },
    'Pakistan': { cities: ['karachi', 'lahore', 'islamabad', 'faisalabad', 'rawalpindi'] },
    'Bangladesh': { cities: ['dhaka', 'chittagong', 'khulna', 'rajshahi'] },
    'Myanmar': { cities: ['yangon', 'mandalay', 'naypyidaw'] },
    'Taiwan': { cities: ['taipei', 'kaohsiung', 'taichung', 'tainan'] },
    'Sri Lanka': { cities: ['colombo', 'kandy', 'galle'] },
    'Nepal': { cities: ['kathmandu', 'pokhara', 'lalitpur'] },
    'Cambodia': { cities: ['phnom penh', 'siem reap', 'battambang'] },
    'Laos': { cities: ['vientiane', 'luang prabang'] },
    'Mongolia': { cities: ['ulaanbaatar', 'erdenet'] },

    // Middle East
    'Turkey': { cities: ['istanbul', 'ankara', 'izmir', 'bursa', 'antalya'] },
    'Iran': { cities: ['tehran', 'mashhad', 'isfahan', 'karaj', 'tabriz'] },
    'Saudi Arabia': { cities: ['riyadh', 'jeddah', 'mecca', 'medina', 'dammam'] },
    'United Arab Emirates': { cities: ['dubai', 'abu dhabi', 'sharjah', 'ajman'] },
    'Israel': { cities: ['tel aviv', 'jerusalem', 'haifa', 'rishon lezion'] },
    'Iraq': { cities: ['baghdad', 'basra', 'mosul', 'erbil'] },
    'Qatar': { cities: ['doha', 'al wakrah'] },
    'Kuwait': { cities: ['kuwait city', 'al ahmadi'] },
    'Jordan': { cities: ['amman', 'zarqa', 'irbid'] },
    'Lebanon': { cities: ['beirut', 'tripoli', 'sidon'] },
    'Oman': { cities: ['muscat', 'salalah', 'sohar'] },
    'Bahrain': { cities: ['manama', 'riffa'] },

    // Africa
    'Egypt': { cities: ['cairo', 'alexandria', 'giza', 'shubra el kheima', 'port said'] },
    'South Africa': { cities: ['johannesburg', 'cape town', 'durban', 'pretoria', 'port elizabeth'] },
    'Nigeria': { cities: ['lagos', 'kano', 'ibadan', 'abuja', 'port harcourt'] },
    'Kenya': { cities: ['nairobi', 'mombasa', 'kisumu', 'nakuru'] },
    'Morocco': { cities: ['casablanca', 'rabat', 'marrakech', 'fez', 'tangier'] },
    'Algeria': { cities: ['algiers', 'oran', 'constantine'] },
    'Tunisia': { cities: ['tunis', 'sfax', 'sousse'] },
    'Ethiopia': { cities: ['addis ababa', 'dire dawa', 'mekelle'] },
    'Ghana': { cities: ['accra', 'kumasi', 'tamale'] },
    'Tanzania': { cities: ['dar es salaam', 'mwanza', 'arusha'] },
    'Uganda': { cities: ['kampala', 'gulu', 'lira'] },

    // Oceania
    'Australia': { cities: ['sydney', 'melbourne', 'brisbane', 'perth', 'adelaide', 'canberra'] },
    'New Zealand': { cities: ['auckland', 'wellington', 'christchurch', 'hamilton'] },
};

// =========================================
// API Functions (WAQI)
// =========================================

/**
 * Search for stations using WAQI search API
 * Filters for valid global stations
 */
async function fetchWAQISearchResults(keyword) {
    try {
        const url = `https://api.waqi.info/search/?token=${WAQI_TOKEN}&keyword=${encodeURIComponent(keyword)}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.status === 'ok' && result.data && Array.isArray(result.data)) {
            // Filter to only include valid AQI readings
            return result.data.filter(station => {
                const aqi = parseInt(station.aqi);
                const isValidAQI = !isNaN(aqi) && aqi > 0;
                return isValidAQI;
            }).map(station => ({
                source: 'WAQI',
                aqi: parseInt(station.aqi),
                station: station.station?.name || 'Unknown Station',
                uid: station.uid,
                country: station.station?.country || ''
            }));
        }
    } catch (error) {
        console.log(`WAQI search failed for ${keyword}:`, error.message);
    }
    return [];
}

/**
 * Main function to fetch AQI for a country (WAQI + Fallback)
 */
async function fetchAQI(countryName) {
    // 1. Check cache first
    const cached = getCachedAQI(countryName);
    if (cached) {
        console.log(`📦 Cache hit for ${countryName}: AQI ${cached.aqi}`);
        return cached;
    }

    console.log(`\n🔄 Fetching AQI for ${countryName}...`);

    // 2. Try WAQI real-time data first
    const countryData = COUNTRY_DATA[countryName];

    if (countryData) {
        const waqiStations = [];
        const seenUIDs = new Set();

        // Strategy: Search by country name and top cities
        const searchTerms = [countryName];
        if (countryData.cities) {
            searchTerms.push(...countryData.cities.slice(0, 5));
        }

        const promises = searchTerms.map(term => fetchWAQISearchResults(term));
        const results = await Promise.all(promises);

        for (const stations of results) {
            for (const station of stations) {
                if (!seenUIDs.has(station.uid)) {
                    seenUIDs.add(station.uid);
                    waqiStations.push(station);
                }
            }
        }

        if (waqiStations.length > 0) {
            const totalAQI = waqiStations.reduce((sum, s) => sum + s.aqi, 0);
            const avgAQI = Math.round(totalAQI / waqiStations.length);

            console.log(`  ✅ WAQI: Found ${waqiStations.length} stations. Avg AQI: ${avgAQI}`);

            const result = {
                aqi: avgAQI,
                dataType: 'real-time',
                year: new Date().getFullYear(),
                sources: ['WAQI'],
                stationCount: waqiStations.length,
                confidence: waqiStations.length >= 3 ? 'High' : waqiStations.length >= 2 ? 'Medium' : 'Low',
                error: false
            };

            setCachedAQI(countryName, result);
            return result;
        }
    }

    // 3. Fallback to 2-year average historical data
    console.log(`  🔄 No real-time data. Using fallback 2-year average for ${countryName}...`);

    const fallbackData = FALLBACK_AQI_DATA[countryName];

    if (fallbackData) {
        const cigarettesPerDay = parseFloat((fallbackData.aqi / 22).toFixed(1));

        const result = {
            country: countryName,
            aqi: fallbackData.aqi,
            dataType: '2-year average',
            years_used: fallbackData.years,
            source: fallbackData.source,
            cigarettes_per_day: cigarettesPerDay,
            note: `Real-time data not available. AQI is the average of ${fallbackData.years.join(' and ')}.`,
            error: false
        };

        setCachedAQI(countryName, result);
        console.log(`  ✅ Fallback 2-year average: AQI ${result.aqi} (${fallbackData.years.join('-')})`);
        console.log(`  🚬 Cigarette equivalent: ${cigarettesPerDay} per day`);
        return result;
    }

    // 4. Last resort: use global estimate (should rarely happen)
    console.warn(`  ⚠️ No data for ${countryName}, using global estimate`);
    const cigarettesPerDay = parseFloat((60 / 22).toFixed(1));

    const result = {
        country: countryName,
        aqi: 60,
        dataType: 'estimated',
        years_used: [2024, 2025],
        source: 'Global Regional Average',
        cigarettes_per_day: cigarettesPerDay,
        note: 'Estimated AQI based on global regional average. Real-time monitoring not available.',
        error: false
    };

    setCachedAQI(countryName, result);
    return result;
}


// =========================================
// Cigarette Calculation
// =========================================

/**
 * Calculate cigarette equivalent from AQI
 * Formula: 1 cigarette ≈ 22 AQI (PM2.5)
 */
function calculateCigarettes(aqi) {
    if (!aqi || aqi < 0) return 0;
    // Simple linear approximation based on Berkeley Earth study
    return (aqi / 22).toFixed(1);
}

// =========================================
// UI Helper Functions
// =========================================

/**
 * Get full display name for a country (formal names for popup)
 */
function getDisplayName(countryName) {
    const displayNames = {
        // Full formal names
        'United States': 'United States of America',
        'Russia': 'Russian Federation',
        'UK': 'United Kingdom',
        'UAE': 'United Arab Emirates',
        'Congo': 'Democratic Republic of the Congo',
        'Tanzania': 'United Republic of Tanzania',
        'Korea': 'Republic of Korea',
        'South Korea': 'Republic of Korea (South Korea)',
        'North Korea': "Democratic People's Republic of Korea",
        'Iran': 'Islamic Republic of Iran',
        'Syria': 'Syrian Arab Republic',
        'Venezuela': 'Bolivarian Republic of Venezuela',
        'Bolivia': 'Plurinational State of Bolivia',
        'Vietnam': 'Socialist Republic of Vietnam',
        'Laos': "Lao People's Democratic Republic",
        'Moldova': 'Republic of Moldova',
        'Macedonia': 'Republic of North Macedonia',
        'North Macedonia': 'Republic of North Macedonia',
        'Czechia': 'Czech Republic',
        'Ivory Coast': "Republic of Côte d'Ivoire",
        'Cote d\'Ivoire': "Republic of Côte d'Ivoire",
        'Burma': 'Republic of the Union of Myanmar',
        'Myanmar': 'Republic of the Union of Myanmar',
        'Brunei': 'Brunei Darussalam',
        'Vatican City': 'Vatican City State',
        'Palestine': 'State of Palestine',
        'Taiwan': 'Taiwan (Republic of China)',
        'Micronesia': 'Federated States of Micronesia',
        'East Timor': 'Democratic Republic of Timor-Leste',
        'Timor-Leste': 'Democratic Republic of Timor-Leste'
    };
    return displayNames[countryName] || countryName;
}

/**
 * Get CSS class for AQI severity
 */
function getAQIClass(aqi) {
    if (aqi <= 50) return 'aqi-good';                      // 0-50: Good (GREEN)
    if (aqi <= 100) return 'aqi-satisfactory';             // 51-100: Moderate (YELLOW/AMBER)
    if (aqi <= 150) return 'aqi-moderate';                 // 101-150: Unhealthy for Sensitive (ORANGE)
    if (aqi <= 200) return 'aqi-poor';                     // 151-200: Unhealthy (RED)
    if (aqi <= 300) return 'aqi-very-poor';                // 201-300: Very Unhealthy (DEEP RED)
    if (aqi <= 400) return 'aqi-severe';                   // 301-400: Severe (MAROON)
    return 'aqi-hazardous';                                 // 400+: Hazardous (PURPLE)
}

// =========================================
// Popup Management
// =========================================

const popup = document.getElementById('info-popup');
const closePopupBtn = document.getElementById('close-popup');
const popupCountry = document.getElementById('popup-country');
const popupAQI = document.getElementById('popup-aqi');
const popupCig = document.getElementById('popup-cig');
const popupNote = document.getElementById('popup-note');
const popupAQIBar = document.getElementById('popup-aqi-bar');

// Track active country element
let activeCountryElement = null;

// Close popup event listener
if (closePopupBtn) {
    closePopupBtn.addEventListener('click', closePopup);
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup && popup.classList.contains('open')) {
        closePopup();
    }
});

// Close on click outside
document.addEventListener('click', (e) => {
    if (popup && popup.classList.contains('open') && !popup.contains(e.target) && !e.target.closest('.country')) {
        closePopup();
    }
});

/**
 * Open popup with country data - simplified view
 */
function openPopup(countryName, data, countryElement = null) {
    popupCountry.textContent = getDisplayName(countryName);

    // Calculate cigarettes
    const cigarettes = data.cigarettes_per_day || calculateCigarettes(data.aqi);

    // Update AQI color bar at top
    if (popupAQIBar) {
        // Remove all AQI classes
        popupAQIBar.className = 'aqi-bar';
        // Add the appropriate class based on AQI
        popupAQIBar.classList.add(getAQIClass(data.aqi));
    }

    // Note: active class and colors are now managed in handleCountryClick
    // Just ensure the active element reference is set
    if (countryElement) {
        activeCountryElement = countryElement;
    }

    // Animate values
    animateValue(popupAQI, 0, data.aqi, 300);
    animateValue(popupCig, 0, cigarettes, 300, true);

    // Show note only for non-real-time data
    if (data.dataType === '2-year average' || data.dataType === 'estimated') {
        popupNote.textContent = 'Based on 2-year average data';
        popupNote.classList.remove('hidden');
    } else {
        popupNote.classList.add('hidden');
    }

    popup.classList.add('open');
}

/**
 * Close popup
 */
function closePopup() {
    if (popup) {
        popup.classList.remove('open');
    }
    // Remove active class from country
    if (activeCountryElement) {
        activeCountryElement.classList.remove('active');

        // Clear AQI color classes from the country
        clearCountryColors(activeCountryElement);

        activeCountryElement = null;
    }

    // Reset URL to home
    resetURL();
}

/**
 * Simple number animation with easing
 */
function animateValue(obj, start, end, duration, isCigarette = false) {
    if (isNaN(end)) {
        obj.textContent = end;
        return;
    }

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function: easeOutQuart for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 4);

        const current = eased * (end - start) + start;

        if (isCigarette) {
            obj.textContent = (Math.round(current * 10) / 10).toFixed(1) + ' 🚬';
        } else {
            obj.textContent = Math.floor(current);
        }

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.textContent = isCigarette ? parseFloat(end).toFixed(1) + ' 🚬' : Math.round(end);
        }
    };
    window.requestAnimationFrame(step);
}

/**
 * Preload major countries to eliminate hover delays
 */
async function preloadMajorCountries() {
    const majorCountries = [
        'United States', 'China', 'India', 'United Kingdom', 'Germany',
        'France', 'Japan', 'Brazil', 'Canada', 'Australia',
        'South Korea', 'Italy', 'Spain', 'Mexico', 'Indonesia',
        'Netherlands', 'Turkey', 'Saudi Arabia', 'Switzerland', 'Poland'
    ];
    console.log(`🚀 Starting preloading for ${majorCountries.length} major countries...`);

    // Batch size of 3 countries every 1.5 seconds to respect rate limits
    const batchSize = 3;
    for (let i = 0; i < majorCountries.length; i += batchSize) {
        const batch = majorCountries.slice(i, i + batchSize);
        batch.forEach(country => {
            fetchAQI(country).catch(() => { }); // Pre-populate cache
        });
        if (i + batchSize < majorCountries.length) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }
    console.log('✅ Preloading complete.');

    // Apply colors to all preloaded countries
    applyColorsToMap();
}

/**
 * Apply cached AQI colors to all countries on the map
 * NOTE: We no longer apply colors permanently - colors only show on hover/click
 */
function applyColorsToMap() {
    // Colors are now applied only on hover or click, not permanently
    // This function is kept for compatibility but does nothing
    console.log('🎨 Color logic updated: colors only show on hover/click');
}

// =========================================
// Map Rendering
// =========================================

async function initMap() {
    const svg = d3.select('#world-map');
    const width = 960;
    const height = 500;

    // Use Natural Earth projection for balanced world view
    const projection = d3.geoNaturalEarth1()
        .scale(160)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Create a group for all map elements (for zooming/panning)
    const g = svg.append('g');

    // Define zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8])  // Allow zooming from 1x to 8x
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Zoom control buttons
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const zoomReset = document.getElementById('zoom-reset');

    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            svg.transition().duration(300).call(zoom.scaleBy, 1.5);
        });
    }

    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            svg.transition().duration(300).call(zoom.scaleBy, 0.67);
        });
    }

    if (zoomReset) {
        zoomReset.addEventListener('click', () => {
            svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
        });
    }

    try {
        // Fetch world countries GeoJSON with better Kashmir coverage for India
        // Using Natural Earth 110m resolution for better accuracy
        const geoResponse = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const topology = await geoResponse.json();

        // Convert TopoJSON to GeoJSON
        const geoData = topojson.feature(topology, topology.objects.countries);

        const countries = g.selectAll('.country')
            .data(geoData.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('data-country', d => {
                // Normalize country name from GeoJSON to match our COUNTRY_DATA keys
                const rawName = d.properties.name || 'Unknown';

                // Common name mappings
                const nameMap = {
                    'United States of America': 'United States',
                    'Russian Federation': 'Russia',
                    'South Korea': 'South Korea',
                    'Korea': 'South Korea',
                    'United Republic of Tanzania': 'Tanzania',
                    'Democratic Republic of the Congo': 'Congo',
                    'Czech Republic': 'Czech Republic',
                    'United Arab Emirates': 'United Arab Emirates'
                };

                return nameMap[rawName] || rawName;
            })
            .on('mouseenter', handleMouseEnter)
            .on('mouseleave', handleMouseLeave)
            .on('click', handleCountryClick);

        console.log('✅ Map initialized successfully with zoom/pan enabled');

        // Update Footer
        const footerText = document.getElementById('active-sources-text');
        if (footerText) {
            footerText.textContent = 'WAQI';
        }

        console.log('\n📡 API Status: WAQI Active (Global Coverage)');

    } catch (error) {
        console.error('Error loading map:', error);
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .attr('fill', '#000000')
            .attr('font-family', 'Inter, sans-serif')
            .text('Error loading map data.');
    }
}

// =========================================
// Event Handlers
// =========================================

let currentHoveredCountry = null;
let currentHoveredElement = null;

async function handleMouseEnter(event, d) {
    const countryName = d3.select(this).attr('data-country') || d.properties.name || 'Unknown';

    if (currentHoveredCountry === countryName) return;

    // Clear color from previously hovered country (if not active)
    if (currentHoveredElement && currentHoveredElement !== activeCountryElement) {
        clearCountryColors(currentHoveredElement);
        d3.select(currentHoveredElement).classed('country-hovered', false);
    }

    currentHoveredCountry = countryName;
    currentHoveredElement = this;
    const element = d3.select(this);

    // Add hover class for CSS z-index control
    element.classed('country-hovered', true);

    // Move to front by re-appending (in SVG, last element renders on top)
    // But don't move if active country is set (keep active on top)
    if (!activeCountryElement) {
        this.parentNode.appendChild(this);
    }

    // Don't change color if this is the active (clicked) country - it already has its color
    if (element.classed('active')) {
        return;
    }

    // Check if we have cached data for instant feedback
    const cachedData = getCachedAQI(countryName);

    if (cachedData && !cachedData.error) {
        // Instant feedback with cached data
        const colorClass = getAQIClass(cachedData.aqi);
        clearCountryColors(this);
        element.classed(colorClass, true);
    } else {
        // Fetch data in background - apply color when ready
        fetchAQI(countryName).then(data => {
            // Only apply if still hovering this country and not active
            if (currentHoveredCountry === countryName && !element.classed('active') && !data.error) {
                const colorClass = getAQIClass(data.aqi);
                clearCountryColors(currentHoveredElement);
                element.classed(colorClass, true);
            }
        }).catch(err => {
            console.warn('AQI fetch failed for', countryName, err);
        });
    }
}

function clearCountryColors(element) {
    if (!element) return;

    // Remove ALL AQI color classes
    d3.select(element)
        .classed('loading', false)
        .classed('aqi-good', false)
        .classed('aqi-satisfactory', false)
        .classed('aqi-moderate', false)
        .classed('aqi-poor', false)
        .classed('aqi-very-poor', false)
        .classed('aqi-severe', false)
        .classed('aqi-hazardous', false);
}

function handleMouseLeave(event) {
    const element = d3.select(this);

    // Remove hover class
    element.classed('country-hovered', false);

    // Clear colors UNLESS this country is actively selected (clicked)
    if (!element.classed('active')) {
        clearCountryColors(this);
    }

    // Reset trackers only if leaving the current hovered element
    if (this === currentHoveredElement) {
        currentHoveredCountry = null;
        currentHoveredElement = null;
    }
}

async function handleCountryClick(event, d) {
    // Use data-country attribute for consistent naming
    const countryName = d3.select(this).attr('data-country') || d.properties.name || 'Unknown';
    const countryElement = this;
    const element = d3.select(this);

    // If clicking the same country that's already active, toggle popup closed
    if (activeCountryElement === countryElement && popup.classList.contains('open')) {
        closePopup();
        return;
    }

    // If there's a different active country, clear it first
    if (activeCountryElement && activeCountryElement !== countryElement) {
        d3.select(activeCountryElement).classed('active', false);
        clearCountryColors(activeCountryElement);
    }

    // Move clicked country to front
    this.parentNode.appendChild(this);

    // Add active class immediately for visual feedback
    element.classed('active', true);
    activeCountryElement = countryElement;

    // Fetch AQI data
    const data = await fetchAQI(countryName);

    if (data.error) {
        console.error('Failed to fetch AQI for', countryName);
        element.classed('active', false);
        activeCountryElement = null;
        return;
    }

    // Clear hover color and apply AQI color
    clearCountryColors(countryElement);
    const colorClass = getAQIClass(data.aqi);
    element.classed(colorClass, true);

    // Update URL for SEO
    updateURL(countryName);

    // Open popup with country data and element reference
    openPopup(countryName, data, countryElement);
}

// =========================================
// Theme Toggle
// =========================================

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('aqi-theme');

    // Apply saved theme or default to light
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('aqi-theme', 'light');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('aqi-theme', 'dark');
            }
        });
    }
}

// =========================================
// Initialize Application
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMap();

    // Start preloading after a short delay to prioritize initial map render
    setTimeout(preloadMajorCountries, 200);
});
// =========================================
// URL Routing for SEO
// =========================================

/**
 * Convert country name to URL-friendly slug
 */
function countryToSlug(countryName) {
    return countryName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

/**
 * Convert URL slug back to country name
 */
function slugToCountry(slug) {
    // Try to find exact match first
    const countries = document.querySelectorAll('.country');
    for (const country of countries) {
        const name = d3.select(country).datum()?.properties?.name;
        if (name && countryToSlug(name) === slug) {
            return name;
        }
    }
    return null;
}

/**
 * Update URL when country is clicked
 */
function updateURL(countryName) {
    try {
        const slug = countryToSlug(countryName);
        const newURL = `/${slug}`;

        // Update browser URL without reload
        window.history.pushState({ country: countryName }, '', newURL);

        // Update page title
        document.title = `${countryName} - Air Quality Index | AQIMap.fun`;
    } catch (error) {
        // Silently fail for file:// protocol or other errors
        console.warn('⚠️ Could not update URL (expected for file:// protocol):', error.message);
        // Still update the title
        document.title = `${countryName} - Air Quality Index | AQIMap.fun`;
    }
}

/**
 * Load country from URL on page load
 */
async function loadCountryFromURL() {
    const path = window.location.pathname;

    // If we're at root, do nothing
    if (path === '/' || path === '/index.html') {
        return;
    }

    // Extract slug from path
    const slug = path.replace(/^\//, '').replace(/\.html$/, '');

    if (!slug) return;

    // Find country by slug
    const countryName = slugToCountry(slug);

    if (!countryName) {
        console.warn('Country not found for slug:', slug);
        return;
    }

    // Find the country element
    const countries = document.querySelectorAll('.country');
    for (const countryElement of countries) {
        const name = d3.select(countryElement).datum()?.properties?.name;
        if (name === countryName) {
            // Fetch and show data
            const data = await fetchAQI(countryName);
            if (!data.error) {
                // Apply AQI color to country
                const colorClass = getAQIClass(data.aqi);
                d3.select(countryElement).classed(colorClass, true);

                // Open popup
                openPopup(countryName, data, countryElement);
            }
            break;
        }
    }
}

/**
 * Handle browser back/forward buttons
 */
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.country) {
        // User went back/forward to a country page
        loadCountryFromURL();
    } else {
        // User went back to home
        closePopup();
        document.title = 'AQIMap.fun - Global Air Quality Index Map';
    }
});

/**
 * Reset URL when popup is closed
 */
function resetURL() {
    try {
        window.history.pushState({}, '', '/');
        document.title = 'AQIMap.fun - Global Air Quality Index Map';
    } catch (error) {
        // Silently fail for file:// protocol
        console.warn('⚠️ Could not reset URL (expected for file:// protocol):', error.message);
        // Still update the title
        document.title = 'AQIMap.fun - Global Air Quality Index Map';
    }
}

// Load country from URL when page loads
window.addEventListener('load', () => {
    // Small delay to ensure map is rendered
    setTimeout(loadCountryFromURL, 500);
});
