// Products Seed Data
export const productsData = [
  // Plumbing Products
  {
    name: 'Professional Pipe Wrench Set',
    description: 'Heavy-duty pipe wrench set with 6 different sizes for all plumbing needs. Made from high-grade steel with comfortable grips.',
    price: 89.99,
    original_price: 129.99,
    sku: 'PLUMB-WRENCH-001',
    stock_quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    ],
    specifications: {
      material: 'High-grade steel',
      sizes: ['8 inch', '10 inch', '12 inch', '14 inch', '16 inch', '18 inch'],
      weight: '2.5 lbs',
      warranty: '2 years'
    },
    is_active: true,
    is_featured: true,
    weight: 2.5,
    dimensions: { length: 18, width: 4, height: 2 },
    tags: ['plumbing', 'tools', 'wrench', 'professional'],
    category_name: 'Plumbing'
  },
  {
    name: 'Smart Touchless Faucet',
    description: 'Modern touchless kitchen faucet with motion sensor technology. Saves water and provides convenience with hands-free operation.',
    price: 299.99,
    original_price: 399.99,
    sku: 'PLUMB-FAUCET-002',
    stock_quantity: 25,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800',
      'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800'
    ],
    specifications: {
      finish: 'Chrome',
      installation: 'Single hole',
      flow_rate: '1.8 GPM',
      power: 'Battery operated',
      warranty: '5 years'
    },
    is_active: true,
    is_featured: true,
    weight: 3.2,
    dimensions: { length: 12, width: 6, height: 8 },
    tags: ['faucet', 'smart', 'touchless', 'kitchen'],
    category_name: 'Faucets & Fixtures'
  },
  {
    name: 'High-Efficiency Toilet',
    description: 'Water-saving dual flush toilet with powerful flush technology. Meets EPA WaterSense standards for maximum efficiency.',
    price: 459.99,
    original_price: 599.99,
    sku: 'PLUMB-TOILET-003',
    stock_quantity: 15,
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800'
    ],
    specifications: {
      flush_type: 'Dual flush',
      water_usage: '1.28/0.8 GPF',
      bowl_shape: 'Elongated',
      seat_included: 'Yes',
      warranty: '10 years'
    },
    is_active: true,
    is_featured: false,
    weight: 95.0,
    dimensions: { length: 30, width: 20, height: 28 },
    tags: ['toilet', 'water-saving', 'efficient', 'dual-flush'],
    category_name: 'Toilets & Bidets'
  },
  {
    name: 'Tankless Water Heater',
    description: 'On-demand tankless water heater providing endless hot water. Energy efficient and space-saving design.',
    price: 899.99,
    original_price: 1199.99,
    sku: 'PLUMB-HEATER-004',
    stock_quantity: 8,
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'
    ],
    specifications: {
      capacity: '6.5 GPM',
      energy_factor: '0.95',
      power: 'Natural gas',
      efficiency: '98%',
      warranty: '12 years'
    },
    is_active: true,
    is_featured: true,
    weight: 45.0,
    dimensions: { length: 20, width: 12, height: 28 },
    tags: ['water-heater', 'tankless', 'energy-efficient', 'on-demand'],
    category_name: 'Water Heaters'
  },

  // Electrical Products
  {
    name: 'LED Recessed Light Kit',
    description: 'Energy-efficient LED recessed light kit with dimmable functionality. Easy installation with included mounting hardware.',
    price: 79.99,
    original_price: 99.99,
    sku: 'ELEC-LED-001',
    stock_quantity: 100,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    ],
    specifications: {
      wattage: '12W',
      lumens: '1100',
      color_temp: '3000K-5000K',
      dimmable: 'Yes',
      warranty: '5 years'
    },
    is_active: true,
    is_featured: true,
    weight: 1.2,
    dimensions: { length: 6, width: 6, height: 3 },
    tags: ['led', 'recessed', 'dimmable', 'energy-efficient'],
    category_name: 'Lighting'
  },
  {
    name: 'Smart Electrical Outlet',
    description: 'WiFi-enabled smart outlet with app control and energy monitoring. Compatible with Alexa and Google Assistant.',
    price: 34.99,
    original_price: 49.99,
    sku: 'ELEC-SMART-002',
    stock_quantity: 75,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800'
    ],
    specifications: {
      voltage: '120V',
      amperage: '15A',
      wifi: '2.4GHz',
      app_control: 'Yes',
      warranty: '2 years'
    },
    is_active: true,
    is_featured: false,
    weight: 0.5,
    dimensions: { length: 4, width: 2, height: 1 },
    tags: ['smart', 'outlet', 'wifi', 'app-control'],
    category_name: 'Switches & Outlets'
  },
  {
    name: 'Circuit Breaker Panel',
    description: '200-amp main circuit breaker panel with 40 spaces. Suitable for residential and light commercial use.',
    price: 249.99,
    original_price: 329.99,
    sku: 'ELEC-PANEL-003',
    stock_quantity: 12,
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800'
    ],
    specifications: {
      amperage: '200A',
      spaces: '40',
      main_breaker: 'Included',
      type: 'Load center',
      warranty: '10 years'
    },
    is_active: true,
    is_featured: false,
    weight: 25.0,
    dimensions: { length: 16, width: 8, height: 4 },
    tags: ['circuit-breaker', 'panel', 'electrical', 'main'],
    category_name: 'Circuit Breakers'
  },

  // HVAC Products
  {
    name: 'Smart Thermostat',
    description: 'WiFi-enabled smart thermostat with learning capabilities and energy savings features. Compatible with most HVAC systems.',
    price: 199.99,
    original_price: 249.99,
    sku: 'HVAC-THERM-001',
    stock_quantity: 40,
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'
    ],
    specifications: {
      display: 'Color touchscreen',
      wifi: 'Yes',
      learning: 'Yes',
      compatibility: 'Most HVAC systems',
      warranty: '3 years'
    },
    is_active: true,
    is_featured: true,
    weight: 0.8,
    dimensions: { length: 4, width: 4, height: 1 },
    tags: ['thermostat', 'smart', 'wifi', 'energy-saving'],
    category_name: 'Thermostats'
  },
  {
    name: 'Portable Air Conditioner',
    description: '12,000 BTU portable air conditioner with remote control and programmable timer. Cools up to 500 sq ft.',
    price: 399.99,
    original_price: 499.99,
    sku: 'HVAC-AC-002',
    stock_quantity: 20,
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'
    ],
    specifications: {
      btu: '12,000',
      coverage: '500 sq ft',
      energy_rating: 'Energy Star',
      features: 'Remote, timer, dehumidifier',
      warranty: '1 year'
    },
    is_active: true,
    is_featured: false,
    weight: 65.0,
    dimensions: { length: 16, width: 12, height: 28 },
    tags: ['air-conditioner', 'portable', 'cooling', 'energy-star'],
    category_name: 'Air Conditioners'
  },
  {
    name: 'Ceiling Fan with Light',
    description: '52-inch ceiling fan with integrated LED light and remote control. Reversible motor for year-round comfort.',
    price: 149.99,
    original_price: 199.99,
    sku: 'HVAC-FAN-003',
    stock_quantity: 30,
    images: [
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800'
    ],
    specifications: {
      blade_span: '52 inches',
      motor: 'Reversible',
      light: 'LED integrated',
      control: 'Remote included',
      warranty: '2 years'
    },
    is_active: true,
    is_featured: false,
    weight: 15.0,
    dimensions: { length: 52, width: 52, height: 12 },
    tags: ['ceiling-fan', 'led', 'remote', 'reversible'],
    category_name: 'Fans & Ventilation'
  },

  // Cleaning Products
  {
    name: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with WiFi connectivity and app control. Self-emptying base and advanced mapping technology.',
    price: 599.99,
    original_price: 799.99,
    sku: 'CLEAN-ROBOT-001',
    stock_quantity: 15,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=800'
    ],
    specifications: {
      suction_power: '2000Pa',
      battery: '90 minutes runtime',
      wifi: 'Yes',
      self_empty: 'Yes',
      warranty: '2 years'
    },
    is_active: true,
    is_featured: true,
    weight: 8.5,
    dimensions: { length: 13, width: 13, height: 4 },
    tags: ['robot-vacuum', 'smart', 'wifi', 'self-empty'],
    category_name: 'Vacuum Cleaners'
  },
  {
    name: 'HEPA Air Purifier',
    description: 'True HEPA air purifier with 3-stage filtration system. Covers up to 1,000 sq ft and removes 99.97% of particles.',
    price: 299.99,
    original_price: 399.99,
    sku: 'CLEAN-PURIFIER-002',
    stock_quantity: 25,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=800'
    ],
    specifications: {
      coverage: '1,000 sq ft',
      filtration: '3-stage HEPA',
      cadr: '350 CFM',
      noise_level: '25-60 dB',
      warranty: '3 years'
    },
    is_active: true,
    is_featured: false,
    weight: 12.0,
    dimensions: { length: 10, width: 10, height: 20 },
    tags: ['air-purifier', 'hepa', 'filtration', 'large-room'],
    category_name: 'Air Purifiers'
  },
  {
    name: 'Professional Cleaning Kit',
    description: 'Complete professional cleaning kit with microfiber cloths, cleaning solutions, and tools for all surfaces.',
    price: 89.99,
    original_price: 129.99,
    sku: 'CLEAN-KIT-003',
    stock_quantity: 50,
    images: [
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=800'
    ],
    specifications: {
      items: '25 pieces',
      microfiber_cloths: '10',
      cleaning_solutions: '5 bottles',
      tools: '10 different tools',
      warranty: '1 year'
    },
    is_active: true,
    is_featured: false,
    weight: 5.0,
    dimensions: { length: 16, width: 12, height: 8 },
    tags: ['cleaning-kit', 'professional', 'microfiber', 'complete'],
    category_name: 'Cleaning Tools'
  },

  // Garden & Outdoor Products
  {
    name: 'Smart Garden Irrigation System',
    description: 'WiFi-enabled smart irrigation system with weather-based watering and app control. Saves water and keeps plants healthy.',
    price: 199.99,
    original_price: 279.99,
    sku: 'GARDEN-IRRIGATION-001',
    stock_quantity: 20,
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
    ],
    specifications: {
      zones: '6',
      wifi: 'Yes',
      weather_sensing: 'Yes',
      app_control: 'Yes',
      warranty: '2 years'
    },
    is_active: true,
    is_featured: true,
    weight: 3.0,
    dimensions: { length: 8, width: 6, height: 4 },
    tags: ['irrigation', 'smart', 'garden', 'water-saving'],
    category_name: 'Garden & Outdoor'
  },
  {
    name: 'Professional Hedge Trimmer',
    description: 'Cordless hedge trimmer with 24-inch blade and long-lasting battery. Perfect for maintaining hedges and shrubs.',
    price: 179.99,
    original_price: 229.99,
    sku: 'GARDEN-TRIMMER-002',
    stock_quantity: 15,
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'
    ],
    specifications: {
      blade_length: '24 inches',
      power: 'Cordless battery',
      runtime: '45 minutes',
      weight: '6.5 lbs',
      warranty: '3 years'
    },
    is_active: true,
    is_featured: false,
    weight: 6.5,
    dimensions: { length: 24, width: 8, height: 4 },
    tags: ['hedge-trimmer', 'cordless', 'professional', 'garden'],
    category_name: 'Garden & Outdoor'
  },

  // Security Products
  {
    name: 'Smart Doorbell Camera',
    description: 'WiFi-enabled doorbell camera with 1080p video, night vision, and two-way audio. Works with Alexa and Google Assistant.',
    price: 199.99,
    original_price: 249.99,
    sku: 'SECURITY-DOORBELL-001',
    stock_quantity: 30,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    ],
    specifications: {
      video: '1080p HD',
      night_vision: 'Yes',
      two_way_audio: 'Yes',
      wifi: '2.4GHz',
      warranty: '2 years'
    },
    is_active: true,
    is_featured: true,
    weight: 0.8,
    dimensions: { length: 4, width: 2, height: 6 },
    tags: ['doorbell', 'camera', 'smart', 'security'],
    category_name: 'Security'
  },
  {
    name: 'Home Security System Kit',
    description: 'Complete wireless home security system with motion sensors, door/window sensors, and 24/7 monitoring.',
    price: 399.99,
    original_price: 549.99,
    sku: 'SECURITY-SYSTEM-002',
    stock_quantity: 10,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    ],
    specifications: {
      sensors: '8 included',
      monitoring: '24/7 professional',
      app_control: 'Yes',
      backup: 'Battery backup',
      warranty: '3 years'
    },
    is_active: true,
    is_featured: false,
    weight: 2.0,
    dimensions: { length: 12, width: 8, height: 4 },
    tags: ['security-system', 'wireless', 'monitoring', 'complete'],
    category_name: 'Security'
  },

  // Furniture Products
  {
    name: 'Ergonomic Office Chair',
    description: 'High-back ergonomic office chair with lumbar support, adjustable height, and breathable mesh back.',
    price: 299.99,
    original_price: 399.99,
    sku: 'FURNITURE-CHAIR-001',
    stock_quantity: 20,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    specifications: {
      material: 'Mesh and plastic',
      weight_capacity: '300 lbs',
      adjustable: 'Height, armrests, lumbar',
      wheels: '5 caster wheels',
      warranty: '5 years'
    },
    is_active: true,
    is_featured: true,
    weight: 25.0,
    dimensions: { length: 26, width: 26, height: 42 },
    tags: ['office-chair', 'ergonomic', 'adjustable', 'mesh'],
    category_name: 'Furniture'
  },
  {
    name: 'Modular Storage System',
    description: 'Versatile modular storage system with multiple configurations. Perfect for organizing any space.',
    price: 199.99,
    original_price: 279.99,
    sku: 'FURNITURE-STORAGE-002',
    stock_quantity: 25,
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
    ],
    specifications: {
      material: 'Engineered wood',
      finish: 'White',
      modular: 'Yes',
      assembly: 'Required',
      warranty: '2 years'
    },
    is_active: true,
    is_featured: false,
    weight: 45.0,
    dimensions: { length: 36, width: 12, height: 72 },
    tags: ['storage', 'modular', 'organizer', 'white'],
    category_name: 'Furniture'
  }
];
