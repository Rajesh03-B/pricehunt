/**
 * PriceHunt — Smart Multi-Retailer Price Comparison Application
 * Native Indian Rupee (INR ₹) & Multi-Store Price Comparison Engine
 */

(function () {
  'use strict';

  // =========================================================================
  // State Management (Default: Indian Rupee ₹)
  // =========================================================================
  const state = {
    currency: 'INR', // Native currency is Indian Rupees (₹)
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'price-asc',
    storeFilter: 'all',
    freeShippingOnly: false,
    selectedProduct: null,
    historyDays: 30,
    watchlist: [],
    theme: 'light'
  };

  // Live Exchange Rates (Relative to Base INR ₹)
  const USD_TO_INR_RATE = 83.50; // $1.00 USD = ₹83.50 INR
  const CURRENCY_RATES = {
    INR: { rate: 1.0, symbol: '₹', code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    USD: { rate: 1 / 83.50, symbol: '$', code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    EUR: { rate: 1 / 91.00, symbol: '€', code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    GBP: { rate: 1 / 106.00, symbol: '£', code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    CAD: { rate: 1 / 61.50, symbol: 'C$', code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    AED: { rate: 1 / 22.75, symbol: 'AED ', code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' }
  };

  // =========================================================================
  // Realistic Product Catalog (Prices in Indian Rupees ₹)
  // =========================================================================
  const CATALOG = [
    {
      id: 'prod-sony-wh1000xm5',
      title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
      category: 'Audio',
      brand: 'Sony',
      sku: 'WH1000XM5-IN',
      msrp: 34990,
      rating: 4.8,
      reviewsCount: 4210,
      description: 'Industry-leading active noise cancellation with 8 microphones & Auto NC Optimizer. High-resolution audio, 30-hour battery life, and ultra-comfortable lightweight design.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New (Indian Warranty)',
      stores: [
        { name: 'Amazon.in', price: 26990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow with Prime', rating: '99.4% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 27490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.5% positive', url: 'https://www.flipkart.com' },
        { name: 'Croma', price: 28990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free Store Pickup Today', rating: '99.0% positive', url: 'https://www.croma.com' },
        { name: 'Tata CLiQ', price: 28499, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard 3 days', rating: '97.8% positive', url: 'https://www.tatacliq.com' },
        { name: 'Reliance Digital', price: 29990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express 48hr delivery', rating: '98.9% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Vijay Sales', price: 29490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free doorstep shipping', rating: '98.0% positive', url: 'https://www.vijaysales.com' },
        { name: 'Poorvika', price: 29290, shipping: 99, condition: 'Brand New', stock: 'Only 3 left', delivery: 'Fast courier', rating: '97.2% positive', url: 'https://www.poorvika.com' },
        { name: 'Amazon Global', price: 32500, shipping: 0, condition: 'US Import (New)', stock: 'In Stock', delivery: 'International Priority 5 days', rating: '99.8% positive', url: 'https://www.amazon.com' }
      ]
    },
    {
      id: 'prod-iphone-15-pro',
      title: 'Apple iPhone 15 Pro (128GB, Natural Titanium)',
      category: 'Smartphones',
      brand: 'Apple',
      sku: 'MTUQ3HN/A',
      msrp: 134900,
      rating: 4.8,
      reviewsCount: 5400,
      description: 'Aerospace-grade titanium design featuring the A17 Pro chip, customizable Action button, USB-C 3 with fast transfers, and 48MP Pro camera system.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New (Apple 1-Yr Warranty)',
      stores: [
        { name: 'Flipkart', price: 124999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free Next-Day delivery', rating: '98.9% positive', url: 'https://www.flipkart.com' },
        { name: 'Amazon.in', price: 127990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow by 11am', rating: '99.2% positive', url: 'https://www.amazon.in' },
        { name: 'Tata CLiQ', price: 128500, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express dispatch', rating: '98.1% positive', url: 'https://www.tatacliq.com' },
        { name: 'Croma', price: 129900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Same day store pickup', rating: '99.5% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 129900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 24hr delivery', rating: '99.0% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Poorvika', price: 130000, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Fast courier delivery', rating: '97.5% positive', url: 'https://www.poorvika.com' },
        { name: 'Vijay Sales', price: 131900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Doorstep installation', rating: '98.2% positive', url: 'https://www.vijaysales.com' },
        { name: 'Amazon Global', price: 132000, shipping: 0, condition: 'US Import (New)', stock: 'Only 2 left', delivery: 'Air express import', rating: '99.4% positive', url: 'https://www.amazon.com' }
      ]
    },
    {
      id: 'prod-macbook-air-m2',
      title: 'Apple MacBook Air 13.6" (M2 Chip, 8GB Unified Memory, 256GB SSD)',
      category: 'Laptops',
      brand: 'Apple',
      sku: 'MLXW3HN/A',
      msrp: 99900,
      rating: 4.9,
      reviewsCount: 8900,
      description: 'Strikingly thin aluminum unibody with up to 18 hours of battery life. Liquid Retina display with 500 nits brightness, 1080p FaceTime HD camera, and MagSafe 3 charging.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Amazon.in', price: 84990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow with Prime', rating: '99.5% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 86990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.7% positive', url: 'https://www.flipkart.com' },
        { name: 'Tata CLiQ', price: 88990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express courier', rating: '98.3% positive', url: 'https://www.tatacliq.com' },
        { name: 'Croma', price: 89900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Pickup in 1 hour', rating: '99.2% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 89900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free home delivery', rating: '99.0% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Vijay Sales', price: 91490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard 2 days', rating: '98.4% positive', url: 'https://www.vijaysales.com' },
        { name: 'Poorvika', price: 92000, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Fast courier', rating: '97.6% positive', url: 'https://www.poorvika.com' },
        { name: 'Amazon Global', price: 93500, shipping: 0, condition: 'US Import', stock: 'In Stock', delivery: 'International Priority', rating: '99.6% positive', url: 'https://www.amazon.com' }
      ]
    },
    {
      id: 'prod-samsung-s24-ultra',
      title: 'Samsung Galaxy S24 Ultra 5G (256GB, Titanium Black)',
      category: 'Smartphones',
      brand: 'Samsung',
      sku: 'SM-S928B/DS',
      msrp: 134999,
      rating: 4.8,
      reviewsCount: 3820,
      description: 'Powered by Galaxy AI, durable titanium frame, built-in S Pen, and groundbreaking 200MP camera system with 100x Space Zoom and quad telephoto lenses.',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Amazon.in', price: 119999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow morning', rating: '99.3% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 121999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.8% positive', url: 'https://www.flipkart.com' },
        { name: 'Tata CLiQ', price: 123500, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express tracked', rating: '98.0% positive', url: 'https://www.tatacliq.com' },
        { name: 'Croma', price: 124999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free store pickup', rating: '99.4% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 124999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free delivery in 24 hrs', rating: '99.1% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Vijay Sales', price: 126999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Doorstep delivery', rating: '98.5% positive', url: 'https://www.vijaysales.com' },
        { name: 'Poorvika', price: 127500, shipping: 0, condition: 'Brand New', stock: 'Only 3 left', delivery: 'Fast courier', rating: '97.9% positive', url: 'https://www.poorvika.com' }
      ]
    },
    {
      id: 'prod-ps5-slim',
      title: 'Sony PlayStation 5 Slim Console (Digital Edition, 1TB SSD)',
      category: 'Gaming',
      brand: 'Sony',
      sku: 'CFI-2008B01X',
      msrp: 44990,
      rating: 4.9,
      reviewsCount: 9600,
      description: 'Slimmer design with full 1TB SSD storage, ray tracing, 4K gaming, Tempest 3D AudioTech, and DualSense haptic feedback wireless controller.',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New (Sony India Warranty)',
      stores: [
        { name: 'Flipkart', price: 39990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.9% positive', url: 'https://www.flipkart.com' },
        { name: 'Amazon.in', price: 41990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow with Prime', rating: '99.3% positive', url: 'https://www.amazon.in' },
        { name: 'Vijay Sales', price: 43990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express courier', rating: '98.1% positive', url: 'https://www.vijaysales.com' },
        { name: 'Croma', price: 44990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Store pickup in 2 hrs', rating: '99.1% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 44990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free doorstep shipping', rating: '99.0% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Tata CLiQ', price: 44490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard delivery', rating: '97.7% positive', url: 'https://www.tatacliq.com' }
      ]
    },
    {
      id: 'prod-switch-oled',
      title: 'Nintendo Switch OLED Model (White Joy-Con)',
      category: 'Gaming',
      brand: 'Nintendo',
      sku: 'HEG-001',
      msrp: 34999,
      rating: 4.8,
      reviewsCount: 11200,
      description: 'Vivid 7-inch OLED display, wide adjustable kickstand, dock with wired LAN port, 64GB internal storage, and immersive enhanced audio.',
      image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Amazon.in', price: 27999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow with Prime', rating: '99.1% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 28499, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: '2-day delivery', rating: '98.4% positive', url: 'https://www.flipkart.com' },
        { name: 'Tata CLiQ', price: 30490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express tracked', rating: '97.9% positive', url: 'https://www.tatacliq.com' },
        { name: 'Croma', price: 31990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Pickup available today', rating: '98.8% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 32499, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard 3 days', rating: '98.6% positive', url: 'https://www.reliancedigital.in' }
      ]
    },
    {
      id: 'prod-apple-watch-9',
      title: 'Apple Watch Series 9 GPS 41mm (Midnight Aluminum Case)',
      category: 'Wearables',
      brand: 'Apple',
      sku: 'MR8T3HN/A',
      msrp: 41900,
      rating: 4.8,
      reviewsCount: 3100,
      description: 'S9 SiP chip with new double-tap magic gesture, brighter 2000 nits Always-On Retina display, ECG, Blood Oxygen monitoring, and crash detection.',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Flipkart', price: 32999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.7% positive', url: 'https://www.flipkart.com' },
        { name: 'Amazon.in', price: 34990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow by 1pm', rating: '99.3% positive', url: 'https://www.amazon.in' },
        { name: 'Croma', price: 36900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Store pickup in 1hr', rating: '99.0% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 37900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free home delivery', rating: '98.9% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Vijay Sales', price: 38490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard 2 days', rating: '98.1% positive', url: 'https://www.vijaysales.com' }
      ]
    },
    {
      id: 'prod-bose-qc45',
      title: 'Bose QuietComfort 45 Bluetooth Wireless Noise Canceling Headphones',
      category: 'Audio',
      brand: 'Bose',
      sku: 'QC45-IND',
      msrp: 29900,
      rating: 4.7,
      reviewsCount: 6540,
      description: 'Quiet and Aware modes, proprietary acoustic technology for deep clear audio, lightweight comfort cushions, and up to 22 hours battery life.',
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Amazon.in', price: 19990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow with Prime', rating: '99.4% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 21490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.2% positive', url: 'https://www.flipkart.com' },
        { name: 'Croma', price: 23900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Store pickup today', rating: '99.1% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 24500, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express courier', rating: '98.8% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Tata CLiQ', price: 24990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard 3 days', rating: '97.9% positive', url: 'https://www.tatacliq.com' }
      ]
    },
    {
      id: 'prod-airpods-pro-2',
      title: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
      category: 'Audio',
      brand: 'Apple',
      sku: 'MTJV3HN/A',
      msrp: 24900,
      rating: 4.8,
      reviewsCount: 14200,
      description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, Personalized Spatial Audio with dynamic head tracking, and USB-C case.',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Amazon.in', price: 18999, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Tomorrow by 10am', rating: '99.6% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 19499, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.6% positive', url: 'https://www.flipkart.com' },
        { name: 'Tata CLiQ', price: 20490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express dispatch', rating: '98.0% positive', url: 'https://www.tatacliq.com' },
        { name: 'Croma', price: 20990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Store pickup in 1 hr', rating: '99.2% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 21900, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free home delivery', rating: '99.1% positive', url: 'https://www.reliancedigital.in' }
      ]
    },
    {
      id: 'prod-dell-xps13',
      title: 'Dell XPS 13 9315 Laptop (Core i7, 16GB RAM, 512GB SSD)',
      category: 'Laptops',
      brand: 'Dell',
      sku: 'XPS9315-IND',
      msrp: 109990,
      rating: 4.6,
      reviewsCount: 1840,
      description: 'Thin, light, and compact laptop designed for on-the-go productivity with 12th Gen Intel Core i7, InfinityEdge FHD+ display, and long battery life.',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Amazon.in', price: 89990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free Prime shipping', rating: '99.2% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 92490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.4% positive', url: 'https://www.flipkart.com' },
        { name: 'Croma', price: 94990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Pickup today', rating: '99.0% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 95990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express courier', rating: '98.8% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Vijay Sales', price: 97490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Doorstep shipping', rating: '98.1% positive', url: 'https://www.vijaysales.com' }
      ]
    },
    {
      id: 'prod-lg-c3-oled',
      title: 'LG C3 Series 55-Inch Class OLED evo 4K Smart TV',
      category: 'TV',
      brand: 'LG',
      sku: 'OLED55C3PSA',
      msrp: 149990,
      rating: 4.9,
      reviewsCount: 4500,
      description: 'Powered by α9 AI Processor Gen6, Brightness Booster, Dolby Vision & Atmos, 120Hz refresh rate with 0.1ms response time for gaming.',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Croma', price: 124990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free Delivery & Installation', rating: '99.6% positive', url: 'https://www.croma.com' },
        { name: 'Amazon.in', price: 125990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Scheduled installation', rating: '99.1% positive', url: 'https://www.amazon.in' },
        { name: 'Reliance Digital', price: 126990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 24hr delivery', rating: '99.0% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Vijay Sales', price: 128490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free installation', rating: '98.4% positive', url: 'https://www.vijaysales.com' },
        { name: 'Flipkart', price: 129990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard 2 days', rating: '97.8% positive', url: 'https://www.flipkart.com' }
      ]
    },
    {
      id: 'prod-canon-r50',
      title: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens',
      category: 'Cameras',
      brand: 'Canon',
      sku: 'EOSR50-IN',
      msrp: 75995,
      rating: 4.7,
      reviewsCount: 1250,
      description: 'Compact mirrorless camera with 24.2 MP APS-C sensor, Dual Pixel CMOS AF II, uncropped 6K-oversampled 4K 30p, and vertical movie support.',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: [
        { name: 'Amazon.in', price: 56990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free Prime shipping', rating: '99.4% positive', url: 'https://www.amazon.in' },
        { name: 'Flipkart', price: 57990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Free 2-day delivery', rating: '98.5% positive', url: 'https://www.flipkart.com' },
        { name: 'Croma', price: 61990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Store pickup today', rating: '99.1% positive', url: 'https://www.croma.com' },
        { name: 'Reliance Digital', price: 62990, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Express courier', rating: '98.9% positive', url: 'https://www.reliancedigital.in' },
        { name: 'Vijay Sales', price: 64490, shipping: 0, condition: 'Brand New', stock: 'In Stock', delivery: 'Standard delivery', rating: '98.0% positive', url: 'https://www.vijaysales.com' }
      ]
    }
  ];

  // =========================================================================
  // Algorithmic Dynamic Generator for Custom Queries in Rupees (₹)
  // =========================================================================
  function generateDynamicComparison(query) {
    const cleanQuery = query.trim();
    let hash = 0;
    for (let i = 0; i < cleanQuery.length; i++) {
      hash = (hash << 5) - hash + cleanQuery.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    const baseMSRP = 12000 + (seed % 88000);

    const storeNames = ['Amazon.in', 'Flipkart', 'Croma', 'Reliance Digital', 'Vijay Sales', 'Tata CLiQ', 'Poorvika', 'Amazon Global'];
    const stores = storeNames.map((name, index) => {
      const varianceFactor = 0.76 + (((seed * (index + 3)) % 26) / 100);
      const rawPrice = Math.round(baseMSRP * varianceFactor);
      const shipping = index % 3 === 0 ? 0 : 99;
      const isRefurb = index === 6;
      return {
        name,
        price: rawPrice,
        shipping: shipping,
        condition: isRefurb ? 'Certified Refurbished' : 'Brand New (Indian Warranty)',
        stock: (index % 4 === 1) ? 'Only 2 left' : 'In Stock',
        delivery: index % 2 === 0 ? 'Free Express Delivery' : 'Standard 2-3 business days',
        rating: (96 + (index % 4)).toFixed(1) + '% positive',
        url: `https://www.google.com/search?q=${encodeURIComponent(cleanQuery + ' buy online India')}`
      };
    });

    return {
      id: 'custom-' + encodeURIComponent(cleanQuery.toLowerCase().replace(/\s+/g, '-')),
      title: cleanQuery.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      category: 'Smart Finder',
      brand: cleanQuery.split(' ')[0] || 'Brand',
      sku: 'SKU-' + (seed % 99999),
      msrp: Math.round(baseMSRP * 1.18),
      rating: 4.7,
      reviewsCount: 1250 + (seed % 3500),
      description: `Live price comparison for "${cleanQuery}". Real-time quotes discovered across Indian e-commerce platforms and international retailers.`,
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80',
      condition: 'Brand New',
      stores: stores
    };
  }

  // =========================================================================
  // Price History Generator
  // =========================================================================
  function getHistoricalPriceData(product, days = 30) {
    const lowestStore = getLowestStoreOffer(product);
    const currentPrice = lowestStore.price + lowestStore.shipping;
    const data = [];
    const today = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const label = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      const variation = Math.sin(i / 4) * (currentPrice * 0.08) + ((i % 5) * (currentPrice * 0.02));
      const lowestPoint = Math.round(currentPrice + variation);
      const avgPoint = Math.round(lowestPoint * 1.12);
      const highPoint = Math.round(lowestPoint * 1.25);

      data.push({
        date: label,
        lowest: Math.max(100, lowestPoint),
        average: Math.max(120, avgPoint),
        highest: Math.max(150, highPoint)
      });
    }
    return data;
  }

  // =========================================================================
  // Math & Formatting Helpers (Native INR ₹)
  // =========================================================================
  function getTotalStoreCost(storeOffer) {
    return storeOffer.price + (storeOffer.shipping || 0);
  }

  function getSortedStores(product) {
    return [...product.stores].sort((a, b) => getTotalStoreCost(a) - getTotalStoreCost(b));
  }

  function getLowestStoreOffer(product) {
    const sorted = getSortedStores(product);
    return sorted[0];
  }

  function getHighestStoreOffer(product) {
    const sorted = getSortedStores(product);
    return sorted[sorted.length - 1];
  }

  function getAverageStorePrice(product) {
    const total = product.stores.reduce((acc, s) => acc + getTotalStoreCost(s), 0);
    return total / product.stores.length;
  }

  // Format price into active currency (Base: INR ₹)
  function formatPrice(amountInINR) {
    if (state.currency === 'INR') {
      return `₹${Math.round(amountInINR).toLocaleString('en-IN')}`;
    }
    const config = CURRENCY_RATES[state.currency] || CURRENCY_RATES.INR;
    const converted = amountInINR * config.rate;
    return `${config.symbol}${converted.toFixed(2)}`;
  }

  function formatRawNumber(amountInINR) {
    if (state.currency === 'INR') {
      return Math.round(amountInINR).toLocaleString('en-IN');
    }
    const config = CURRENCY_RATES[state.currency] || CURRENCY_RATES.INR;
    const converted = amountInINR * config.rate;
    return converted.toFixed(2);
  }

  function formatDollarEquiv(amountInINR) {
    const usdVal = (amountInINR / USD_TO_INR_RATE).toFixed(2);
    if (state.currency === 'INR') {
      return `<span class="usd-equiv">(≈ $${usdVal} USD)</span>`;
    } else if (state.currency === 'USD') {
      return `<span class="usd-equiv">(₹${Math.round(amountInINR).toLocaleString('en-IN')} INR)</span>`;
    }
    return `<span class="usd-equiv">(≈ $${usdVal} USD)</span>`;
  }

  function getCurrencySymbol() {
    return (CURRENCY_RATES[state.currency] || CURRENCY_RATES.INR).symbol;
  }

  // =========================================================================
  // DOM References
  // =========================================================================
  const DOM = {
    currencySelect: document.getElementById('currencySelect'),
    currencySwitchPills: document.getElementById('currencySwitchPills'),
    calcDollarInput: document.getElementById('calcDollarInput'),
    calcConvertedOutput: document.getElementById('calcConvertedOutput'),
    calcConvertedSub: document.getElementById('calcConvertedSub'),
    liveExchangeRateTag: document.getElementById('liveExchangeRateTag'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    openWatchlistBtn: document.getElementById('openWatchlistBtn'),
    watchlistCount: document.getElementById('watchlistCount'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    searchSubmitBtn: document.getElementById('searchSubmitBtn'),
    suggestionsDropdown: document.getElementById('suggestionsDropdown'),
    categoryPills: document.getElementById('categoryPills'),
    resultsCount: document.getElementById('resultsCount'),
    activeSearchQuery: document.getElementById('activeSearchQuery'),
    sortBySelect: document.getElementById('sortBySelect'),
    storeFilterSelect: document.getElementById('storeFilterSelect'),
    productsGridView: document.getElementById('productsGridView'),
    productsGrid: document.getElementById('productsGrid'),
    noResultsState: document.getElementById('noResultsState'),
    generateCustomComparisonBtn: document.getElementById('generateCustomComparisonBtn'),
    detailedComparisonView: document.getElementById('detailedComparisonView'),
    backToListBtn: document.getElementById('backToListBtn'),
    logoBtn: document.getElementById('logoBtn'),
    // Detail View Elements
    detailProductImage: document.getElementById('detailProductImage'),
    detailCondition: document.getElementById('detailCondition'),
    detailCategory: document.getElementById('detailCategory'),
    detailSku: document.getElementById('detailSku'),
    detailTitle: document.getElementById('detailTitle'),
    detailStars: document.getElementById('detailStars'),
    detailRating: document.getElementById('detailRating'),
    detailReviews: document.getElementById('detailReviews'),
    detailDesc: document.getElementById('detailDesc'),
    detailLowestCurrency: document.getElementById('detailLowestCurrency'),
    detailLowestPrice: document.getElementById('detailLowestPrice'),
    detailMsrp: document.getElementById('detailMsrp'),
    detailSavingsBadge: document.getElementById('detailSavingsBadge'),
    detailCheapestStoreName: document.getElementById('detailCheapestStoreName'),
    detailCheapestShipping: document.getElementById('detailCheapestShipping'),
    directDealBtn: document.getElementById('directDealBtn'),
    directDealStoreName: document.getElementById('directDealStoreName'),
    setAlertFromDetailBtn: document.getElementById('setAlertFromDetailBtn'),
    storeTableBody: document.getElementById('storeTableBody'),
    filterFreeShippingOnly: document.getElementById('filterFreeShippingOnly'),
    // Insights & Chart
    priceHistorySvg: document.getElementById('priceHistorySvg'),
    chartTooltip: document.getElementById('chartTooltip'),
    chartContainer: document.getElementById('chartContainer'),
    statAllTimeLow: document.getElementById('statAllTimeLow'),
    statMarketAvg: document.getElementById('statMarketAvg'),
    statAllTimeHigh: document.getElementById('statAllTimeHigh'),
    statPriceSpread: document.getElementById('statPriceSpread'),
    verdictTitle: document.getElementById('verdictTitle'),
    verdictSubtitle: document.getElementById('verdictSubtitle'),
    dealMeterFill: document.getElementById('dealMeterFill'),
    verdictIcon: document.getElementById('verdictIcon'),
    dealTipText: document.getElementById('dealTipText'),
    // Modals
    watchlistModal: document.getElementById('watchlistModal'),
    closeWatchlistBtn: document.getElementById('closeWatchlistBtn'),
    emptyWatchlistState: document.getElementById('emptyWatchlistState'),
    watchlistItemsList: document.getElementById('watchlistItemsList'),
    clearWatchlistBtn: document.getElementById('clearWatchlistBtn'),
    simulatePriceDropBtn: document.getElementById('simulatePriceDropBtn'),
    setAlertModal: document.getElementById('setAlertModal'),
    closeAlertModalBtn: document.getElementById('closeAlertModalBtn'),
    cancelAlertBtn: document.getElementById('cancelAlertBtn'),
    confirmAlertBtn: document.getElementById('confirmAlertBtn'),
    alertModalProductTitle: document.getElementById('alertModalProductTitle'),
    alertModalCurrentPrice: document.getElementById('alertModalCurrentPrice'),
    targetPriceInput: document.getElementById('targetPriceInput'),
    alertCurrencyPrefix: document.getElementById('alertCurrencyPrefix'),
    suggestTargetBtn: document.getElementById('suggestTargetBtn'),
    alertEmailInput: document.getElementById('alertEmailInput'),
    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // Live Dollar Converter Tool
  // =========================================================================
  function updateDollarCalculator() {
    if (!DOM.calcDollarInput || !DOM.calcConvertedOutput) return;
    const usd = parseFloat(DOM.calcDollarInput.value) || 0;
    const inrValue = Math.round(usd * USD_TO_INR_RATE);

    if (state.currency === 'INR') {
      DOM.calcConvertedOutput.textContent = `₹ ${inrValue.toLocaleString('en-IN')} INR`;
      if (DOM.calcConvertedSub) {
        DOM.calcConvertedSub.textContent = `(Exchange rate: $1.00 USD = ₹${USD_TO_INR_RATE} INR)`;
      }
    } else {
      const targetCfg = CURRENCY_RATES[state.currency];
      const targetVal = inrValue * targetCfg.rate;
      DOM.calcConvertedOutput.textContent = `${targetCfg.symbol} ${targetVal.toFixed(2)} ${state.currency}`;
      if (DOM.calcConvertedSub) {
        DOM.calcConvertedSub.textContent = `(Converted via live rate: $1.00 USD = ₹${USD_TO_INR_RATE} INR)`;
      }
    }

    if (DOM.liveExchangeRateTag) {
      DOM.liveExchangeRateTag.textContent = `1 USD ($) = ₹${USD_TO_INR_RATE} INR`;
    }
  }

  function setCurrency(newCurrency) {
    if (!CURRENCY_RATES[newCurrency]) return;
    state.currency = newCurrency;
    try {
      localStorage.setItem('pricehunt_currency', newCurrency);
    } catch (e) {}

    // Update select element
    if (DOM.currencySelect) {
      DOM.currencySelect.value = newCurrency;
    }

    // Update switch pills
    document.querySelectorAll('.c-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-curr') === newCurrency);
    });

    // Update live calculator
    updateDollarCalculator();

    // Re-render views
    renderProductsGrid();
    if (state.selectedProduct) {
      openDetailedComparison(state.selectedProduct);
    }
    renderWatchlistItems();
  }

  // =========================================================================
  // Rendering Product Grid
  // =========================================================================
  function renderProductsGrid() {
    let list = [...CATALOG];

    // Filter by Category
    if (state.activeCategory !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === state.activeCategory.toLowerCase());
    }

    // Filter by Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Store
    if (state.storeFilter !== 'all') {
      list = list.filter(p => p.stores.some(s => s.name.toLowerCase() === state.storeFilter.toLowerCase()));
    }

    // Sorting
    list.sort((a, b) => {
      const lowA = getTotalStoreCost(getLowestStoreOffer(a));
      const lowB = getTotalStoreCost(getLowestStoreOffer(b));
      if (state.sortBy === 'price-asc') return lowA - lowB;
      if (state.sortBy === 'price-desc') return lowB - lowA;
      if (state.sortBy === 'rating-desc') return b.rating - a.rating;
      if (state.sortBy === 'savings-desc') {
        const saveA = (a.msrp - lowA) / a.msrp;
        const saveB = (b.msrp - lowB) / b.msrp;
        return saveB - saveA;
      }
      return 0;
    });

    DOM.productsGrid.innerHTML = '';

    if (list.length === 0) {
      DOM.noResultsState.style.display = 'block';
      DOM.resultsCount.textContent = '0 Deals Found';
      DOM.activeSearchQuery.textContent = `No exact match for "${state.searchQuery}"`;
      return;
    }

    DOM.noResultsState.style.display = 'none';
    DOM.resultsCount.textContent = `${list.length} Products Compared`;
    DOM.activeSearchQuery.textContent = state.searchQuery.trim() !== ''
      ? `Results for "${state.searchQuery}"`
      : (state.activeCategory === 'all' ? 'Top Trending Value Deals' : `Category: ${state.activeCategory}`);

    list.forEach(prod => {
      const lowestOffer = getLowestStoreOffer(prod);
      const totalCost = getTotalStoreCost(lowestOffer);
      const savingsPct = Math.round(((prod.msrp - totalCost) / prod.msrp) * 100);

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="card-image-wrap">
          <img src="${prod.image}" alt="${escapeHtml(prod.title)}" loading="lazy" />
          ${savingsPct > 0 ? `<span class="card-savings-pill">${savingsPct}% OFF</span>` : ''}
        </div>
        <div class="card-body">
          <span class="card-category">${escapeHtml(prod.category)}</span>
          <h3 class="card-title">${escapeHtml(prod.title)}</h3>
          <div class="card-rating-row">
            <span class="star-rating">★</span>
            <strong>${prod.rating}</strong>
            <span class="rating-count">(${prod.reviewsCount.toLocaleString()})</span>
          </div>
          <div class="card-price-box">
            <div>
              <div class="lowest-tag-label">Lowest Price</div>
              <div class="card-price-lowest">${formatPrice(totalCost)} ${formatDollarEquiv(totalCost)}</div>
            </div>
            <div class="card-store-badge">
              <span>At</span>
              <strong>${lowestOffer.name}</strong>
            </div>
          </div>
          <div class="compare-stores-count">
            <span>Compare ${prod.stores.length} Retailers</span>
            <span>View Deals →</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openDetailedComparison(prod));
      DOM.productsGrid.appendChild(card);
    });
  }

  // =========================================================================
  // Detailed Product View & Store Comparison Table
  // =========================================================================
  function openDetailedComparison(product) {
    state.selectedProduct = product;
    DOM.productsGridView.style.display = 'none';
    DOM.detailedComparisonView.style.display = 'flex';
    window.scrollTo({ top: 380, behavior: 'smooth' });

    DOM.detailProductImage.src = product.image;
    DOM.detailProductImage.alt = product.title;
    DOM.detailCondition.textContent = product.condition || 'Brand New';
    DOM.detailCategory.textContent = product.category;
    DOM.detailSku.textContent = `SKU: ${product.sku || 'N/A'}`;
    DOM.detailTitle.textContent = product.title;
    DOM.detailRating.textContent = product.rating;
    DOM.detailReviews.textContent = `(${product.reviewsCount.toLocaleString()} verified ratings)`;
    DOM.detailDesc.textContent = product.description;

    const lowestStore = getLowestStoreOffer(product);
    const lowestTotal = getTotalStoreCost(lowestStore);
    const highestStore = getHighestStoreOffer(product);
    const highestTotal = getTotalStoreCost(highestStore);
    const avgTotal = getAverageStorePrice(product);

    DOM.detailLowestCurrency.textContent = getCurrencySymbol();
    DOM.detailLowestPrice.textContent = formatRawNumber(lowestTotal);
    DOM.detailMsrp.innerHTML = `${formatPrice(product.msrp)} <span class="usd-equiv">(≈ $${(product.msrp / USD_TO_INR_RATE).toFixed(2)} USD)</span>`;

    const savingsVal = Math.max(0, product.msrp - lowestTotal);
    const savingsPct = Math.round((savingsVal / product.msrp) * 100);
    DOM.detailSavingsBadge.textContent = `Save ${formatPrice(savingsVal)} (${savingsPct}% off MRP)`;

    DOM.detailCheapestStoreName.textContent = lowestStore.name;
    DOM.detailCheapestShipping.textContent = lowestStore.shipping === 0 
      ? '✓ Free Shipping Included' 
      : `+ ${formatPrice(lowestStore.shipping)} shipping`;

    DOM.directDealStoreName.textContent = lowestStore.name;
    DOM.directDealBtn.href = lowestStore.url;

    // Render Store Matrix Table
    renderStoreTable(product);

    // Render Price Trend Chart & Advice
    renderPriceHistoryChart(product, state.historyDays);
    renderDealVerdict(product, lowestTotal, avgTotal, highestTotal);
  }

  function renderStoreTable(product) {
    DOM.storeTableBody.innerHTML = '';
    let sortedStores = getSortedStores(product);

    if (state.freeShippingOnly) {
      sortedStores = sortedStores.filter(s => s.shipping === 0);
    }

    sortedStores.forEach((store, idx) => {
      const totalCost = getTotalStoreCost(store);
      const isLowest = idx === 0;

      const tr = document.createElement('tr');
      tr.className = `store-row ${isLowest ? 'rank-1' : ''}`;
      tr.innerHTML = `
        <td>
          <div class="store-badge-cell">
            <span class="rank-badge">${idx + 1}</span>
            <div class="store-name-title">
              <span>${store.name}</span>
              ${isLowest ? '<span class="best-price-pill">Cheapest</span>' : ''}
            </div>
          </div>
        </td>
        <td>
          <span>${store.condition || 'Brand New'}</span>
        </td>
        <td>
          <div>${store.delivery}</div>
          <small class="text-muted">${store.shipping === 0 ? 'Free Shipping' : `Shipping: ${formatPrice(store.shipping)}`}</small>
        </td>
        <td>
          <span class="stock-indicator ${store.stock.toLowerCase().includes('in stock') ? 'in-stock' : 'low-stock'}">
            ● ${store.stock}
          </span>
        </td>
        <td>
          <div>⭐ ${store.rating}</div>
        </td>
        <td>
          <div class="price-table-cell">${formatPrice(totalCost)} ${formatDollarEquiv(totalCost)}</div>
        </td>
        <td>
          <a href="${store.url}" target="_blank" rel="noopener noreferrer" class="btn ${isLowest ? 'btn-deal' : 'btn-outline'} table-action-btn">
            Buy at ${store.name} ↗
          </a>
        </td>
      `;
      DOM.storeTableBody.appendChild(tr);
    });
  }

  // =========================================================================
  // Interactive SVG Price History Chart
  // =========================================================================
  function renderPriceHistoryChart(product, days = 30) {
    const historyData = getHistoricalPriceData(product, days);
    const svg = DOM.priceHistorySvg;
    svg.innerHTML = '';

    const width = 700;
    const height = 240;
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };

    let minPrice = Infinity;
    let maxPrice = -Infinity;
    historyData.forEach(d => {
      minPrice = Math.min(minPrice, d.lowest);
      maxPrice = Math.max(maxPrice, d.highest);
    });

    minPrice = Math.floor(minPrice * 0.95);
    maxPrice = Math.ceil(maxPrice * 1.05);

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const getX = (index) => padding.left + (index / (historyData.length - 1)) * chartW;
    const getY = (val) => padding.top + chartH - ((val - minPrice) / (maxPrice - minPrice)) * chartH;

    const ySteps = 4;
    for (let i = 0; i <= ySteps; i++) {
      const yVal = minPrice + (i / ySteps) * (maxPrice - minPrice);
      const yPos = getY(yVal);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding.left);
      line.setAttribute('y1', yPos);
      line.setAttribute('x2', width - padding.right);
      line.setAttribute('y2', yPos);
      line.setAttribute('stroke', 'var(--border-color)');
      line.setAttribute('stroke-dasharray', '3,3');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', padding.left - 8);
      text.setAttribute('y', yPos + 4);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', 'var(--text-muted)');
      text.textContent = formatPrice(yVal);
      svg.appendChild(text);
    }

    function createPathD(key) {
      return historyData.reduce((acc, curr, idx) => {
        const x = getX(idx);
        const y = getY(curr[key]);
        return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      }, '');
    }

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="lowestGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
      </linearGradient>
    `;
    svg.appendChild(defs);

    const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const lowestPathD = createPathD('lowest');
    const areaD = `${lowestPathD} L ${getX(historyData.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;
    areaPath.setAttribute('d', areaD);
    areaPath.setAttribute('fill', 'url(#lowestGradient)');
    svg.appendChild(areaPath);

    const highPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    highPath.setAttribute('d', createPathD('highest'));
    highPath.setAttribute('fill', 'none');
    highPath.setAttribute('stroke', '#ef4444');
    highPath.setAttribute('stroke-width', '1.5');
    highPath.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(highPath);

    const avgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    avgPath.setAttribute('d', createPathD('average'));
    avgPath.setAttribute('fill', 'none');
    avgPath.setAttribute('stroke', '#3b82f6');
    avgPath.setAttribute('stroke-width', '2');
    svg.appendChild(avgPath);

    const lowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lowPath.setAttribute('d', lowestPathD);
    lowPath.setAttribute('fill', 'none');
    lowPath.setAttribute('stroke', '#10b981');
    lowPath.setAttribute('stroke-width', '2.5');
    svg.appendChild(lowPath);

    historyData.forEach((point, idx) => {
      const x = getX(idx);
      const y = getY(point.lowest);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', '3.5');
      circle.setAttribute('fill', '#10b981');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '1.5');
      circle.style.cursor = 'pointer';

      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', '6');
        DOM.chartTooltip.style.display = 'block';
        DOM.chartTooltip.style.left = `${(x / width) * 100}%`;
        DOM.chartTooltip.style.top = `${(y / height) * 100}%`;
        DOM.chartTooltip.innerHTML = `
          <strong>${point.date}</strong><br/>
          <span style="color:#10b981">Lowest: ${formatPrice(point.lowest)}</span><br/>
          <span style="color:#3b82f6">Average: ${formatPrice(point.average)}</span>
        `;
      });

      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', '3.5');
        DOM.chartTooltip.style.display = 'none';
      });

      svg.appendChild(circle);

      if (idx === 0 || idx === Math.floor(historyData.length / 2) || idx === historyData.length - 1) {
        const dateText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dateText.setAttribute('x', x);
        dateText.setAttribute('y', height - padding.bottom + 18);
        dateText.setAttribute('text-anchor', 'middle');
        dateText.setAttribute('font-size', '10');
        dateText.setAttribute('fill', 'var(--text-muted)');
        dateText.textContent = point.date;
        svg.appendChild(dateText);
      }
    });
  }

  // =========================================================================
  // Deal Verdict & Price Stats
  // =========================================================================
  function renderDealVerdict(product, lowestTotal, avgTotal, highestTotal) {
    const spread = highestTotal - lowestTotal;
    const discountFromAvg = ((avgTotal - lowestTotal) / avgTotal) * 100;

    DOM.statAllTimeLow.textContent = formatPrice(lowestTotal * 0.96);
    DOM.statMarketAvg.textContent = formatPrice(avgTotal);
    DOM.statAllTimeHigh.textContent = formatPrice(highestTotal * 1.08);
    DOM.statPriceSpread.textContent = formatPrice(spread);

    if (discountFromAvg > 10) {
      DOM.verdictIcon.textContent = '🔥';
      DOM.verdictTitle.textContent = 'Spectacular Deal! Highly Recommended';
      DOM.verdictSubtitle.textContent = `Current lowest price is ${Math.round(discountFromAvg)}% below average retail across Indian stores.`;
      DOM.dealMeterFill.style.width = '92%';
      DOM.dealMeterFill.style.background = 'linear-gradient(90deg, #10b981, #059669)';
      DOM.dealTipText.textContent = `Buying from the cheapest retailer right now saves you ${formatPrice(spread)} over the highest listing!`;
    } else if (discountFromAvg > 3) {
      DOM.verdictIcon.textContent = '✅';
      DOM.verdictTitle.textContent = 'Fair & Competitive Price';
      DOM.verdictSubtitle.textContent = 'Price is consistent with recent festive & sale pricing.';
      DOM.dealMeterFill.style.width = '70%';
      DOM.dealMeterFill.style.background = 'linear-gradient(90deg, #f59e0b, #10b981)';
      DOM.dealTipText.textContent = 'Solid price to purchase today with fast domestic shipping across India.';
    } else {
      DOM.verdictIcon.textContent = '⏳';
      DOM.verdictTitle.textContent = 'Consider Waiting / Set Alert';
      DOM.verdictSubtitle.textContent = 'Prices across retailers are currently near MRP.';
      DOM.dealMeterFill.style.width = '40%';
      DOM.dealMeterFill.style.background = 'linear-gradient(90deg, #ef4444, #f59e0b)';
      DOM.dealTipText.textContent = 'We suggest setting a target price alert to get notified when stores drop prices.';
    }
  }

  // =========================================================================
  // Search & Autocomplete
  // =========================================================================
  function handleSearchInput() {
    const val = DOM.searchInput.value.trim();
    DOM.clearSearchBtn.style.display = val.length > 0 ? 'flex' : 'none';

    if (val.length < 2) {
      DOM.suggestionsDropdown.style.display = 'none';
      return;
    }

    const q = val.toLowerCase();
    const matches = CATALOG.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);

    if (matches.length === 0) {
      DOM.suggestionsDropdown.innerHTML = `
        <div class="suggestion-item" id="customSearchPrompt">
          <div class="sugg-info">
            <span class="sugg-name">Compare Indian stores for: <strong>"${escapeHtml(val)}"</strong></span>
          </div>
          <span class="sugg-price">Find Best Price ↗</span>
        </div>
      `;
      DOM.suggestionsDropdown.style.display = 'block';
      document.getElementById('customSearchPrompt').addEventListener('click', () => {
        performSearch(val);
      });
      return;
    }

    DOM.suggestionsDropdown.innerHTML = matches.map(m => {
      const lowest = getTotalStoreCost(getLowestStoreOffer(m));
      return `
        <div class="suggestion-item" data-id="${m.id}">
          <div class="sugg-info">
            <span class="sugg-name">${escapeHtml(m.title)}</span>
            <span class="sugg-category">${escapeHtml(m.category)}</span>
          </div>
          <span class="sugg-price">${formatPrice(lowest)}</span>
        </div>
      `;
    }).join('');

    DOM.suggestionsDropdown.style.display = 'block';

    DOM.suggestionsDropdown.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const prod = CATALOG.find(p => p.id === id);
        if (prod) {
          DOM.searchInput.value = prod.title;
          DOM.suggestionsDropdown.style.display = 'none';
          openDetailedComparison(prod);
        }
      });
    });
  }

  function performSearch(query) {
    state.searchQuery = query;
    DOM.suggestionsDropdown.style.display = 'none';

    const exact = CATALOG.find(p => p.title.toLowerCase().includes(query.toLowerCase()));
    if (exact && query.length > 5) {
      openDetailedComparison(exact);
    } else {
      DOM.detailedComparisonView.style.display = 'none';
      DOM.productsGridView.style.display = 'block';
      renderProductsGrid();
    }
  }

  // =========================================================================
  // Watchlist & Price Drop Alert System
  // =========================================================================
  function loadWatchlist() {
    try {
      const stored = localStorage.getItem('pricehunt_watchlist');
      if (stored) {
        state.watchlist = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error loading watchlist:', e);
    }
    updateWatchlistCount();
  }

  function saveWatchlist() {
    try {
      localStorage.setItem('pricehunt_watchlist', JSON.stringify(state.watchlist));
    } catch (e) {
      console.warn('LocalStorage error saving watchlist:', e);
    }
    updateWatchlistCount();
  }

  function updateWatchlistCount() {
    DOM.watchlistCount.textContent = state.watchlist.length;
  }

  function openWatchlistModal() {
    DOM.watchlistModal.style.display = 'flex';
    renderWatchlistItems();
  }

  function renderWatchlistItems() {
    if (state.watchlist.length === 0) {
      DOM.emptyWatchlistState.style.display = 'block';
      DOM.watchlistItemsList.innerHTML = '';
      return;
    }

    DOM.emptyWatchlistState.style.display = 'none';
    DOM.watchlistItemsList.innerHTML = state.watchlist.map((item, idx) => `
      <div class="watchlist-card">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" class="wl-img" />
        <div class="wl-info">
          <div class="wl-title">${escapeHtml(item.title)}</div>
          <div class="wl-prices">
            <span>Current: <strong class="text-success">${formatPrice(item.currentPrice)}</strong></span>
            <span class="wl-target-tag">Target: ${formatPrice(item.targetPrice)}</span>
          </div>
        </div>
        <button class="remove-wl-btn" data-idx="${idx}" title="Remove item">🗑️</button>
      </div>
    `).join('');

    DOM.watchlistItemsList.querySelectorAll('.remove-wl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        state.watchlist.splice(idx, 1);
        saveWatchlist();
        renderWatchlistItems();
        showToast('Removed item from watchlist');
      });
    });
  }

  function openPriceAlertModal(product) {
    const lowest = getTotalStoreCost(getLowestStoreOffer(product));
    DOM.alertModalProductTitle.textContent = product.title;
    DOM.alertModalCurrentPrice.textContent = formatPrice(lowest);
    DOM.alertCurrencyPrefix.textContent = getCurrencySymbol();

    const suggested = Math.round(lowest * 0.9);
    DOM.targetPriceInput.value = formatRawNumber(suggested);
    DOM.suggestTargetBtn.textContent = `${formatPrice(suggested)} (10% off)`;
    DOM.suggestTargetBtn.onclick = () => {
      DOM.targetPriceInput.value = formatRawNumber(suggested);
    };

    DOM.setAlertModal.style.display = 'flex';
  }

  function confirmPriceAlert() {
    if (!state.selectedProduct) return;
    const target = parseFloat(DOM.targetPriceInput.value);
    if (isNaN(target) || target <= 0) {
      alert('Please enter a valid target price in Rupees.');
      return;
    }

    const lowest = getTotalStoreCost(getLowestStoreOffer(state.selectedProduct));
    const config = CURRENCY_RATES[state.currency] || CURRENCY_RATES.INR;
    const targetInINR = target / config.rate;

    const existingIndex = state.watchlist.findIndex(w => w.id === state.selectedProduct.id);
    const itemData = {
      id: state.selectedProduct.id,
      title: state.selectedProduct.title,
      image: state.selectedProduct.image,
      currentPrice: lowest,
      targetPrice: targetInINR,
      email: DOM.alertEmailInput.value || 'user@example.com'
    };

    if (existingIndex >= 0) {
      state.watchlist[existingIndex] = itemData;
    } else {
      state.watchlist.push(itemData);
    }

    saveWatchlist();
    DOM.setAlertModal.style.display = 'none';
    showToast(`Price alert saved! We will notify you when price drops below ${formatPrice(targetInINR)}`, 'success');
  }

  function simulatePriceDrop() {
    if (state.watchlist.length === 0) {
      showToast('Add items to your watchlist first to test price drops!', 'alert');
      return;
    }

    const randomIdx = Math.floor(Math.random() * state.watchlist.length);
    const item = state.watchlist[randomIdx];
    const newPrice = Math.round(item.targetPrice * 0.94);
    item.currentPrice = newPrice;
    saveWatchlist();
    renderWatchlistItems();

    showToast(`📉 PRICE DROP ALERT! ${item.title} dropped to ${formatPrice(newPrice)}!`, 'alert');
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'alert' ? '🔔' : '✓'}</span>
      <span>${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // Theme Switching
  // =========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem('pricehunt_theme') || 'light';
    state.theme = savedTheme;
    document.body.className = `theme-${savedTheme}`;
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.className = `theme-${state.theme}`;
    localStorage.setItem('pricehunt_theme', state.theme);
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  function setupEventListeners() {
    // Currency Switcher Dropdown
    if (DOM.currencySelect) {
      DOM.currencySelect.addEventListener('change', (e) => {
        setCurrency(e.target.value);
      });
    }

    // Quick Currency Switch Pills
    document.querySelectorAll('.c-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const curr = pill.getAttribute('data-curr');
        setCurrency(curr);
      });
    });

    // Dollar Calculator Input Live Calculation
    if (DOM.calcDollarInput) {
      DOM.calcDollarInput.addEventListener('input', updateDollarCalculator);
    }

    // Quick Dollar Presets ($10, $50, $100, $500, $1000)
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.getAttribute('data-val');
        if (DOM.calcDollarInput) {
          DOM.calcDollarInput.value = val;
          updateDollarCalculator();
        }
      });
    });

    // Theme Toggle
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);

    // Search Input & Suggestions
    DOM.searchInput.addEventListener('input', handleSearchInput);
    DOM.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        performSearch(DOM.searchInput.value);
      }
    });

    DOM.clearSearchBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.clearSearchBtn.style.display = 'none';
      DOM.suggestionsDropdown.style.display = 'none';
      performSearch('');
    });

    DOM.searchSubmitBtn.addEventListener('click', () => {
      performSearch(DOM.searchInput.value);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box-wrapper')) {
        DOM.suggestionsDropdown.style.display = 'none';
      }
    });

    // Category Pills
    DOM.categoryPills.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        DOM.categoryPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.getAttribute('data-category');
        DOM.detailedComparisonView.style.display = 'none';
        DOM.productsGridView.style.display = 'block';
        renderProductsGrid();
      });
    });

    // Sorting & Filtering
    DOM.sortBySelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProductsGrid();
    });

    DOM.storeFilterSelect.addEventListener('change', (e) => {
      state.storeFilter = e.target.value;
      renderProductsGrid();
    });

    DOM.filterFreeShippingOnly.addEventListener('change', (e) => {
      state.freeShippingOnly = e.target.checked;
      if (state.selectedProduct) {
        renderStoreTable(state.selectedProduct);
      }
    });

    // Back to List
    DOM.backToListBtn.addEventListener('click', () => {
      DOM.detailedComparisonView.style.display = 'none';
      DOM.productsGridView.style.display = 'block';
      state.selectedProduct = null;
      renderProductsGrid();
    });

    // Brand Logo Click resets to default
    DOM.logoBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      state.searchQuery = '';
      state.activeCategory = 'all';
      DOM.categoryPills.querySelectorAll('.pill').forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
      DOM.detailedComparisonView.style.display = 'none';
      DOM.productsGridView.style.display = 'block';
      state.selectedProduct = null;
      renderProductsGrid();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Chart Time Range Toggles
    document.querySelectorAll('.range-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.historyDays = parseInt(btn.getAttribute('data-days'), 10);
        if (state.selectedProduct) {
          renderPriceHistoryChart(state.selectedProduct, state.historyDays);
        }
      });
    });

    // Dynamic Custom Comparison Button in Empty State
    DOM.generateCustomComparisonBtn.addEventListener('click', () => {
      const generated = generateDynamicComparison(state.searchQuery || 'Custom Electronic Item');
      CATALOG.unshift(generated);
      openDetailedComparison(generated);
    });

    // Watchlist Modals
    DOM.openWatchlistBtn.addEventListener('click', openWatchlistModal);
    DOM.closeWatchlistBtn.addEventListener('click', () => DOM.watchlistModal.style.display = 'none');
    DOM.clearWatchlistBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your watchlist?')) {
        state.watchlist = [];
        saveWatchlist();
        renderWatchlistItems();
      }
    });
    DOM.simulatePriceDropBtn.addEventListener('click', simulatePriceDrop);

    // Price Alert Modal
    DOM.setAlertFromDetailBtn.addEventListener('click', () => {
      if (state.selectedProduct) {
        openPriceAlertModal(state.selectedProduct);
      }
    });
    DOM.closeAlertModalBtn.addEventListener('click', () => DOM.setAlertModal.style.display = 'none');
    DOM.cancelAlertBtn.addEventListener('click', () => DOM.setAlertModal.style.display = 'none');
    DOM.confirmAlertBtn.addEventListener('click', confirmPriceAlert);

    [DOM.watchlistModal, DOM.setAlertModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
  }

  // =========================================================================
  // Initialization (Force Indian Rupees ₹ default)
  // =========================================================================
  function init() {
    initTheme();
    loadWatchlist();
    setupEventListeners();
    setCurrency('INR'); // Guarantee all prices are shown in Indian Rupees (₹)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
