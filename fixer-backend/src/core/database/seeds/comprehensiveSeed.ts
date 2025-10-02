import { pool } from '../../../config/database';
import { BcryptUtils } from '../../../core/utils';
import { 
  usersData, 
  defaultPassword 
} from './users';
import { 
  categoriesData 
} from './categories';
import { 
  productsData 
} from './products';
import { 
  serviceProvidersData 
} from './serviceProviders';
import { 
  serviceRequestsData 
} from './serviceProviders';
import { 
  quotesData, 
  bookingsData 
} from './quotes';

export async function comprehensiveSeed() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // 1. Create Categories
    console.log('📁 Creating categories...');
    const categoryIds: { [key: string]: string } = {};
    
    for (const category of categoriesData) {
      const result = await pool.query(
        `INSERT INTO categories (name, description, parent_id, image, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [category.name, category.description, category.parent_id, category.image, category.is_active, category.sort_order]
      );
      categoryIds[category.name] = result.rows[0].id;
    }

    // Update parent_id for subcategories
    const subcategoryMappings = {
      'Pipes & Fittings': 'Plumbing',
      'Faucets & Fixtures': 'Plumbing',
      'Toilets & Bidets': 'Plumbing',
      'Water Heaters': 'Plumbing',
      'Wiring & Cables': 'Electrical',
      'Switches & Outlets': 'Electrical',
      'Lighting': 'Electrical',
      'Circuit Breakers': 'Electrical',
      'Air Conditioners': 'HVAC',
      'Heaters': 'HVAC',
      'Fans & Ventilation': 'HVAC',
      'Thermostats': 'HVAC',
      'Cleaning Supplies': 'Cleaning',
      'Cleaning Tools': 'Cleaning',
      'Vacuum Cleaners': 'Cleaning',
      'Air Purifiers': 'Cleaning'
    };

    for (const [subcategory, parent] of Object.entries(subcategoryMappings)) {
      if (categoryIds[subcategory] && categoryIds[parent]) {
        await pool.query(
          'UPDATE categories SET parent_id = $1 WHERE id = $2',
          [categoryIds[parent], categoryIds[subcategory]]
        );
      }
    }

    // 2. Create Users
    console.log('👥 Creating users...');
    const userIds: { [key: string]: string } = {};
    
    for (const user of usersData) {
      const passwordHash = await BcryptUtils.hashPassword(defaultPassword);
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, phone, user_type, first_name, last_name, profile_picture, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [user.email, passwordHash, user.phone, user.user_type, user.first_name, user.last_name, user.profile_picture, user.is_verified]
      );
      userIds[user.email] = result.rows[0].id;
    }

    // 3. Create Service Providers
    console.log('🔧 Creating service providers...');
    const providerIds: { [key: string]: string } = {};
    
    const providerEmails = [
      'elite.plumbing@fixer.com',
      'bright.electric@fixer.com',
      'cool.comfort@fixer.com',
      'sparkle.clean@fixer.com',
      'green.thumb@fixer.com',
      'secure.home@fixer.com',
      'furniture.pros@fixer.com',
      'appliance.masters@fixer.com',
      'perfect.paint@fixer.com',
      'floor.masters@fixer.com',
      'roof.right@fixer.com',
      'handy.helpers@fixer.com',
      'eco.clean@fixer.com',
      'tech.home@fixer.com',
      'garden.design@fixer.com'
    ];

    for (let i = 0; i < serviceProvidersData.length; i++) {
      const provider = serviceProvidersData[i];
      const userEmail = providerEmails[i];
      const userId = userIds[userEmail];
      
      if (userId) {
        const result = await pool.query(
          `INSERT INTO service_providers (user_id, business_name, business_license, services_offered, service_areas, verification_status, rating, total_reviews, years_experience, bio)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id`,
          [userId, provider.business_name, provider.business_license, provider.services_offered, provider.service_areas, provider.verification_status, provider.rating, provider.total_reviews, provider.years_experience, provider.bio]
        );
        providerIds[provider.business_name] = result.rows[0].id;
      }
    }

    // 4. Create Products
    console.log('🛍️ Creating products...');
    const productIds: string[] = [];
    
    for (const product of productsData) {
      const categoryId = categoryIds[product.category_name];
      const providerId = Object.values(providerIds)[Math.floor(Math.random() * Object.values(providerIds).length)];
      
      if (categoryId && providerId) {
        const result = await pool.query(
          `INSERT INTO products (provider_id, category_id, name, description, price, original_price, sku, stock_quantity, images, specifications, is_active, is_featured, weight, dimensions, tags)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
           RETURNING id`,
          [
            providerId,
            categoryId,
            product.name,
            product.description,
            product.price,
            product.original_price,
            product.sku,
            product.stock_quantity,
            product.images,
            JSON.stringify(product.specifications),
            product.is_active,
            product.is_featured,
            product.weight,
            JSON.stringify(product.dimensions),
            product.tags
          ]
        );
        productIds.push(result.rows[0].id);
      }
    }

    // 5. Create Service Requests
    console.log('📋 Creating service requests...');
    const serviceRequestIds: string[] = [];
    const customerEmails = [
      'john.doe@email.com',
      'jane.smith@email.com',
      'bob.johnson@email.com',
      'alice.brown@email.com',
      'charlie.wilson@email.com',
      'diana.davis@email.com',
      'edward.garcia@email.com',
      'fiona.miller@email.com',
      'george.anderson@email.com',
      'helen.taylor@email.com',
      'ivan.thomas@email.com',
      'julia.jackson@email.com',
      'kevin.white@email.com',
      'linda.harris@email.com',
      'mike.martin@email.com'
    ];

    for (let i = 0; i < serviceRequestsData.length; i++) {
      const request = serviceRequestsData[i];
      const customerEmail = customerEmails[i % customerEmails.length];
      const customerId = userIds[customerEmail];
      
      if (customerId) {
        const result = await pool.query(
          `INSERT INTO service_requests (customer_id, service_type, title, description, location, urgency, status, budget_min, budget_max, preferred_date, images)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
           RETURNING id`,
          [
            customerId,
            request.service_type,
            request.title,
            request.description,
            JSON.stringify(request.location),
            request.urgency,
            request.status,
            request.budget_min,
            request.budget_max,
            request.preferred_date,
            request.images
          ]
        );
        serviceRequestIds.push(result.rows[0].id);
      }
    }

    // 6. Create Quotes
    console.log('💰 Creating quotes...');
    const quoteIds: string[] = [];
    
    for (let i = 0; i < quotesData.length; i++) {
      const quote = quotesData[i];
      const serviceRequestId = serviceRequestIds[i % serviceRequestIds.length];
      const providerId = Object.values(providerIds)[Math.floor(Math.random() * Object.values(providerIds).length)];
      
      if (serviceRequestId && providerId) {
        const result = await pool.query(
          `INSERT INTO quotes (service_request_id, provider_id, amount, notes, status, valid_until)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [serviceRequestId, providerId, quote.amount, quote.notes, quote.status, quote.valid_until]
        );
        quoteIds.push(result.rows[0].id);
      }
    }

    // 7. Create Bookings
    console.log('📅 Creating bookings...');
    
    for (let i = 0; i < bookingsData.length; i++) {
      const booking = bookingsData[i];
      const serviceRequestId = serviceRequestIds[i % serviceRequestIds.length];
      const quoteId = quoteIds[i % quoteIds.length];
      const providerId = Object.values(providerIds)[Math.floor(Math.random() * Object.values(providerIds).length)];
      const customerId = userIds[customerEmails[i % customerEmails.length]];
      
      if (serviceRequestId && quoteId && providerId && customerId) {
        await pool.query(
          `INSERT INTO bookings (service_request_id, quote_id, provider_id, customer_id, scheduled_time, status, total_amount, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [serviceRequestId, quoteId, providerId, customerId, booking.scheduled_time, booking.status, booking.total_amount, booking.notes]
        );
      }
    }

    // 8. Create Sample Reviews
    console.log('⭐ Creating sample reviews...');
    
    for (let i = 0; i < Math.min(20, productIds.length); i++) {
      const productId = productIds[i];
      const customerId = userIds[customerEmails[i % customerEmails.length]];
      const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
      const reviews = [
        'Great product, exactly as described!',
        'Fast shipping and excellent quality.',
        'Perfect for my needs, highly recommended.',
        'Good value for money, works well.',
        'Excellent customer service and product quality.',
        'Very satisfied with this purchase.',
        'High quality product, will buy again.',
        'Great addition to my toolkit.',
        'Works perfectly, easy to install.',
        'Excellent product, exceeded expectations.'
      ];
      
      await pool.query(
        `INSERT INTO reviews (user_id, product_id, rating, title, comment, is_verified, helpful_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          customerId,
          productId,
          rating,
          `Review for product ${i + 1}`,
          reviews[Math.floor(Math.random() * reviews.length)],
          true,
          Math.floor(Math.random() * 10)
        ]
      );
    }

    // 9. Create Sample Cart Items
    console.log('🛒 Creating sample cart items...');
    
    for (let i = 0; i < 10; i++) {
      const customerId = userIds[customerEmails[i % customerEmails.length]];
      const productId = productIds[Math.floor(Math.random() * productIds.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      
      await pool.query(
        `INSERT INTO cart_items (user_id, product_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, product_id) DO NOTHING`,
        [customerId, productId, quantity]
      );
    }

    // 10. Create Sample Wishlist Items
    console.log('❤️ Creating sample wishlist items...');
    
    for (let i = 0; i < 15; i++) {
      const customerId = userIds[customerEmails[i % customerEmails.length]];
      const productId = productIds[Math.floor(Math.random() * productIds.length)];
      
      await pool.query(
        `INSERT INTO wishlist (user_id, product_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, product_id) DO NOTHING`,
        [customerId, productId]
      );
    }

    console.log('✅ Comprehensive database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${Object.keys(categoryIds).length} categories`);
    console.log(`   - ${Object.keys(userIds).length} users`);
    console.log(`   - ${Object.keys(providerIds).length} service providers`);
    console.log(`   - ${productIds.length} products`);
    console.log(`   - ${serviceRequestIds.length} service requests`);
    console.log(`   - ${quoteIds.length} quotes`);
    console.log(`   - ${bookingsData.length} bookings`);
    console.log(`   - 20 product reviews`);
    console.log(`   - 10 cart items`);
    console.log(`   - 15 wishlist items`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  comprehensiveSeed()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}
