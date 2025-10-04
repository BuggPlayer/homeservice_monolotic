const { Pool } = require('pg');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE || 'fixer_marketplace',
  user: process.env.DB_USER || 'faizan',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

const pool = new Pool(dbConfig);

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');
  
  try {
    // Test 1: Basic Connection
    console.log('1️⃣ Testing basic connection...');
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    // Test 2: Database Version
    console.log('\n2️⃣ Getting database version...');
    const versionResult = await client.query('SELECT version();');
    console.log('✅ Database version:', versionResult.rows[0].version.split(' ')[0] + ' ' + versionResult.rows[0].version.split(' ')[1]);
    
    // Test 3: List Tables
    console.log('\n3️⃣ Listing all tables...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('✅ Found', tablesResult.rows.length, 'tables:');
    tablesResult.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
    
    // Test 4: Check Users Table
    console.log('\n4️⃣ Checking users table structure...');
    const usersColumns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    console.log('✅ Users table columns:');
    usersColumns.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? '(NOT NULL)' : '(NULLABLE)'}`);
    });
    
    // Test 5: Count Records
    console.log('\n5️⃣ Counting records in key tables...');
    const tables = ['users', 'service_requests', 'bookings', 'products', 'categories'];
    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table};`);
        console.log(`   - ${table}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`   - ${table}: Error - ${error.message}`);
      }
    }
    
    // Test 6: Test Insert/Select (if users table is empty)
    console.log('\n6️⃣ Testing insert/select operations...');
    const userCount = await client.query('SELECT COUNT(*) FROM users;');
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log('   - Users table is empty, testing insert...');
      const testUser = {
        email: 'test@example.com',
        phone: '+1234567890',
        password_hash: '$2b$10$test.hash.for.testing.purposes.only',
        user_type: 'customer',
        first_name: 'Test',
        last_name: 'User'
      };
      
      const insertResult = await client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, first_name, last_name;
      `, [testUser.email, testUser.phone, testUser.password_hash, testUser.user_type, testUser.first_name, testUser.last_name]);
      
      console.log('   ✅ Test user inserted:', insertResult.rows[0]);
      
      // Clean up test data
      await client.query('DELETE FROM users WHERE email = $1;', [testUser.email]);
      console.log('   ✅ Test user cleaned up');
    } else {
      console.log('   - Users table has data, skipping insert test');
    }
    
    // Test 7: Check Indexes
    console.log('\n7️⃣ Checking database indexes...');
    const indexesResult = await client.query(`
      SELECT indexname, tablename, indexdef
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname;
    `);
    console.log('✅ Found', indexesResult.rows.length, 'indexes:');
    indexesResult.rows.forEach(row => {
      console.log(`   - ${row.tablename}.${row.indexname}`);
    });
    
    // Test 8: Check Foreign Keys
    console.log('\n8️⃣ Checking foreign key constraints...');
    const foreignKeysResult = await client.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `);
    console.log('✅ Found', foreignKeysResult.rows.length, 'foreign key constraints:');
    foreignKeysResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}.${row.column_name} → ${row.foreign_table_name}.${row.foreign_column_name}`);
    });
    
    client.release();
    
    console.log('\n🎉 All database tests passed successfully!');
    console.log('✅ Database is ready for use');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Detail:', error.detail);
    
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if PostgreSQL is running: brew services list | grep postgres');
    console.log('2. Start PostgreSQL: brew services start postgresql@15');
    console.log('3. Check your .env file configuration');
    console.log('4. Verify database exists: createdb fixer_marketplace');
    console.log('5. Run migrations: npm run migrate');
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the test
testDatabaseConnection();
