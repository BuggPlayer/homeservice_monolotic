import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'fixer_marketplace',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // Clear existing data
    await client.query('DELETE FROM calls');
    await client.query('DELETE FROM bookings');
    await client.query('DELETE FROM quotes');
    await client.query('DELETE FROM service_requests');
    await client.query('DELETE FROM service_providers');
    await client.query('DELETE FROM users');

    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const adminUser = await client.query(`
      INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [
      'admin@fixer.com',
      '+1234567890',
      adminPasswordHash,
      'admin',
      'Admin',
      'User',
      true
    ]);

    // Create sample customers
    const customerPasswordHash = await bcrypt.hash('password123', 12);
    const customers = await Promise.all([
      client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'john.doe@example.com',
        '+1234567891',
        customerPasswordHash,
        'customer',
        'John',
        'Doe',
        true
      ]),
      client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'jane.smith@example.com',
        '+1234567892',
        customerPasswordHash,
        'customer',
        'Jane',
        'Smith',
        true
      ]),
      client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'mike.johnson@example.com',
        '+1234567893',
        customerPasswordHash,
        'customer',
        'Mike',
        'Johnson',
        true
      ])
    ]);

    // Create sample service providers
    const providerPasswordHash = await bcrypt.hash('password123', 12);
    const providers = await Promise.all([
      client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'electrician@fixer.com',
        '+1234567894',
        providerPasswordHash,
        'provider',
        'Bob',
        'Electrician',
        true
      ]),
      client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'plumber@fixer.com',
        '+1234567895',
        providerPasswordHash,
        'provider',
        'Alice',
        'Plumber',
        true
      ]),
      client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `, [
        'handyman@fixer.com',
        '+1234567896',
        providerPasswordHash,
        'provider',
        'Charlie',
        'Handyman',
        true
      ])
    ]);

    // Create service provider profiles
    const serviceProviders = await Promise.all([
      client.query(`
        INSERT INTO service_providers (
          user_id, business_name, services_offered, service_areas, 
          verification_status, rating, total_reviews, years_experience, bio
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        providers[0].rows[0].id,
        'Bob\'s Electrical Services',
        ['electrical', 'lighting', 'outlets', 'wiring'],
        ['New York', 'Brooklyn', 'Queens'],
        'verified',
        4.8,
        25,
        10,
        'Licensed electrician with 10+ years of experience in residential and commercial electrical work.'
      ]),
      client.query(`
        INSERT INTO service_providers (
          user_id, business_name, services_offered, service_areas, 
          verification_status, rating, total_reviews, years_experience, bio
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        providers[1].rows[0].id,
        'Alice\'s Plumbing Solutions',
        ['plumbing', 'drain_cleaning', 'pipe_repair', 'faucet_installation'],
        ['New York', 'Manhattan', 'Bronx'],
        'verified',
        4.9,
        30,
        8,
        'Professional plumber specializing in residential plumbing repairs and installations.'
      ]),
      client.query(`
        INSERT INTO service_providers (
          user_id, business_name, services_offered, service_areas, 
          verification_status, rating, total_reviews, years_experience, bio
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
      `, [
        providers[2].rows[0].id,
        'Charlie\'s Handyman Services',
        ['handyman', 'furniture_assembly', 'shelving', 'painting'],
        ['New York', 'Brooklyn', 'Queens', 'Manhattan'],
        'verified',
        4.7,
        20,
        5,
        'Versatile handyman offering a wide range of home improvement and repair services.'
      ])
    ]);

    // Create sample service requests
    const serviceRequests = await Promise.all([
      client.query(`
        INSERT INTO service_requests (
          customer_id, service_type, title, description, location, 
          urgency, status, budget_min, budget_max, preferred_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        customers[0].rows[0].id,
        'electrical',
        'Fix broken outlet in living room',
        'The outlet in the living room stopped working. Need someone to diagnose and fix the issue. The outlet is near the TV and has multiple devices plugged in.',
        JSON.stringify({
          address: '123 Main St, New York, NY 10001',
          city: 'New York',
          state: 'NY',
          zip_code: '10001',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        }),
        'medium',
        'open',
        100,
        200,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      ]),
      client.query(`
        INSERT INTO service_requests (
          customer_id, service_type, title, description, location, 
          urgency, status, budget_min, budget_max, preferred_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        customers[1].rows[0].id,
        'plumbing',
        'Kitchen sink is leaking',
        'The kitchen sink has been leaking for a few days. Water is dripping from under the sink and pooling on the floor. Need urgent repair.',
        JSON.stringify({
          address: '456 Oak Ave, Brooklyn, NY 11201',
          city: 'Brooklyn',
          state: 'NY',
          zip_code: '11201',
          coordinates: { lat: 40.6782, lng: -73.9442 }
        }),
        'high',
        'open',
        150,
        300,
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      ]),
      client.query(`
        INSERT INTO service_requests (
          customer_id, service_type, title, description, location, 
          urgency, status, budget_min, budget_max, preferred_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id
      `, [
        customers[2].rows[0].id,
        'handyman',
        'Assemble new furniture',
        'I bought a new bookshelf and dining table that need to be assembled. Looking for someone experienced with furniture assembly.',
        JSON.stringify({
          address: '789 Pine St, Queens, NY 11375',
          city: 'Queens',
          state: 'NY',
          zip_code: '11375',
          coordinates: { lat: 40.7282, lng: -73.7949 }
        }),
        'low',
        'open',
        80,
        150,
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      ])
    ]);

    // Create sample quotes
    const quotes = await Promise.all([
      client.query(`
        INSERT INTO quotes (
          service_request_id, provider_id, amount, notes, status, valid_until
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        serviceRequests[0].rows[0].id,
        serviceProviders[0].rows[0].id,
        150.00,
        'I can fix the outlet issue. Likely a loose wire or faulty outlet. Will replace if necessary.',
        'pending',
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      ]),
      client.query(`
        INSERT INTO quotes (
          service_request_id, provider_id, amount, notes, status, valid_until
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        serviceRequests[1].rows[0].id,
        serviceProviders[1].rows[0].id,
        200.00,
        'I can fix the leak under your sink. Will need to check the pipes and replace any damaged parts.',
        'pending',
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
      ]),
      client.query(`
        INSERT INTO quotes (
          service_request_id, provider_id, amount, notes, status, valid_until
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `, [
        serviceRequests[2].rows[0].id,
        serviceProviders[2].rows[0].id,
        120.00,
        'I have experience with furniture assembly. Can complete both items in 2-3 hours.',
        'pending',
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      ])
    ]);

    // Create sample bookings
    const bookings = await Promise.all([
      client.query(`
        INSERT INTO bookings (
          service_request_id, quote_id, provider_id, customer_id, 
          scheduled_time, status, total_amount, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        serviceRequests[0].rows[0].id,
        quotes[0].rows[0].id,
        serviceProviders[0].rows[0].id,
        customers[0].rows[0].id,
        new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        'scheduled',
        150.00,
        'Please call when you arrive. I\'ll be home all day.'
      ])
    ]);

    // Create sample calls
    const calls = await Promise.all([
      client.query(`
        INSERT INTO calls (
          customer_id, provider_id, call_duration, status, twilio_call_sid
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        customers[0].rows[0].id,
        serviceProviders[0].rows[0].id,
        300, // 5 minutes
        'completed',
        'CA' + Math.random().toString(36).substr(2, 32)
      ]),
      client.query(`
        INSERT INTO calls (
          customer_id, provider_id, call_duration, status, twilio_call_sid
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `, [
        customers[1].rows[0].id,
        serviceProviders[1].rows[0].id,
        180, // 3 minutes
        'completed',
        'CA' + Math.random().toString(36).substr(2, 32)
      ])
    ]);

    console.log('Database seeded successfully!');
    console.log('Created:');
    console.log('- 1 admin user');
    console.log('- 3 customer users');
    console.log('- 3 service provider users');
    console.log('- 3 service provider profiles');
    console.log('- 3 service requests');
    console.log('- 3 quotes');
    console.log('- 1 booking');
    console.log('- 2 calls');
    
    console.log('\nTest credentials:');
    console.log('Admin: admin@fixer.com / admin123');
    console.log('Customer: john.doe@example.com / password123');
    console.log('Provider: electrician@fixer.com / password123');
    
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
