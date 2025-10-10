#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE || 'fixer_marketplace',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function seedRBAC() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Seeding RBAC data...');
    
    // Run seed data migration
    const seedFile = path.join(__dirname, '..', 'src', 'core', 'database', 'migrations', '015_seed_rbac_data.sql');
    if (fs.existsSync(seedFile)) {
      console.log('📄 Running seed data migration...');
      const sql = fs.readFileSync(seedFile, 'utf8');
      await client.query(sql);
      console.log('✅ Seed data migration completed');
    }
    
    // Run user approval workflow migration
    const approvalFile = path.join(__dirname, '..', 'src', 'core', 'database', 'migrations', '016_create_user_approval_workflow.sql');
    if (fs.existsSync(approvalFile)) {
      console.log('📄 Running user approval workflow migration...');
      const sql = fs.readFileSync(approvalFile, 'utf8');
      await client.query(sql);
      console.log('✅ User approval workflow migration completed');
    }
    
    // Create super admin user
    console.log('👑 Creating super admin user...');
    
    const bcrypt = require('bcrypt');
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin123!';
    const passwordHash = await bcrypt.hash(superAdminPassword, 12);
    
    // Check if super admin already exists
    const existingAdmin = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['superadmin@fixer.com']
    );
    
    if (existingAdmin.rows.length === 0) {
      // Create super admin user
      const superAdmin = await client.query(`
        INSERT INTO users (email, phone, password_hash, user_type, first_name, last_name, is_verified, approval_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
      `, [
        'superadmin@fixer.com',
        '+1234567890',
        passwordHash,
        'admin',
        'Super',
        'Admin',
        true,
        'approved'
      ]);
      
      const superAdminId = superAdmin.rows[0].id;
      
      // Assign super admin role
      const superAdminRole = await client.query(
        'SELECT id FROM roles WHERE name = $1',
        ['super_admin']
      );
      
      if (superAdminRole.rows.length > 0) {
        await client.query(`
          INSERT INTO user_roles (user_id, role_id, assigned_by)
          VALUES ($1, $2, $3)
          ON CONFLICT (user_id, role_id) DO NOTHING
        `, [superAdminId, superAdminRole.rows[0].id, superAdminId]);
        
        console.log('✅ Super admin user created successfully');
        console.log(`📧 Email: superadmin@fixer.com`);
        console.log(`🔑 Password: ${superAdminPassword}`);
      }
    } else {
      console.log('ℹ️  Super admin user already exists');
    }
    
    console.log('🎉 RBAC seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding RBAC:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedRBAC();
