// Product Categories Seed Data
export const categoriesData = [
  // Home Improvement
  {
    name: 'Home Improvement',
    description: 'Tools and materials for home improvement projects',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=500',
    is_active: true,
    sort_order: 1
  },
  {
    name: 'Plumbing',
    description: 'Plumbing tools, fixtures, and accessories',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=500',
    is_active: true,
    sort_order: 2
  },
  {
    name: 'Electrical',
    description: 'Electrical tools, components, and safety equipment',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
    is_active: true,
    sort_order: 3
  },
  {
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning equipment',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    is_active: true,
    sort_order: 4
  },
  {
    name: 'Cleaning',
    description: 'Cleaning supplies and equipment',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=500',
    is_active: true,
    sort_order: 5
  },
  {
    name: 'Garden & Outdoor',
    description: 'Garden tools, outdoor equipment, and landscaping supplies',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
    is_active: true,
    sort_order: 6
  },
  {
    name: 'Security',
    description: 'Home security systems and safety equipment',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    is_active: true,
    sort_order: 7
  },
  {
    name: 'Furniture',
    description: 'Home and office furniture',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
    is_active: true,
    sort_order: 8
  },

  // Plumbing Subcategories
  {
    name: 'Pipes & Fittings',
    description: 'PVC, copper, and other pipe materials and fittings',
    parent_id: null, // Will be updated after parent categories are created
    image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=500',
    is_active: true,
    sort_order: 1
  },
  {
    name: 'Faucets & Fixtures',
    description: 'Bathroom and kitchen faucets, showerheads, and fixtures',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500',
    is_active: true,
    sort_order: 2
  },
  {
    name: 'Toilets & Bidets',
    description: 'Toilets, bidets, and related accessories',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500',
    is_active: true,
    sort_order: 3
  },
  {
    name: 'Water Heaters',
    description: 'Tank and tankless water heaters',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    is_active: true,
    sort_order: 4
  },

  // Electrical Subcategories
  {
    name: 'Wiring & Cables',
    description: 'Electrical wires, cables, and conduits',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
    is_active: true,
    sort_order: 1
  },
  {
    name: 'Switches & Outlets',
    description: 'Light switches, outlets, and electrical boxes',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
    is_active: true,
    sort_order: 2
  },
  {
    name: 'Lighting',
    description: 'LED lights, fixtures, and lighting accessories',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    is_active: true,
    sort_order: 3
  },
  {
    name: 'Circuit Breakers',
    description: 'Circuit breakers, fuses, and electrical panels',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
    is_active: true,
    sort_order: 4
  },

  // HVAC Subcategories
  {
    name: 'Air Conditioners',
    description: 'Window, portable, and central air conditioning units',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    is_active: true,
    sort_order: 1
  },
  {
    name: 'Heaters',
    description: 'Space heaters, radiators, and heating systems',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    is_active: true,
    sort_order: 2
  },
  {
    name: 'Fans & Ventilation',
    description: 'Ceiling fans, exhaust fans, and ventilation systems',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    is_active: true,
    sort_order: 3
  },
  {
    name: 'Thermostats',
    description: 'Smart and programmable thermostats',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500',
    is_active: true,
    sort_order: 4
  },

  // Cleaning Subcategories
  {
    name: 'Cleaning Supplies',
    description: 'Detergents, disinfectants, and cleaning solutions',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=500',
    is_active: true,
    sort_order: 1
  },
  {
    name: 'Cleaning Tools',
    description: 'Brooms, mops, sponges, and cleaning accessories',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=500',
    is_active: true,
    sort_order: 2
  },
  {
    name: 'Vacuum Cleaners',
    description: 'Upright, canister, and robotic vacuum cleaners',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=500',
    is_active: true,
    sort_order: 3
  },
  {
    name: 'Air Purifiers',
    description: 'Air purifiers and air quality improvement devices',
    parent_id: null,
    image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f4fb?w=500',
    is_active: true,
    sort_order: 4
  }
];

// Service Types Data
export const serviceTypesData = [
  {
    name: 'Plumbing Services',
    description: 'Professional plumbing installation, repair, and maintenance',
    category: 'plumbing',
    icon: '🔧',
    is_active: true
  },
  {
    name: 'Electrical Services',
    description: 'Electrical installation, repair, and safety inspections',
    category: 'electrical',
    icon: '⚡',
    is_active: true
  },
  {
    name: 'HVAC Services',
    description: 'Heating, ventilation, and air conditioning services',
    category: 'hvac',
    icon: '🌡️',
    is_active: true
  },
  {
    name: 'Cleaning Services',
    description: 'Residential and commercial cleaning services',
    category: 'cleaning',
    icon: '🧹',
    is_active: true
  },
  {
    name: 'Garden & Landscaping',
    description: 'Garden maintenance, landscaping, and outdoor services',
    category: 'garden',
    icon: '🌱',
    is_active: true
  },
  {
    name: 'Home Security',
    description: 'Security system installation and monitoring services',
    category: 'security',
    icon: '🔒',
    is_active: true
  },
  {
    name: 'Furniture Assembly',
    description: 'Professional furniture assembly and installation',
    category: 'furniture',
    icon: '🪑',
    is_active: true
  },
  {
    name: 'Appliance Repair',
    description: 'Home appliance repair and maintenance services',
    category: 'appliance',
    icon: '🔌',
    is_active: true
  },
  {
    name: 'Painting Services',
    description: 'Interior and exterior painting services',
    category: 'painting',
    icon: '🎨',
    is_active: true
  },
  {
    name: 'Flooring Services',
    description: 'Flooring installation, repair, and maintenance',
    category: 'flooring',
    icon: '🏠',
    is_active: true
  },
  {
    name: 'Roofing Services',
    description: 'Roof repair, installation, and maintenance',
    category: 'roofing',
    icon: '🏠',
    is_active: true
  },
  {
    name: 'Handyman Services',
    description: 'General home repair and maintenance services',
    category: 'handyman',
    icon: '🔨',
    is_active: true
  }
];
