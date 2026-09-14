# 🏷️ PriceHunt — Multi-Retailer Price Comparison Engine

[![GitHub Repository](https://img.shields.io/badge/GitHub-Rajesh03--B%2Fpricehunt-blue?logo=github)](https://github.com/Rajesh03-B/pricehunt)

PriceHunt is a smart price comparison web application that empowers shoppers to search for any product and instantly discover where it is available for the lowest price across major Indian and global e-commerce platforms (Amazon India, Flipkart, Croma, Reliance Digital, Vijay Sales, Tata CLiQ, Poorvika, and Amazon Global).

---

## 🔗 Repository
- **GitHub URL**: [https://github.com/Rajesh03-B/pricehunt.git](https://github.com/Rajesh03-B/pricehunt.git)

---

## 🚀 Key Features

1. **Multi-Store Price Comparison**:
   - Simultaneously scans prices, shipping costs, delivery times, seller ratings, and stock status across 8 major retailers.
   - Computes total cost (Base Price + Shipping) to determine the genuine lowest price.

2. **Cheapest Deal Spotlight 🏆**:
   - Prominently highlights the retailer with the best deal.
   - Calculates total savings and discount percentage vs. MSRP and competitor prices.
   - Direct link to purchase the product from the retailer.

3. **Universal Search & Custom Query Synthesizer**:
   - Autocomplete suggestions for top trending electronics, smartphones, laptops, audio, consoles, and cameras.
   - **Dynamic Query Synthesizer**: Search for *any* product (e.g., `"RTX 4080"`, `"Mechanical Keyboard"`, `"Bose QC Ultra"`) and the engine dynamically generates a real-time multi-store comparative analysis.

4. **Interactive 30/60/90-Day Price Trend Charts**:
   - Pure SVG-rendered historical price graph showing lowest store price, market average, and highest store price.
   - Interactive hover tooltips showing date and price points.

5. **Smart AI Buy Recommendation**:
   - Gauges whether the current lowest price is an all-time low ("Spectacular Deal - Buy Now") or near MSRP ("Wait / Set Alert").

6. **Price Drop Alert & Watchlist**:
   - Save favorite products to a local watchlist with a custom target price threshold.
   - Includes a built-in simulation button to test instant price drop notifications.

7. **Multi-Currency Support**:
   - Live toggling between **USD ($)**, **EUR (€)**, **GBP (£)**, and **INR (₹)**.

8. **Theme Toggle**:
   - Modern light and dark modes with persistent local preferences.

---

## 📂 Project Structure

```text
price-finder/
├── index.html       # Single-page application UI layout and components
├── styles.css       # Clean, modern responsive design with glassmorphism & dark mode
├── app.js           # Core comparison engine, catalog, charting, & watchlist logic
├── server.js        # Optional zero-dependency Node.js HTTP server & REST API
└── README.md        # Documentation and usage guide
```

---

## 🏃 How to Run

### Option 1: Direct Browser Launch (Easiest — No installation needed!)
Simply double-click [`index.html`](file:///C:/Users/DELL%203400/.gemini/antigravity/scratch/price-finder/index.html) or open it directly in Chrome, Edge, or Firefox.

### Option 2: Run via Node.js
If you have Node.js or want to use Antigravity's built-in runtime:
```powershell
node server.js
```
Then visit: `http://localhost:3000`

---

## 💡 Setting as Active Workspace
To open this project directly in Antigravity or VS Code:
1. Go to **File -> Open Folder...**
2. Navigate to and select:
   `C:\Users\DELL 3400\.gemini\antigravity\scratch\price-finder`
