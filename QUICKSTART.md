# ◼ QUICK START GUIDE

## Setup in 3 Steps

### Step 1: Get API Key (2 mins)

```
1. Go to: https://openweathermap.org/api
2. Click "Sign Up" (free account)
3. Verify email
4. Go to: https://openweathermap.org/api/one-call-3
5. Copy your API key
6. Open `.env` file
7. Replace: VITE_OPENWEATHER_API_KEY=YOUR_API_KEY_HERE
```

### Step 2: Install & Run (1 min)

```bash
npm install
npm run dev
```

### Step 3: Open Browser

```
→ http://localhost:5173
```

---

## ✨ Features to Try

### Search Cities

- Type city name in search box
- Click "FIND"
- View saved in "SAVED CITIES" section

### Toggle Temperature

- Click `°C` or `°F` button in top right
- Affects all temperatures

### Geolocation

- Allow browser geolocation on first load
- Auto-detects your location

### Save Cities

- Search cities automatically saves them
- Click city in "SAVED CITIES" to open
- Click ✕ to remove

### View Forecast

- See 5-day forecast below current weather
- Shows high/low temps and conditions

---

## 🔑 API Key Troubleshooting

### "Failed to fetch weather data"

1. Check `.env` file has API key
2. Go to openweathermap.org → API section
3. Verify key is "Active" (not disabled)
4. Wait 10 minutes after creating (they can take time)
5. Check browser console (F12) for exact error

### "City not found"

- Spelling might be wrong
- Try with country code: "London, UK"
- Some very small cities aren't indexed

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] API key works locally
- [ ] All features tested
- [ ] Search works for multiple cities
- [ ] Forecast displays correctly
- [ ] Temperature toggle works
- [ ] Responsive design looks good on mobile

**Deploy to:**

- **Vercel**: npm run build → deploy dist/
- **Netlify**: npm run build → deploy dist/
- Remember to add API key to hosting env vars!

---

## 📋 Project Structure

```
project/
├── src/
│   ├── App.jsx              ← Main component (300 lines)
│   ├── App.css              ← Styles (400 lines)
│   ├── index.css            ← Global (30 lines)
│   └── main.jsx             ← Entry (10 lines)
├── index.html               ← Template (15 lines)
├── vite.config.js           ← Config (15 lines)
├── package.json             ← Dependencies
├── .env                     ← API key (KEEP PRIVATE)
└── README.md                ← Full docs
```

---

## 💡 Tips

1. **Save multiple cities** for quick access
2. **Use °F/°C toggle** for different countries
3. **Refresh page** - localStorage persists saved cities
4. **Check browser console** (F12) for API errors
5. **Free tier limit**: 1000 calls/day (plenty!)

---

## 🎨 Design

**BRUTALISM** means:

- Bold, stark, no decorations
- Dark theme (black & white only)
- Large borders, simple layout
- Monospace font (technical feel)
- Maximum information density

It's intentionally harsh. That's the point.

---

## ❓ FAQ

**Q: Can I use someone else's API key?**  
A: Not recommended. Create free account at openweathermap.org

**Q: Will my API key be exposed?**  
A: On frontend, yes. But free tier has low limits anyway. Consider backend proxy for production.

**Q: Can I change the design?**  
A: Yes! Edit `src/App.css`. But it's brutalism - keep it harsh!

**Q: How many API calls does this use?**  
A: ~2 per search + 1 per city load + optional hourly auto-updates = very low

**Q: Can I add more features?**  
A: Yes! See "Future Enhancements" in README.md

---

**Ready? Run `npm install && npm run dev`**

**Let's go. No excuses. BRUTAL.**
