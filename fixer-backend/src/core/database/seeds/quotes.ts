// Quotes Seed Data
export const quotesData = [
  {
    service_request_id: null, // Will be set when creating service requests
    provider_id: null, // Will be set when creating service providers
    amount: 250.00,
    notes: 'Kitchen sink leak repair includes replacing the shut-off valve and fixing the connection. Estimated time: 2-3 hours.',
    status: 'pending',
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 180.00,
    notes: 'Quick fix for the kitchen sink leak. Will replace the washer and tighten connections. 1-2 hour job.',
    status: 'pending',
    valid_until: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 350.00,
    notes: 'Complete electrical work for 3 pendant lights and 2 ceiling fans. Includes installation and testing. Professional grade materials.',
    status: 'accepted',
    valid_until: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 450.00,
    notes: 'Premium electrical installation with smart switches and dimmers. Includes warranty on all work.',
    status: 'rejected',
    valid_until: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago (expired)
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 650.00,
    notes: 'AC diagnosis and repair. Likely needs refrigerant recharge and filter replacement. Same-day service available.',
    status: 'accepted',
    valid_until: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 320.00,
    notes: 'Complete deep cleaning of 2-bedroom apartment. Includes appliances, bathrooms, and all surfaces. Eco-friendly products.',
    status: 'pending',
    valid_until: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) // 4 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 280.00,
    notes: 'Professional move-out cleaning with detailed attention to all areas. Includes inside appliances and fixtures.',
    status: 'pending',
    valid_until: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 200.00,
    notes: 'Monthly garden maintenance service. Includes mowing, trimming, and basic plant care. Ongoing contract available.',
    status: 'accepted',
    valid_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 180.00,
    notes: 'Basic garden maintenance with focus on lawn care and hedge trimming. One-time service.',
    status: 'pending',
    valid_until: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) // 8 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 1200.00,
    notes: 'Complete home security system with 8 sensors, 2 cameras, and 24/7 monitoring. Professional installation included.',
    status: 'accepted',
    valid_until: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 950.00,
    notes: 'Basic security package with 4 sensors and 1 camera. Self-monitoring option available.',
    status: 'rejected',
    valid_until: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago (expired)
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 150.00,
    notes: 'Professional IKEA furniture assembly. All pieces included. 2-3 hour assembly time.',
    status: 'completed',
    valid_until: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 120.00,
    notes: 'Quick assembly service for bedroom furniture. Experienced with IKEA products.',
    status: 'rejected',
    valid_until: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago (expired)
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 350.00,
    notes: 'Refrigerator repair - likely needs new compressor. Parts and labor included. 1-year warranty on work.',
    status: 'in_progress',
    valid_until: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 280.00,
    notes: 'Diagnostic service for refrigerator. Will provide detailed report and repair estimate.',
    status: 'pending',
    valid_until: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 2200.00,
    notes: 'Complete interior painting of 3-bedroom house. Premium paint and professional finish. 5-day project.',
    status: 'pending',
    valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 1800.00,
    notes: 'Standard interior painting with quality materials. Includes primer and two coats of paint.',
    status: 'pending',
    valid_until: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 3200.00,
    notes: 'Professional hardwood floor refinishing. Sanding, staining, and polyurethane finish. 800 sq ft.',
    status: 'accepted',
    valid_until: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000) // 20 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 2800.00,
    notes: 'Basic hardwood refinishing with standard stain. Good quality work at competitive price.',
    status: 'rejected',
    valid_until: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago (expired)
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 800.00,
    notes: 'Emergency roof leak repair. Temporary patch and full inspection. Permanent repair quote provided.',
    status: 'accepted',
    valid_until: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 600.00,
    notes: 'Quick roof leak fix with quality materials. 1-year warranty on repair work.',
    status: 'pending',
    valid_until: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 180.00,
    notes: 'Multiple small repairs package. Cabinet door, floorboard, door handle, and towel rack. 2-3 hour job.',
    status: 'accepted',
    valid_until: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000) // 6 days from now
  },
  {
    service_request_id: null,
    provider_id: null,
    amount: 150.00,
    notes: 'Basic handyman service for small repairs. Hourly rate with material costs included.',
    status: 'rejected',
    valid_until: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago (expired)
  }
];

// Bookings Seed Data
export const bookingsData = [
  {
    service_request_id: null, // Will be set when creating service requests
    quote_id: null, // Will be set when creating quotes
    provider_id: null, // Will be set when creating service providers
    customer_id: null, // Will be set when creating users
    scheduled_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'scheduled',
    total_amount: 150.00,
    notes: 'Please call 30 minutes before arrival. Gate code: 1234'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: 'scheduled',
    total_amount: 350.00,
    notes: 'Customer prefers morning appointment. Will need access to electrical panel.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    status: 'scheduled',
    total_amount: 650.00,
    notes: 'Emergency AC repair. Customer will be home all day.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'scheduled',
    total_amount: 320.00,
    notes: 'Move-out cleaning. Keys will be left with building manager.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'scheduled',
    total_amount: 200.00,
    notes: 'Monthly garden maintenance. Please water plants if needed.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: 'scheduled',
    total_amount: 1200.00,
    notes: 'Security system installation. Will need 4-6 hours. Customer will be present.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'completed',
    total_amount: 150.00,
    notes: 'Furniture assembly completed successfully. Customer satisfied with work.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    status: 'scheduled',
    total_amount: 350.00,
    notes: 'Refrigerator repair in progress. Parts ordered, will complete tomorrow.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: 'scheduled',
    total_amount: 2200.00,
    notes: 'Interior painting project. Will start with living room and bedrooms.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    status: 'scheduled',
    total_amount: 3200.00,
    notes: 'Hardwood floor refinishing. Customer will need to vacate for 3 days.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    status: 'scheduled',
    total_amount: 800.00,
    notes: 'Emergency roof repair. Temporary fix to stop leak, permanent repair scheduled.'
  },
  {
    service_request_id: null,
    quote_id: null,
    provider_id: null,
    customer_id: null,
    scheduled_time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    status: 'scheduled',
    total_amount: 180.00,
    notes: 'Multiple small repairs. Customer will provide materials list.'
  }
];
