const { Pool } = require('pg');
require('dotenv').config();

/**
 * Comprehensive Supabase Connection Test
 * This script will help you verify your Supabase connection and troubleshoot issues
 */

async function testSupabaseConnection() {
  console.log('🔍 Supabase Connection Diagnostic Tool\n');
  
  // Display current configuration
  console.log('📋 Current Configuration:');
  console.log(`   Host: ${process.env.DB_HOST || 'NOT SET'}`);
  console.log(`   Database: ${process.env.DB_DATABASE || 'NOT SET'}`);
  console.log(`   User: ${process.env.DB_USER || 'NOT SET'}`);
  console.log(`   Port: ${process.env.DB_PORT || 'NOT SET'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***SET***' : 'NOT SET'}\n`);
  
  // Validate configuration
  const requiredVars = ['DB_HOST', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.log('\n🔧 Please set these variables in your .env file');
    return;
  }
  
  // Check if it's a Supabase connection
  const isSupabase = process.env.DB_HOST.includes('supabase.co');
  console.log(`🌐 Connection Type: ${isSupabase ? 'Supabase' : 'Local PostgreSQL'}\n`);
  
  // Create connection pool
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: isSupabase ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
  });

  try {
    console.log('1️⃣ Testing basic connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!\n');
    
    console.log('2️⃣ Getting database information...');
    const dbInfo = await client.query('SELECT current_database(), current_user, version();');
    console.log(`   Database: ${dbInfo.rows[0].current_database}`);
    console.log(`   User: ${dbInfo.rows[0].current_user}`);
    console.log(`   Version: ${dbInfo.rows[0].version.split(' ')[0]} ${dbInfo.rows[0].version.split(' ')[1]}\n`);
    
    console.log('3️⃣ Checking available schemas...');
    const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
      ORDER BY schema_name;
    `);
    console.log('   Available schemas:');
    schemas.rows.forEach(row => {
      console.log(`   - ${row.schema_name}`);
    });
    console.log('');
    
    console.log('4️⃣ Checking tables in public schema...');
    const publicTables = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    if (publicTables.rows.length === 0) {
      console.log('   ⚠️  No tables found in public schema');
      console.log('   💡 This means you need to run migrations on Supabase');
    } else {
      console.log(`   ✅ Found ${publicTables.rows.length} tables:`);
      publicTables.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name} (${row.table_type})`);
      });
    }
    console.log('');
    
    if (isSupabase) {
      console.log('5️⃣ Checking Supabase auth schema...');
      const authTables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        ORDER BY table_name;
      `);
      
      if (authTables.rows.length > 0) {
        console.log(`   ✅ Found ${authTables.rows.length} auth tables:`);
        authTables.rows.forEach(row => {
          console.log(`   - auth.${row.table_name}`);
        });
      } else {
        console.log('   ⚠️  No auth schema found (this is normal for some Supabase setups)');
      }
      console.log('');
    }
    
    console.log('6️⃣ Checking table permissions...');
    const permissions = await client.query(`
      SELECT 
        table_name,
        privilege_type
      FROM information_schema.table_privileges 
      WHERE grantee = current_user 
        AND table_schema = 'public'
      ORDER BY table_name, privilege_type;
    `);
    
    if (permissions.rows.length > 0) {
      console.log('   ✅ Table permissions:');
      const tablePerms = {};
      permissions.rows.forEach(row => {
        if (!tablePerms[row.table_name]) {
          tablePerms[row.table_name] = [];
        }
        tablePerms[row.table_name].push(row.privilege_type);
      });
      
      Object.entries(tablePerms).forEach(([table, perms]) => {
        console.log(`   - ${table}: ${perms.join(', ')}`);
      });
    } else {
      console.log('   ⚠️  No table permissions found');
    }
    console.log('');
    
    client.release();
    
    console.log('🎉 Supabase connection test completed successfully!');
    
    if (publicTables.rows.length === 0) {
      console.log('\n📝 Next Steps:');
      console.log('1. Run migrations: npm run migrate');
      console.log('2. Run seeds: npm run seed');
      console.log('3. Verify tables in Supabase dashboard');
    }
    
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    console.log('\n🔧 Troubleshooting Guide:');
    
    if (error.code === '28P01') {
      console.log('   🔑 Authentication failed:');
      console.log('   - Check your database password');
      console.log('   - Verify username is correct (usually "postgres")');
      console.log('   - Ensure password doesn\'t contain special characters that need escaping');
    } else if (error.code === 'ENOTFOUND') {
      console.log('   🌐 Host not found:');
      console.log('   - Check your DB_HOST URL');
      console.log('   - Ensure it includes the full Supabase hostname');
      console.log('   - Verify your Supabase project is active');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('   🚫 Connection refused:');
      console.log('   - Check if your IP is whitelisted in Supabase');
      console.log('   - Verify the port number (usually 5432)');
      console.log('   - Check if your Supabase project is paused');
    } else if (error.message.includes('SSL')) {
      console.log('   🔒 SSL/TLS issues:');
      console.log('   - Supabase requires SSL connections');
      console.log('   - Check if ssl: { rejectUnauthorized: false } is set');
    }
    
    console.log('\n📋 Common Solutions:');
    console.log('1. Verify credentials in Supabase dashboard');
    console.log('2. Check your .env file format');
    console.log('3. Ensure no extra spaces in environment variables');
    console.log('4. Try connecting via Supabase dashboard first');
    console.log('5. Check if your Supabase project is active and not paused');
    
  } finally {
    await pool.end();
  }
}

// Run the diagnostic
testSupabaseConnection();
