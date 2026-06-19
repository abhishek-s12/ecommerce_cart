import { useState, useMemo } from 'react';
import './App.css';

// SVG Icons defined as inline React components for absolute stability
const SearchIcon = () => (
  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CartIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CloseIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Curated high quality mock tech products with specs and image descriptions
const PRODUCTS_DATA = [
  {
    id: 1,
    name: "Aura Smart Ring",
    price: 299.99,
    category: "Wearables",
    rating: 4.8,
    reviews: 124,
    tag: "Popular",
    description: "Experience discrete bio-tracking with the Aura Ring. Tracks heart rate variability, sleep stages, temperature patterns, and daily steps using an ultra-lightweight, high-grade titanium frame.",
    specifications: [
      "Aerospace-grade titanium with PVD coating",
      "Up to 7 days battery life with wireless charger",
      "50m water resistant (safe for swimming)",
      "Syncs directly with Apple Health & Google Fit"
    ],
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80"
  },
  {
    id: 2,
    name: "Orbit Keyless Keyboard",
    price: 189.50,
    category: "Peripherals",
    rating: 4.7,
    reviews: 85,
    tag: "New",
    description: "Reinvent your typing experience. A compact mechanical keyboard utilizing custom hot-swappable switches, double-shot keycaps, and customisable dynamic RGB lights inside a heavy aluminium housing.",
    specifications: [
      "Hot-swappable linear mechanical switches",
      "CNC milled anodized aluminum case",
      "Tri-mode connectivity: 2.4Ghz, Bluetooth 5.1, and USB-C",
      "Dynamic per-key RGB backlighting"
    ],
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80"
  },
  {
    id: 3,
    name: "Apex Wireless Headphones",
    price: 349.99,
    category: "Audio",
    rating: 4.9,
    reviews: 312,
    tag: "Best Seller",
    description: "Block the noise, elevate the sound. Equipped with ultra-tuned acoustic drivers, customisable Active Noise Cancelling, and spatial audio head tracking, engineered for high-fidelity audio enthusiasts.",
    specifications: [
      "Advanced Hybrid Active Noise Cancelling (ANC)",
      "40mm custom dynamic biosynthetic drivers",
      "Up to 45 hours battery life with fast charge support",
      "Ergonomic memory foam earcups with leatherette wrap"
    ],
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80"
  },
  {
    id: 4,
    name: "NeoDesk Charging Pad",
    price: 79.00,
    category: "Accessories",
    rating: 4.5,
    reviews: 64,
    tag: "Minimalist",
    description: "Organise your power. This 3-in-1 desktop hub docks your phone, smartwatch, and earbuds simultaneously on a gorgeous organic walnut wood base with smart heat protection control.",
    specifications: [
      "15W MagSafe-compatible fast charging",
      "Genuine American walnut wood faceplate",
      "Smart circuitry protects against overcharging",
      "Heavy zinc alloy base with non-slip pads"
    ],
    image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80"
  },
  {
    id: 5,
    name: "Horizon Curve Monitor",
    price: 699.00,
    category: "Displays",
    rating: 4.8,
    reviews: 92,
    tag: "Elite Tech",
    description: "Submerge yourself into visual clarity. A 34-inch curved QD-OLED display that delivers infinite contrast, ultra-fast 175Hz refresh rates, and incredibly vibrant color gamuts for work or gaming.",
    specifications: [
      "34-inch 1800R curved ultra-wide QD-OLED (3440 x 1440)",
      "175Hz refresh rate with 0.03ms response time",
      "VESA DisplayHDR True Black 400 certified",
      "Integrated 90W USB-C charging display port"
    ],
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80"
  },
  {
    id: 6,
    name: "Lunar Desk Mat",
    price: 45.00,
    category: "Accessories",
    rating: 4.6,
    reviews: 104,
    tag: "Essentials",
    description: "Protect your space with high-grade desk protection. Features an elegant woven texture designed to facilitate precise mouse tracking, backed by thick non-slip natural rubber.",
    specifications: [
      "Liquid-repellent micro-weave fabric top layer",
      "Anti-fray stitched edges to prolong durability",
      "Natural rubber foam base layer for grip",
      "Dimensions: 900mm x 400mm x 4mm"
    ],
    image: "https://images.unsplash.com/photo-1632292224971-0d45778bd364?w=500&q=80"
  },
  {
    id: 7,
    name: "Prism Smart Bulb Pack",
    price: 59.99,
    category: "Home",
    rating: 4.4,
    reviews: 48,
    tag: "Atmosphere",
    description: "Paint your room in color. Includes 3 custom bulbs supporting 16 million colors, smart home automation hubs, sound tracking, and a sleep scheduler for dynamic atmosphere generation.",
    specifications: [
      "16 million colors and adjustable white temperatures",
      "Works with Google Home, Apple HomeKit, and Alexa",
      "Wi-Fi and Bluetooth mesh enabled (no hub required)",
      "Energy efficient 9W (equivalent to standard 60W)"
    ],
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=500&q=80"
  },
  {
    id: 8,
    name: "Voyager Commuter Backpack",
    price: 159.00,
    category: "Apparel",
    rating: 4.7,
    reviews: 154,
    tag: "Durable",
    description: "The ultimate modern companion. Crafted from water-resistant ballistic nylon, this bag organizes a 16-inch laptop, tech accessories, keys, and water bottles while keeping a low slim profile.",
    specifications: [
      "840D recycled water-resistant ballistic nylon",
      "Suspended 16-inch laptop compartment with felt liner",
      "Ergonomic load-bearing padded shoulder straps",
      "Integrated trolley sleeve for luggage transit"
    ],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
  }
];

// Valid coupons: SAVE10 (10% off items), NEON25 (25% off items), FREESHIP (reduces shipping to 0)
const COUPONS = {
  SAVE10: { type: 'percent', value: 0.1 },
  NEON25: { type: 'percent', value: 0.25 },
  FREESHIP: { type: 'shipping', value: 0 }
};

// Pre-calculated confetti values to satisfy React 19 render purity rules
const CONFETTI_PIECES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 7.7 + 3) % 100}%`,
  delay: `${(i * 0.13) % 1.5}s`,
  width: `${5 + (i * 2) % 7}px`,
  height: `${8 + (i * 3) % 9}px`,
  colorVar: i % 3 === 0 ? 'var(--color-primary)' : i % 3 === 1 ? 'var(--color-secondary)' : 'var(--color-success)'
}));

export default function App() {
  // Main states
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceLimit, setPriceLimit] = useState(750);
  const [sortBy, setSortBy] = useState('default');
  
  // Checkout flow state: 'catalog' | 'shipping' | 'payment' | 'success'
  const [checkoutStep, setCheckoutStep] = useState('catalog');
  
  // Promo code states
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  // Form states
  const [shippingForm, setShippingForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [shippingErrors, setShippingErrors] = useState({});
  
  const [paymentForm, setPaymentForm] = useState({ cardNumber: '', expiry: '', cvc: '', cardName: '' });
  const [paymentErrors, setPaymentErrors] = useState({});

  // Generated Order Details
  const [orderId, setOrderId] = useState('');
  const [completedOrderSummary, setCompletedOrderSummary] = useState(null);

  // Dynamic calculations based on cart items
  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    let discountAmount = 0;
    if (activeCoupon && COUPONS[activeCoupon]) {
      const coupon = COUPONS[activeCoupon];
      if (coupon.type === 'percent') {
        discountAmount = subtotal * coupon.value;
      }
    }
    
    const isFreeShippingCoupon = activeCoupon === 'FREESHIP';
    const isOverThreshold = subtotal > 300;
    const shipping = subtotal === 0 ? 0 : (isFreeShippingCoupon || isOverThreshold ? 0 : 15.00);
    
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const tax = taxableAmount * 0.08; // 8% sales tax
    
    const total = taxableAmount + shipping + tax;
    
    return {
      subtotal,
      discountAmount,
      shipping,
      tax,
      total,
      itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [cart, activeCoupon]);



  // Product filters
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS_DATA];
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    
    result = result.filter(p => p.price <= priceLimit);
    
    if (sortBy === 'lowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highToLow') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }
    
    return result;
  }, [searchQuery, categoryFilter, priceLimit, sortBy]);

  // Categories list with counts
  const categoriesWithCounts = useMemo(() => {
    const list = { All: PRODUCTS_DATA.length };
    PRODUCTS_DATA.forEach(p => {
      list[p.category] = (list[p.category] || 0) + 1;
    });
    return Object.entries(list);
  }, []);

  // Cart operations
  const addToCart = (product) => {
    setCart(currentCart => {
      const index = currentCart.findIndex(item => item.product.id === product.id);
      if (index > -1) {
        const next = [...currentCart];
        next[index] = { ...next[index], quantity: next[index].quantity + 1 };
        return next;
      }
      return [...currentCart, { product, quantity: 1 }];
    });
    
    // Auto open cart drawer as micro-feedback
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, amount) => {
    setCart(currentCart => {
      return currentCart.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + amount;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.product.id !== productId));
  };

  const applyPromoCode = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    
    if (COUPONS[code]) {
      setActiveCoupon(code);
      setCouponFeedback({
        text: `Coupon "${code}" applied successfully!`,
        type: 'success'
      });
    } else {
      setCouponFeedback({
        text: "Invalid promo code. Try SAVE10 or NEON25.",
        type: 'error'
      });
    }
  };

  const removePromoCode = () => {
    setActiveCoupon('');
    setCouponInput('');
    setCouponFeedback({ text: '', type: '' });
  };

  // Shipping form validation
  const validateShipping = () => {
    const errors = {};
    if (!shippingForm.name.trim()) errors.name = "Full name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!shippingForm.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(shippingForm.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!shippingForm.address.trim()) errors.address = "Street address is required";
    if (!shippingForm.city.trim()) errors.city = "City is required";
    
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!shippingForm.zip.trim()) {
      errors.zip = "ZIP/Postal code is required";
    } else if (!zipRegex.test(shippingForm.zip)) {
      errors.zip = "Enter a valid 5-digit ZIP code";
    }
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Payment form validation & auto formatting
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Digits only
    if (value.length > 16) value = value.slice(0, 16);
    // Format card input with spacing: XXXX XXXX XXXX XXXX
    const matches = value.match(/\d{1,4}/g);
    const formatted = matches ? matches.join(' ') : '';
    setPaymentForm(p => ({ ...p, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Digits only
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setPaymentForm(p => ({ ...p, expiry: value }));
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPaymentForm(p => ({ ...p, cvc: value }));
  };

  const validatePayment = () => {
    const errors = {};
    
    const cardDigits = paymentForm.cardNumber.replace(/\s/g, '');
    if (cardDigits.length < 15) {
      errors.cardNumber = "Enter a valid card number (15-16 digits)";
    }
    
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryRegex.test(paymentForm.expiry)) {
      errors.expiry = "Enter a valid expiry date (MM/YY)";
    } else {
      // Check expiry date is in future
      const [m, y] = paymentForm.expiry.split('/');
      const expiryDate = new Date(parseInt(`20${y}`), parseInt(m) - 1, 1);
      const today = new Date();
      if (expiryDate < today) {
        errors.expiry = "Card has expired";
      }
    }
    
    if (paymentForm.cvc.length < 3) {
      errors.cvc = "Enter valid CVC (3-4 digits)";
    }
    
    if (!paymentForm.cardName.trim()) {
      errors.cardName = "Cardholder name is required";
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Complete checkout workflow
  const triggerCheckout = () => {
    setIsCartOpen(false);
    setCheckoutStep('shipping');
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    if (validateShipping()) {
      setCheckoutStep('payment');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      // Generate simulated order
      const randomId = `ORDER-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(randomId);
      setCompletedOrderSummary({
        items: [...cart],
        totals: { ...cartTotals },
        shippingAddress: { ...shippingForm }
      });
      setCheckoutStep('success');
      // Clear Cart state upon success
      setCart([]);
      setActiveCoupon('');
      setCouponInput('');
    }
  };

  const resetOrderFlow = () => {
    setCheckoutStep('catalog');
    setShippingForm({ name: '', email: '', address: '', city: '', zip: '' });
    setPaymentForm({ cardNumber: '', expiry: '', cvc: '', cardName: '' });
    setCompletedOrderSummary(null);
    setOrderId('');
  };

  return (
    <>
      {/* Dynamic Header */}
      <header className="app-header">
        <a href="#" className="brand" onClick={(e) => { e.preventDefault(); resetOrderFlow(); }}>
          <div className="brand-icon">S</div>
          <h1 className="brand-text">SPARK<span>CART</span></h1>
        </a>
        
        <div className="header-actions">
          {checkoutStep === 'catalog' && (
            <button className="cart-btn" onClick={() => setIsCartOpen(true)} id="open-cart-btn">
              <div className="cart-icon-wrapper">
                <CartIcon />
                {cartTotals.itemCount > 0 && (
                  <span className="cart-badge">{cartTotals.itemCount}</span>
                )}
              </div>
              <span>${cartTotals.total.toFixed(2)}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Catalog Mode */}
        {checkoutStep === 'catalog' && (
          <div className="main-content">
            {/* Sidebar filter section */}
            <aside className="filter-panel">
              <div className="filter-section">
                <h3 className="filter-title">Search</h3>
                <div className="search-wrapper">
                  <SearchIcon />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search smart rings, keyboards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Categories</h3>
                <div className="category-list">
                  {categoriesWithCounts.map(([cat, count]) => (
                    <button
                      key={cat}
                      className={`category-btn ${categoryFilter === cat ? 'active' : ''}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      <span>{cat}</span>
                      <span className="category-count">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Max Price</h3>
                <div className="price-slider-container">
                  <div className="price-range-info">
                    <span>$0</span>
                    <span>${priceLimit}</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="1000"
                    step="10"
                    value={priceLimit}
                    onChange={(e) => setPriceLimit(Number(e.target.value))}
                    className="slider-input"
                  />
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Sort By</h3>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Relevance</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </aside>

            {/* Product Section Grid */}
            <section className="catalog-section">
              <div className="catalog-header">
                <div className="results-count">
                  Showing <span>{filteredProducts.length}</span> products
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <div className="product-card" key={product.id}>
                      <div className="product-img-wrapper" onClick={() => setSelectedProduct(product)} style={{ cursor: 'pointer' }}>
                        <img src={product.image} className="product-img" alt={product.name} />
                        {product.tag && <span className="product-tag">{product.tag}</span>}
                        <div className="product-rating">
                          <StarIcon />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h4 className="product-name" onClick={() => setSelectedProduct(product)}>
                          {product.name}
                        </h4>
                        <p className="product-description">{product.description}</p>
                        <div className="product-footer">
                          <span className="product-price">${product.price.toFixed(2)}</span>
                          <button 
                            className="add-cart-btn" 
                            onClick={() => addToCart(product)}
                            title="Add to cart"
                          >
                            <CartIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-catalog">
                  <div className="empty-icon">✕</div>
                  <h3 className="empty-title">No products match your criteria</h3>
                  <p>Try refining your search queries or resetting your price limits.</p>
                  <button 
                    className="reset-filters-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('All');
                      setPriceLimit(750);
                      setSortBy('default');
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Shipping & Payment Checkout Wizard */}
        {(checkoutStep === 'shipping' || checkoutStep === 'payment') && (
          <div style={{ padding: '2rem 1.5rem', flex: 1, display: 'flex', alignItems: 'center' }}>
            <div className="checkout-container">
              {/* Checkout Progress Stepper */}
              <div className="checkout-stepper">
                <div 
                  className="stepper-progress-bar" 
                  style={{ width: checkoutStep === 'payment' ? '100%' : '50%' }}
                ></div>
                <div className="step-node completed">
                  1
                  <span className="step-label">Shipping</span>
                </div>
                <div className={`step-node ${checkoutStep === 'payment' ? 'completed' : 'active'}`}>
                  2
                  <span className="step-label">Payment</span>
                </div>
                <div className="step-node">
                  3
                  <span className="step-label">Receipt</span>
                </div>
              </div>

              {/* Shipping address form */}
              {checkoutStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem' }}>Shipping Address</h3>
                  
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className={`form-input ${shippingErrors.name ? 'error-border' : ''}`}
                        placeholder="John Doe"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm(p => ({ ...p, name: e.target.value }))}
                      />
                      {shippingErrors.name && <span className="field-error-msg">{shippingErrors.name}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className={`form-input ${shippingErrors.email ? 'error-border' : ''}`}
                        placeholder="john@example.com"
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm(p => ({ ...p, email: e.target.value }))}
                      />
                      {shippingErrors.email && <span className="field-error-msg">{shippingErrors.email}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Street Address</label>
                      <input
                        type="text"
                        className={`form-input ${shippingErrors.address ? 'error-border' : ''}`}
                        placeholder="123 Main St, Apt 4B"
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm(p => ({ ...p, address: e.target.value }))}
                      />
                      {shippingErrors.address && <span className="field-error-msg">{shippingErrors.address}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        className={`form-input ${shippingErrors.city ? 'error-border' : ''}`}
                        placeholder="New York"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm(p => ({ ...p, city: e.target.value }))}
                      />
                      {shippingErrors.city && <span className="field-error-msg">{shippingErrors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">ZIP / Postal Code</label>
                      <input
                        type="text"
                        className={`form-input ${shippingErrors.zip ? 'error-border' : ''}`}
                        placeholder="10001"
                        value={shippingForm.zip}
                        onChange={(e) => setShippingForm(p => ({ ...p, zip: e.target.value }))}
                      />
                      {shippingErrors.zip && <span className="field-error-msg">{shippingErrors.zip}</span>}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="back-btn" onClick={() => setCheckoutStep('catalog')}>
                      Return to Store
                    </button>
                    <button type="submit" className="next-btn">
                      Continue to Payment &rarr;
                    </button>
                  </div>
                </form>
              )}

              {/* Payment Details form */}
              {checkoutStep === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <h3 style={{ marginTop: 0, marginBottom: '0.25rem', fontSize: '1.3rem' }}>Payment Method</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    <LockIcon />
                    Secure SSL Checkout. Enter mock card details below.
                  </p>

                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label className="form-label">Card Number</label>
                      <input
                        type="text"
                        className={`form-input ${paymentErrors.cardNumber ? 'error-border' : ''}`}
                        placeholder="4111 2222 3333 4444"
                        value={paymentForm.cardNumber}
                        onChange={handleCardNumberChange}
                      />
                      {paymentErrors.cardNumber && <span className="field-error-msg">{paymentErrors.cardNumber}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label className="form-label">Cardholder Name</label>
                      <input
                        type="text"
                        className={`form-input ${paymentErrors.cardName ? 'error-border' : ''}`}
                        placeholder="JOHN DOE"
                        value={paymentForm.cardName}
                        onChange={(e) => setPaymentForm(p => ({ ...p, cardName: e.target.value.toUpperCase() }))}
                      />
                      {paymentErrors.cardName && <span className="field-error-msg">{paymentErrors.cardName}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Expiry Date</label>
                      <input
                        type="text"
                        className={`form-input ${paymentErrors.expiry ? 'error-border' : ''}`}
                        placeholder="MM/YY"
                        value={paymentForm.expiry}
                        onChange={handleExpiryChange}
                      />
                      {paymentErrors.expiry && <span className="field-error-msg">{paymentErrors.expiry}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Security Code (CVC)</label>
                      <input
                        type="password"
                        className={`form-input ${paymentErrors.cvc ? 'error-border' : ''}`}
                        placeholder="123"
                        value={paymentForm.cvc}
                        onChange={handleCvcChange}
                      />
                      {paymentErrors.cvc && <span className="field-error-msg">{paymentErrors.cvc}</span>}
                    </div>
                  </div>

                  {/* Dynamic Order Cost Breakdown in payment */}
                  <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      <span>Subtotal:</span>
                      <span>${cartTotals.subtotal.toFixed(2)}</span>
                    </div>
                    {cartTotals.discountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-success)', marginBottom: '0.4rem' }}>
                        <span>Promo Code Discount ({activeCoupon}):</span>
                        <span>-${cartTotals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                      <span>Shipping Fee:</span>
                      <span>{cartTotals.shipping === 0 ? 'FREE' : `$${cartTotals.shipping.toFixed(2)}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                      <span>Estimated Tax (8%):</span>
                      <span>${cartTotals.tax.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                      <span>Grand Total:</span>
                      <span style={{ color: 'var(--color-primary)' }}>${cartTotals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="back-btn" onClick={() => setCheckoutStep('shipping')}>
                      Back to Shipping
                    </button>
                    <button type="submit" className="next-btn" style={{ background: 'var(--color-success)' }}>
                      Pay & Confirm Order (${cartTotals.total.toFixed(2)})
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Order Success Confirmation Screen */}
        {checkoutStep === 'success' && completedOrderSummary && (
          <div style={{ padding: '2rem 1.5rem', flex: 1, display: 'flex', alignItems: 'center' }}>
            <div className="checkout-container" style={{ maxWidth: '600px' }}>
              <div className="success-card">
                
                {/* CSS Confetti Fallback particles */}
                <div className="confetti-container">
                  {CONFETTI_PIECES.map(piece => (
                    <div 
                      key={piece.id} 
                      className="confetti-piece"
                      style={{
                        left: piece.left,
                        backgroundColor: piece.colorVar,
                        animationDelay: piece.delay,
                        width: piece.width,
                        height: piece.height
                      }}
                    ></div>
                  ))}
                </div>

                <div className="success-badge-wrapper">
                  <CheckIcon />
                </div>

                <h2 className="success-title">Order Confirmed!</h2>
                <p className="success-message">
                  Thank you for your purchase. We have received your order and are processing it.
                </p>

                {/* Receipt item details */}
                <div className="receipt-box">
                  <div className="receipt-header">
                    <span>Order: {orderId}</span>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                  </div>

                  <div className="receipt-items">
                    {completedOrderSummary.items.map(item => (
                      <div className="receipt-item" key={item.product.id}>
                        <span className="receipt-item-name">
                          {item.product.name} <span style={{ color: 'var(--text-muted)' }}>x{item.quantity}</span>
                        </span>
                        <span className="receipt-item-price">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="receipt-totals">
                    <div className="receipt-row">
                      <span>Subtotal:</span>
                      <span>${completedOrderSummary.totals.subtotal.toFixed(2)}</span>
                    </div>
                    {completedOrderSummary.totals.discountAmount > 0 && (
                      <div className="receipt-row" style={{ color: 'var(--color-success)' }}>
                        <span>Discount:</span>
                        <span>-${completedOrderSummary.totals.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="receipt-row">
                      <span>Shipping:</span>
                      <span>{completedOrderSummary.totals.shipping === 0 ? 'FREE' : `$${completedOrderSummary.totals.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="receipt-row">
                      <span>Estimated Tax (8%):</span>
                      <span>${completedOrderSummary.totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="receipt-row final">
                      <span>Total Paid:</span>
                      <span style={{ color: 'var(--color-success)' }}>${completedOrderSummary.totals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '1.25rem', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong>Deliver to:</strong> {completedOrderSummary.shippingAddress.name} <br />
                    {completedOrderSummary.shippingAddress.address}, {completedOrderSummary.shippingAddress.city}, {completedOrderSummary.shippingAddress.zip}
                  </div>
                </div>

                <button className="reset-filters-btn" onClick={resetOrderFlow} style={{ width: '100%', maxWidth: '300px' }}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-out Shopping Cart Sidebar Drawer */}
      <div 
        className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      ></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`} id="cart-drawer-element">
        <div className="cart-header">
          <h3 className="cart-title">
            <CartIcon />
            <span>Shopping Cart</span>
            {cartTotals.itemCount > 0 && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({cartTotals.itemCount} items)</span>
            )}
          </h3>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        <div className="cart-items-container">
          {cart.length > 0 ? (
            cart.map(item => (
              <div className="cart-item" key={item.product.id}>
                <img src={item.product.image} className="cart-item-img" alt={item.product.name} />
                <div className="cart-item-details">
                  <div>
                    <h5 className="cart-item-name">{item.product.name}</h5>
                    <span className="cart-item-price">${item.product.price.toFixed(2)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-picker">
                      <button className="quantity-btn" onClick={() => updateQuantity(item.product.id, -1)}>&minus;</button>
                      <span className="quantity-val">{item.quantity}</span>
                      <button className="quantity-btn" onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                    </div>
                    
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.product.id)}>
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-cart-view">
              <div className="empty-cart-icon"><CartIcon size={40} /></div>
              <p>Your shopping cart is empty.</p>
              <button className="reset-filters-btn" onClick={() => setIsCartOpen(false)} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                Browse Catalog
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            
            {/* Promo Code Input */}
            <div>
              {!activeCoupon ? (
                <div className="coupon-section">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Enter Coupon: e.g. SAVE10"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value);
                      if (couponFeedback.text) {
                        setCouponFeedback({ text: '', type: '' });
                      }
                    }}
                  />
                  <button className="coupon-btn" onClick={applyPromoCode}>
                    Apply
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 0.75rem', borderRadius: '0.35rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600 }}>
                    Promo Code: {activeCoupon} Applied!
                  </span>
                  <button 
                    onClick={removePromoCode} 
                    style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponFeedback.text && (
                <div className={`coupon-feedback ${couponFeedback.type}`} style={{ fontSize: '0.75rem', marginTop: '0.35rem' }}>
                  {couponFeedback.text}
                </div>
              )}
            </div>

            {/* Calculations summaries */}
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cartTotals.subtotal.toFixed(2)}</span>
            </div>

            {cartTotals.discountAmount > 0 && (
              <div className="summary-row" style={{ color: 'var(--color-success)' }}>
                <span>Coupon Discount ({activeCoupon}):</span>
                <span>-${cartTotals.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Shipping Fee:</span>
              <span>{cartTotals.shipping === 0 ? 'FREE' : `$${cartTotals.shipping.toFixed(2)}`}</span>
            </div>

            <div className="summary-row">
              <span>Estimated Tax (8%):</span>
              <span>${cartTotals.tax.toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total Price:</span>
              <span>${cartTotals.total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={triggerCheckout}>
              <span>Proceed to Checkout</span>
              <span>&rarr;</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-grid">
              
              <div className="modal-img-wrapper">
                <img src={selectedProduct.image} className="modal-img" alt={selectedProduct.name} />
              </div>
              
              <div className="modal-body">
                <div className="modal-header-section">
                  <span className="modal-tag">{selectedProduct.tag || selectedProduct.category}</span>
                  <button className="close-btn modal-close-btn" onClick={() => setSelectedProduct(null)}>
                    <CloseIcon size={18} />
                  </button>
                  <h4 className="modal-title">{selectedProduct.name}</h4>
                  
                  <div className="modal-price-row">
                    <span className="modal-price">${selectedProduct.price.toFixed(2)}</span>
                    <span className="modal-rating">
                      <StarIcon /> {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                    </span>
                  </div>
                  
                  <p className="modal-desc">{selectedProduct.description}</p>
                  
                  <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Specifications
                  </h5>
                  <ul className="modal-specs-list">
                    {selectedProduct.specifications.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </div>

                <button 
                  className="modal-footer-btn" 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  Add to Cart &mdash; ${selectedProduct.price.toFixed(2)}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} SparkCart Storefront. Designed in Premium Glassmorphism Dark Mode.</p>
        <p style={{ margin: 0, fontSize: '0.75rem' }}>
          Mock E-commerce Checkout simulator. No real money or payment cards are used.
        </p>
      </footer>
    </>
  );
}
