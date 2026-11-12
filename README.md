
neobweather.vercel.app


# ◼ WEATHER — BRUTALIST EDITION

## Raw. Bold. Uncompromising.

A minimalist brutalism weather application built with React, Vite, and Open-Meteo. No fluff. Just data and stark typography.

---

## 🎨 DESIGN PHILOSOPHY

**BRUTALISM**: Raw materials, bold forms, stark typography. No gradients. No rounded corners. Just **BLACK**, **WHITE**, and **TRUTH**.

- **Typography**: Courier New (monospace) - 700+ weight
- **Color**: Pure black (#000) and pure white (#fff)
- **Borders**: 2-3px solid lines
- **Philosophy**: "Form follows function"

---

<h1>vercel link</ h1>
<br><br>
neobweather.vercel.app







## ✨ FEATURES

✅ **Current Weather** - Temperature, feels-like, weather condition  
✅ **5-Day Forecast** - Daily breakdown with high/low temps  
✅ **City Search** - Search by city name  
✅ **Geolocation** - Auto-detect user location on first load  
✅ **Temperature Toggle** - Switch between °C and °F  
✅ **Multiple Saved Cities** - Save favorite cities (localStorage)  
✅ **Detailed Metrics** - Humidity, pressure, wind speed, visibility  
✅ **Weather Icons** - Unicode-based minimalist icons  
✅ **Responsive Design** - Desktop, tablet, mobile  
✅ **No Backend Needed** - Direct API calls only

---

## 🚀 QUICK START

### 1. Create `.env` file

Copy from `.env.example`:

```bash
No API key is required.
```

### 2. Weather Data Provider

Open-Meteo provides the weather data without an API key or account.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

Outputs to `dist/` folder - deploy to any static host (Vercel, Netlify, etc.)

---

## 📦 DEPENDENCIES

| Package             | Purpose                   |
| ------------------- | ------------------------- |
| **React 18**        | UI framework              |
| **Vite**            | Ultra-fast build tool     |
| **Open-Meteo**      | Weather data source       |

---

## 🎯 KEY FEATURES EXPLAINED

### Current Weather Display

- Large temperature display
- Weather condition with description
- Feels-like temperature
- Humidity, pressure, wind speed
- Visibility and UV index

### 5-Day Forecast

- Daily forecast cards
- High/low temperatures
- Weather icons
- Clickable (future enhancement)

### City Management

- Search any city globally
- Auto-save to localStorage
- Quick access to saved cities
- One-click deletion

### Temperature Conversion

- Toggle between Celsius and Fahrenheit
- Applies to all displays
- Persists on page reload

### Geolocation

- Auto-detects user location on first load
- Falls back to "London" if denied
- Uses longitude/latitude for accurate weather

---

## 🛠️ STRUCTURE

```
project/
├── src/
│   ├── App.jsx           # Main weather component
│   ├── App.css          # Brutalism styles
│   ├── index.css        # Global styles
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies
├── .env                 # API key (DON'T COMMIT)
└── .env.example         # Template
```

---

## 🔌 API ENDPOINTS USED

```
GET /api/weather?q={city}
GET /api/weather?q={latitude},{longitude}
```

---

## 💾 DATA STORAGE

**localStorage** (browser only, no backend):

- Saved cities list
- Persists across page reloads
- ~50KB limit per domain

---

## 📱 RESPONSIVE BREAKPOINTS

| Screen  | Breakpoint | Changes          |
| ------- | ---------- | ---------------- |
| Desktop | >768px     | Full grid layout |
| Tablet  | 481-768px  | 2-column details |
| Mobile  | <480px     | 1-column layout  |

---

## 🎨 BRUTALISM DESIGN DETAILS

- **No shadows** - Only borders
- **No rounded corners** - 0px radius
- **No animations** - Except loading pulse (functional)
- **No gradients** - Solid colors
- **No special fonts** - System monospace
- **High contrast** - Max readability
- **Large borders** - 2-3px emphasis
- **Bold typography** - 700+ weights

This is intentional. This is **BRUTALISM**.

---

## 🐛 TROUBLESHOOTING

### API Key Error

```
Error: Failed to fetch weather data
```

✅ Confirm the Open-Meteo service is reachable

### City Not Found

```
Error: City "XYZ" not found
```

✅ Check spelling  
✅ Try with country code: "London, UK"  
✅ Some small cities may not be indexed

### Geolocation Denied

✅ Browser will use "London" as default  
✅ Search for your city manually  
✅ Allow geolocation in browser settings

---

## 🚀 DEPLOYMENT

### Vercel (Recommended)

```bash
npm run build
# Deploy the project to Vercel
# No environment variable is required
```

### Netlify

```bash
npm run build
# Drag dist/ folder to Netlify
# Add env variable in Settings
```

### GitHub Pages

```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

---

## 📄 LICENSE

Public domain. Do what you want.

---

## 🎯 FUTURE ENHANCEMENTS

- [ ] Air quality index (AQI)
- [ ] Hourly breakdown
- [ ] Weather alerts
- [ ] Map view
- [ ] Dark/light theme toggle (ironic for brutalism)
- [ ] Multiple language support
- [ ] Favorites with drag-reorder

---

## 👨‍💻 AUTHOR

Built with brutalist principles and zero compromise.

**WEATHER** ◼  
**BRUTALIST** ◼  
**UNFILTERED** ◼

---

**Website**: https://open-meteo.com/
**API Docs**: https://open-meteo.com/en/docs

**Ready to check the weather? GET HARSH. GET BRUTAL.**
# neoweather
